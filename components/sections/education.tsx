"use client"

import { GraduationCap, BookOpen } from "lucide-react"

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
  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-[#0f0a06]">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-16 text-[#f5ede6] animate-fade-in-up">
          Education
        </h1>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#ff6a00] via-[rgba(255,106,0,0.3)] to-transparent hidden sm:block" />

          <div className="space-y-8">
            {education.map((item, index) => (
              <div
                key={index}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-8 w-4 h-4 rounded-full bg-[#ff6a00] border-4 border-[#0f0a06] hidden sm:block shadow-[0_0_12px_rgba(255,106,0,0.5)]" />

                <div className="glass-card glass-card-hover sm:ml-16 relative overflow-hidden">
                  {/* Left orange accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff6a00]" />
                  
                  <div className="p-6 pl-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h2 className="text-lg font-semibold text-[#f5ede6]">
                        {item.institution}
                      </h2>
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
