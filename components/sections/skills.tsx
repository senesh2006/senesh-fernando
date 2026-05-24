"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SectionHeader } from "@/components/editorial/section-header"

interface SkillCategory {
  id: string
  category: string
  skill_list: string[]
}

const fallbackSkills: SkillCategory[] = [
  {
    id: "languages",
    category: "Languages",
    skill_list: ["TypeScript", "JavaScript", "Python", "SQL"],
  },
  {
    id: "frontend",
    category: "Frontend",
    skill_list: ["React", "Next.js", "Tailwind CSS", "HTML / CSS"],
  },
  {
    id: "backend",
    category: "Backend",
    skill_list: ["Node.js", "REST APIs", "Firebase", "Firestore"],
  },
  {
    id: "ai",
    category: "AI / ML",
    skill_list: ["Google Gemini", "Anthropic API", "Prompt Engineering"],
  },
  {
    id: "tools",
    category: "Tools",
    skill_list: ["Cursor", "Git / GitHub", "Figma", "VS Code"],
  },
  {
    id: "learning",
    category: "Currently learning",
    skill_list: ["System Design", "DevOps", "Rust"],
  },
]

export function SkillsSection() {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch("/api/skills")
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        setSkillCategories(Array.isArray(data) && data.length > 0 ? data : fallbackSkills)
      } catch {
        setError("Failed to load skills")
        setSkillCategories(fallbackSkills)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSkills()
  }, [])

  const groups = skillCategories.length > 0 ? skillCategories : fallbackSkills

  return (
    <section id="skills">
      <div className="container">
        <SectionHeader num="02" title="Skills" />

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
            <div className="skills-grid">
              {groups.map((skillGroup) => (
                <div key={skillGroup.id} className="skill-group">
                  <div className="skill-group-label">{skillGroup.category}</div>
                  <div className="skill-tags">
                    {skillGroup.skill_list?.map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
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
