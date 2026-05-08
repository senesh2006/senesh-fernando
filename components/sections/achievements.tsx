"use client"

import { Trophy, Users } from "lucide-react"

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
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-[#0f0a06]">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-16 text-[#f5ede6] animate-fade-in-up">
          Achievements
        </h1>

        {/* Achievements List */}
        <div className="space-y-4 mb-20">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="glass-card glass-card-hover flex items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-5 flex items-center gap-4 flex-1">
                <div className="p-3 rounded-xl bg-[rgba(255,106,0,0.1)] shrink-0">
                  <Trophy className="h-5 w-5 text-[#ff6a00]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-[#f5ede6]">{achievement.title}</h2>
                  <p className="text-sm text-[rgba(245,237,230,0.5)]">{achievement.issuer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Extra-Curricular */}
        <h2 className="text-2xl font-medium text-center mb-10 text-[#f5ede6] animate-fade-in-up">
          Extra-Curricular Activities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {extracurricular.map((activity, index) => (
            <div
              key={index}
              className="glass-card glass-card-hover flex items-center gap-4 p-5 animate-fade-in-up"
              style={{ animationDelay: `${(achievements.length + index) * 50}ms` }}
            >
              <div className="p-3 rounded-xl bg-[rgba(255,106,0,0.08)] shrink-0">
                <Users className="h-5 w-5 text-[#ff6a00]" />
              </div>
              <h3 className="font-medium text-[#f5ede6]">{activity.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
