"use client"

import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  // Actual mouse position
  const mousePos = useRef({ x: 0, y: 0 })
  // Smoothed ring position (trails behind)
  const ringPos = useRef({ x: 0, y: 0 })
  
  useEffect(() => {
    // Check if device supports hover (not touch-only)
    const hasHover = window.matchMedia("(hover: hover)").matches
    if (!hasHover) return
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }
    
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)
    
    // Track hover state for interactive elements
    const handleElementMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]") ||
        target.closest(".glass-card-hover") ||
        target.classList.contains("cursor-pointer")
      
      setIsHovering(!!isInteractive)
    }
    
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseover", handleElementMouseOver)
    
    // Animation loop with spring physics
    let animationId: number
    const springStrength = 0.15 // Lower = more lag
    
    const animate = () => {
      // Update dot position instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`
      }
      
      // Update ring position with spring lag
      const dx = mousePos.current.x - ringPos.current.x
      const dy = mousePos.current.y - ringPos.current.y
      
      ringPos.current.x += dx * springStrength
      ringPos.current.y += dy * springStrength
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`
      }
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseover", handleElementMouseOver)
      cancelAnimationFrame(animationId)
    }
  }, [isVisible])
  
  // Don't render on touch devices
  if (typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches) {
    return null
  }
  
  return (
    <>
      {/* Hide default cursor globally */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
      
      {/* Dot - follows mouse exactly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: isHovering ? "8px" : "10px",
          height: isHovering ? "8px" : "10px",
          backgroundColor: isHovering ? "transparent" : "#ff6a00",
          borderRadius: "50%",
          opacity: isVisible ? 1 : 0,
          transition: "width 0.2s ease, height 0.2s ease, background-color 0.2s ease, opacity 0.15s ease",
        }}
      />
      
      {/* Ring - trails behind with spring physics */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: isHovering ? "40px" : "10px",
          height: isHovering ? "40px" : "10px",
          backgroundColor: "transparent",
          border: isHovering ? "2px solid #ff6a00" : "none",
          borderRadius: "50%",
          opacity: isVisible ? (isHovering ? 0.8 : 0) : 0,
          mixBlendMode: "difference",
          transition: "width 0.25s cubic-bezier(0.23, 1, 0.32, 1), height 0.25s cubic-bezier(0.23, 1, 0.32, 1), border 0.2s ease, opacity 0.2s ease",
        }}
      />
    </>
  )
}
