"use client"

import { useEffect, useRef, useState } from "react"

/**
 * CustomCursor component that emulates the iconic iOS pointer behavior.
 * It's a small dot that magnetically snaps and morphs into clickable elements.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const cursorSize = useRef({ w: 8, h: 8, r: 50 }) // width, height, border-radius
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
      // Broadly detect interactive elements
      const clickable = target.closest('a, button, [role="button"], .link-hover, .project-card, .glass-card-hover, .row-hover, .sm-panel-item, .sm-toggle') as HTMLElement
      if (clickable) {
        setTargetEl(clickable)
      } else {
        setTargetEl(null)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseover", handleMouseOver)

    const animate = () => {
      // Use faster lerp for snapping, slower for idle
      const lerp = targetEl ? 0.22 : 0.18
      const sizeLerp = 0.15

      let targetX = mousePos.current.x
      let targetY = mousePos.current.y
      let targetW = 8
      let targetH = 8
      let targetR = 50

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        // Snap to center but allow subtle mouse resistance for that "magnetic" feel
        targetX = centerX + (mousePos.current.x - centerX) * 0.15
        targetY = centerY + (mousePos.current.y - centerY) * 0.15
        
        // Add padding around the target element
        targetW = rect.width + 12
        targetH = rect.height + 8
        
        // Match border radius with slight offset
        const style = window.getComputedStyle(targetEl)
        const borderRadius = parseInt(style.borderRadius)
        targetR = isNaN(borderRadius) ? 8 : borderRadius + 4
      }

      // Smoothly interpolate all properties
      cursorPos.current.x += (targetX - cursorPos.current.x) * lerp
      cursorPos.current.y += (targetY - cursorPos.current.y) * lerp
      cursorSize.current.w += (targetW - cursorSize.current.w) * sizeLerp
      cursorSize.current.h += (targetH - cursorSize.current.h) * sizeLerp
      
      if (!targetEl) {
        cursorSize.current.r += (50 - cursorSize.current.r) * sizeLerp
      } else {
        cursorSize.current.r += (targetR - cursorSize.current.r) * sizeLerp
      }

      if (cursorRef.current) {
        const { x, y } = cursorPos.current
        const { w, h, r } = cursorSize.current
        
        cursorRef.current.style.width = `${w}px`
        cursorRef.current.style.height = `${h}px`
        cursorRef.current.style.borderRadius = targetEl ? `${r}px` : `${r}%`
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
        cursorRef.current.style.opacity = "1"
        
        // Visual styling for morphing mode
        cursorRef.current.style.backgroundColor = targetEl 
          ? 'rgba(255, 255, 255, 0.15)' 
          : 'white'
        cursorRef.current.style.mixBlendMode = targetEl ? 'normal' : 'difference'
        cursorRef.current.style.backdropFilter = targetEl ? 'blur(4px)' : 'none'
      }

      requestAnimationFrame(animate)
    }

    const raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
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
        zIndex: 9999,
        mixBlendMode: 'difference',
        transition: 'opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.4s ease',
        willChange: 'transform, width, height, border-radius',
        opacity: 0
      }}
    />
  )
}
