"use client"

import { useState, useEffect } from "react"
import { Send, Loader2, GraduationCap, Plus, Hash, Trash2, Edit, X, Layers, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Education {
  id: string
  degree: string
  institution: string
  duration: string
  description: string | null
  order_index: number
  created_at: string
}

export default function EducationAdminPage() {
  const [educationList, setEducationList] = useState<Education[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingEdu, setEditingEdu] = useState<Education | null>(null)
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    duration: "",
    description: "",
    order_index: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/education")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setEducationList(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (edu: Education) => {
    setEditingEdu(edu)
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      duration: edu.duration,
      description: edu.description || "",
      order_index: edu.order_index,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      await fetch(`/api/education?id=${id}`, { method: "DELETE" })
      setEducationList(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      alert("Delete failed")
    }
  }

  const cancelEdit = () => {
    setEditingEdu(null)
    setFormData({ degree: "", institution: "", duration: "", description: "", order_index: 0 })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const payload = {
      ...formData,
      id: editingEdu?.id,
      order_index: Number(formData.order_index)
    }

    try {
      const response = await fetch("/api/education", {
        method: editingEdu ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Operation failed")

      setSubmitted(true)
      cancelEdit()
      fetchEducation()
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
              {editingEdu ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {editingEdu ? "Edit Education" : "Education Admin"}
              </h1>
              <p className="text-foreground-muted text-sm">Manage your academic qualifications</p>
            </div>
          </div>
          {editingEdu && (
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
                  <GraduationCap className="h-4 w-4" /> Degree / Field
                </label>
                <Input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                  required
                  className="bg-white/5 border-primary/20 text-foreground rounded-xl"
                  placeholder="BSc in Information Technology..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Institution
                </label>
                <Input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  required
                  className="bg-white/5 border-primary/20 text-foreground rounded-xl"
                  placeholder="Curtin University Colombo..."
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
                  placeholder="2022 - 2026"
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
              <label className="text-sm text-foreground-muted">Description (Optional)</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="bg-white/5 border-primary/20 text-foreground rounded-xl resize-none"
                placeholder="Mention specific focus or relevant coursework..."
              />
            </div>

            {submitted && <p className="text-green-400 text-center">Success!</p>}
            {error && <p className="text-red-400 text-center">{error}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white rounded-xl py-6">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="ml-2">{editingEdu ? "Update Education" : "Add Education"}</span>
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Existing Education</h2>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="grid gap-4">
              {educationList.map((edu) => (
                <div key={edu.id} className="glass-card p-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-primary">{edu.institution}</p>
                    <p className="text-xs text-foreground-muted">{edu.duration}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(edu)} className="hover:text-primary hover:bg-primary/10 rounded-xl">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(edu.id)} className="hover:text-red-400 hover:bg-red-400/10 rounded-xl">
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
