import { HeroSection } from "@/components/sections/hero"
import { EducationSection } from "@/components/sections/education"
import { ExperienceSection } from "@/components/sections/experience"
import { SkillsSection } from "@/components/sections/skills"
import { ProjectsSection } from "@/components/sections/projects"
import { BlogsSection } from "@/components/sections/blogs"
import { CaseStudiesSection } from "@/components/sections/case-studies"
import { AchievementsSection } from "@/components/sections/achievements"
import { RecommendationsSection } from "@/components/sections/recommendations"
import { ContactSection } from "@/components/sections/contact"

export default function Home() {
  return (
    <>
      <HeroSection />
      <div id="education">
        <EducationSection />
      </div>
      <div id="experience">
        <ExperienceSection />
      </div>
      <div id="skills">
        <SkillsSection />
      </div>
      <div id="projects">
        <ProjectsSection />
      </div>
      <div id="blogs">
        <BlogsSection />
      </div>
      <div id="case-studies">
        <CaseStudiesSection />
      </div>
      <div id="achievements">
        <AchievementsSection />
      </div>
      <div id="recommendations">
        <RecommendationsSection />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
    </>
  )
}
