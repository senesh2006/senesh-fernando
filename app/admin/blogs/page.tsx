"use client"

import { useState } from "react"
import { Send, Loader2, BookOpen, Plus, Tag, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function BlogAdminPage() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Frontend",
    tags: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const payload = {
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(t => t !== ""),
    }

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to create blog post")

      setSubmitted(true)
      setFormData({ title: "", content: "", category: "Frontend", tags: "" })
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050302] p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Blog Admin</h1>
            <p className="text-foreground-muted text-sm">Create a new technical blog post</p>
          </div>
        </div>

        <div className="glass-card p-8">
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
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-[#0a0705] border border-primary/20 text-foreground p-2 rounded-xl focus:border-primary outline-none"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="UX">UX</option>
                  <option value="System Programming">System Programming</option>
                  <option value="Next.js">Next.js</option>
                </select>
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
                Blog post created successfully!
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
              {isSubmitting ? "Creating..." : "Publish Blog Post"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
