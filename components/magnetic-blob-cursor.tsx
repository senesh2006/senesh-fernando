"use client"

import { useEffect, useRef } from "react"

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], .project-card, [data-magnetic], [data-cursor], summary, label[for], [data-cursor-label]'

const IDLE_SIZE = 18
const PAD = 8
const LEAN = 0.14
const MAX_LEAN = 7
// How long each corner bracket arm is (px)
const BRACKET_LEN = 8

function readRadius(el: HTMLElement): number {
  const r = parseFloat(getComputedStyle(el).borderTopLeftRadius || "0")
  return Number.isFinite(r) && r > 0 ? r + 2 : 4
}

export function MagneticBlobCursor() {
  const wrapRef = useRef<HTMLDivElement>(null)
  // Four corners: TL, TR, BR, BL
  const cornersRef = useRef<HTMLDivElement[]>([])
  const dotRef = useRef<HTMLDivElement>(null)

  const state = useRef({
    x: -200, y: -200, w: IDLE_SIZE, h: IDLE_SIZE, r: IDLE_SIZE / 2,
    tx: -200, ty: -200, tw: IDLE_SIZE, th: IDLE_SIZE, tr: IDLE_SIZE / 2,
    pointerX: -200, pointerY: -200,
    visible: false, needsReset: true, hovering: false,
  })

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return

    document.body.style.cursor = "none"
    document.body.classList.add("custom-cursor-active")

    const wrap = wrapRef.current
    const corners = cornersRef.current
    const dot = dotRef.current
    if (!wrap || corners.length < 4 || !dot) return

    const POS_SPRING = 0.22
    const GEO_SPRING = 0.30

    const resolveTarget = (px: number, py: number) => {
      const s = state.current
      const under = document.elementFromPoint(px, py) as HTMLElement | null
      const el = under?.closest(INTERACTIVE_SELECTOR) as HTMLElement | null

      if (el) {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const leanX = Math.max(-MAX_LEAN, Math.min(MAX_LEAN, (px - cx) * LEAN))
        const leanY = Math.max(-MAX_LEAN, Math.min(MAX_LEAN, (py - cy) * LEAN))
        s.tx = cx + leanX
        s.ty = cy + leanY
        s.tw = rect.width + PAD * 2
        s.th = rect.height + PAD * 2
        s.tr = readRadius(el)
        s.hovering = true
      } else {
        s.tx = px; s.ty = py
        s.tw = IDLE_SIZE; s.th = IDLE_SIZE; s.tr = IDLE_SIZE / 2
        s.hovering = false
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const s = state.current
      s.pointerX = e.clientX; s.pointerY = e.clientY
      if (s.needsReset) {
        s.x = e.clientX; s.y = e.clientY
        s.tx = e.clientX; s.ty = e.clientY
        s.needsReset = false
      }
      s.visible = true
      resolveTarget(e.clientX, e.clientY)
    }

    const handleMouseLeave = () => { state.current.visible = false; state.current.needsReset = true }
    const handleMouseEnter = () => { state.current.needsReset = true }
    const handleVisibilityChange = () => {
      if (document.hidden) { state.current.visible = false; state.current.needsReset = true }
    }
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

      const op = s.visible ? "1" : "0"
      const hw = s.w / 2
      const hh = s.h / 2
      // At rest the arms equal the half-size so the four quarter-circles
      // close into a full ring; on hover they shrink into corner brackets.
      const arm = s.hovering ? BRACKET_LEN : Math.min(hw, hh)
      const borderColor = s.hovering
        ? "rgba(255,255,255,0.65)"
        : "rgba(255,255,255,0.8)"

      // Center pointer dot — visible only at rest.
      dot.style.opacity = s.visible && !s.hovering ? "1" : "0"
      dot.style.transform = `translate(${s.x}px, ${s.y}px) translate(-50%, -50%)`
      const bw = "1.5px"

      // positions: [left, top] for each corner
      const positions: [number, number][] = [
        [s.x - hw, s.y - hh], // TL
        [s.x + hw, s.y - hh], // TR
        [s.x + hw, s.y + hh], // BR
        [s.x - hw, s.y + hh], // BL
      ]

      // border sides to draw per corner [top/bottom, left/right]
      const borders: [string, string][] = [
        ["borderTop", "borderLeft"],
        ["borderTop", "borderRight"],
        ["borderBottom", "borderRight"],
        ["borderBottom", "borderLeft"],
      ]

      corners.forEach((c, i) => {
        const [lx, ly] = positions[i]
        c.style.opacity = op
        c.style.left = `${lx}px`
        c.style.top = `${ly}px`
        c.style.width = `${arm}px`
        c.style.height = `${arm}px`
        // shift so the outer corner of the bracket lands on the cursor box edge
        const tx = i === 0 || i === 3 ? "0%" : "-100%"
        const ty = i === 0 || i === 1 ? "0%" : "-100%"
        c.style.transform = `translate(${tx}, ${ty})`
        const borderStyle = `${bw} solid ${borderColor}`;
        (c.style as any)[borders[i][0]] = borderStyle;
        (c.style as any)[borders[i][1]] = borderStyle
        // clear the other two sides
        const clearH = borders[i][0] === "borderTop" ? "borderBottom" : "borderTop"
        const clearV = borders[i][1] === "borderLeft" ? "borderRight" : "borderLeft";
        (c.style as any)[clearH] = "none";
        (c.style as any)[clearV] = "none"
        // rounded corner facing inward
        const rMap = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"]
        c.style[rMap[i] as any] = `${s.r}px`
      })

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
    <div ref={wrapRef} className="fixed top-0 left-0 pointer-events-none z-[9999]">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          ref={(el) => { if (el) cornersRef.current[i] = el }}
          className="absolute"
          style={{ opacity: 0, willChange: "transform, width, height, opacity" }}
        />
      ))}
      <div
        ref={dotRef}
        className="absolute top-0 left-0"
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.9)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />
    </div>
  )
}
