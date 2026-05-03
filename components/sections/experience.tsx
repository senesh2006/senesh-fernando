"use client"

import { useRef } from "react"
import { Briefcase } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

const skills = ["Python", "C", "DSA", "Mentoring"]

export function ExperienceSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })

  return (
    <section id="experience" ref={ref} className="px-4 sm:px-6 bg-[#0a0705]">
      <div className="max-w-[1100px] mx-auto">
        <h2 className={cn(
          "text-3xl sm:text-4xl font-medium text-center mb-16 text-[#f5ede6] transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Experience
        </h2>

        <div
          className={cn(
            "glass-card glass-card-hover transition-all duration-700",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="p-8 flex flex-col sm:flex-row gap-6">
            <div className="p-4 rounded-xl bg-[rgba(255,106,0,0.1)] shrink-0 self-start hidden sm:block">
              <Briefcase className="h-8 w-8 text-[#ff6a00]" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h3 className="text-xl font-semibold text-[#f5ede6]">
                  Freelance Tutor & Mentor
                </h3>
                <span className="text-sm text-[rgba(245,237,230,0.5)] px-3 py-1 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,120,20,0.15)]">
                  August 2025 - Present
                </span>
              </div>
              <p className="text-[#ff6a00] font-medium mb-4">
                Curtin University Colombo
              </p>
              <p className="text-[rgba(245,237,230,0.6)] leading-relaxed mb-6">
                Tutored engineering and computer science students in programming fundamentals, 
                C, and data structures and algorithms — leading to improved understanding and 
                project completion.
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-sm bg-[rgba(255,106,0,0.1)] text-[#ff6a00] border border-[rgba(255,106,0,0.2)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
