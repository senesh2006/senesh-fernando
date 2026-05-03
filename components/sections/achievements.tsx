"use client"

import { useRef } from "react"
import { Trophy, Medal, Award, ExternalLink, Users } from "lucide-react"
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
  { title: "Co-Founder, Carbon Wise", description: "Sustainability initiative" },
  { title: "Organizing Committee", description: "Eclipse Sports Meet, Curtin Colombo" },
  { title: "Organizing Committee", description: "Avurudhu Celebrations, Curtin Colombo" },
  { title: "Member", description: "Curtin Colombo Cricket Team & Programming Club" },
]

export function AchievementsSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.1 })

  return (
    <section id="achievements" ref={ref} className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className={cn(
          "text-3xl sm:text-4xl font-bold text-center mb-16 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Achievements
        </h2>

        {/* Achievements List */}
        <div className="space-y-4 mb-16">
          {achievements.map((achievement, index) => {
            const icons = [Trophy, Medal, Award]
            const Icon = icons[index % icons.length]
            
            return (
              <div
                key={index}
                className={cn(
                  "glass-card glass-card-hover rounded-xl p-5 transition-all duration-500 flex items-center gap-4",
                  isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                )}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.issuer}</p>
                </div>
                {achievement.link && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 gap-2 text-muted-foreground hover:text-primary"
                    asChild
                  >
                    <a href={achievement.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      <span className="hidden sm:inline">View</span>
                    </a>
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        {/* Extra-Curricular */}
        <h3 className={cn(
          "text-2xl font-semibold text-center mb-8 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Extra-Curricular Activities
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {extracurricular.map((activity, index) => (
            <div
              key={index}
              className={cn(
                "glass-card glass-card-hover rounded-xl p-5 transition-all duration-500 flex items-center gap-4",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(achievements.length + index) * 50}ms` }}
            >
              <div className="p-3 rounded-lg bg-accent/10 shrink-0">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{activity.title}</h4>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
