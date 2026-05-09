"use client"

import { useState, useEffect } from "react"
import { Reveal } from "@/components/reveal"
import { Loader2, BookOpen, AlertCircle } from "lucide-react"

interface BlogEntry {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  created_at: string
}

export function BlogsSection() {
  const [blogs, setBlogs] = useState<BlogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        console.log("Fetching blogs...")
        const response = await fetch("/api/blogs")
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Server responded with ${response.status}`)
        }
        const data = await response.json()
        setBlogs(data)
      } catch (e: any) {
        console.error("Fetch error:", e)
        setError(e.message || "Failed to load blogs")
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  return (
    <section className="min-h-screen px-4 sm:px-6 py-20 bg-background">
      <div className="max-w-[800px] mx-auto">
        <Reveal>
          <div className="flex flex-col items-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-4 text-foreground">
              Technical Blogs
            </h1>
            <p className="text-foreground-muted text-center">
              Simple Debug View
            </p>
          </div>
        </Reveal>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <span>Error: {error}</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-foreground-muted">
             <BookOpen className="h-16 w-16 opacity-20 mx-auto mb-4" />
             No blog posts found in database.
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((entry) => (
              <div key={entry.id} className="glass-card p-6">
                <h2 className="text-xl font-bold text-foreground mb-2">{entry.title}</h2>
                <span className="text-xs text-primary uppercase font-mono">{entry.category}</span>
                <p className="text-foreground-muted text-sm mt-4 line-clamp-2">{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
