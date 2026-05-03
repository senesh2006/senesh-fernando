"use client"

import { Briefcase } from "lucide-react"

const skills = ["Python", "C", "DSA", "Mentoring"]

export function ExperienceSection() {
  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-[#0a0705]">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-16 text-[#f5ede6] animate-fade-in-up">
          Experience
        </h1>

        <div className="glass-card glass-card-hover animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <div className="p-8 flex flex-col sm:flex-row gap-6">
            <div className="p-4 rounded-xl bg-[rgba(255,106,0,0.1)] shrink-0 self-start hidden sm:block">
              <Briefcase className="h-8 w-8 text-[#ff6a00]" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h2 className="text-xl font-semibold text-[#f5ede6]">
                  Freelance Tutor & Mentor
                </h2>
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
