import { NextRequest, NextResponse } from "next/server"

const MAX_BYTES = 200 * 1024 // 200KB — don't try to render giant files

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const repoUrl = searchParams.get("repo") ?? ""
    const path = searchParams.get("path") ?? ""

    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match || !path) {
      return NextResponse.json({ error: "Missing repo or path" }, { status: 400 })
    }

    const [, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, "")

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`,
      {
        headers: {
          ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub responded ${res.status}` },
        { status: res.status === 404 ? 404 : 502 }
      )
    }

    const data = await res.json()

    if (Array.isArray(data) || data.type !== "file") {
      return NextResponse.json({ error: "Not a file" }, { status: 400 })
    }

    if (typeof data.size === "number" && data.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large to preview", size: data.size, tooLarge: true },
        { status: 200 }
      )
    }

    const content =
      data.encoding === "base64" && data.content
        ? Buffer.from(data.content, "base64").toString("utf-8")
        : (data.content ?? "")

    const name: string = data.name ?? path.split("/").pop() ?? path
    const ext = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "txt"

    return NextResponse.json({ name, path, ext, content })
  } catch (error) {
    console.error("Failed to fetch file content:", error)
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 })
  }
}
