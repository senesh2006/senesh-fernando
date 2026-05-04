import { Metadata } from "next"
import { CaseStudiesSection } from "@/components/sections/case-studies"

export const metadata: Metadata = {
  title: "Case Studies | Senesh Fernando",
  description: "Deep dives into impactful projects with problem analysis, solutions, and key learnings.",
}

export default function CaseStudiesPage() {
  return <CaseStudiesSection />
}
