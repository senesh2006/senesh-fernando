import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/sections/hero"
import { EducationSection } from "@/components/sections/education"
import { ExperienceSection } from "@/components/sections/experience"
import { SkillsSection } from "@/components/sections/skills"
import { ProjectsSection } from "@/components/sections/projects"
import { AchievementsSection } from "@/components/sections/achievements"
import { ContactSection } from "@/components/sections/contact"

export default function Home() {
  return (
    <>
      {/* Subtle grain/noise texture overlay */}
      <div className="noise-overlay" />
      
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <EducationSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <AchievementsSection />
        <ContactSection />
      </main>
    </>
  )
}
