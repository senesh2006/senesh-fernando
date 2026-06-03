"use client"

import { useEffect, useState } from "react"
import {
  BookOpen,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  ArrowUpRight,
  Eye,
  Users,
  TrendingUp,
  Plus,
  Heart,
} from "lucide-react"
import Link from "next/link"

interface SiteStats {
  totalViews: number
  uniqueVisitors: number
}

interface BlogPost {
  id: string
  title: string
  category: string
  views: number
  likes?: number
  created_at?: string
}

interface ContentCounts {
  blogs: number
  projects: number
  experience: number
  education: number
  achievements: number
}

export default function AdminDashboard() {
  const [siteStats, setSiteStats] = useState<SiteStats>({ totalViews: 0, uniqueVisitors: 0 })
  const [counts, setCounts] = useState<ContentCounts>({ blogs: 0, projects: 0, experience: 0, education: 0, achievements: 0 })
  const [topPosts, setTopPosts] = useState<BlogPost[]>([])
  const [totalBlogViews, setTotalBlogViews] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [visitorRes, blogsRes, projectsRes, expRes, eduRes, achRes] = await Promise.allSettled([
          fetch("/api/visitors"),
          fetch("/api/blogs"),
          fetch("/api/projects"),
          fetch("/api/experience"),
          fetch("/api/education"),
          fetch("/api/achievements"),
        ])

        if (visitorRes.status === "fulfilled" && visitorRes.value.ok) {
          setSiteStats(await visitorRes.value.json())
        }

        if (blogsRes.status === "fulfilled" && blogsRes.value.ok) {
          const blogs: BlogPost[] = await blogsRes.value.json()
          const sorted = [...blogs].sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
          setTopPosts(sorted.slice(0, 5))
          setTotalBlogViews(blogs.reduce((sum, b) => sum + (b.views ?? 0), 0))
          setCounts((c: ContentCounts) => ({ ...c, blogs: blogs.length }))
        }

        if (projectsRes.status === "fulfilled" && projectsRes.value.ok) {
          const d = await projectsRes.value.json()
          setCounts((c: ContentCounts) => ({ ...c, projects: Array.isArray(d) ? d.length : 0 }))
        }
        if (expRes.status === "fulfilled" && expRes.value.ok) {
          const d = await expRes.value.json()
          setCounts((c: ContentCounts) => ({ ...c, experience: Array.isArray(d) ? d.length : 0 }))
        }
        if (eduRes.status === "fulfilled" && eduRes.value.ok) {
          const d = await eduRes.value.json()
          setCounts((c: ContentCounts) => ({ ...c, education: Array.isArray(d) ? d.length : 0 }))
        }
        if (achRes.status === "fulfilled" && achRes.value.ok) {
          const d = await achRes.value.json()
          setCounts((c: ContentCounts) => ({ ...c, achievements: Array.isArray(d) ? d.length : 0 }))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <div className="p-6 sm:p-8 space-y-10 max-w-6xl">
      {/* Header */}
      <div>
        <div className="font-mono text-xs text-muted-foreground mb-1">// admin.dashboard</div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, Peter</h1>
      </div>

      {/* Site analytics */}
      <section>
        <div className="font-mono text-xs text-muted-foreground mb-4">// site.analytics</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Page Views", value: siteStats.totalViews, icon: Eye, sub: "all time" },
            { label: "Unique Visitors", value: siteStats.uniqueVisitors, icon: Users, sub: "all time" },
            { label: "Blog Views", value: totalBlogViews, icon: TrendingUp, sub: "across all posts" },
            { label: "Total Posts", value: counts.blogs, icon: BookOpen, sub: "published", href: "/admin/blogs" },
          ].map((s) => (
            <div
              key={s.label}
              className={`border border-border rounded-md p-5 bg-card/40 ${s.href ? "cursor-pointer hover:border-foreground/30 transition-colors" : ""}`}
              onClick={s.href ? () => window.location.href = s.href! : undefined}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-semibold tabular-nums">
                {loading ? <span className="text-muted-foreground text-lg">—</span> : s.value.toLocaleString()}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Content counts */}
      <section>
        <div className="font-mono text-xs text-muted-foreground mb-4">// content.inventory</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Projects", value: counts.projects, icon: Cpu, href: "/admin/projects" },
            { label: "Experience", value: counts.experience, icon: Briefcase, href: "/admin/experience" },
            { label: "Education", value: counts.education, icon: GraduationCap, href: "/admin/education" },
            { label: "Achievements", value: counts.achievements, icon: Award, href: "/admin/achievements" },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="border border-border rounded-md p-5 bg-card/40 flex items-center justify-between hover:border-foreground/30 transition-colors group"
            >
              <div>
                <div className="font-mono text-xs text-muted-foreground mb-2">{s.label}</div>
                <div className="text-2xl font-semibold tabular-nums">
                  {loading ? <span className="text-muted-foreground text-lg">—</span> : s.value}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <s.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top posts */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <div className="font-mono text-xs text-muted-foreground">// top.posts.by.views</div>
            <Link href="/admin/blogs" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
              all posts →
            </Link>
          </div>
          <div className="border border-border rounded-md overflow-hidden">
            {loading ? (
              <div className="p-6 text-center font-mono text-xs text-muted-foreground">loading...</div>
            ) : topPosts.length === 0 ? (
              <div className="p-6 text-center font-mono text-xs text-muted-foreground">no posts yet</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground font-normal">title</th>
                    <th className="text-right px-4 py-3 font-mono text-xs text-muted-foreground font-normal">
                      <Eye className="h-3 w-3 inline mr-1" />views
                    </th>
                    <th className="text-right px-4 py-3 font-mono text-xs text-muted-foreground font-normal">
                      <Heart className="h-3 w-3 inline mr-1" />likes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topPosts.map((post: BlogPost, i: number) => (
                    <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-muted-foreground w-4">{i + 1}</span>
                          <span className="truncate max-w-[200px]" title={post.title}>{post.title}</span>
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground pl-6">{post.category}</div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-mono text-xs">{(post.views ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-mono text-xs text-muted-foreground">{post.likes ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <div className="font-mono text-xs text-muted-foreground mb-4">// quick.actions</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "New Blog Post", href: "/admin/blogs", icon: BookOpen },
              { label: "Add Project", href: "/admin/projects", icon: Cpu },
              { label: "Add Experience", href: "/admin/experience", icon: Briefcase },
              { label: "Add Achievement", href: "/admin/achievements", icon: Award },
              { label: "Update Education", href: "/admin/education", icon: GraduationCap },
              { label: "Manage Skills", href: "/admin/skills", icon: Users },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-3 border border-border rounded-md p-4 hover:border-foreground/30 hover:bg-card/40 transition-colors group"
              >
                <Plus className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                <span className="text-sm">{a.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
