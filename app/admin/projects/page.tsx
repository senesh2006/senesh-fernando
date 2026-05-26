"use client"

import { useState, useEffect } from "react"
import { Send, Loader2, Cpu, Plus, Tag, Layers, Image as ImageIcon, Github, Trash2, Edit, X, Code, Lightbulb, TrendingUp, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Project {
  id: string
  name: string
  language: string
  description: string
  full_description: string
  source_url: string | null
  skills: string[]
  impact: string
  image_url: string
  gallery: string[]
  order_index: number
  created_at: string
}

export default function ProjectAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    language: "Python",
    description: "",
    full_description: "",
    source_url: "",
    skills: "",
    impact: "",
    image_url: "",
    gallery: "",
    order_index: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/projects")
      if (!response.ok) throw new Error("Failed to fetch projects")
      const data = await response.json()
      setProjects(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      language: project.language,
      description: project.description,
      full_description: project.full_description,
      source_url: project.source_url || "",
      skills: project.skills.join(", "),
      impact: project.impact,
      image_url: project.image_url,
      gallery: Array.isArray(project.gallery) ? project.gallery.join(", ") : "",
      order_index: project.order_index,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects?id=${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete")
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert("Failed to delete project")
    }
  }

  const cancelEdit = () => {
    setEditingProject(null)
    setFormData({ 
      name: "", 
      language: "Python", 
      description: "", 
      full_description: "", 
      source_url: "",
      skills: "",
      impact: "",
      image_url: "",
      gallery: "",
      order_index: 0
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const payload = {
      ...formData,
      id: editingProject?.id,
      skills: formData.skills.split(",").map(s => s.trim()).filter(s => s !== ""),
      gallery: formData.gallery.split(",").map(s => s.trim()).filter(s => s !== ""),
      order_index: Number(formData.order_index)
    }

    try {
      const response = await fetch("/api/projects", {
        method: editingProject ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error(`Failed to ${editingProject ? 'update' : 'create'} project`)

      setSubmitted(true)
      cancelEdit()
      fetchProjects()
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              {editingProject ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {editingProject ? "Edit Project" : "Project Admin"}
              </h1>
              <p className="text-foreground-muted text-sm">
                {editingProject ? `Updating "${editingProject.name}"` : "Add a new project to your portfolio"}
              </p>
            </div>
          </div>
          {editingProject && (
            <Button variant="outline" onClick={cancelEdit} className="gap-2 border-white/10 text-foreground">
              <X className="h-4 w-4" /> Cancel Edit
            </Button>
          )}
        </div>

        {/* Editor Form */}
        <div className="glass-card p-6 sm:p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Cpu className="h-4 w-4" /> Project Name
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl"
                  placeholder="BeeWorld Simulation..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Code className="h-4 w-4" /> Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full bg-[#0a0705] border border-primary/20 text-foreground p-2 rounded-xl focus:border-primary outline-none"
                >
                  <option value="Python">Python</option>
                  <option value="C">C</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="React">React</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground-muted">Short Description</label>
              <Input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl"
                placeholder="Brief summary for the card..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground-muted">Full Detailed Description</label>
              <Textarea
                value={formData.full_description}
                onChange={(e) => setFormData(prev => ({ ...prev, full_description: e.target.value }))}
                required
                rows={5}
                className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl resize-none"
                placeholder="In-depth explanation for the modal..."
              />
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
                  required
                  className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Github className="h-4 w-4" /> Source URL (GitHub)
                </label>
                <Input
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, source_url: e.target.value }))}
                  className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground-muted flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Screenshots (Gallery URLs, comma separated)
              </label>
              <Textarea
                value={formData.gallery}
                onChange={(e) => setFormData(prev => ({ ...prev, gallery: e.target.value }))}
                rows={3}
                className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl resize-none"
                placeholder="https://image1.com, https://image2.com..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Skills Used (comma separated)
                </label>
                <Input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  required
                  className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl"
                  placeholder="Python, OOP, Matplotlib..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Hash className="h-4 w-4" /> Order Index (Higher = Last)
                </label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_index: Number(e.target.value) }))}
                  className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground-muted flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Impact on You
              </label>
              <Textarea
                value={formData.impact}
                onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
                required
                rows={3}
                className="bg-white/5 border-primary/20 text-foreground focus:border-primary rounded-xl resize-none"
                placeholder="What did you learn from this project?"
              />
            </div>

            {submitted && (
              <p className="text-green-400 text-center bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                Project {editingProject ? "updated" : "added"} successfully!
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
              {isSubmitting ? (editingProject ? "Updating..." : "Adding...") : (editingProject ? "Update Project" : "Add Project")}
            </Button>
          </form>
        </div>

        {/* Project List Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" /> Existing Projects
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="glass-card p-10 text-center text-foreground-muted">
              No projects found.
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <div key={project.id} className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-12 w-12 rounded-lg overflow-hidden border border-white/5 shrink-0">
                      <img src={project.image_url} alt={project.name} className="h-full w-full object-cover opacity-60" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-primary uppercase tracking-widest font-mono block mb-1">
                        {project.language}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground truncate">{project.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(project)}
                      className="h-10 w-10 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-xl"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(project.id)}
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
