"use client"

import { useState, useEffect } from "react"
import { Send, Loader2, Briefcase, Plus, Hash, Trash2, Edit, X, Layers, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Experience {
  id: string
  role: string
  company: string
  duration: string
  description: string
  achievements: string[]
  order_index: number
  created_at: string
}

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    duration: "",
    description: "",
    achievements: "",
    order_index: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/experience")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setExperiences(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (exp: Experience) => {
    setEditingExp(exp)
    setFormData({
      role: exp.role,
      company: exp.company,
      duration: exp.duration,
      description: exp.description,
      achievements: exp.achievements.join("\n"),
      order_index: exp.order_index,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      await fetch(`/api/experience?id=${id}`, { method: "DELETE" })
      setExperiences(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      alert("Delete failed")
    }
  }

  const cancelEdit = () => {
    setEditingExp(null)
    setFormData({ role: "", company: "", duration: "", description: "", achievements: "", order_index: 0 })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const payload = {
      ...formData,
      id: editingExp?.id,
      achievements: formData.achievements.split("\n").map(a => a.trim()).filter(a => a !== ""),
      order_index: Number(formData.order_index)
    }

    try {
      const response = await fetch("/api/experience", {
        method: editingExp ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Operation failed")

      setSubmitted(true)
      cancelEdit()
      fetchExperiences()
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              {editingExp ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {editingExp ? "Edit Experience" : "Experience Admin"}
              </h1>
              <p className="text-foreground-muted text-sm">Manage your professional career history</p>
            </div>
          </div>
          {editingExp && (
            <Button variant="outline" onClick={cancelEdit} className="gap-2 border-white/10 text-foreground">
              <X className="h-4 w-4" /> Cancel Edit
            </Button>
          )}
        </div>

        <div className="glass-card p-6 sm:p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Role / Title
                </label>
                <Input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  required
                  className="bg-white/5 border-primary/20 text-foreground rounded-xl"
                  placeholder="Software Engineer Intern..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Company
                </label>
                <Input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  required
                  className="bg-white/5 border-primary/20 text-foreground rounded-xl"
                  placeholder="Google..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Duration
                </label>
                <Input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  required
                  className="bg-white/5 border-primary/20 text-foreground rounded-xl"
                  placeholder="Jan 2024 - Present"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Hash className="h-4 w-4" /> Order Index
                </label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_index: Number(e.target.value) }))}
                  className="bg-white/5 border-primary/20 text-foreground rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground-muted">Overall Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={3}
                className="bg-white/5 border-primary/20 text-foreground rounded-xl resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground-muted">Key Achievements (One per line)</label>
              <Textarea
                value={formData.achievements}
                onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                rows={5}
                className="bg-white/5 border-primary/20 text-foreground rounded-xl resize-none"
                placeholder="Developed a new API feature...&#10;Reduced latency by 20%..."
              />
            </div>

            {submitted && <p className="text-green-400 text-center">Success!</p>}
            {error && <p className="text-red-400 text-center">{error}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white rounded-xl py-6">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="ml-2">{editingExp ? "Update Experience" : "Add Experience"}</span>
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Existing Experience</h2>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="grid gap-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="glass-card p-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{exp.role}</h3>
                    <p className="text-sm text-primary">{exp.company}</p>
                    <p className="text-xs text-foreground-muted">{exp.duration}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(exp)} className="hover:text-primary hover:bg-primary/10 rounded-xl">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(exp.id)} className="hover:text-red-400 hover:bg-red-400/10 rounded-xl">
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
