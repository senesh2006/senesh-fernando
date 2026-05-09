"use client"

import { useState } from "react"
import { ExternalLink, X, Code, Lightbulb, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"

interface Project {
  name: string
  language: string
  description: string
  sourceUrl: string | null
  fullDescription: string
  skills: string[]
  impact: string
  image: string
}

const projects: Project[] = [
  {
    name: "BeeWorld Simulation",
    language: "Python",
    description: "Simulated bee movement and terrain interaction.",
    sourceUrl: null,
    fullDescription: "A comprehensive ecosystem simulation modeling bee behavior patterns, foraging algorithms, and environmental interactions. The project implements swarm intelligence principles and visualizes complex collective behavior.",
    skills: ["Python", "OOP", "Simulation", "Matplotlib", "Algorithm Design"],
    impact: "Deepened my understanding of emergent behavior in complex systems and improved my ability to translate real-world phenomena into computational models.",
    image: "https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=1000&auto=format&fit=crop" // Cyber Bee/Nature
  },
  {
    name: "Personal Finance Insight Tool",
    language: "Python",
    description: "Real-time stock analysis using Yahoo Finance data.",
    sourceUrl: "#",
    fullDescription: "A financial analysis tool that fetches real-time market data, performs technical analysis, and generates actionable insights for investment decisions. Features include trend detection, volatility analysis, and portfolio tracking.",
    skills: ["Python", "APIs", "Data Analysis", "Pandas", "yFinance"],
    impact: "Strengthened my data pipeline skills and taught me to handle real-time data streams while building practical tools that solve real problems.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" // Business/Data
  },
  {
    name: "Temporal Analysis of DC Comics Trends",
    language: "Python",
    description: "Data analysis using FiveThirtyEight datasets.",
    sourceUrl: "#",
    fullDescription: "An exploratory data analysis project examining character appearances, diversity representation, and publication trends in DC Comics over decades. Utilized statistical methods to uncover patterns in comic book publishing.",
    skills: ["Python", "Pandas", "Data Visualization", "Statistical Analysis", "Jupyter"],
    impact: "Enhanced my ability to extract meaningful insights from large datasets and communicate findings through compelling visualizations.",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1000&auto=format&fit=crop" // Comic/Art
  },
  {
    name: "Critical Care Optimization System",
    language: "Python",
    description: "Hospital resource scheduling using DSA.",
    sourceUrl: null,
    fullDescription: "A hospital resource management system that optimizes bed allocation, staff scheduling, and equipment utilization using advanced data structures and algorithms. Implements priority queues and graph algorithms for optimal resource distribution.",
    skills: ["Python", "DSA", "Queue Systems", "Graph Algorithms", "Optimization"],
    impact: "Taught me how algorithmic thinking can directly impact real-world healthcare efficiency and resource allocation.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1000" // Healthcare/Tech
  },
  {
    name: "Escape",
    language: "C",
    description: "ASCII maze game with traps, floods, and linked list undo.",
    sourceUrl: null,
    fullDescription: "A terminal-based adventure game featuring procedurally generated mazes, dynamic flood mechanics, trap systems, and a full undo/redo system implemented with linked lists. Demonstrates low-level programming concepts and memory management.",
    skills: ["C", "Linked Lists", "Memory Management", "Game Logic", "Terminal Graphics"],
    impact: "Solidified my understanding of pointers, manual memory management, and the importance of clean code architecture in complex systems.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop" // Hacker/Code/Cyber
  },
  {
    name: "Python Pipeline Web Crawler",
    language: "Python",
    description: "Modular web crawler with queue-based task management.",
    sourceUrl: "#",
    fullDescription: "A scalable web crawling system with modular pipeline architecture, rate limiting, and intelligent URL management. Features concurrent processing and data extraction capabilities.",
    skills: ["Python", "Web Scraping", "Queues", "BeautifulSoup", "Async Programming"],
    impact: "Improved my understanding of concurrent programming patterns and building robust, fault-tolerant data collection systems.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop" // Network/Spider
  },
]

const languageColors: Record<string, string> = {
  Python: "bg-[#3776ab]",
  C: "bg-[#a8b9cc]",
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-background">
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-16 text-foreground">
            Projects
          </h1>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const langColor = languageColors[project.language] || languageColors.Python
            return (
              <Reveal
                key={index}
                delay={index * 100}
              >
                <div
                  onClick={() => setSelectedProject(project)}
                  className="glass-card glass-card-hover cursor-pointer h-full overflow-hidden flex flex-col"
                >
                  {/* Project Image */}
                  <div className="relative h-48 w-full overflow-hidden group/img">
                    <img 
                      src={project.image} 
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110 opacity-60"
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

                    <p className="text-foreground-muted text-sm leading-relaxed mb-5 flex-1">
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
            className="relative w-full max-w-2xl glass-card p-8 animate-scale-in bg-background/90"
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
                  src={selectedProject.image} 
                  alt={selectedProject.name}
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2">{selectedProject.name}</h2>
                <span className={cn(
                  "inline-block px-3 py-1 rounded-md text-xs font-medium text-white w-fit",
                  languageColors[selectedProject.language] || languageColors.Python
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
                {selectedProject.fullDescription}
              </p>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-primary uppercase tracking-wider">Skills Used</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProject.skills.map((skill, i) => (
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
            {selectedProject.sourceUrl && (
              <Button
                variant="outline"
                className="gap-2 bg-transparent border-primary/30 text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
                asChild
                data-magnetic
              >
                <a href={selectedProject.sourceUrl} target="_blank" rel="noopener noreferrer">
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
