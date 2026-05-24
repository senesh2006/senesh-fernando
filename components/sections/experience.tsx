"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SectionHeader } from "@/components/editorial/section-header"

interface Experience {
  id: string
  role: string
  company: string
  duration: string
  description: string
}

const fallbackExperience: Experience[] = [
  {
    id: "buildathon",
    role: "Competitor — Buildathon",
    company: "Cursor 24hr Buildathon",
    duration: "May 2026\n24 hours",
    description:
      "Built SoloScale from scratch in 24 hours with a team of three. Designed the full-stack architecture, Firestore schema, and Gemini AI integration pipeline. Placed 20th overall and 3rd in the Google Gemini track.",
  },
  {
    id: "undergrad",
    role: "Undergraduate Student",
    company: "University — Sri Lanka",
    duration: "Ongoing",
    description:
      "Studying towards a degree while building real projects on the side. Focused on full-stack development, AI integrations, and software architecture. Learning by building, shipping, and breaking things.",
  },
]

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
        setExperiences(Array.isArray(data) && data.length > 0 ? data : fallbackExperience)
      } catch {
        setError("Failed to load experience")
        setExperiences(fallbackExperience)
      } finally {
        setIsLoading(false)
      }
    }
    fetchExperience()
  }, [])

  const items = experiences.length > 0 ? experiences : fallbackExperience

  return (
    <section id="experience">
      <div className="container">
        <SectionHeader num="04" title="Experience" />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : (
          <Reveal>
            {error && (
              <p className="text-sm text-red-400 mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
            <div className="exp-list">
              {items.map((exp) => (
                <div key={exp.id} className="exp-item">
                  <div className="exp-period">
                    {exp.duration.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < exp.duration.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  <div>
                    <div className="exp-role">{exp.role}</div>
                    <div className="exp-org">{exp.company}</div>
                    <div className="exp-desc">{exp.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
