"use client"

import { useRef } from "react"
import { ExternalLink } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const projects = [
  {
    name: "BeeWorld Simulation",
    language: "Python",
    description: "Simulated bee movement and terrain interaction with batch and interactive modes.",
    sourceUrl: null,
  },
  {
    name: "Personal Finance Insight Tool",
    language: "Python",
    description: "Real-time stock analysis and visualization system using Yahoo Finance data.",
    sourceUrl: "#",
  },
  {
    name: "Temporal Analysis of DC Comics Trends",
    language: "Python",
    description: "Temporal data analysis and visualization using FiveThirtyEight character datasets.",
    sourceUrl: "#",
  },
  {
    name: "Critical Care Optimization System",
    language: "Python",
    description: "Hospital resource management system using data structures and algorithms for efficient scheduling and reporting.",
    sourceUrl: null,
  },
  {
    name: "Escape",
    language: "C",
    description: "ASCII-based maze game featuring traps, floods, and a linked list-based undo system.",
    sourceUrl: null,
  },
  {
    name: "Python Pipeline Web Crawler",
    language: "Python",
    description: "Multi-stage pipeline capable of fetching, parsing, and processing large volumes of web data with queue-based task management.",
    sourceUrl: "#",
  },
]

const languageColors: Record<string, { border: string; bg: string; text: string }> = {
  Python: { border: "border-t-blue-500", bg: "bg-blue-500/10", text: "text-blue-400" },
  C: { border: "border-t-amber-500", bg: "bg-amber-500/10", text: "text-amber-400" },
}

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.1 })

  return (
    <section id="projects" ref={ref} className="py-24 px-4 sm:px-6 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <h2 className={cn(
          "text-3xl sm:text-4xl font-bold text-center mb-16 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const colors = languageColors[project.language] || languageColors.Python
            return (
              <div
                key={index}
                className={cn(
                  "glass-card glass-card-hover rounded-xl p-6 transition-all duration-500 border-t-2",
                  colors.border,
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-foreground text-lg">{project.name}</h3>
                  <Badge className={cn(colors.bg, colors.text, "border-0")}>
                    {project.language}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4 min-h-[60px]">
                  {project.description}
                </p>

                {project.sourceUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border/50 hover:border-primary hover:bg-primary/10"
                    asChild
                  >
                    <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      View Source
                    </a>
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
