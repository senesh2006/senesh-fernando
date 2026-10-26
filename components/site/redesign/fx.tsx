"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react"
import { cn } from "@/lib/utils"

export function SplitHeading({
  lines,
  className,
}: {
  lines: { text: string; className?: string }[]
  className?: string
}) {
  const reduce = useReducedMotion()
  const label = lines.map((line) => line.text).join(" ")
  return (
    <h1 aria-label={label} className={className}>
      {lines.map((line, lineIndex) => (
        <span key={line.text} className={cn("block overflow-hidden pb-[0.08em]", line.className)}>
          <span className="inline-block">
            {reduce
              ? line.text
              : line.text.split("").map((char, index) => (
                  <motion.span
                    key={`${line.text}-${index}`}
                    aria-hidden
                    className="inline-block"
                    initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.7,
                      delay: 0.08 + lineIndex * 0.12 + index * 0.028,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
          </span>
        </span>
      ))}
    </h1>
  )
}

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()

  const onMove = (event: React.MouseEvent<HTMLSpanElement>) => {
    const node = ref.current
    if (!node || reduce || !window.matchMedia("(pointer: fine)").matches) return
    const rect = node.getBoundingClientRect()
    const x = event.clientX - (rect.left + rect.width / 2)
    const y = event.clientY - (rect.top + rect.height / 2)
    node.style.transform = `translate3d(${x * 0.28}px, ${y * 0.4}px, 0)`
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "translate3d(0,0,0)"
      }}
      className={cn("inline-flex transition-transform duration-200 ease-out", className)}
    >
      {children}
    </span>
  )
}

export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node || !window.matchMedia("(pointer: fine)").matches) return
    const rect = node.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    node.style.setProperty("--sx", `${event.clientX - rect.left}px`)
    node.style.setProperty("--sy", `${event.clientY - rect.top}px`)
    if (!reduce) {
      node.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 8}deg)`
    }
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        const node = ref.current
        if (!node) return
        node.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)"
      }}
      className={cn("spotlight-card", className)}
    >
      {children}
    </div>
  )
}

export function Counter({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion()
  const [current, setCurrent] = useState(reduce ? value : 0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduce) {
      setCurrent(value)
      return
    }
    const node = ref.current
    if (!node) return
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1100)
          const eased = 1 - (1 - t) ** 3
          setCurrent(Math.round(eased * value))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.5 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [reduce, value])

  return (
    <span ref={ref} className={className}>
      {current}
    </span>
  )
}

export function Parallax({
  children,
  className,
  amount = 36,
}: {
  children: ReactNode
  className?: string
  amount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount])
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

export function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  if (reduce) return null
  return <motion.div style={{ scaleX }} className="scroll-progress" aria-hidden />
}
