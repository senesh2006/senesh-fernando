"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface MagneticElement {
  element: HTMLElement
  rect: DOMRect
  centerX: number
  centerY: number
}

export function MagneticBlobCursor() {
  const blobRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  
  // Current blob position
  const blobPos = useRef({ x: -100, y: -100 })
  // Target position (mouse or magnetic target)
  const targetPos = useRef({ x: -100, y: -100 })
  // Velocity for stretching effect
  const velocity = useRef({ x: 0, y: 0 })
  // Previous position for velocity calculation
  const prevPos = useRef({ x: -100, y: -100 })
  // Magnetic elements cache
  const magneticElements = useRef<MagneticElement[]>([])
  // Current magnetic target
  const magneticTarget = useRef<MagneticElement | null>(null)
  // Track if mouse just entered to prevent size spike
  const justEntered = useRef(false)
  // Track if cursor is outside window
  const isOutside = useRef(true)
  
  const updateMagneticElements = useCallback(() => {
    const elements = document.querySelectorAll('a, button, [data-magnetic], .glass-card-hover')
    magneticElements.current = Array.from(elements).map(el => {
      const rect = el.getBoundingClientRect()
      return {
        element: el as HTMLElement,
        rect,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      }
    })
  }, [])
  
  useEffect(() => {
    // Check if device supports hover
    const hasHover = window.matchMedia("(hover: hover)").matches
    if (!hasHover) return
    
    const handleMouseMove = (e: MouseEvent) => {
      const newTarget = { x: e.clientX, y: e.clientY }
      
      // If mouse just entered or was outside, snap position to prevent spike
      if (justEntered.current || isOutside.current) {
        blobPos.current = { ...newTarget }
        prevPos.current = { ...newTarget }
        velocity.current = { x: 0, y: 0 }
        justEntered.current = false
        isOutside.current = false
      }
      
      targetPos.current = newTarget
      if (!isVisible) setIsVisible(true)
      
      // Check for magnetic attraction
      let closestElement: MagneticElement | null = null
      let closestDistance = Infinity
      const magneticRadius = 80
      
      for (const magEl of magneticElements.current) {
        const dx = e.clientX - magEl.centerX
        const dy = e.clientY - magEl.centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < magneticRadius && distance < closestDistance) {
          closestDistance = distance
          closestElement = magEl
        }
      }
      
      if (closestElement) {
        magneticTarget.current = closestElement
        setIsHovering(true)
        const pull = 1 - (closestDistance / magneticRadius)
        const pullStrength = 0.4
        targetPos.current = {
          x: e.clientX + (closestElement.centerX - e.clientX) * pull * pullStrength,
          y: e.clientY + (closestElement.centerY - e.clientY) * pull * pullStrength,
        }
      } else {
        magneticTarget.current = null
        setIsHovering(false)
      }
    }
    
    const handleMouseEnter = () => {
      justEntered.current = true
      isOutside.current = false
      setIsVisible(true)
    }
    
    const handleMouseLeave = () => {
      isOutside.current = true
      setIsVisible(false)
      setIsHovering(false)
      // Reset velocity to prevent spike on re-entry
      velocity.current = { x: 0, y: 0 }
    }
    
    const handleScrollOrResize = () => {
      updateMagneticElements()
    }
    
    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false)
        isOutside.current = true
        velocity.current = { x: 0, y: 0 }
      }
    }
    
    // Handle window blur (clicking outside browser)
    const handleWindowBlur = () => {
      setIsVisible(false)
      isOutside.current = true
      velocity.current = { x: 0, y: 0 }
    }
    
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleWindowBlur)
    window.addEventListener("scroll", handleScrollOrResize, { passive: true })
    window.addEventListener("resize", handleScrollOrResize)
    
    updateMagneticElements()
    
    const updateInterval = setInterval(updateMagneticElements, 1000)
    
    let animationId: number
    const springStrength = 0.12
    
    const animate = () => {
      // Skip animation if outside window
      if (isOutside.current) {
        animationId = requestAnimationFrame(animate)
        return
      }
      
      // Calculate velocity with clamping
      const rawVelX = (targetPos.current.x - blobPos.current.x) * springStrength
      const rawVelY = (targetPos.current.y - blobPos.current.y) * springStrength
      
      // Clamp velocity to prevent extreme values
      const maxVel = 50
      velocity.current = {
        x: Math.max(-maxVel, Math.min(maxVel, rawVelX)),
        y: Math.max(-maxVel, Math.min(maxVel, rawVelY)),
      }
      
      blobPos.current.x += velocity.current.x
      blobPos.current.y += velocity.current.y
      
      // Calculate speed for stretch effect with clamping
      const dx = blobPos.current.x - prevPos.current.x
      const dy = blobPos.current.y - prevPos.current.y
      const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 30)
      
      // Calculate stretch with lower max
      const maxStretch = 1.3
      const stretchAmount = Math.min(speed / 20, maxStretch - 1)
      const scaleX = 1 + stretchAmount
      const scaleY = 1 - stretchAmount * 0.4
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)
      
      if (blobRef.current) {
        const baseSize = isHovering ? 50 : 20
        blobRef.current.style.width = `${baseSize}px`
        blobRef.current.style.height = `${baseSize}px`
        blobRef.current.style.transform = `
          translate(${blobPos.current.x}px, ${blobPos.current.y}px)
          translate(-50%, -50%)
          rotate(${angle}deg)
          scale(${scaleX}, ${scaleY})
        `
      }
      
      prevPos.current = { ...blobPos.current }
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleWindowBlur)
      window.removeEventListener("scroll", handleScrollOrResize)
      window.removeEventListener("resize", handleScrollOrResize)
      clearInterval(updateInterval)
      cancelAnimationFrame(animationId)
    }
  }, [isVisible, updateMagneticElements])
  
  if (typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches) {
    return null
  }
  
  return (
    <>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
      
      <div
        ref={blobRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: "20px",
          height: "20px",
          background: isHovering 
            ? "radial-gradient(circle, rgba(255,106,0,0.9) 0%, rgba(255,106,0,0.6) 50%, rgba(255,106,0,0.3) 100%)"
            : "radial-gradient(circle, #ff6a00 0%, rgba(255,106,0,0.8) 70%, rgba(255,106,0,0.4) 100%)",
          borderRadius: "50%",
          opacity: isVisible ? 1 : 0,
          boxShadow: isHovering 
            ? "0 0 30px rgba(255,106,0,0.6), 0 0 60px rgba(255,106,0,0.3)"
            : "0 0 15px rgba(255,106,0,0.5), 0 0 30px rgba(255,106,0,0.2)",
          transition: "width 0.3s cubic-bezier(0.23, 1, 0.32, 1), height 0.3s cubic-bezier(0.23, 1, 0.32, 1), background 0.2s ease, box-shadow 0.3s ease, opacity 0.15s ease",
          willChange: "transform, width, height",
        }}
      />
    </>
  )
}
