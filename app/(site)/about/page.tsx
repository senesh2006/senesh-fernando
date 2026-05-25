import type { Metadata } from "next"
import { AboutPage } from "@/components/pages/about-page"
import { getExperienceTimeline, getSkillNames } from "@/lib/content"
import { IMAGES } from "@/lib/images"
import { PROFILE } from "@/lib/profile"

export const metadata: Metadata = {
  title: "About — Senesh Fernando",
  description:
    "About Senesh Fernando — IT undergraduate at Curtin University Colombo, data scientist in training, co-founder of CarbonWise.",
  openGraph: {
    title: "About — Senesh Fernando",
    description: PROFILE.tagline,
    images: [IMAGES.portrait],
  },
}

export default async function Page() {
  const [timeline, skills] = await Promise.all([getExperienceTimeline(), getSkillNames()])
  return (
    <AboutPage
      timeline={timeline.length > 0 ? timeline : PROFILE.timeline}
      stack={skills.length > 0 ? skills : [...PROFILE.skills]}
    />
  )
}
