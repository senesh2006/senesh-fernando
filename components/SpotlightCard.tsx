"use client"

import { useRef, type ReactNode, type MouseEvent } from "react"
import { useTheme } from "next-themes"
import "./SpotlightCard.css"

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor: propSpotlightColor,
}: SpotlightCardProps) {
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || theme
  const isDark = currentTheme === "dark"

  const defaultSpotlightColor = isDark
    ? "rgba(212, 168, 83, 0.2)"
    : "rgba(59, 130, 246, 0.1)"
  
  const spotlightColor = propSpotlightColor || defaultSpotlightColor
  const divRef = useRef<HTMLDivElement>(null)
// ...

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    divRef.current.style.setProperty("--mouse-x", `${x}px`)
    divRef.current.style.setProperty("--mouse-y", `${y}px`)
    divRef.current.style.setProperty("--spotlight-color", spotlightColor)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`card-spotlight ${className}`.trim()}
    >
      <div className="card-spotlight__content">{children}</div>
    </div>
  )
}
