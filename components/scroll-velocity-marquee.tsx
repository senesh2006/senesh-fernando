"use client"

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/registry/magicui/scroll-based-velocity"

const rows = [
  {
    items: ["Python", "Next.js", "React", "TypeScript", "Data Visualization", "Automation"],
    direction: 1 as const,
    velocity: 2,
    className: "text-primary/20",
  },
  {
    items: ["Problem Solving", "Simulations", "Tailwind CSS", "PostgreSQL", "API Design", "Open Source"],
    direction: -1 as const,
    velocity: 1.75,
    className: "text-foreground/15",
  },
  {
    items: ["Developer", "Portfolio", "Innovation", "Analytics", "Full Stack", "Creative Code"],
    direction: 1 as const,
    velocity: 2.25,
    className: "text-primary/15",
  },
  {
    items: ["Curtin Colombo", "Machine Learning", "Web Apps", "Automation", "Research", "Building"],
    direction: -1 as const,
    velocity: 1.5,
    className: "text-foreground/12",
  },
]

function VelocityText({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-12 px-8 ${className ?? ""}`}>
      {items.map((item) => (
        <span key={item} className="inline-flex items-center gap-12">
          <span>{item}</span>
          <span aria-hidden="true" className="opacity-40">
            ✦
          </span>
        </span>
      ))}
    </span>
  )
}

/** Full-bleed scroll velocity background for the landing hero */
export function ScrollVelocityBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex flex-col justify-center gap-8 py-10 sm:gap-12">
        <ScrollVelocityContainer className="flex flex-col gap-8 sm:gap-12">
          {rows.map((row, index) => (
            <ScrollVelocityRow
              key={index}
              baseVelocity={row.velocity}
              direction={row.direction}
              className="py-1"
            >
              <span
                className={`text-[clamp(2.25rem,7vw,4.5rem)] font-bold tracking-tight whitespace-nowrap ${row.className}`}
              >
                <VelocityText items={row.items} />
              </span>
            </ScrollVelocityRow>
          ))}
        </ScrollVelocityContainer>
      </div>

      {/* Soft vignette — keeps text readable while velocity stays visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/55 to-background/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--background)_85%)]" />
    </div>
  )
}

/** Foreground marquee band between sections */
export function ScrollVelocityMarquee() {
  return (
    <section className="relative z-10 w-full border-y border-primary/10 bg-background/80 py-6 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />

      <ScrollVelocityContainer className="flex flex-col gap-4">
        <ScrollVelocityRow baseVelocity={3} direction={1} className="py-1">
          <span className="text-2xl font-bold tracking-tight text-foreground/90 sm:text-4xl md:text-5xl">
            <VelocityText items={rows[0].items} />
          </span>
        </ScrollVelocityRow>

        <ScrollVelocityRow baseVelocity={3} direction={-1} className="py-1">
          <span className="text-2xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl bg-linear-to-r from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text">
            <VelocityText items={rows[2].items} />
          </span>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </section>
  )
}
