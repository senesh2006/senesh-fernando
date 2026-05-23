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

function VelocityText({ items }: { items: string[] }) {
  return (
    <span className="inline-flex items-center gap-8 px-4">
      {items.map((item) => (
        <span key={item} className="inline-flex items-center gap-8">
          <span>{item}</span>
          <span className="text-primary/60" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </span>
  )
}

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
