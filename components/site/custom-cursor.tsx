"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion"

export function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Outer ring spring: slightly slower/trailing
  const ringSpringConfig = { damping: 25, stiffness: 200, mass: 0.6 }
  const cursorX = useSpring(mouseX, ringSpringConfig)
  const cursorY = useSpring(mouseY, ringSpringConfig)

  // Inner dot spring: very fast/reactive
  const dotSpringConfig = { damping: 40, stiffness: 800, mass: 0.1 }
  const dotX = useSpring(mouseX, dotSpringConfig)
  const dotY = useSpring(mouseY, dotSpringConfig)

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('link-hover') ||
        target.classList.contains('cursor-pointer') ||
        target.role === 'button'
      
      setIsHovering(!!isInteractive)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [isVisible, mouseX, mouseY])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Outer ring - Trailing glass effect */}
            <motion.div
              className="fixed top-0 left-0 w-10 h-10 border border-foreground/30 rounded-full mix-blend-difference"
              style={{
                x: cursorX,
                y: cursorY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                scale: isHovering ? 1.8 : isClicking ? 0.9 : 1,
                opacity: isHovering ? 0.2 : 0.4,
                borderWidth: isHovering ? '1px' : '1.5px',
              }}
              transition={{ duration: 0.2 }}
              exit={{ opacity: 0, scale: 0 }}
            />
            
            {/* Inner dot - High precision */}
            <motion.div
              className="fixed top-0 left-0 w-1.5 h-1.5 bg-foreground rounded-full mix-blend-difference"
              style={{
                x: dotX,
                y: dotY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                scale: isHovering ? 4 : isClicking ? 0.8 : 1,
                opacity: isHovering ? 0.15 : 1,
              }}
              transition={{ duration: 0.15 }}
              exit={{ opacity: 0, scale: 0 }}
            />

            {/* Hover flare */}
            {isHovering && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="fixed top-0 left-0 w-12 h-12 bg-primary rounded-full blur-xl mix-blend-screen"
                style={{
                  x: dotX,
                  y: dotY,
                  translateX: "-50%",
                  translateY: "-50%",
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
