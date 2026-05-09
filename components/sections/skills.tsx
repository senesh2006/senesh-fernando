"use client"

import { useState, useEffect } from "react"
import { Reveal } from "@/components/reveal"
import { Code, Server, Database, Layout, Loader2, AlertCircle } from "lucide-react"

interface SkillCategory {
  id: string
  category: string
  skill_list: string[]
}

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
        setSkillCategories(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load skills")
      } finally {
        setIsLoading(false)
      }
    }
    fetchSkills()
  }, [])

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-background">
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-16 text-foreground">
            Skills
          </h1>
        </Reveal>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
        ) : error ? (
          <div className="text-center text-red-400 py-10 flex flex-col items-center gap-2">
            <AlertCircle />
            <span>{error}</span>
          </div>
        ) : skillCategories.length === 0 ? (
          <div className="text-center text-foreground-muted py-20">No skills added yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((skillGroup, index) => (
              <Reveal
                key={skillGroup.id}
                delay={index * 100}
              >
                <div className="glass-card p-6 h-full hover:border-primary/40 transition-colors group">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <Code className="h-5 w-5" />
                    </div>
                    <h2 className="font-bold text-foreground text-sm uppercase tracking-widest">
                      {skillGroup.category}
                    </h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.skill_list && skillGroup.skill_list.map((skill, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground-muted hover:text-primary hover:border-primary/30 transition-all cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
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
