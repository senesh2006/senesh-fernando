import type { Metadata } from "next"
import { AboutPage } from "@/components/pages/about-page"
import { getExperienceTimeline, getSkillNames } from "@/lib/content"
import { IMAGES } from "@/lib/images"

const FALLBACK_TIMELINE = [
  ["2025 —", "independent. consulting, open source, writing."],
  ["2022 — 2025", "staff engineer at a fintech infra company. design system + perf."],
  ["2019 — 2022", "founding engineer at two early-stage startups."],
  ["2016 — 2019", "agency life. shipped 30+ marketing & product sites."],
  ["2014 — 2016", "computer science at the University of Moratuwa."],
] as const

const FALLBACK_STACK = [
  "TypeScript",
  "React",
  "TanStack",
  "Node",
  "Postgres",
  "Redis",
  "Cloudflare",
  "Tailwind",
  "CSS variables",
  "Vite",
  "Bun",
  "Rust (learning)",
]

export const metadata: Metadata = {
  title: "About — Senesh Fernando",
  description: "About Senesh Fernando — background, approach, timeline, and how I work.",
  openGraph: {
    title: "About — Senesh Fernando",
    description: "Background, approach, timeline, and how I work.",
    images: [IMAGES.portrait],
  },
}

export default async function Page() {
  const [timeline, skills] = await Promise.all([getExperienceTimeline(), getSkillNames()])
  return (
    <AboutPage
      timeline={timeline.length > 0 ? timeline : [...FALLBACK_TIMELINE]}
      stack={skills.length > 0 ? skills : [...FALLBACK_STACK]}
    />
  )
}
