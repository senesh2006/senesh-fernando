"use client"

import { useEffect, useRef, useState } from "react"

/**
 * CustomCursor component that implements a smooth, theme-aware cursor
 * inspired by modern design portfolios.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Disable on touch devices
    const coarse = window.matchMedia("(pointer: coarse)").matches
    setEnabled(!coarse)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Detect links, buttons, and elements with interactive roles/classes
      if (target.closest('a, button, [role="button"], .link-hover, .project-card, .glass-card-hover')) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseover", handleMouseOver)

    const animate = () => {
      // Linear Interpolation (Lerp) for smooth gliding effect
      // 0.15 provides a nice balance between responsiveness and smoothness
      const lerp = 0.15
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * lerp
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * lerp

      if (cursorRef.current) {
        // Apply transformation: position + scale on hover
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%) scale(${isHovered ? 2.5 : 1})`
        // Update opacity to ensure it's visible once it starts moving
        cursorRef.current.style.opacity = "1"
      }

      requestAnimationFrame(animate)
    }

    const raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
      cancelAnimationFrame(raf)
    }
  }, [enabled, isHovered])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '24px',
        height: '24px',
        backgroundColor: 'white',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
        transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease',
        willChange: 'transform',
        opacity: 0 // Start hidden until movement
      }}
    />
  )
}
