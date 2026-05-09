"use client"

import { useState, useEffect } from "react"
import { Reveal } from "@/components/reveal"
import { Terminal, Code2, Cpu, Globe, Loader2, BookOpen, Github, Linkedin, ExternalLink, X, AlertCircle, Link as LinkIcon, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

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
}

const iconMap: Record<string, any> = {
  Frontend: Globe,
  UX: Terminal,
  "System Programming": Cpu,
  "Next.js": Code2,
}

export function BlogsSection({ autoOpenId }: { autoOpenId?: string }) {
  const [blogs, setBlogs] = useState<BlogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBlog, setSelectedBlog] = useState<BlogEntry | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    async function fetchBlogs() {
      try {
        const response = await fetch("/api/blogs")
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || "Failed to fetch from API")
        }
        const data = await response.json()
        const blogList = Array.isArray(data) ? data : []
        setBlogs(blogList)

        // If an ID is provided via props (from dynamic route), open that blog automatically
        if (autoOpenId) {
          const blogToOpen = blogList.find((b: BlogEntry) => b.id === autoOpenId)
          if (blogToOpen) {
            setSelectedBlog(blogToOpen)
          }
        }
      } catch (e: any) {
        console.error("Fetch error:", e)
        setError(e.message || "Failed to load blogs")
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlogs()
  }, [autoOpenId])

  const formatDate = (dateString: string) => {
    if (!isMounted) return ""
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch (e) {
      return ""
    }
  }

  const handleBlogClick = (blog: BlogEntry) => {
    setSelectedBlog(blog)
    // Update URL without refreshing the page to support sharing the specific link
    window.history.pushState(null, '', `/blogs/${blog.id}`)
  }

  const closePortal = () => {
    setSelectedBlog(null)
    // Restore the base /blogs URL
    window.history.pushState(null, '', '/blogs')
  }

  const handleShareLinkedIn = (blog: BlogEntry) => {
    const url = `${window.location.origin}/blogs/${blog.id}`
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank', 'width=600,height=600')
  }

  const handleCopyLink = (blog: BlogEntry) => {
    const url = `${window.location.origin}/blogs/${blog.id}`
    navigator.clipboard.writeText(url)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
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
          <div className="max-w-md mx-auto p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex flex-col items-center text-center gap-4">
            <AlertCircle className="h-10 w-10" />
            <div>
              <h3 className="font-bold mb-1">Database Connection Error</h3>
              <p className="text-sm opacity-80">{error}</p>
              <p className="text-[10px] mt-4 uppercase tracking-widest opacity-50">Check Vercel Environment Variables</p>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-foreground-muted">
             <BookOpen className="h-16 w-16 opacity-20 mx-auto mb-4" />
             No blog posts yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((entry, index) => {
              const Icon = iconMap[entry.category] || BookOpen
              return (
                <Reveal key={entry.id} delay={index * 100}>
                  <div 
                    className="glass-card h-full flex flex-col glass-card-hover group overflow-hidden cursor-pointer"
                    onClick={() => handleBlogClick(entry)}
                  >
                    {/* Blog Image */}
                    {entry.image_url && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img 
                          src={entry.image_url} 
                          alt={entry.title}
                          className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050302] via-transparent to-transparent opacity-80" />
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-medium block mb-1">
                              {entry.category}
                            </span>
                            <h2 className="text-xl font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                              {entry.title}
                            </h2>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-foreground-muted leading-relaxed mb-6 line-clamp-3">
                        {entry.content}
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <Button 
                          variant="ghost" 
                          className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent font-medium flex items-center gap-2 group/btn"
                        >
                          View Blog <ExternalLink className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                        <span className="text-[10px] text-foreground-muted font-mono">
                          {formatDate(entry.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}

        {/* Blog Detail Modal */}
        {selectedBlog && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
            onClick={closePortal}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" />
            
            <div 
              className="relative w-full max-w-3xl glass-card max-h-full overflow-y-auto animate-scale-in p-6 sm:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closePortal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-primary/20 transition-colors z-10"
                data-magnetic
              >
                <X className="h-5 w-5 text-foreground" />
              </button>

              {selectedBlog.image_url && (
                <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8 border border-white/10">
                  <img 
                    src={selectedBlog.image_url} 
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              )}

              <div className="mb-8">
                <span className="text-xs text-primary uppercase tracking-[0.3em] font-bold block mb-3">
                  {selectedBlog.category}
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold text-foreground leading-tight">
                  {selectedBlog.title}
                </h2>
                <p className="text-xs text-foreground-muted font-mono mt-4">
                  Published on {formatDate(selectedBlog.created_at)}
                </p>
              </div>

              <div className="prose prose-invert max-w-none mb-10">
                <p className="text-foreground/90 text-lg leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedBlog.content}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-4">
                   {/* Share Section */}
                   <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                    <span className="text-[10px] text-foreground-muted uppercase tracking-widest font-bold">Share:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShareLinkedIn(selectedBlog)}
                      className="h-8 w-8 p-0 text-foreground-muted hover:text-[#0077b5] hover:bg-[#0077b5]/10 rounded-lg"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyLink(selectedBlog)}
                      className="h-8 w-8 p-0 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-lg"
                      title="Copy Link"
                    >
                      {linkCopied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    {selectedBlog.github_url && (
                      <a 
                        href={selectedBlog.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors text-sm"
                        data-magnetic
                      >
                        <Github className="h-5 w-5" /> GitHub
                      </a>
                    )}
                    {selectedBlog.linkedin_url && (
                      <a 
                        href={selectedBlog.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors text-sm"
                        data-magnetic
                      >
                        <Linkedin className="h-5 w-5" /> Original Post
                      </a>
                    )}
                    {selectedBlog.other_url && (
                      <a 
                        href={selectedBlog.other_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors text-sm"
                        data-magnetic
                      >
                        <ExternalLink className="h-5 w-5" /> Live Link
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedBlog.tags && selectedBlog.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 rounded-full text-[10px] bg-primary/10 text-primary border border-primary/20 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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
