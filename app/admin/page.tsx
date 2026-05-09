"use client"

import { useEffect, useState } from "react"
import { Reveal } from "@/components/reveal"
import { 
  BookOpen, 
  Cpu, 
  Briefcase, 
  GraduationCap, 
  Award, 
  User, 
  ArrowUpRight, 
  Activity,
  Plus
} from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Total Blogs", icon: BookOpen, href: "/admin/blogs", key: "blogs" },
  { label: "Projects", icon: Cpu, href: "/admin/projects", key: "projects" },
  { label: "Experience", icon: Briefcase, href: "/admin/experience", key: "experience" },
  { label: "Education", icon: GraduationCap, href: "/admin/education", key: "education" },
  { label: "Achievements", icon: Award, href: "/admin/achievements", key: "achievements" },
]

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    async function fetchCounts() {
      // Mocking counts for now, in a real scenario we'd have an API for this
      const endpoints = ["blogs", "projects", "experience", "education", "achievements"]
      const newCounts: Record<string, number> = {}
      
      for (const endpoint of endpoints) {
        try {
          const res = await fetch(`/api/${endpoint}`)
          if (res.ok) {
            const data = await res.json()
            newCounts[endpoint] = data.length
          }
        } catch (e) {
          newCounts[endpoint] = 0
        }
      }
      setCounts(newCounts)
    }
    fetchCounts()
  }, [])

  return (
    <div className="p-8">
      <Reveal>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back, Peter</h1>
          <p className="text-foreground-muted">Manage your portfolio content and track your activity.</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <Reveal key={stat.key} delay={i * 100}>
            <Link 
              href={stat.href}
              className="glass-card p-6 flex items-center justify-between group hover:border-primary/40 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{counts[stat.key] || 0}</p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-foreground-muted group-hover:text-primary transition-colors" />
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={400}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Quick Actions</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href="/admin/blogs"
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <Plus className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">New Blog Post</span>
              </Link>
              <Link 
                href="/admin/projects"
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <Plus className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Add Project</span>
              </Link>
              <Link 
                href="/admin/experience"
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <Plus className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Add Experience</span>
              </Link>
            </div>
          </div>

          <div className="glass-card p-8 border-dashed border-white/10 flex flex-col items-center justify-center text-center">
            <User className="h-12 w-12 text-primary/20 mb-4" />
            <h3 className="text-lg font-bold mb-2">Live Status</h3>
            <p className="text-sm text-foreground-muted mb-6 max-w-xs">
              Your status is currently set to <span className="text-green-500 font-bold">Available for work</span>.
            </p>
            <Button variant="outline" className="rounded-xl border-white/10 text-foreground-muted">
              Update Status
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
