import { NextRequest, NextResponse } from 'next/server'

interface GithubFile {
  name: string
  path: string
  type: 'file' | 'dir'
  size?: number
  url?: string
  content?: string
}

interface GithubApiResponse {
  name: string
  path: string
  type: 'file' | 'dir'
  size?: number
  download_url?: string
  url: string
}

/**
 * Fetch repository structure and file contents from GitHub
 * Query params:
 * - owner: GitHub username
 * - repo: Repository name
 * - path: File/folder path (default: root)
 * - token: (optional) GitHub token for higher rate limits
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const owner = searchParams.get('owner')
    const repo = searchParams.get('repo')
    const path = searchParams.get('path') || ''
    const token = searchParams.get('token')

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required parameters: owner, repo' },
        { status: 400 }
      )
    }

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'SeneshPortfolio',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Fetch directory contents
    const contentsUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    const contentsResponse = await fetch(contentsUrl, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!contentsResponse.ok) {
      if (contentsResponse.status === 404) {
        return NextResponse.json(
          { error: 'Repository or path not found' },
          { status: 404 }
        )
      }
      throw new Error(`GitHub API error: ${contentsResponse.status}`)
    }

    let contents = await contentsResponse.json()
    if (!Array.isArray(contents)) {
      contents = [contents]
    }

    // Format the response
    const formattedContents: GithubFile[] = await Promise.all(
      (contents as GithubApiResponse[])
        .filter(item => !item.name.startsWith('.'))
        .slice(0, 50) // Limit to 50 items
        .map(async (item) => {
          const file: GithubFile = {
            name: item.name,
            path: item.path,
            type: item.type as 'file' | 'dir',
          }

          if (item.type === 'file') {
            file.size = item.size || 0
            file.url = item.download_url || ''

            // Fetch file content for code files (limit size to 100KB)
            if (
              file.size < 100000 &&
              isCodeFile(item.name)
            ) {
              try {
                const fileResponse = await fetch(item.download_url || item.url, {
                  headers,
                  next: { revalidate: 3600 },
                })
                if (fileResponse.ok) {
                  file.content = await fileResponse.text()
                }
              } catch (err) {
                console.error(`Failed to fetch file content for ${item.name}:`, err)
              }
            }
          }

          return file
        })
    )

    return NextResponse.json({
      owner,
      repo,
      path: path || '/',
      contents: formattedContents,
    })
  } catch (error) {
    console.error('[v0] GitHub API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch repository contents' },
      { status: 500 }
    )
  }
}

function isCodeFile(filename: string): boolean {
  const codeExtensions = [
    '.ts', '.tsx', '.js', '.jsx',
    '.py', '.java', '.cpp', '.c',
    '.go', '.rs', '.rb', '.php',
    '.json', '.yaml', '.yml', '.toml',
    '.md', '.txt', '.css', '.scss',
  ]
  return codeExtensions.some(ext => filename.toLowerCase().endsWith(ext))
}
