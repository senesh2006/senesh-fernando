"use client"

import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const projects = [
  {
    name: "BeeWorld Simulation",
    language: "Python",
    description: "Simulated bee movement and terrain interaction.",
    sourceUrl: null,
  },
  {
    name: "Personal Finance Insight Tool",
    language: "Python",
    description: "Real-time stock analysis using Yahoo Finance data.",
    sourceUrl: "#",
  },
  {
    name: "Temporal Analysis of DC Comics Trends",
    language: "Python",
    description: "Data analysis using FiveThirtyEight datasets.",
    sourceUrl: "#",
  },
  {
    name: "Critical Care Optimization System",
    language: "Python",
    description: "Hospital resource scheduling using DSA.",
    sourceUrl: null,
  },
  {
    name: "Escape",
    language: "C",
    description: "ASCII maze game with traps, floods, and linked list undo.",
    sourceUrl: null,
  },
  {
    name: "Python Pipeline Web Crawler",
    language: "Python",
    description: "Modular web crawler with queue-based task management.",
    sourceUrl: "#",
  },
]

const languageColors: Record<string, string> = {
  Python: "bg-[#3776ab]",
  C: "bg-[#a8b9cc]",
}

export function ProjectsSection() {
  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-[#0a0705]">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-16 text-[#f5ede6] animate-fade-in-up">
          Projects
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const langColor = languageColors[project.language] || languageColors.Python
            return (
              <div
                key={index}
                className="glass-card glass-card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h2 className="font-semibold text-[#f5ede6] text-lg leading-tight">{project.name}</h2>
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium text-white shrink-0",
                      langColor
                    )}>
                      {project.language}
                    </span>
                  </div>

                  <p className="text-[rgba(245,237,230,0.6)] text-sm leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {project.sourceUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent border-[rgba(255,120,20,0.2)] text-[#f5ede6] hover:border-[#ff6a00] hover:bg-[rgba(255,106,0,0.1)] hover:text-[#ff6a00] transition-all rounded-lg"
                      asChild
                      data-magnetic
                    >
                      <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        View Source
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
