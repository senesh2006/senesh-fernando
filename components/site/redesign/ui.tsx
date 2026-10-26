"use client"

import Link from "next/link"
import { useEffect, useState, type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const LOCAL_IMAGE_FALLBACKS: [string, string][] = [
  ["1558652593", "/assets/writing-cover-system.jpg"],
  ["1511467687858", "/assets/writing-cover-keyboard.jpg"],
  ["1504639725440", "/assets/writing-cover-vanilla.jpg"],
  ["1558494943", "/assets/writing-cover-perf.jpg"],
  ["1455390582240", "/assets/writing-cover-handoff.jpg"],
  ["1586281380349", "/assets/index-hero.jpg"],
  ["1460925895917", "/assets/projects-hero.jpg"],
  ["D5603AQFVENT05T1dDA", "/assets/senesh-portrait.jpg"],
]

export function resolveImage(src: string | undefined | null) {
  if (!src) return ""
  const hit = LOCAL_IMAGE_FALLBACKS.find(([id]) => src.includes(id))
  return hit ? hit[1] : src
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

export function Container({
  children,
  className,
  id,
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  id?: string
  as?: "div" | "section" | "header" | "footer" | "article" | "nav"
}) {
  return (
    <Tag id={id} className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </Tag>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground", className)}>
      {children}
    </p>
  )
}

export function PrimaryLink({
  href,
  children,
  external,
  className,
}: {
  href: string
  children: ReactNode
  external?: boolean
  className?: string
}) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-transform motion-safe:hover:-translate-y-0.5",
    className,
  )
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

export function GhostLink({
  href,
  children,
  external,
  className,
}: {
  href: string
  children: ReactNode
  external?: boolean
  className?: string
}) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-background/40 px-5 text-sm font-medium transition-colors hover:bg-secondary",
    className,
  )
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

export function TextArrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1">
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

export function CoverImage({
  src,
  alt,
  className,
  fallbackLabel,
}: {
  src: string
  alt: string
  className?: string
  fallbackLabel?: string
}) {
  const resolved = resolveImage(src)
  const [current, setCurrent] = useState(resolved)
  const [dead, setDead] = useState(!resolved)

  useEffect(() => {
    setCurrent(resolved)
    setDead(!resolved)
  }, [resolved])

  if (dead) {
    return (
      <div
        className={cn(
          "relative grid h-full w-full place-items-end overflow-hidden bg-secondary p-5",
          className,
        )}
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,color-mix(in_oklab,var(--accent)_50%,transparent),transparent_42%),radial-gradient(circle_at_85%_80%,color-mix(in_oklab,oklch(0.55_0.14_285)_45%,transparent),transparent_46%)]"
        />
        <span className="relative max-w-[18rem] text-left text-sm font-medium leading-snug text-foreground">
          {fallbackLabel || alt}
        </span>
      </div>
    )
  }

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        const local = resolveImage(current)
        if (local && local !== current) setCurrent(local)
        else setDead(true)
      }}
    />
  )
}

export function SkillMarquee({ items }: { items: readonly string[] }) {
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-border bg-background/50">
      <div className="marquee-track flex w-max gap-10 py-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10" aria-hidden={i >= items.length}>
            <span>{item}</span>
            <span className="text-accent" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
