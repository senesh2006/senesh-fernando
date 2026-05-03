"use client"

import { useRef } from "react"
import { Code, Server, Cog, BarChart3, Lightbulb } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const skillCategories = [
  {
    icon: Code,
    title: "Programming Languages",
    skills: ["Python", "C", "SQL", "YAML"],
    accentColor: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
  },
  {
    icon: Server,
    title: "OS & Administration",
    skills: ["RedHat Systems Administration", "Bash Scripting"],
    accentColor: "from-red-500 to-orange-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
  },
  {
    icon: Cog,
    title: "Software Engineering",
    skills: ["Data Structures & Algorithms", "Git", "Agile Project Management"],
    accentColor: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-400",
  },
  {
    icon: BarChart3,
    title: "Data Science & Analytics",
    skills: ["Pandas", "NumPy", "Matplotlib", "Excel", "Jupyter Notebook", "Time Series Analysis", "Data Pipelining"],
    accentColor: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
  },
  {
    icon: Lightbulb,
    title: "Emerging Tech & Soft Skills",
    skills: ["Prompt Engineering", "Creative Pitching", "Leadership"],
    accentColor: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
  },
]

export function SkillsSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.1 })

  return (
    <section id="skills" ref={ref} className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className={cn(
          "text-3xl sm:text-4xl font-bold text-center mb-16 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Skills
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className={cn(
                "glass-card glass-card-hover rounded-xl p-6 transition-all duration-500 relative overflow-hidden",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Top gradient border */}
              <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", category.accentColor)} />
              
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("p-2 rounded-lg", category.bgColor)}>
                  <category.icon className={cn("h-5 w-5", category.textColor)} />
                </div>
                <h3 className="font-semibold text-foreground">{category.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <Badge
                    key={skillIndex}
                    variant="secondary"
                    className="bg-secondary/50 text-foreground hover:bg-secondary transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
