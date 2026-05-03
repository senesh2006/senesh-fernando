"use client"

import { useRef } from "react"
import { Briefcase } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const skills = ["Python", "C", "DSA", "Mentoring"]

export function ExperienceSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })

  return (
    <section id="experience" ref={ref} className="py-24 px-4 sm:px-6 bg-secondary/20">
      <div className="max-w-4xl mx-auto">
        <h2 className={cn(
          "text-3xl sm:text-4xl font-bold text-center mb-16 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Experience
        </h2>

        <div
          className={cn(
            "glass-card glass-card-hover rounded-xl p-8 transition-all duration-700 border-l-4 border-l-primary",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-start gap-6">
            <div className="p-4 rounded-xl bg-primary/10 shrink-0 hidden sm:block">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h3 className="text-xl font-semibold text-foreground">
                  Freelance Tutor & Mentor
                </h3>
                <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-secondary">
                  August 2025 - Present
                </span>
              </div>
              <p className="text-primary font-medium mb-4">
                Curtin University Colombo
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Tutored engineering and computer science students in programming fundamentals, 
                C, and data structures and algorithms — leading to improved understanding and 
                project completion.
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
