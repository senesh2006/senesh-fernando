"use client"

import { Code, Server, Cog, BarChart3, Lightbulb } from "lucide-react"
import { TechStackChart } from "@/components/tech-stack-chart"

const skillCategories = [
  {
    icon: Code,
    title: "Programming Languages",
    skills: ["Python", "C", "SQL", "YAML"],
  },
  {
    icon: Server,
    title: "OS & Administration",
    skills: ["RedHat", "Bash Scripting"],
  },
  {
    icon: Cog,
    title: "Software Engineering",
    skills: ["DSA", "Git", "Agile"],
  },
  {
    icon: BarChart3,
    title: "Data Science & Analytics",
    skills: ["Pandas", "NumPy", "Matplotlib", "Excel", "Jupyter", "Time Series", "Pipelining"],
  },
  {
    icon: Lightbulb,
    title: "Emerging & Soft Skills",
    skills: ["Prompt Engineering", "Creative Pitching", "Leadership"],
  },
]

export function SkillsSection() {
  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-[#0f0a06]">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-6 text-[#f5ede6] animate-fade-in-up">
          Skills
        </h1>
        <p className="text-center text-[rgba(245,237,230,0.6)] mb-12 max-w-2xl mx-auto animate-fade-in-up">
          Technologies and tools I work with
        </p>

        {/* Tech Stack Chart */}
        <div className="mb-16 animate-fade-in-up">
          <TechStackChart />
        </div>

        <h2 className="text-2xl font-medium text-center mb-8 text-[#f5ede6] animate-fade-in-up">
          Skill Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="glass-card glass-card-hover relative overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glowing orange top border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#ff6a00] shadow-[0_0_8px_rgba(255,106,0,0.5)]" />
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-[rgba(255,106,0,0.1)]">
                    <category.icon className="h-5 w-5 text-[#ff6a00]" />
                  </div>
                  <h2 className="font-semibold text-[#f5ede6]">{category.title}</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1.5 rounded-full text-sm bg-[rgba(255,106,0,0.08)] text-[rgba(245,237,230,0.8)] border border-[rgba(255,106,0,0.15)] hover:bg-[rgba(255,106,0,0.15)] transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
