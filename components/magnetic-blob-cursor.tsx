"use client"

import { useEffect, useRef } from "react"

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], .project-card, [data-magnetic], [data-cursor], summary, label[for], [data-cursor-label]'

const IDLE_SIZE = 24 // diameter of the resting dot
const PAD = 6 // how far the highlight extends past the element edges
const LEAN = 0.14 // how strongly the highlight leans toward the pointer
const MAX_LEAN = 7 // px cap on the lean offset

function readRadius(el: HTMLElement, h: number): number {
  const r = parseFloat(getComputedStyle(el).borderTopLeftRadius || "0")
  if (Number.isFinite(r) && r > 0) return r + PAD
  return Math.min(12, h / 2 + PAD) // soft default
}

export function MagneticBlobCursor() {
  const ringRef = useRef<HTMLDivElement>(null)

  const state = useRef({
    // current animated geometry (center x/y, width, height, radius)
    x: -200,
    y: -200,
    w: IDLE_SIZE,
    h: IDLE_SIZE,
    r: IDLE_SIZE / 2,
    // targets
    tx: -200,
    ty: -200,
    tw: IDLE_SIZE,
    th: IDLE_SIZE,
    tr: IDLE_SIZE / 2,
    pointerX: -200,
    pointerY: -200,
    visible: false,
    needsReset: true,
    hovering: false,
  })

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return

    document.body.style.cursor = "none"
    document.body.classList.add("custom-cursor-active")

    const ring = ringRef.current
    if (!ring) return

    // Spring constants — geometry snaps a touch faster than position.
    const POS_SPRING = 0.22
    const GEO_SPRING = 0.30

    // Recompute the target geometry from the element under the pointer.
    const resolveTarget = (px: number, py: number) => {
      const s = state.current
      const under = document.elementFromPoint(px, py) as HTMLElement | null
      const el = under?.closest(INTERACTIVE_SELECTOR) as HTMLElement | null

      if (el) {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        // lean the highlight toward the pointer, clamped
        const leanX = Math.max(-MAX_LEAN, Math.min(MAX_LEAN, (px - cx) * LEAN))
        const leanY = Math.max(-MAX_LEAN, Math.min(MAX_LEAN, (py - cy) * LEAN))
        s.tx = cx + leanX
        s.ty = cy + leanY
        s.tw = rect.width + PAD * 2
        s.th = rect.height + PAD * 2
        s.tr = readRadius(el, rect.height)
        s.hovering = true
      } else {
        s.tx = px
        s.ty = py
        s.tw = IDLE_SIZE
        s.th = IDLE_SIZE
        s.tr = IDLE_SIZE / 2
        s.hovering = false
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const s = state.current
      s.pointerX = e.clientX
      s.pointerY = e.clientY

      if (s.needsReset) {
        s.x = e.clientX
        s.y = e.clientY
        s.tx = e.clientX
        s.ty = e.clientY
        s.needsReset = false
      }
      s.visible = true
      resolveTarget(e.clientX, e.clientY)
    }

    const handleMouseLeave = () => {
      state.current.visible = false
      state.current.needsReset = true
    }
    const handleMouseEnter = () => {
      state.current.needsReset = true
    }
    const handleVisibilityChange = () => {
      if (document.hidden) {
        state.current.visible = false
        state.current.needsReset = true
      }
    }
    // Keep the highlight glued to the element while scrolling without mouse movement.
    const handleScroll = () => {
      const s = state.current
      if (s.visible) resolveTarget(s.pointerX, s.pointerY)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("scroll", handleScroll, { passive: true })

    let raf: number
    const animate = () => {
      const s = state.current

      s.x += (s.tx - s.x) * POS_SPRING
      s.y += (s.ty - s.y) * POS_SPRING
      s.w += (s.tw - s.w) * GEO_SPRING
      s.h += (s.th - s.h) * GEO_SPRING
      s.r += (s.tr - s.r) * GEO_SPRING

      ring.style.opacity = s.visible ? "1" : "0"
      ring.style.width = `${s.w}px`
      ring.style.height = `${s.h}px`
      ring.style.borderRadius = `${s.r}px`
      ring.style.transform = `translate(${s.x - s.w / 2}px, ${s.y - s.h / 2}px)`
      // Outline-only so the element underneath stays fully visible.
      ring.style.borderColor = s.hovering
        ? "rgba(255,255,255,0.5)"
        : "rgba(255,255,255,0.7)"

      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(raf)
      document.body.style.cursor = "auto"
      document.body.classList.remove("custom-cursor-active")
    }
  }, [])

  return (
    <div
      ref={ringRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        width: IDLE_SIZE,
        height: IDLE_SIZE,
        borderRadius: "50%",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.7)",
        opacity: 0,
        willChange: "transform, width, height, border-radius, opacity",
      }}
    />
  )
}
