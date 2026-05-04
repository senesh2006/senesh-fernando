"use client"

import { useState } from "react"
import { ArrowRight, Target, Lightbulb, Rocket, ChevronDown, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CaseStudy {
  id: string
  title: string
  subtitle: string
  problem: string
  solution: string
  results: string[]
  technologies: string[]
  keyLearnings: string[]
  timeline: string
  role: string
  sourceUrl?: string
}

const caseStudies: CaseStudy[] = [
  {
    id: "beeworld",
    title: "BeeWorld Simulation",
    subtitle: "Ecosystem Modeling & Swarm Intelligence",
    problem: "Traditional biology education relies on static diagrams that fail to capture the dynamic nature of ecosystem interactions. Students struggle to understand emergent behaviors in complex systems like bee colonies.",
    solution: "Developed an interactive Python simulation that models bee behavior patterns, foraging algorithms, and environmental interactions. The simulation implements swarm intelligence principles and visualizes collective behavior in real-time, allowing users to adjust parameters and observe how changes affect the ecosystem.",
    results: [
      "Successfully modeled 500+ individual bee agents with realistic behavior patterns",
      "Implemented 3 distinct foraging algorithms based on real biological research",
      "Created interactive visualization showing resource distribution and colony efficiency",
      "Reduced concept learning time by making abstract concepts visually concrete"
    ],
    technologies: ["Python", "OOP", "Matplotlib", "NumPy", "Algorithm Design"],
    keyLearnings: [
      "Emergent behavior arises from simple rules applied to many agents",
      "Proper abstraction in OOP is critical for managing complex simulations",
      "Performance optimization is essential when dealing with large agent counts"
    ],
    timeline: "3 weeks",
    role: "Solo Developer"
  },
  {
    id: "finance-tool",
    title: "Personal Finance Insight Tool",
    subtitle: "Real-Time Stock Analysis Platform",
    problem: "Retail investors lack access to professional-grade analysis tools. Free platforms provide raw data but little actionable insight, while professional tools are prohibitively expensive for individual users.",
    solution: "Built a financial analysis tool that fetches real-time market data from Yahoo Finance, performs technical analysis including trend detection and volatility analysis, and generates actionable insights. The tool automates repetitive analysis tasks and presents data in an easily digestible format.",
    results: [
      "Integrated with Yahoo Finance API for real-time data on 8000+ stocks",
      "Implemented 5 technical indicators (RSI, MACD, Moving Averages, Bollinger Bands, Volume Analysis)",
      "Built portfolio tracking with performance comparison against market indices",
      "Automated daily trend reports saving 2+ hours of manual analysis"
    ],
    technologies: ["Python", "yFinance API", "Pandas", "Data Analysis", "Time Series"],
    keyLearnings: [
      "API rate limiting requires thoughtful caching strategies",
      "Financial data requires careful handling of edge cases (market closures, splits)",
      "User experience matters even in data tools - clear visualization prevents misinterpretation"
    ],
    timeline: "4 weeks",
    role: "Solo Developer",
    sourceUrl: "#"
  },
  {
    id: "critical-care",
    title: "Critical Care Optimization System",
    subtitle: "Hospital Resource Management with DSA",
    problem: "Hospital ICUs face constant resource allocation challenges. Manual scheduling leads to inefficiencies, extended wait times, and suboptimal equipment utilization during critical situations.",
    solution: "Designed a resource management system that optimizes bed allocation, staff scheduling, and equipment utilization using advanced data structures and algorithms. The system uses priority queues for patient triage, graph algorithms for resource dependency mapping, and implements a constraint-based scheduler.",
    results: [
      "Reduced simulated patient wait time by 35% through priority queue optimization",
      "Modeled resource dependencies using directed acyclic graphs",
      "Implemented constraint satisfaction for multi-resource scheduling",
      "Created real-time dashboard showing resource utilization and bottlenecks"
    ],
    technologies: ["Python", "DSA", "Priority Queues", "Graph Algorithms", "Constraint Satisfaction"],
    keyLearnings: [
      "Healthcare systems have unique constraints requiring careful domain understanding",
      "Algorithm selection has massive impact on real-world outcomes",
      "Simulation and testing are crucial before any real deployment"
    ],
    timeline: "5 weeks",
    role: "Lead Developer (Team of 2)"
  }
]

export function CaseStudiesSection() {
  const [expandedId, setExpandedId] = useState<string | null>(caseStudies[0]?.id || null)

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-[#0f0a06]">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-6 text-[#f5ede6] animate-fade-in-up">
          Case Studies
        </h1>
        <p className="text-center text-[rgba(245,237,230,0.6)] mb-16 max-w-2xl mx-auto animate-fade-in-up">
          Deep dives into my most impactful projects, exploring the problems, solutions, and lessons learned
        </p>

        <div className="space-y-6">
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              className={cn(
                "glass-card overflow-hidden transition-all duration-500 animate-fade-in-up",
                expandedId === study.id && "ring-1 ring-[rgba(255,106,0,0.3)]"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header - Always visible */}
              <button
                onClick={() => setExpandedId(expandedId === study.id ? null : study.id)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
              >
                <div>
                  <h2 className="text-xl font-semibold text-[#f5ede6] mb-1">{study.title}</h2>
                  <p className="text-[#ff6a00] text-sm">{study.subtitle}</p>
                </div>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-[#ff6a00] transition-transform duration-300",
                    expandedId === study.id && "rotate-180"
                  )}
                />
              </button>

              {/* Expanded content */}
              <div
                className={cn(
                  "grid transition-all duration-500",
                  expandedId === study.id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-8 pt-2 border-t border-[rgba(255,120,20,0.1)]">
                    {/* Meta info */}
                    <div className="flex flex-wrap gap-4 mb-8 text-sm text-[rgba(245,237,230,0.5)]">
                      <span>Timeline: <strong className="text-[#f5ede6]">{study.timeline}</strong></span>
                      <span>Role: <strong className="text-[#f5ede6]">{study.role}</strong></span>
                    </div>

                    {/* Problem */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5 text-[#ff6a00]" />
                        <h3 className="font-semibold text-[#ff6a00] uppercase tracking-wider text-sm">The Problem</h3>
                      </div>
                      <p className="text-[rgba(245,237,230,0.8)] leading-relaxed pl-7">
                        {study.problem}
                      </p>
                    </div>

                    {/* Solution */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="h-5 w-5 text-[#ff6a00]" />
                        <h3 className="font-semibold text-[#ff6a00] uppercase tracking-wider text-sm">The Solution</h3>
                      </div>
                      <p className="text-[rgba(245,237,230,0.8)] leading-relaxed pl-7">
                        {study.solution}
                      </p>
                    </div>

                    {/* Results */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <Rocket className="h-5 w-5 text-[#ff6a00]" />
                        <h3 className="font-semibold text-[#ff6a00] uppercase tracking-wider text-sm">Results & Impact</h3>
                      </div>
                      <ul className="space-y-2 pl-7">
                        {study.results.map((result, i) => (
                          <li key={i} className="flex items-start gap-2 text-[rgba(245,237,230,0.8)]">
                            <ArrowRight className="h-4 w-4 text-[#ff6a00] mt-1 shrink-0" />
                            <span>{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div className="mb-8">
                      <h3 className="font-semibold text-[rgba(245,237,230,0.6)] text-sm mb-3">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {study.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-full text-sm bg-[rgba(255,106,0,0.1)] text-[#ff6a00] border border-[rgba(255,106,0,0.2)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Learnings */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-[rgba(245,237,230,0.6)] text-sm mb-3">Key Learnings</h3>
                      <ul className="space-y-2">
                        {study.keyLearnings.map((learning, i) => (
                          <li key={i} className="flex items-start gap-2 text-[rgba(245,237,230,0.7)] text-sm">
                            <span className="text-[#ff6a00]">{i + 1}.</span>
                            <span>{learning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Source link */}
                    {study.sourceUrl && (
                      <Button
                        variant="outline"
                        className="gap-2 bg-transparent border-[rgba(255,120,20,0.3)] text-[#f5ede6] hover:border-[#ff6a00] hover:bg-[rgba(255,106,0,0.1)] hover:text-[#ff6a00] transition-all rounded-lg"
                        asChild
                        data-magnetic
                      >
                        <a href={study.sourceUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          View Source Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
