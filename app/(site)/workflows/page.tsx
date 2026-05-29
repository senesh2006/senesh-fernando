import type { Metadata } from "next"
import { WorkflowsPage } from "@/components/pages/workflows-page"

export const metadata: Metadata = {
  title: "AI Workflows — Senesh Fernando",
  description: "Explore AI-driven workflows and tools built to bridge the gap between data and decisions.",
}

export default function Page() {
  return <WorkflowsPage />
}
