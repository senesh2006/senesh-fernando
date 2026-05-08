"use client"

import { Code, Server, Cog, BarChart3, Lightbulb } from "lucide-react"
import { TechStackChart } from "@/components/tech-stack-chart"
import { Reveal } from "@/components/reveal"

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
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-background">
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-6 text-foreground">
            Skills
          </h1>
        </Reveal>
        
        <Reveal delay={100}>
          <p className="text-center text-foreground-muted mb-12 max-w-2xl mx-auto">
            Technologies and tools I work with
          </p>
        </Reveal>

        {/* Tech Stack Chart */}
        <Reveal delay={200} className="mb-16">
          <TechStackChart />
        </Reveal>

        <Reveal delay={300}>
          <h2 className="text-2xl font-medium text-center mb-8 text-foreground">
            Skill Categories
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <Reveal
              key={index}
              delay={index * 100}
              className="h-full"
            >
              <div className="glass-card glass-card-hover relative overflow-hidden h-full">
                {/* Glowing orange top border */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(255,106,0,0.5)]" />
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-primary/10">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="font-semibold text-foreground">{category.title}</h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1.5 rounded-full text-sm bg-primary/5 text-foreground/80 border border-primary/10 hover:bg-primary/15 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
