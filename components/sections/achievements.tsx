"use client"

import { useState, useEffect } from "react"
import { Reveal } from "@/components/reveal"
import { SectionHeader } from "@/components/editorial/section-header"
import { Award, Loader2, AlertCircle } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  date: string
}

export function AchievementsSection() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const response = await fetch("/api/achievements")
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        setAchievements(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load achievements")
      } finally {
        setIsLoading(false)
      }
    }
    fetchAchievements()
  }, [])

  return (
    <section id="achievements">
      <div className="container">
        <SectionHeader num="08" title="Achievements" />

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
        ) : error ? (
          <div className="text-center text-red-400 py-10 flex flex-col items-center gap-2">
            <AlertCircle />
            <span>{error}</span>
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center text-foreground-muted py-20">No achievements added yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <Reveal
                key={achievement.id}
                delay={index * 100}
              >
                <div className="glass-card p-8 h-full flex flex-col hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                      <Award className="h-6 w-6" />
                    </div>
                    <span className="text-foreground-muted text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      {achievement.date}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      {achievement.title}
                    </h2>
                    <p className="text-foreground/70 leading-relaxed text-sm">
                      {achievement.description}
                    </p>
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
