import type { FileNode } from "@/components/site/files-tree"

interface GitHubTreeItem {
  path: string
  mode: string
  type: "blob" | "tree"
  sha: string
  size?: number
  url: string
}

interface GitHubTreeResponse {
  sha: string
  url: string
  tree: GitHubTreeItem[]
  truncated: boolean
}

export async function fetchGitHubRepoData(repoUrl: string) {
  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) return null

    const [, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, "")

    // Fetch repo stats
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers: {
        ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 },
    })

    // Fetch tree
    const treePromise = fetchGitHubTree(repoUrl)

    if (!repoRes.ok) return { tree: await treePromise }

    const repoData = await repoRes.json()

    // Fetch last commit
    const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=1`, {
      headers: {
        ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 },
    })

    let lastCommit = "recent"
    if (commitsRes.ok) {
      const commits = await commitsRes.json()
      if (commits && commits.length > 0) {
        const date = new Date(commits[0].commit.committer.date)
        lastCommit = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      }
    }

    return {
      stats: {
        stars: repoData.stargazers_count?.toString() || "0",
        forks: repoData.forks_count?.toString() || "0",
        issues: repoData.open_issues_count?.toString() || "0",
        license: repoData.license?.spdx_id || "MIT",
        lastCommit,
      },
      isPrivate: repoData.private,
      tree: await treePromise,
    }
  } catch (error) {
    console.error("Error fetching GitHub repo data:", error)
    return null
  }
}

export async function fetchGitHubTree(repoUrl: string): Promise<FileNode[]> {
  try {
    // Basic validation and parsing of the GitHub URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) return []

    const [, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, "")

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/main?recursive=1`,
      {
        headers: {
          ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    // Fallback to master if main doesn't exist
    if (res.status === 404) {
      const fallbackRes = await fetch(
        `https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/master?recursive=1`,
        {
          headers: {
            ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
            Accept: "application/vnd.github.v3+json",
          },
          next: { revalidate: 3600 },
        }
      )
      if (!fallbackRes.ok) return []
      return buildTreeFromItems((await fallbackRes.json()).tree)
    }

    if (!res.ok) return []
    const data: GitHubTreeResponse = await res.json()
    return buildTreeFromItems(data.tree)
  } catch (error) {
    console.error("Error fetching GitHub tree:", error)
    return []
  }
}

function buildTreeFromItems(items: GitHubTreeItem[]): FileNode[] {
  const root: FileNode[] = []
  const folderMap = new Map<string, FileNode[]>()

  // Sort items to process folders first if needed, but recursive=1 gives us all paths
  // We can just iterate and build the structure
  
  // First, filter out hidden files and focus on top-level or reasonable depth
  const filteredItems = items
    .filter(item => !item.path.startsWith(".") && !item.path.includes("/."))
    .slice(0, 100) // Limit to 100 items for performance

  for (const item of filteredItems) {
    const parts = item.path.split("/")
    const fileName = parts.pop()!
    const folderPath = parts.join("/")

    const node: FileNode =
      item.type === "tree"
        ? { type: "folder", name: fileName, children: [] }
        : { type: "file", name: fileName }

    if (folderPath === "") {
      root.push(node)
    } else {
      const parentChildren = folderMap.get(folderPath)
      if (parentChildren) {
        parentChildren.push(node)
      } else {
        // This might happen if recursive items are out of order, 
        // but for git trees they usually aren't.
        // For simplicity, if parent is missing, we skip or could build recursively.
      }
    }

    if (item.type === "tree") {
      folderMap.set(item.path, (node as any).children)
    }
  }

  // Sort: folders first, then alphabetical
  const sortNodes = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
    nodes.forEach(n => {
      if (n.type === "folder") sortNodes(n.children)
    })
  }

  sortNodes(root)
  
  // Set some defaults
  if (root.length > 0) {
    const src = root.find(n => n.type === "folder" && (n.name === "src" || n.name === "app"))
    if (src && src.type === "folder") {
      src.defaultOpen = true
    }
  }

  return root
}
