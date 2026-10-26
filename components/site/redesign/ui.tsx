"use client"

import Link from "next/link"
import { useEffect, useState, type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Magnetic } from "@/components/site/redesign/fx"

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
  fill,
}: {
  href: string
  children: ReactNode
  external?: boolean
  className?: string
  fill?: boolean
}) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_40%,transparent),0_10px_40px_-12px_color-mix(in_oklab,var(--accent)_70%,transparent)] transition-transform motion-safe:hover:-translate-y-0.5",
    fill && "w-full min-[420px]:w-auto",
    className,
  )
  const node = external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {children}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
  return <Magnetic className={fill ? "w-full min-[420px]:w-auto" : undefined}>{node}</Magnetic>
}

export function GhostLink({
  href,
  children,
  external,
  className,
  fill,
}: {
  href: string
  children: ReactNode
  external?: boolean
  className?: string
  fill?: boolean
}) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-background/40 px-5 text-sm font-medium backdrop-blur-md transition-colors hover:bg-secondary",
    fill && "w-full min-[420px]:w-auto",
    className,
  )
  const node = external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {children}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
  return <Magnetic className={fill ? "w-full min-[420px]:w-auto" : undefined}>{node}</Magnetic>
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
  const reverse = [...items].reverse()
  const back = [...reverse, ...reverse]
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-background/40 py-3 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-16 bg-gradient-to-l from-background to-transparent" />
      <div className="marquee-track flex w-max gap-8 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/80">
        {row.map((item, i) => (
          <span key={`a-${item}-${i}`} className="flex items-center gap-8" aria-hidden={i >= items.length}>
            <span>{item}</span>
            <span className="text-accent" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
      <div className="marquee-track flex w-max gap-8 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground [animation-direction:reverse]">
        {back.map((item, i) => (
          <span key={`b-${item}-${i}`} className="flex items-center gap-8" aria-hidden>
            <span>{item}</span>
            <span className="text-[oklch(0.75_0.12_285)]">✺</span>
          </span>
        ))}
      </div>
    </div>
  )
}
