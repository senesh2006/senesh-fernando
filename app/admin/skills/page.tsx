"use client"

import { useState, useEffect } from "react"
import { Send, Loader2, User, Plus, Hash, Trash2, Edit, X, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface SkillCategory {
  id: string
  category: string
  skill_list: string[]
  order_index: number
  created_at: string
}

export default function SkillsAdminPage() {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState<SkillCategory | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    skill_list: "",
    order_index: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/skills")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setSkillCategories(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (skill: SkillCategory) => {
    setEditingSkill(skill)
    setFormData({
      category: skill.category,
      skill_list: skill.skill_list.join(", "),
      order_index: skill.order_index,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      await fetch(`/api/skills?id=${id}`, { method: "DELETE" })
      setSkillCategories(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      alert("Delete failed")
    }
  }

  const cancelEdit = () => {
    setEditingSkill(null)
    setFormData({ category: "", skill_list: "", order_index: 0 })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const payload = {
      ...formData,
      id: editingSkill?.id,
      skill_list: formData.skill_list.split(",").map(s => s.trim()).filter(s => s !== ""),
      order_index: Number(formData.order_index)
    }

    try {
      const response = await fetch("/api/skills", {
        method: editingSkill ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Operation failed")

      setSubmitted(true)
      cancelEdit()
      fetchSkills()
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
              {editingSkill ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {editingSkill ? "Edit Skill Category" : "Skills Admin"}
              </h1>
              <p className="text-foreground-muted text-sm">Organize your technical toolkit</p>
            </div>
          </div>
          {editingSkill && (
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
                  <Layers className="h-4 w-4" /> Category Name
                </label>
                <Input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                  className="bg-white/5 border-primary/20 text-foreground rounded-xl"
                  placeholder="Programming Languages..."
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
              <label className="text-sm text-foreground-muted flex items-center gap-2">
                <Plus className="h-4 w-4" /> Skills (comma separated)
              </label>
              <Textarea
                value={formData.skill_list}
                onChange={(e) => setFormData(prev => ({ ...prev, skill_list: e.target.value }))}
                required
                rows={3}
                className="bg-white/5 border-primary/20 text-foreground rounded-xl resize-none"
                placeholder="Python, C, TypeScript, SQL..."
              />
            </div>

            {submitted && <p className="text-green-400 text-center">Success!</p>}
            {error && <p className="text-red-400 text-center">{error}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white rounded-xl py-6">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="ml-2">{editingSkill ? "Update Skills" : "Add Skill Category"}</span>
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Existing Skills</h2>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="grid gap-4">
              {skillCategories.map((skill) => (
                <div key={skill.id} className="glass-card p-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{skill.category}</h3>
                    <p className="text-sm text-foreground-muted">{skill.skill_list.join(", ")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(skill)} className="hover:text-primary hover:bg-primary/10 rounded-xl">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(skill.id)} className="hover:text-red-400 hover:bg-red-400/10 rounded-xl">
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
