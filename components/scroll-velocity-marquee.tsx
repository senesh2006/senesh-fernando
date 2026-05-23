"use client"

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/registry/magicui/scroll-based-velocity"

const rowOne = [
  "Python",
  "Next.js",
  "React",
  "TypeScript",
  "Data Visualization",
  "Automation",
  "Problem Solving",
]

const rowTwo = [
  "Curtin Colombo",
  "Simulations",
  "Tailwind CSS",
  "PostgreSQL",
  "API Design",
  "Open Source",
  "Full Stack",
]

const rowThree = [
  "Developer",
  "Portfolio",
  "Innovation",
  "Analytics",
  "Machine Learning",
  "Web Apps",
  "Creative Code",
]

function VelocityText({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-10 px-6 ${className ?? ""}`}>
      {items.map((item) => (
        <span key={item} className="inline-flex items-center gap-10">
          <span>{item}</span>
          <span aria-hidden="true">·</span>
        </span>
      ))}
    </span>
  )
}

/** Subtle full-bleed background for the hero landing section */
export function ScrollVelocityBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
      <div className="absolute inset-0 flex flex-col justify-center gap-10 py-16 opacity-[0.11] sm:gap-14 sm:opacity-[0.13]">
        <ScrollVelocityContainer className="flex flex-col gap-10 sm:gap-14">
          <ScrollVelocityRow baseVelocity={1.5} direction={1} className="py-2">
            <span className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold tracking-tight text-primary/40">
              <VelocityText items={rowOne} />
            </span>
          </ScrollVelocityRow>

          <ScrollVelocityRow baseVelocity={1.25} direction={-1} className="py-2">
            <span className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold tracking-tight text-foreground/25">
              <VelocityText items={rowTwo} />
            </span>
          </ScrollVelocityRow>

          <ScrollVelocityRow baseVelocity={1.75} direction={1} className="hidden py-2 sm:block">
            <span className="text-[clamp(2rem,6vw,4rem)] font-bold tracking-tight text-primary/25">
              <VelocityText items={rowThree} />
            </span>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_78%)]" />
    </div>
  )
}

/** Foreground marquee band — optional accent strip between sections */
export function ScrollVelocityMarquee() {
  return (
    <section className="relative z-10 w-full border-y border-primary/10 bg-background/80 py-6 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />

      <ScrollVelocityContainer className="flex flex-col gap-4">
        <ScrollVelocityRow baseVelocity={3} direction={1} className="py-1">
          <span className="text-2xl font-bold tracking-tight text-foreground/90 sm:text-4xl md:text-5xl">
            <VelocityText items={rowOne} />
          </span>
        </ScrollVelocityRow>

        <ScrollVelocityRow baseVelocity={3} direction={-1} className="py-1">
          <span className="text-2xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl bg-linear-to-r from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text">
            <VelocityText items={rowTwo} />
          </span>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </section>
  )
}
