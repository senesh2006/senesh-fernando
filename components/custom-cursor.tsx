"use client"

import { useEffect, useRef, useState } from "react"

/**
 * CustomCursor component that emulates the iconic iOS pointer behavior.
 * Fixed: Robust morphing, consistent sizing, and reliable return-to-idle.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null)
  
  // Refs for animation values to avoid re-renders and closure staleness
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const cursorSize = useRef({ w: 8, h: 8, r: 4 }) // All in pixels
  const isVisible = useRef(false)
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
      if (!isVisible.current) {
        isVisible.current = true
        if (cursorRef.current) cursorRef.current.style.opacity = "1"
      }
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const clickable = target.closest('a, button, [role="button"], .link-hover, .project-card, .glass-card-hover, .row-hover, .sm-panel-item, .sm-toggle') as HTMLElement
      
      if (clickable && clickable.isConnected) {
        setTargetEl(clickable)
      } else {
        setTargetEl(null)
      }
    }

    const handleMouseLeaveWindow = () => {
      isVisible.current = false
      setTargetEl(null)
      if (cursorRef.current) cursorRef.current.style.opacity = "0"
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseover", handleMouseOver, { passive: true })
    window.addEventListener("mouseleave", handleMouseLeaveWindow)
    document.addEventListener("mouseleave", handleMouseLeaveWindow)

    const animate = () => {
      // Physics constants
      const lerp = targetEl ? 0.25 : 0.2 // Slightly snappier
      const sizeLerp = 0.2

      let targetX = mousePos.current.x
      let targetY = mousePos.current.y
      let targetW = 8
      let targetH = 8
      let targetR = 4 // 8/2 for circle

      if (targetEl && targetEl.isConnected) {
        const rect = targetEl.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        // iOS magnetic effect: snap to center with 15% mouse influence
        targetX = centerX + (mousePos.current.x - centerX) * 0.15
        targetY = centerY + (mousePos.current.y - centerY) * 0.15
        
        // Morph with padding
        targetW = rect.width + 12
        targetH = rect.height + 8
        
        const style = window.getComputedStyle(targetEl)
        const borderRadius = parseInt(style.borderRadius)
        targetR = isNaN(borderRadius) ? 8 : borderRadius + 4
      }

      // Smoothly interpolate position
      cursorPos.current.x += (targetX - cursorPos.current.x) * lerp
      cursorPos.current.y += (targetY - cursorPos.current.y) * lerp

      // Smoothly interpolate size and radius
      cursorSize.current.w += (targetW - cursorSize.current.w) * sizeLerp
      cursorSize.current.h += (targetH - cursorSize.current.h) * sizeLerp
      cursorSize.current.r += (targetR - cursorSize.current.r) * sizeLerp

      if (cursorRef.current && isVisible.current) {
        const { x, y } = cursorPos.current
        const { w, h, r } = cursorSize.current
        
        // Apply transform for position
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
        
        // Apply dimensions
        cursorRef.current.style.width = `${w}px`
        cursorRef.current.style.height = `${h}px`
        cursorRef.current.style.borderRadius = `${r}px`
        
        // Visual style transitions
        if (targetEl) {
          cursorRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
          cursorRef.current.style.mixBlendMode = 'normal'
          cursorRef.current.style.backdropFilter = 'blur(4px)'
        } else {
          cursorRef.current.style.backgroundColor = 'white'
          cursorRef.current.style.mixBlendMode = 'difference'
          cursorRef.current.style.backdropFilter = 'none'
        }
      }

      requestAnimationFrame(animate)
    }

    const raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
      window.removeEventListener("mouseleave", handleMouseLeaveWindow)
      document.removeEventListener("mouseleave", handleMouseLeaveWindow)
      cancelAnimationFrame(raf)
    }
  }, [enabled, targetEl])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '8px',
        height: '8px',
        backgroundColor: 'white',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99999,
        mixBlendMode: 'difference',
        opacity: 0,
        transition: 'opacity 0.3s ease, background-color 0.3s ease, mix-blend-mode 0.3s ease',
        willChange: 'transform, width, height, border-radius'
      }}
    />
  )
}
