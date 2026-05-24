"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, AlertCircle } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SectionHeader } from "@/components/editorial/section-header"
import { stripBlogExcerpt } from "@/lib/blog-content"

interface BlogEntry {
  id: string
  title: string
  content: string
  category: string
  created_at: string
}

interface BlogsSectionProps {
  preview?: boolean
}

export function BlogsSection({ preview = false }: BlogsSectionProps) {
  const [blogs, setBlogs] = useState<BlogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
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
        setBlogs(Array.isArray(data) ? data : [])
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
      })
    } catch {
      return ""
    }
  }

  const displayBlogs = preview ? blogs.slice(0, 2) : blogs

  return (
    <section id="blog">
      <div className="container">
        <SectionHeader num="05" title="Writing" />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10 flex flex-col items-center gap-2">
            <AlertCircle />
            <span>{error}</span>
          </div>
        ) : (
          <Reveal>
            <div className="blog-grid">
              {displayBlogs.length > 0 ? (
                displayBlogs.map((entry) => (
                  <Link key={entry.id} href={`/blogs/${entry.id}`} className="blog-card">
                    <div className="blog-date">
                      {formatDate(entry.created_at)} · {entry.category}
                    </div>
                    <div className="blog-title">{entry.title}</div>
                    <div className="blog-excerpt">{stripBlogExcerpt(entry.content)}</div>
                    <div className="blog-read">Read more →</div>
                  </Link>
                ))
              ) : (
                <Link href="/blogs" className="blog-card">
                  <div className="blog-date">May 2026 · Buildathon</div>
                  <div className="blog-title">
                    We built a SaaS in 24 hours. It never deployed. We still placed Top 20.
                  </div>
                  <div className="blog-excerpt">
                    A first-person account of shipping fast, breaking things, and learning that a
                    great demo can outlast a broken production build.
                  </div>
                  <div className="blog-read">Read more →</div>
                </Link>
              )}

              {preview && (
                <div className="blog-card blog-card-dim">
                  <div className="blog-date">Coming soon</div>
                  <div className="blog-title">More posts in the works</div>
                  <div className="blog-excerpt">
                    Writing about things I&apos;m learning — architecture, AI integrations, building
                    products as a student, and whatever breaks next.
                  </div>
                  <div className="blog-read">Stay tuned</div>
                </div>
              )}
            </div>

            {preview && blogs.length > 2 && (
              <div className="mt-8 text-center">
                <Link href="/blogs" className="btn btn-ghost">
                  View all posts
                </Link>
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  )
}
