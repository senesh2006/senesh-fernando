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
  const textRef = useRef<HTMLSpanElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [cursorText, setCursorText] = useState("")
  
  const state = useRef({
    blobX: -100,
    blobY: -100,
    targetX: -100,
    targetY: -100,
    prevX: -100,
    prevY: -100,
    visible: false,
    needsReset: true,
    currentAngle: 0,
  })
  
  const magneticElements = useRef<MagneticElement[]>([])
  
  const updateMagneticElements = useCallback(() => {
    const elements = document.querySelectorAll('a, button, [data-magnetic], .glass-card-hover, .project-card, input, textarea, select')
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
    const hasHover = window.matchMedia("(hover: hover)").matches
    if (!hasHover) return
    
    const blob = blobRef.current
    if (!blob) return
    
    const handleMouseMove = (e: MouseEvent) => {
      const s = state.current
      
      if (s.needsReset) {
        s.blobX = e.clientX
        s.blobY = e.clientY
        s.targetX = e.clientX
        s.targetY = e.clientY
        s.prevX = e.clientX
        s.prevY = e.clientY
        s.needsReset = false
      }
      
      s.targetX = e.clientX
      s.targetY = e.clientY
      s.visible = true
      
      // Check what element we're hovering over for cursor text
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [role="button"], .project-card, input, textarea, select')
      
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
      
      if (closestElement || interactive) {
        setIsHovering(true)
        
        // Determine cursor text based on element type
        const el = interactive || closestElement?.element
        if (el) {
          if (el.classList.contains('project-card')) {
            setCursorText("View")
          } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            setCursorText("Type")
          } else if (el.tagName === 'SELECT') {
            setCursorText("Select")
          } else if (el.tagName === 'A') {
            const isExternal = el.getAttribute('target') === '_blank'
            const isNav = el.closest('nav')
            if (isExternal) {
              setCursorText("Open")
            } else if (isNav) {
              setCursorText("Go")
            } else {
              setCursorText("View")
            }
          } else if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') {
            const buttonText = el.textContent?.toLowerCase() || ''
            if (buttonText.includes('submit') || buttonText.includes('send')) {
              setCursorText("Send")
            } else if (buttonText.includes('close') || buttonText.includes('cancel')) {
              setCursorText("Close")
            } else {
              setCursorText("Click")
            }
          } else {
            setCursorText("View")
          }
        }
        
        if (closestElement) {
          const pull = 1 - (closestDistance / magneticRadius)
          const pullStrength = 0.4
          s.targetX = e.clientX + (closestElement.centerX - e.clientX) * pull * pullStrength
          s.targetY = e.clientY + (closestElement.centerY - e.clientY) * pull * pullStrength
        }
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
      } else {
        state.current.needsReset = true
      }
    }
    
    const handleWindowBlur = () => {
      state.current.visible = false
      state.current.needsReset = true
    }
    
    const handleScrollOrResize = () => {
      updateMagneticElements()
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
    const springStrength = 0.15
    
    const animate = () => {
      const s = state.current
      
      const dx = s.targetX - s.blobX
      const dy = s.targetY - s.blobY
      
      s.blobX += dx * springStrength
      s.blobY += dy * springStrength
      
      const moveX = s.blobX - s.prevX
      const moveY = s.blobY - s.prevY
      
      const clampedMoveX = Math.max(-15, Math.min(15, moveX))
      const clampedMoveY = Math.max(-15, Math.min(15, moveY))
      
      const speed = Math.sqrt(clampedMoveX * clampedMoveX + clampedMoveY * clampedMoveY)
      
      const stretchAmount = Math.min(speed / 25, 0.25)
      const scaleX = 1 + stretchAmount
      const scaleY = 1 - stretchAmount * 0.3
      const angle = Math.atan2(clampedMoveY, clampedMoveX) * (180 / Math.PI)
      
      s.currentAngle = angle
      
      blob.style.opacity = s.visible ? "1" : "0"
      blob.style.transform = `
        translate(${s.blobX}px, ${s.blobY}px)
        translate(-50%, -50%)
        rotate(${angle}deg)
        scale(${scaleX}, ${scaleY})
      `
      
      // Counter-rotate text to keep it upright
      if (textRef.current) {
        textRef.current.style.transform = `rotate(${-angle}deg)`
      }
      
      s.prevX = s.blobX
      s.prevY = s.blobY
      
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
  }, [updateMagneticElements])
  
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
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          width: isHovering ? "42px" : "20px",
          height: isHovering ? "42px" : "20px",
          background: isHovering 
            ? "transparent"
            : "radial-gradient(circle, #ff6a00 0%, rgba(255,106,0,0.8) 70%, rgba(255,106,0,0.4) 100%)",
          border: isHovering ? "2px solid #ff6a00" : "none",
          borderRadius: "50%",
          opacity: 0,
          boxShadow: isHovering 
            ? "0 0 20px rgba(255,106,0,0.4), 0 0 40px rgba(255,106,0,0.2), inset 0 0 20px rgba(255,106,0,0.1)"
            : "0 0 15px rgba(255,106,0,0.5), 0 0 30px rgba(255,106,0,0.2)",
          transition: "width 0.2s ease-out, height 0.2s ease-out, background 0.2s ease, box-shadow 0.2s ease, opacity 0.1s ease, border 0.2s ease",
          willChange: "transform, width, height, opacity",
        }}
      >
        <span
          ref={textRef}
          className="text-[8px] font-semibold tracking-wider uppercase"
          style={{
            color: "#ff6a00",
            opacity: isHovering && cursorText ? 1 : 0,
            transition: "opacity 0.15s ease",
            textShadow: "0 0 10px rgba(255,106,0,0.5)",
          }}
        >
          {cursorText}
        </span>
      </div>
    </>
  )
}
