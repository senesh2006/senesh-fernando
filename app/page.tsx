import { HeroSection } from "@/components/sections/hero"
import { AboutHomeSection } from "@/components/sections/about-home"
import { SkillsSection } from "@/components/sections/skills"
import { ProjectsSection } from "@/components/sections/projects"
import { ExperienceSection } from "@/components/sections/experience"
import { BlogsSection } from "@/components/sections/blogs"
import { ContactSection } from "@/components/sections/contact"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutHomeSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <BlogsSection preview />
      <ContactSection />
      <SiteFooter />
    </>
  )
}
