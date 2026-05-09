"use client"

import { useState, useEffect } from "react"
import { ExternalLink, X, Code, Lightbulb, TrendingUp, Loader2, AlertCircle, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"

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
}

const languageColors: Record<string, string> = {
  Python: "bg-[#3776ab]",
  C: "bg-[#a8b9cc]",
  TypeScript: "bg-[#3178c6]",
  React: "bg-[#61dbfb]",
  Other: "bg-[#555555]",
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects")
        if (!response.ok) throw new Error("Failed to fetch projects")
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load projects")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-background">
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-16 text-foreground">
            Projects
          </h1>
        </Reveal>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex flex-col items-center text-center gap-4">
            <AlertCircle className="h-10 w-10" />
            <span>{error}</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-foreground-muted">
             <Cpu className="h-16 w-16 opacity-20 mx-auto mb-4" />
             No projects found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const langColor = languageColors[project.language] || languageColors.Other
              return (
                <Reveal
                  key={project.id}
                  delay={index * 100}
                >
                  <div
                    onClick={() => setSelectedProject(project)}
                    className="glass-card glass-card-hover cursor-pointer h-full overflow-hidden flex flex-col"
                  >
                    {/* Project Image */}
                    <div className="relative h-48 w-full overflow-hidden group/img">
                      <img 
                        src={project.image_url} 
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110 opacity-60"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050302] via-transparent to-transparent opacity-80" />
                      <div className="absolute inset-0 bg-primary/10 group-hover/img:bg-transparent transition-colors" />
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <h2 className="font-semibold text-foreground text-lg leading-tight">{project.name}</h2>
                        <span className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-medium text-white shrink-0",
                          langColor
                        )}>
                          {project.language}
                        </span>
                      </div>

                      <p className="text-foreground-muted text-sm leading-relaxed mb-5 flex-1 line-clamp-2">
                        {project.description}
                      </p>

                      <span className="text-primary text-sm font-medium flex items-center gap-2">
                        Details <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setSelectedProject(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" />
          
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-2xl glass-card max-h-[90vh] overflow-y-auto p-8 animate-scale-in bg-background/90"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-primary/20 transition-colors"
              data-magnetic
            >
              <X className="h-5 w-5 text-foreground" />
            </button>

            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-full md:w-1/2 h-48 rounded-xl overflow-hidden border border-primary/20">
                <img 
                  src={selectedProject.image_url} 
                  alt={selectedProject.name}
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2">{selectedProject.name}</h2>
                <span className={cn(
                  "inline-block px-3 py-1 rounded-md text-xs font-medium text-white w-fit",
                  languageColors[selectedProject.language] || languageColors.Other
                )}>
                  {selectedProject.language}
                </span>
              </div>
            </div>

            {/* Full Description */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Code className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-primary uppercase tracking-wider">About</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                {selectedProject.full_description}
              </p>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-primary uppercase tracking-wider">Skills Used</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProject.skills && selectedProject.skills.map((skill, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm bg-primary/15 text-primary border border-primary/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Impact */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-primary uppercase tracking-wider">Impact on Me</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                {selectedProject.impact}
              </p>
            </div>

            {/* Source Link */}
            {selectedProject.source_url && (
              <Button
                variant="outline"
                className="gap-2 bg-transparent border-primary/30 text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
                asChild
                data-magnetic
              >
                <a href={selectedProject.source_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View Source Code
                </a>
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
