import { HeroSection } from "@/components/sections/hero"
import { FlowingNavSection } from "@/components/sections/flowing-nav"
import { PageShell } from "@/components/page-shell"

export default function Home() {
  return (
    <PageShell>
      <HeroSection />
      <FlowingNavSection />
    </PageShell>
  )
}
