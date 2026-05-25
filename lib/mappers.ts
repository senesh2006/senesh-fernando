import type { FileNode } from "@/components/site/files-tree"
import type { BackendBlog, BackendExperience, BackendProject, BackendSkill } from "@/lib/backend-types"
import {
  estimateReadMinutes,
  extractBlogHtml,
  looksLikeHtml,
  stripBlogExcerpt,
} from "@/lib/blog-content"
import type { Post } from "@/data/posts"
import type { Project } from "@/data/projects"

const DEFAULT_PROJECT_IMAGE =
  "https://images.unsplash.com/photo-1555066931-436f8abb32?auto=format&fit=crop&w=1200&q=80"

const DEFAULT_BLOG_IMAGE =
  "https://images.unsplash.com/photo-1455390582240-0447851f2f93?auto=format&fit=crop&w=1200&q=80"

const FALLBACK_PROJECT_TREE: FileNode[] = [
  {
    type: "folder",
    name: "src",
    defaultOpen: true,
    children: [
      {
        type: "folder",
        name: "components",
        children: [
          { type: "file", name: "index.tsx" },
          { type: "file", name: "layout.tsx" },
        ],
      },
      { type: "file", name: "main.ts" },
    ],
  },
  { type: "file", name: "package.json" },
  { type: "file", name: "README.md" },
]

function formatProjectYear(createdAt?: string) {
  if (!createdAt) return new Date().getFullYear().toString()
  const year = new Date(createdAt).getFullYear()
  return Number.isNaN(year) ? new Date().getFullYear().toString() : year.toString()
}

function formatBlogDate(createdAt?: string) {
  if (!createdAt) return new Date().toISOString().slice(0, 10).replace(/-/g, ".")
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) {
    return createdAt.slice(0, 10).replace(/-/g, ".")
  }
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}.${m}.${d}`
}

export function mapBackendProject(record: BackendProject, index: number): Project {
  const cover = record.image_url || DEFAULT_PROJECT_IMAGE
  const description = record.description?.trim() || "Project details coming soon."
  const longDescription =
    record.full_description?.trim() || record.description?.trim() || description
  const skills = Array.isArray(record.skills) ? record.skills.map(String) : []
  const repo = record.source_url || "https://github.com/senesh2006"

  return {
    slug: record.id,
    n: String(index + 1).padStart(2, "0"),
    name: record.name,
    year: formatProjectYear(record.created_at),
    tag: (record.language || "project").toLowerCase(),
    status: "shipping",
    body: description,
    longDescription,
    pros: skills.slice(0, 3).map((skill) => skill),
    cons: record.impact ? [record.impact] : [],
    cover,
    gallery: [cover],
    repo,
    demo: repo,
    stack: skills.length > 0 ? skills : [record.language || "TypeScript"],
    stats: {
      stars: "—",
      forks: "—",
      issues: "—",
      license: "MIT",
      lastCommit: "recent",
    },
    tree: FALLBACK_PROJECT_TREE,
  }
}

export function mapBackendBlog(record: BackendBlog): Post {
  const content = String(record.content ?? "")
  const dek = stripBlogExcerpt(content)
  const cover = record.image_url || DEFAULT_BLOG_IMAGE

  return {
    slug: record.id,
    date: formatBlogDate(record.created_at),
    title: record.title,
    dek,
    read: estimateReadMinutes(content),
    tag: record.category || "writing",
    cover,
    contentHtml: looksLikeHtml(content) ? extractBlogHtml(content) : undefined,
    contentMarkdown: looksLikeHtml(content) ? undefined : content,
    views: Number(record.views ?? 0),
    tags: Array.isArray(record.tags) ? record.tags.map(String) : [],
  }
}

export function mapExperienceToTimeline(entry: BackendExperience): [string, string] {
  const when = entry.duration?.trim() || "—"
  const what = [entry.role, entry.company].filter(Boolean).join(" · ")
  const detail = entry.description?.trim()
  const line = detail ? `${what}. ${detail}` : what
  return [when, line]
}

export function mapSkillNames(records: BackendSkill[]) {
  return records.flatMap((record) => {
    if (Array.isArray(record.skill_list) && record.skill_list.length > 0) {
      return record.skill_list.map(String)
    }
    if (record.category) return [record.category]
    if (record.name) return [record.name]
    return []
  })
}
