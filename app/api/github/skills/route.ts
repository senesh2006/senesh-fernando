import { NextResponse } from "next/server"

const GITHUB_USER = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "senesh2006"

// Map GitHub language names → simpleicons.org slugs (for logos).
const LANG_ICON: Record<string, string> = {
  Python: "python",
  TypeScript: "typescript",
  JavaScript: "javascript",
  "C++": "cplusplus",
  C: "c",
  "C#": "csharp",
  Java: "openjdk",
  HTML: "html5",
  CSS: "css3",
  SCSS: "sass",
  Shell: "gnubash",
  Go: "go",
  Rust: "rust",
  Ruby: "ruby",
  PHP: "php",
  Dart: "dart",
  Kotlin: "kotlin",
  Swift: "swift",
  Jupyter: "jupyter",
  "Jupyter Notebook": "jupyter",
  Vue: "vuedotjs",
  Svelte: "svelte",
  R: "r",
  Dockerfile: "docker",
  SQL: "postgresql",
  PLpgSQL: "postgresql",
  TeX: "latex",
  Lua: "lua",
}

interface Repo {
  name: string
  fork: boolean
  languages_url: string
}

const ghHeaders = {
  ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
  Accept: "application/vnd.github+json",
}

export async function GET() {
  try {
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
      { headers: ghHeaders, next: { revalidate: 86400 } }
    )

    if (!reposRes.ok) {
      return NextResponse.json({ skills: [], error: `GitHub ${reposRes.status}` }, { status: 200 })
    }

    const repos: Repo[] = await reposRes.json()
    const own = repos.filter((r) => !r.fork)

    // Aggregate bytes per language across all repos.
    const totals: Record<string, number> = {}
    await Promise.all(
      own.map(async (repo) => {
        try {
          const res = await fetch(repo.languages_url, { headers: ghHeaders, next: { revalidate: 86400 } })
          if (!res.ok) return
          const langs: Record<string, number> = await res.json()
          for (const [lang, bytes] of Object.entries(langs)) {
            totals[lang] = (totals[lang] ?? 0) + bytes
          }
        } catch {
          /* skip individual repo failures */
        }
      })
    )

    const skills = Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([name, bytes]) => ({
        name,
        bytes,
        icon: LANG_ICON[name] ?? null,
      }))

    return NextResponse.json({ skills, repoCount: own.length })
  } catch (error) {
    console.error("Failed to aggregate GitHub skills:", error)
    return NextResponse.json({ skills: [], error: "failed" }, { status: 200 })
  }
}
