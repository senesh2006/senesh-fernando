"use client"

import { Trophy, Users } from "lucide-react"
import { Reveal } from "@/components/reveal"

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
  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-background">
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-16 text-foreground">
            Achievements
          </h1>
        </Reveal>

        {/* Achievements List */}
        <div className="space-y-4 mb-20">
          {achievements.map((achievement, index) => (
            <Reveal
              key={index}
              delay={index * 50}
            >
              <div className="glass-card glass-card-hover flex items-center gap-4">
                <div className="p-5 flex items-center gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-foreground">{achievement.title}</h2>
                    <p className="text-sm text-foreground-muted">{achievement.issuer}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Extra-Curricular */}
        <Reveal delay={200}>
          <h2 className="text-2xl font-medium text-center mb-10 text-foreground">
            Extra-Curricular Activities
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {extracurricular.map((activity, index) => (
            <Reveal
              key={index}
              delay={index * 100}
            >
              <div className="glass-card glass-card-hover flex items-center gap-4 p-5">
                <div className="p-3 rounded-xl bg-primary/8 shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">{activity.title}</h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
