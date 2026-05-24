"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowLeft,
  Github,
  Linkedin,
  ExternalLink,
  Link as LinkIcon,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AvatarGroup } from "@/registry/magicui/avatar-group"
import { getBlogLikers } from "@/lib/blog-likers"
import {
  BlogLikeButton,
  getLikedBlogIds,
  markBlogLiked,
} from "@/components/blog-like-button"
import { BlogContent } from "@/components/editorial/blog-content"

export interface BlogArticleData {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  image_url: string | null
  github_url: string | null
  linkedin_url: string | null
  other_url: string | null
  created_at: string
  views: number
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return ""
  }
}

export function BlogArticle({ blog }: { blog: BlogArticleData }) {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [likingId, setLikingId] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const [views, setViews] = useState(blog.views)

  useEffect(() => {
    setLikedIds(getLikedBlogIds())
  }, [])

  const handleLike = async () => {
    if (likedIds.has(blog.id) || likingId === blog.id) return
    setLikingId(blog.id)
    try {
      const response = await fetch(`/api/blogs/${blog.id}/views`, { method: "POST" })
      if (!response.ok) return
      const data = await response.json()
      markBlogLiked(blog.id)
      setLikedIds((prev) => new Set(prev).add(blog.id))
      setViews(data.views ?? views)
    } finally {
      setLikingId(null)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/blogs/${blog.id}`)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <div className="bg-background min-h-screen pt-20">
      <header className="editorial-hero border-b border-paper-3">
        <div className="editorial-hero-inner max-w-[860px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground-muted hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All posts
          </Link>

          <p className="editorial-kicker mb-6">
            <span className="editorial-kicker-line" />
            {blog.category}
          </p>

          <h1 className="font-serif text-[clamp(2rem,6vw,3.75rem)] leading-[1.08] font-normal tracking-tight text-foreground mb-6">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 editorial-meta">
            <div>
              <span className="editorial-meta-label">Published</span>
              <span className="editorial-meta-val">{formatDate(blog.created_at)}</span>
            </div>
            <div>
              <span className="editorial-meta-label">Author</span>
              <span className="editorial-meta-val">Senesh</span>
            </div>
          </div>

          {blog.tags?.length > 0 && (
            <div className="feature-list mt-8">
              {blog.tags.map((tag) => (
                <span key={tag} className="feature-pill">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {blog.image_url && (
        <div className="max-w-[860px] mx-auto px-4 sm:px-8 -mt-6 mb-0">
          <div className="rounded-sm overflow-hidden border border-paper-3">
            <img
              src={blog.image_url}
              alt={blog.title}
              className="w-full max-h-[420px] object-cover"
            />
          </div>
        </div>
      )}

      <article className="editorial-article max-w-[720px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <BlogContent content={blog.content} />

        <div className="editorial-divider">· · ·</div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <AvatarGroup
            avatars={getBlogLikers(blog.id, 5)}
            max={5}
            totalCount={views}
            size="md"
          />
          <BlogLikeButton
            blogId={blog.id}
            likes={views}
            isLiked={likedIds.has(blog.id)}
            isLoading={likingId === blog.id}
            size="md"
            onLike={handleLike}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-8 pt-8 border-t border-paper-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground-muted">
            Share
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              window.open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/blogs/${blog.id}`)}`,
                "_blank",
                "width=600,height=600"
              )
            }
            className="h-8 px-2 text-foreground-muted hover:text-accent-blue"
          >
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="h-8 px-2 text-foreground-muted hover:text-primary"
          >
            {linkCopied ? (
              <CheckCircle className="h-4 w-4 text-green-700" />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
          </Button>
          {blog.github_url && (
            <a
              href={blog.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-blue hover:underline"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          )}
          {blog.other_url && (
            <a
              href={blog.other_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-blue hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Link
            </a>
          )}
        </div>

        <footer className="editorial-footer mt-12">
          <span className="font-mono text-[10px] tracking-[0.1em] text-foreground-muted">
            Senesh
          </span>
          <Link href="/blogs" className="editorial-footer-link">
            Back to writing →
          </Link>
        </footer>
      </article>
    </div>
  )
}
