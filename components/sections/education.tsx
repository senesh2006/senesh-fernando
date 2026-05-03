"use client"

import { useRef } from "react"
import { GraduationCap, BookOpen } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

const education = [
  {
    icon: GraduationCap,
    institution: "Curtin University Colombo",
    qualification: "Bachelor of Information Technology",
    details: "2nd Year, 75 CWA",
    period: "2024 - Present",
  },
  {
    icon: BookOpen,
    institution: "Cambridge A Levels",
    qualification: "Computer Science, Business Studies, Accounting",
    details: "Advanced Level Certification",
    period: "2021 - 2023",
  },
]

export function EducationSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })

  return (
    <section id="education" ref={ref} className="px-4 sm:px-6 bg-[#0f0a06]">
      <div className="max-w-[1100px] mx-auto">
        <h2 className={cn(
          "text-3xl sm:text-4xl font-medium text-center mb-16 text-[#f5ede6] transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Education
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#ff6a00] via-[rgba(255,106,0,0.3)] to-transparent hidden sm:block" />

          <div className="space-y-8">
            {education.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "relative transition-all duration-700",
                  isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-8 w-4 h-4 rounded-full bg-[#ff6a00] border-4 border-[#0f0a06] hidden sm:block shadow-[0_0_12px_rgba(255,106,0,0.5)]" />

                <div className="glass-card glass-card-hover sm:ml-16 relative overflow-hidden">
                  {/* Left orange accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff6a00]" />
                  
                  <div className="p-6 pl-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-[#f5ede6]">
                        {item.institution}
                      </h3>
                      <span className="text-sm text-[rgba(245,237,230,0.5)] shrink-0">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-[#ff6a00] font-medium mb-1">
                      {item.qualification}
                    </p>
                    <p className="text-sm text-[rgba(245,237,230,0.6)]">
                      {item.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
