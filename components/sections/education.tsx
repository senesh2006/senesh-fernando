"use client"

import { useState, useEffect } from "react"
import { Reveal } from "@/components/reveal"
import { SectionHeader } from "@/components/editorial/section-header"
import { GraduationCap, Loader2, AlertCircle } from "lucide-react"

interface Education {
  id: string
  degree: string
  institution: string
  duration: string
  description: string | null
}

export function EducationSection() {
  const [educationList, setEducationList] = useState<Education[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEducation() {
      try {
        const response = await fetch("/api/education")
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        setEducationList(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load education")
      } finally {
        setIsLoading(false)
      }
    }
    fetchEducation()
  }, [])

  return (
    <section id="education">
      <div className="container">
        <SectionHeader num="07" title="Education" />

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
        ) : error ? (
          <div className="text-center text-red-400 py-10 flex flex-col items-center gap-2">
            <AlertCircle />
            <span>{error}</span>
          </div>
        ) : educationList.length === 0 ? (
          <div className="text-center text-foreground-muted py-20">No education entries found.</div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            {educationList.map((edu, index) => (
              <Reveal
                key={edu.id}
                delay={index * 100}
              >
                <div className="glass-card p-8 flex flex-col sm:flex-row sm:items-start gap-6 border-l-2 border-primary/20 hover:border-primary transition-colors">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {edu.degree}
                        </h2>
                        <p className="text-primary font-medium mt-1">{edu.institution}</p>
                      </div>
                      <span className="text-foreground-muted text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10 shrink-0 self-start">
                        {edu.duration}
                      </span>
                    </div>

                    {edu.description && (
                      <p className="text-foreground/70 leading-relaxed text-sm">
                        {edu.description}
                      </p>
                    )}
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
