"use client"

import { useRef } from "react"
import { Trophy, ExternalLink, Users } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const achievements = [
  { title: "2nd Place", issuer: "Codemize 2023 & 2024", link: null },
  { title: "Pitch to a VC Challenge", issuer: "TetrVerse x Tetr College of Business", link: "#" },
  { title: "Lovable AI Challenge", issuer: "Tetr College of Business", link: "#" },
  { title: "Red Hat System Administration I (RH124)", issuer: "Ver. 9.3", link: "#" },
  { title: "Red Hat System Administration II (RH134)", issuer: "Ver. 9.3", link: "#" },
  { title: "Agile Project Management", issuer: "HP Life", link: "#" },
  { title: "Introduction to Cybersecurity Awareness", issuer: "HP Life", link: "#" },
  { title: "Data Science and Analytics", issuer: "HP Life", link: "#" },
  { title: "Startup Hackathon Participation", issuer: "Tetr College of Business", link: null },
]

const extracurricular = [
  { title: "Co-Founder, Carbon Wise" },
  { title: "Organizing Committee - Eclipse Sports Meet" },
  { title: "Organizing Committee - Avurudhu Celebrations" },
  { title: "Curtin Cricket Team & Programming Club Member" },
]

export function AchievementsSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.1 })

  return (
    <section id="achievements" ref={ref} className="px-4 sm:px-6 bg-[#0f0a06]">
      <div className="max-w-[1100px] mx-auto">
        <h2 className={cn(
          "text-3xl sm:text-4xl font-medium text-center mb-16 text-[#f5ede6] transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Achievements
        </h2>

        {/* Achievements List */}
        <div className="space-y-4 mb-20">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={cn(
                "glass-card glass-card-hover transition-all duration-500 flex items-center gap-4",
                isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="p-5 flex items-center gap-4 flex-1">
                <div className="p-3 rounded-xl bg-[rgba(255,106,0,0.1)] shrink-0">
                  <Trophy className="h-5 w-5 text-[#ff6a00]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#f5ede6]">{achievement.title}</h3>
                  <p className="text-sm text-[rgba(245,237,230,0.5)]">{achievement.issuer}</p>
                </div>
                {achievement.link && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 gap-2 text-[rgba(245,237,230,0.5)] hover:text-[#ff6a00] hover:bg-[rgba(255,106,0,0.1)]"
                    asChild
                  >
                    <a href={achievement.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      <span className="hidden sm:inline">View</span>
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Extra-Curricular */}
        <h3 className={cn(
          "text-2xl font-medium text-center mb-10 text-[#f5ede6] transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Extra-Curricular Activities
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {extracurricular.map((activity, index) => (
            <div
              key={index}
              className={cn(
                "glass-card glass-card-hover transition-all duration-500 flex items-center gap-4 p-5",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(achievements.length + index) * 50}ms` }}
            >
              <div className="p-3 rounded-xl bg-[rgba(255,106,0,0.08)] shrink-0">
                <Users className="h-5 w-5 text-[#ff6a00]" />
              </div>
              <h4 className="font-medium text-[#f5ede6]">{activity.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
