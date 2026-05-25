import type { Metadata } from "next"
import { ContactPage } from "@/components/pages/contact-page"

export const metadata: Metadata = {
  title: "Contact — Senesh Fernando",
  description: "Get in touch with Senesh Fernando for engineering and design work.",
  openGraph: {
    title: "Contact — Senesh Fernando",
    description: "Get in touch for engineering and design work.",
  },
}

export default function Page() {
  return <ContactPage />
}
