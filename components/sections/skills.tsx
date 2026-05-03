"use client"

import { useRef } from "react"
import { Code, Server, Cog, BarChart3, Lightbulb } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

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
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.1 })

  return (
    <section id="skills" ref={ref} className="px-4 sm:px-6 bg-[#0f0a06]">
      <div className="max-w-[1100px] mx-auto">
        <h2 className={cn(
          "text-3xl sm:text-4xl font-medium text-center mb-16 text-[#f5ede6] transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Skills
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className={cn(
                "glass-card glass-card-hover transition-all duration-500 relative overflow-hidden",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Glowing orange top border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#ff6a00] shadow-[0_0_8px_rgba(255,106,0,0.5)]" />
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-[rgba(255,106,0,0.1)]">
                    <category.icon className="h-5 w-5 text-[#ff6a00]" />
                  </div>
                  <h3 className="font-semibold text-[#f5ede6]">{category.title}</h3>
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
