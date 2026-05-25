import type { Metadata } from "next"
import { ContactPage } from "@/components/pages/contact-page"

import { PROFILE } from "@/lib/profile"

export const metadata: Metadata = {
  title: "Contact — Senesh Fernando",
  description: `Contact Senesh Fernando — ${PROFILE.email}, ${PROFILE.phoneDisplay}, ${PROFILE.location}.`,
  openGraph: {
    title: "Contact — Senesh Fernando",
    description: "Get in touch for tech, education, AI, and collaboration opportunities.",
  },
}

export default function Page() {
  return <ContactPage />
}
