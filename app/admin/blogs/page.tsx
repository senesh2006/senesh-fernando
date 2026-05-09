"use client"

import { useState, useEffect } from "react"
import { Send, Loader2, BookOpen, Plus, Tag, Layers, Image as ImageIcon, Github, Linkedin, Globe, Trash2, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<BlogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingBlog, setEditingBlog] = useState<BlogEntry | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    customCategory: "",
    tags: "",
    image_url: "",
    github_url: "",
    linkedin_url: "",
    other_url: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/blogs")
      if (!response.ok) throw new Error("Failed to fetch blogs")
      const data = await response.json()
      setBlogs(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (blog: BlogEntry) => {
    setEditingBlog(blog)
    const knownCategories = ["Frontend", "UX", "System Programming", "Next.js"]
    const isKnown = knownCategories.includes(blog.category)
    
    setFormData({
      title: blog.title,
      content: blog.content,
      category: isKnown ? blog.category : "Other",
      customCategory: isKnown ? "" : blog.category,
      tags: blog.tags.join(", "),
      image_url: blog.image_url || "",
      github_url: blog.github_url || "",
      linkedin_url: blog.linkedin_url || "",
      other_url: blog.other_url || "",
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/blogs?id=${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete")
      setBlogs(prev => prev.filter(b => b.id !== id))
    } catch (err) {
      alert("Failed to delete blog post")
    }
  }

  const cancelEdit = () => {
    setEditingBlog(null)
    setFormData({ 
      title: "", 
      content: "", 
      category: "", 
      customCategory: "", 
      tags: "",
      image_url: "",
      github_url: "",
      linkedin_url: "",
      other_url: ""
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const category = formData.category === "Other" ? formData.customCategory : formData.category
    
    if (!category) {
      setError("Please specify a category")
      setIsSubmitting(false)
      return
    }

    const payload = {
      ...formData,
      id: editingBlog?.id,
      category,
      tags: formData.tags.split(",").map(t => t.trim()).filter(t => t !== ""),
    }

    try {
      const response = await fetch("/api/blogs", {
        method: editingBlog ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error(`Failed to ${editingBlog ? 'update' : 'create'} blog post`)

      setSubmitted(true)
      cancelEdit()
      fetchBlogs()
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050302] p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              {editingBlog ? <Edit className="h-6 w-6 text-primary" /> : <Plus className="h-6 w-6 text-primary" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {editingBlog ? "Edit Blog Post" : "Blog Admin"}
              </h1>
              <p className="text-foreground-muted text-sm">
                {editingBlog ? `Updating "${editingBlog.title}"` : "Create a new technical blog post"}
              </p>
            </div>
          </div>
          {editingBlog && (
            <Button variant="outline" onClick={cancelEdit} className="gap-2 border-white/10 text-foreground">
              <X className="h-4 w-4" /> Cancel Edit
            </Button>
          )}
        </div>

        {/* Editor Form */}
        <div className="glass-card p-6 sm:p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-foreground-muted flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Title
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl"
                placeholder="The Future of Web Audio..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Category
                </label>
                <div className="space-y-2">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#0a0705] border border-primary/20 text-foreground p-2 rounded-xl focus:border-primary outline-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Frontend">Frontend</option>
                    <option value="UX">UX</option>
                    <option value="System Programming">System Programming</option>
                    <option value="Next.js">Next.js</option>
                    <option value="Other">Other (Type below)</option>
                  </select>
                  {formData.category === "Other" && (
                    <Input
                      type="text"
                      value={formData.customCategory}
                      onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                      required
                      className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl"
                      placeholder="Type your category..."
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Tags (comma separated)
                </label>
                <Input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl"
                  placeholder="react, audio, tutorial"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Image URL
                </label>
                <Input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Github className="h-4 w-4" /> GitHub Project URL
                </label>
                <Input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                  className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl"
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Linkedin className="h-4 w-4" /> LinkedIn Post URL
                </label>
                <Input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl"
                  placeholder="https://linkedin.com/posts/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Other Social / Live Link
                </label>
                <Input
                  type="url"
                  value={formData.other_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, other_url: e.target.value }))}
                  className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground-muted">Content (Markdown supported)</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                required
                rows={10}
                className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl resize-none"
                placeholder="Write your blog content here..."
              />
            </div>

            {submitted && (
              <p className="text-green-400 text-center bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                Blog post {editingBlog ? "updated" : "created"} successfully!
              </p>
            )}

            {error && (
              <p className="text-red-400 text-center bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gap-2 bg-primary text-white hover:bg-primary/90 transition-all rounded-xl py-6 shadow-[0_0_20px_rgba(255,106,0,0.3)]"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isSubmitting ? (editingBlog ? "Updating..." : "Creating...") : (editingBlog ? "Update Blog Post" : "Publish Blog Post")}
            </Button>
          </form>
        </div>

        {/* Blog List Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" /> Existing Posts
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="glass-card p-10 text-center text-foreground-muted">
              No blog posts found.
            </div>
          ) : (
            <div className="grid gap-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="min-w-0">
                    <span className="text-[10px] text-primary uppercase tracking-widest font-mono block mb-1">
                      {blog.category}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground truncate">{blog.title}</h3>
                    <p className="text-xs text-foreground-muted mt-1">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(blog)}
                      className="h-10 w-10 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-xl"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(blog.id)}
                      className="h-10 w-10 text-foreground-muted hover:text-red-400 hover:bg-red-400/10 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
