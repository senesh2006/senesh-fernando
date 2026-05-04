"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface Skill {
  name: string
  level: number // 0-100
  category: string
}

const skills: Skill[] = [
  // Programming Languages
  { name: "Python", level: 90, category: "Languages" },
  { name: "C", level: 70, category: "Languages" },
  { name: "SQL", level: 80, category: "Languages" },
  { name: "YAML", level: 65, category: "Languages" },
  
  // Data Science
  { name: "Pandas", level: 85, category: "Data Science" },
  { name: "NumPy", level: 80, category: "Data Science" },
  { name: "Matplotlib", level: 85, category: "Data Science" },
  { name: "Jupyter", level: 90, category: "Data Science" },
  
  // Tools & Systems
  { name: "Git", level: 75, category: "Tools" },
  { name: "RedHat Linux", level: 70, category: "Tools" },
  { name: "Bash", level: 65, category: "Tools" },
  { name: "Excel", level: 80, category: "Tools" },
  
  // Concepts
  { name: "DSA", level: 75, category: "Concepts" },
  { name: "Agile", level: 70, category: "Concepts" },
  { name: "OOP", level: 85, category: "Concepts" },
]

const categories = ["All", "Languages", "Data Science", "Tools", "Concepts"]

export function TechStackChart() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const filteredSkills = activeCategory === "All" 
    ? skills 
    : skills.filter(s => s.category === activeCategory)

  return (
    <div className="glass-card p-8">
      <h3 className="text-xl font-semibold text-[#f5ede6] mb-6 text-center">
        Tech Proficiency
      </h3>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeCategory === cat
                ? "bg-[#ff6a00] text-white"
                : "bg-[rgba(255,255,255,0.04)] text-[rgba(245,237,230,0.6)] hover:bg-[rgba(255,106,0,0.1)] hover:text-[#ff6a00]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid with Bars */}
      <div className="space-y-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.name}
            className="group"
            onMouseEnter={() => setHoveredSkill(skill.name)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={cn(
                "text-sm font-medium transition-colors",
                hoveredSkill === skill.name ? "text-[#ff6a00]" : "text-[#f5ede6]"
              )}>
                {skill.name}
              </span>
              <span className="text-xs text-[rgba(245,237,230,0.5)]">
                {skill.level}%
              </span>
            </div>
            <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  hoveredSkill === skill.name
                    ? "bg-[#ff6a00] shadow-[0_0_10px_rgba(255,106,0,0.5)]"
                    : "bg-gradient-to-r from-[#ff6a00] to-[#ff8533]"
                )}
                style={{
                  width: `${skill.level}%`,
                  transition: "width 1s ease-out, background 0.3s, box-shadow 0.3s",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-[rgba(255,120,20,0.1)]">
        <div className="flex justify-center gap-6 text-xs text-[rgba(245,237,230,0.4)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[rgba(255,106,0,0.3)]" />
            <span>Beginner (0-40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[rgba(255,106,0,0.6)]" />
            <span>Intermediate (40-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff6a00]" />
            <span>Advanced (70-100%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
