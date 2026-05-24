"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Loader2, BookOpen, AlertCircle, ArrowRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SectionHeader } from "@/components/editorial/section-header"
import { AvatarGroup } from "@/registry/magicui/avatar-group"
import { getBlogLikers } from "@/lib/blog-likers"
import {
  BlogLikeButton,
  getLikedBlogIds,
  markBlogLiked,
} from "@/components/blog-like-button"

interface BlogEntry {
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

export function BlogsSection() {
  const [blogs, setBlogs] = useState<BlogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [likingId, setLikingId] = useState<string | null>(null)

  useEffect(() => {
    setLikedIds(getLikedBlogIds())
    setIsMounted(true)
  }, [])

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch("/api/blogs")
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || "Failed to fetch from API")
        }
        const data = await response.json()
        setBlogs(
          Array.isArray(data)
            ? data.map((b: BlogEntry) => ({ ...b, views: b.views ?? 0 }))
            : []
        )
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load blogs")
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const formatDate = (dateString: string) => {
    if (!isMounted) return ""
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return ""
    }
  }

  const handleLike = async (blogId: string) => {
    if (likedIds.has(blogId) || likingId === blogId) return

    setLikingId(blogId)
    try {
      const response = await fetch(`/api/blogs/${blogId}/views`, { method: "POST" })
      if (!response.ok) return
      const data = await response.json()
      markBlogLiked(blogId)
      setLikedIds((prev) => new Set(prev).add(blogId))
      setBlogs((prev) =>
        prev.map((b) => (b.id === blogId ? { ...b, views: data.views ?? 0 } : b))
      )
    } finally {
      setLikingId(null)
    }
  }

  return (
    <section className="min-h-screen px-4 sm:px-6 py-16 bg-background border-b border-paper-3">
      <div className="max-w-[860px] mx-auto">
        <SectionHeader
          kicker="Writing"
          title="Technical blogs"
          description="In-depth notes on technical hurdles, daily discoveries, and the journey of building as a developer."
        />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="editorial-callout border-l-red-500">
            <div className="editorial-callout-title text-red-700">Connection error</div>
            <p>{error}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-foreground-muted">
            <BookOpen className="h-12 w-12 opacity-30 mx-auto mb-4" />
            No blog posts yet.
          </div>
        ) : (
          <div className="space-y-0 border-t border-paper-3">
            {blogs.map((entry, index) => (
              <Reveal key={entry.id} delay={index * 80}>
                <Link href={`/blogs/${entry.id}`} className="block group">
                  <motion.article
                    className="py-8 border-b border-paper-3 transition-colors hover:bg-paper-2/40 -mx-4 px-4 sm:-mx-6 sm:px-6"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                      {entry.image_url && (
                        <div className="sm:w-40 sm:shrink-0 h-28 sm:h-24 overflow-hidden rounded-sm border border-paper-3">
                          <img
                            src={entry.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-2">
                          {entry.category}
                        </p>
                        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground group-hover:text-primary transition-colors leading-tight mb-3">
                          {entry.title}
                        </h2>
                        <p className="text-sm text-foreground-muted line-clamp-2 leading-relaxed mb-4">
                          {entry.content}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <AvatarGroup
                              avatars={getBlogLikers(entry.id)}
                              max={3}
                              totalCount={entry.views}
                              size="sm"
                            />
                            <BlogLikeButton
                              blogId={entry.id}
                              likes={entry.views}
                              isLiked={likedIds.has(entry.id)}
                              isLoading={likingId === entry.id}
                              onLike={handleLike}
                            />
                          </div>
                          <div className="flex items-center gap-3 font-mono text-[11px] text-foreground-muted">
                            <span>{formatDate(entry.created_at)}</span>
                            <span className="text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                              Read <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={300}>
          <div className="mt-16 editorial-callout">
            <div className="editorial-callout-title">Collaborate</div>
            <p className="mb-4">
              Have a technical question or want to work on something together?
            </p>
            <Link
              href="/contact"
              className="editorial-footer-link inline-flex items-center gap-1"
            >
              Get in touch →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
