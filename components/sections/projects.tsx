"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SectionHeader } from "@/components/editorial/section-header"

interface Project {
  id: string
  name: string
  language: string
  description: string
  source_url: string | null
  skills: string[]
}

const fallbackProjects: Project[] = [
  {
    id: "soloscale",
    name: "SoloScale",
    language: "TypeScript",
    description:
      "AI-powered content and event SaaS built in 24 hours at the Cursor Buildathon. Describe your campaign goal → Gemini generates a strategy → one click produces a flyer, audio promo, and a live event registration page. Placed 20th globally — undeployed.",
    source_url: "https://github.com/senesh2006/SoloScale",
    skills: ["Next.js 16", "Google Gemini", "Firebase", "TanStack Query", "Tailwind v4", "TypeScript"],
  },
  {
    id: "more",
    name: "More coming soon",
    language: "Other",
    description:
      "Currently working on new projects. Check back soon or visit my GitHub to see what's in progress.",
    source_url: "https://github.com/senesh2006",
    skills: ["github.com/senesh2006"],
  },
]

function getBadges(project: Project) {
  if (project.id === "soloscale" || project.name === "SoloScale") {
    return (
      <>
        <span className="project-badge badge-gold">Buildathon · Top 20</span>
        <span className="project-badge badge-blue">3rd · Gemini Track</span>
      </>
    )
  }
  return <span className="project-badge badge-dim">Personal project</span>
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects")
        if (!response.ok) throw new Error("Failed to fetch projects")
        const data = await response.json()
        setProjects(Array.isArray(data) && data.length > 0 ? data : fallbackProjects)
      } catch {
        setError("Failed to load projects")
        setProjects(fallbackProjects)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const items = projects.length > 0 ? projects : fallbackProjects

  return (
    <section id="projects">
      <div className="container">
        <SectionHeader num="03" title="Projects" />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <Reveal>
            {error && (
              <p className="text-sm text-red-400 mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
            <div className="projects-list">
              {items.map((project) => (
                <a
                  key={project.id}
                  href={project.source_url || "https://github.com/senesh2006"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card"
                >
                  <div>
                    <div className="project-top">{getBadges(project)}</div>
                    <div className="project-name">{project.name}</div>
                    <div className="project-desc">{project.description}</div>
                    <div className="project-tech">
                      {(project.skills?.length ? project.skills : [project.language]).map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="project-arrow">↗</div>
                </a>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
