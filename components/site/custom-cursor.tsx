"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion"

export function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 250, mass: 0.5 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

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
        target.classList.contains('cursor-pointer')
      
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
            {/* Outer ring */}
            <motion.div
              className="fixed top-0 left-0 w-8 h-8 border border-primary rounded-full mix-blend-difference"
              style={{
                x: cursorX,
                y: cursorY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                scale: isHovering ? 1.5 : isClicking ? 0.8 : 1,
                opacity: 0.5,
              }}
              exit={{ opacity: 0, scale: 0 }}
            />
            {/* Inner dot */}
            <motion.div
              className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full mix-blend-difference"
              style={{
                x: mouseX,
                y: mouseY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                scale: isHovering ? 0 : isClicking ? 2 : 1,
              }}
              exit={{ opacity: 0, scale: 0 }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
