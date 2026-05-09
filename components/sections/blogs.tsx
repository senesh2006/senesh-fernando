"use client"

import { useState, useEffect } from "react"
import { Reveal } from "@/components/reveal"
import { Terminal, Code2, Cpu, Globe, Loader2, BookOpen } from "lucide-react"

interface BlogEntry {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  created_at: string
}

const iconMap: Record<string, any> = {
  Frontend: Globe,
  UX: Terminal,
  "System Programming": Cpu,
  "Next.js": Code2,
}

export function BlogsSection() {
  const [blogs, setBlogs] = useState<BlogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch("/api/blogs")
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        setBlogs(data)
      } catch (e) {
        console.error("Failed to load blogs:", e)
        setError("Failed to load blogs")
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <section className="min-h-screen px-4 sm:px-6 py-20 bg-background">
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <div className="flex flex-col items-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-4 text-foreground">
              Technical Blogs
            </h1>
            <p className="text-foreground-muted text-center max-w-2xl">
              In-depth looks at technical hurdles, daily discoveries, and my journey as a developer.
            </p>
          </div>
        </Reveal>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-foreground-muted">
             <BookOpen className="h-16 w-16 opacity-20 mx-auto mb-4" />
             No blog posts yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((entry, index) => {
              const Icon = iconMap[entry.category] || BookOpen
              return (
                <Reveal key={entry.id} delay={index * 100}>
                  <div className="glass-card p-6 h-full flex flex-col glass-card-hover group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-medium block mb-1">
                            {entry.category}
                          </span>
                          <h2 className="text-lg font-semibold text-foreground leading-tight">
                            {entry.title}
                          </h2>
                        </div>
                      </div>
                      <span className="text-[10px] text-foreground-muted font-mono whitespace-nowrap">
                        {formatDate(entry.created_at)}
                      </span>
                    </div>

                    <p className="text-sm text-foreground-muted leading-relaxed mb-6 flex-1 whitespace-pre-wrap">
                      {entry.content}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border/30">
                      {entry.tags && entry.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="text-[9px] px-2 py-0.5 rounded-md bg-white/5 text-foreground-muted border border-border/50 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}

        <Reveal delay={500}>
          <div className="mt-20 p-8 glass-card border-dashed border-primary/30 flex flex-col items-center text-center">
            <h3 className="text-xl font-medium text-foreground mb-4">Have a technical question?</h3>
            <p className="text-foreground-muted text-sm mb-6 max-w-md">
              I'm always happy to discuss these topics or collaborate on projects involving these technologies.
            </p>
            <a 
              href="/contact" 
              className="px-6 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all glow-orange"
              data-magnetic
            >
              Get in touch
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
