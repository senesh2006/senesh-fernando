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
    <section id="education" ref={ref} className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className={cn(
          "text-3xl sm:text-4xl font-bold text-center mb-16 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Education
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent hidden sm:block" />

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
                <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-primary border-4 border-background hidden sm:block" />

                <div className="glass-card glass-card-hover rounded-xl p-6 sm:ml-16 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.institution}
                        </h3>
                        <span className="text-sm text-muted-foreground shrink-0">
                          {item.period}
                        </span>
                      </div>
                      <p className="text-primary font-medium mb-1">
                        {item.qualification}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.details}
                      </p>
                    </div>
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
