"use client"

import { useState, useEffect } from "react"
import { Reveal } from "@/components/reveal"
import { SectionHeader } from "@/components/editorial/section-header"
import { Briefcase, Loader2, AlertCircle } from "lucide-react"

interface Experience {
  id: string
  role: string
  company: string
  duration: string
  description: string
  achievements: string[]
}

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchExperience() {
      try {
        const response = await fetch("/api/experience")
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        setExperiences(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load experience")
      } finally {
        setIsLoading(false)
      }
    }
    fetchExperience()
  }, [])

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-16 bg-background border-b border-paper-3">
      <div className="max-w-[860px] mx-auto">
        <SectionHeader kicker="Career" title="Experience" />

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
        ) : error ? (
          <div className="text-center text-red-400 py-10 flex flex-col items-center gap-2">
            <AlertCircle />
            <span>{error}</span>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center text-foreground-muted py-20">No experience added yet.</div>
        ) : (
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <Reveal
                key={exp.id}
                delay={index * 100}
              >
                <div className="glass-card p-8 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {exp.role}
                        </h2>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
                        <span className="text-primary font-medium">{exp.company}</span>
                        <span className="text-foreground-muted text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10">
                          {exp.duration}
                        </span>
                      </div>

                      <p className="text-foreground/80 leading-relaxed mb-6">
                        {exp.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {exp.achievements && exp.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 shrink-0" />
                            <p className="text-sm text-foreground-muted leading-relaxed italic">
                              {achievement}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
