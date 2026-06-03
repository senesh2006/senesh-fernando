"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface MagneticElement {
  element: HTMLElement
  rect: DOMRect
  centerX: number
  centerY: number
  label: string
}

function getLabel(el: HTMLElement): string {
  const attr = el.getAttribute("data-cursor-label")
  if (attr) return attr
  if (el.closest(".project-card, [data-cursor='view']")) return "View"
  if (el.tagName === "A") return "Go"
  if (el.tagName === "BUTTON" || el.getAttribute("role") === "button") return "Press"
  if (el.closest("[data-magnetic]")) return "Drag"
  return "View"
}

export function MagneticBlobCursor() {
  const blobRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [cursorText, setCursorText] = useState("")

  const state = useRef({
    blobX: -200,
    blobY: -200,
    dotX: -200,
    dotY: -200,
    targetX: -200,
    targetY: -200,
    prevX: -200,
    prevY: -200,
    rawX: -200,
    rawY: -200,
    visible: false,
    needsReset: true,
    angle: 0,
  })

  const magneticElements = useRef<MagneticElement[]>([])

  const updateMagneticElements = useCallback(() => {
    const elements = document.querySelectorAll(
      '[data-magnetic], .glass-card-hover, .project-card, a, button, [role="button"]'
    )
    magneticElements.current = Array.from(elements).map((el) => {
      const rect = el.getBoundingClientRect()
      return {
        element: el as HTMLElement,
        rect,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        label: getLabel(el as HTMLElement),
      }
    })
  }, [])

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return

    document.body.style.cursor = "none"

    const blob = blobRef.current
    const dot = dotRef.current
    if (!blob || !dot) return

    const MAGNETIC_RADIUS = 90
    const PULL_STRENGTH = 0.38
    const SPRING = 0.14
    const DOT_SPRING = 0.28

    const handleMouseMove = (e: MouseEvent) => {
      const s = state.current

      s.rawX = e.clientX
      s.rawY = e.clientY

      if (s.needsReset) {
        s.blobX = e.clientX
        s.blobY = e.clientY
        s.dotX = e.clientX
        s.dotY = e.clientY
        s.targetX = e.clientX
        s.targetY = e.clientY
        s.prevX = e.clientX
        s.prevY = e.clientY
        s.needsReset = false
      }

      s.visible = true
      s.targetX = e.clientX
      s.targetY = e.clientY

      let closestEl: MagneticElement | null = null
      let closestDist = Infinity

      for (const m of magneticElements.current) {
        const dx = e.clientX - m.centerX
        const dy = e.clientY - m.centerY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MAGNETIC_RADIUS && dist < closestDist) {
          closestDist = dist
          closestEl = m
        }
      }

      if (closestEl) {
        const pull = (1 - closestDist / MAGNETIC_RADIUS) * PULL_STRENGTH
        s.targetX = e.clientX + (closestEl.centerX - e.clientX) * pull
        s.targetY = e.clientY + (closestEl.centerY - e.clientY) * pull
        setIsHovering(true)
        setCursorText(closestEl.label)
      } else {
        setIsHovering(false)
        setCursorText("")
      }
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

    const handleScrollResize = () => updateMagneticElements()

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("scroll", handleScrollResize, { passive: true })
    window.addEventListener("resize", handleScrollResize)

    updateMagneticElements()
    const interval = setInterval(updateMagneticElements, 800)

    let raf: number

    const animate = () => {
      const s = state.current

      // Blob spring
      s.blobX += (s.targetX - s.blobX) * SPRING
      s.blobY += (s.targetY - s.blobY) * SPRING

      // Dot tracks raw mouse
      s.dotX += (s.rawX - s.dotX) * DOT_SPRING
      s.dotY += (s.rawY - s.dotY) * DOT_SPRING

      const moveX = s.blobX - s.prevX
      const moveY = s.blobY - s.prevY
      const speed = Math.sqrt(moveX * moveX + moveY * moveY)
      const stretch = Math.min(speed / 22, 0.28)
      const scaleX = 1 + stretch
      const scaleY = 1 - stretch * 0.35
      const angle = Math.atan2(moveY, moveX) * (180 / Math.PI)
      s.angle = angle
      s.prevX = s.blobX
      s.prevY = s.blobY

      blob.style.opacity = s.visible ? "1" : "0"
      blob.style.transform = `translate(${s.blobX}px,${s.blobY}px) translate(-50%,-50%) rotate(${angle}deg) scale(${scaleX},${scaleY})`

      dot.style.opacity = s.visible ? "1" : "0"
      dot.style.transform = `translate(${s.dotX}px,${s.dotY}px) translate(-50%,-50%)`

      if (labelRef.current) {
        labelRef.current.style.transform = `rotate(${-angle}deg)`
      }

      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("scroll", handleScrollResize)
      window.removeEventListener("resize", handleScrollResize)
      clearInterval(interval)
      cancelAnimationFrame(raf)
      document.body.style.cursor = "auto"
    }
  }, [updateMagneticElements])

  return (
    <>
      {/* Magnetic blob */}
      <div
        ref={blobRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          width: isHovering ? "38px" : "12px",
          height: isHovering ? "38px" : "12px",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.7)",
          borderRadius: "50%",
          opacity: 0,
          backdropFilter: "blur(6px)",
          boxShadow: "none",
          transition:
            "width 0.35s cubic-bezier(0.23,1,0.32,1), height 0.35s cubic-bezier(0.23,1,0.32,1), background 0.25s ease, box-shadow 0.25s ease, border 0.25s ease, backdrop-filter 0.25s ease",
          willChange: "transform, width, height, opacity",
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "7px",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "transparent",
            opacity: isHovering && cursorText ? 1 : 0,
            transition: "opacity 0.2s ease",
            userSelect: "none",
          }}
        >
          {cursorText}
        </span>
      </div>

      {/* Precise dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          width: "4px",
          height: "4px",
          background: "#ffffff",
          border: "1px solid #ffffff",
          borderRadius: "50%",
          opacity: 0,
          transition: "background 0.2s ease",
          willChange: "transform, opacity",
        }}
      />
    </>
  )
}
