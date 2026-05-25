"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertCircle, ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SectionHeader } from "@/components/editorial/section-header"
import SpotlightCard from "@/components/SpotlightCard"
import { projectFallbackImages } from "@/lib/site-menu-items"

interface Project {
  id: string
  name: string
  language: string
  description: string
  source_url: string | null
  skills: string[]
  image_url?: string | null
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
    image_url: projectFallbackImages.soloscale,
  },
  {
    id: "more",
    name: "More coming soon",
    language: "Other",
    description:
      "Currently working on new projects. Check back soon or visit my GitHub to see what's in progress.",
    source_url: "https://github.com/senesh2006",
    skills: ["github.com/senesh2006"],
    image_url: projectFallbackImages.more,
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

function projectImage(project: Project) {
  return (
    project.image_url ||
    projectFallbackImages[project.id] ||
    `https://images.unsplash.com/photo-1555066931-436f8abb32?auto=format&fit=crop&w=800&q=80`
  )
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
            <div className="projects-grid">
              {items.map((project) => (
                <a
                  key={project.id}
                  href={project.source_url || "https://github.com/senesh2006"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                >
                  <SpotlightCard
                    className="project-spotlight-card"
                    spotlightColor="rgba(212, 168, 83, 0.22)"
                  >
                    <div
                      className="project-spotlight-image"
                      style={{ backgroundImage: `url(${projectImage(project)})` }}
                    />
                    <div className="project-top">{getBadges(project)}</div>
                    <div className="project-name">{project.name}</div>
                    <div className="project-desc">{project.description}</div>
                    <div className="project-tech">
                      {(project.skills?.length ? project.skills : [project.language]).map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                    <div className="project-card-footer">
                      <span className="project-arrow">
                        View project <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </SpotlightCard>
                </a>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
