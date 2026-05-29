"use client"

import * as React from "react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"

export function ShiningText({ text, className }: { text: string; className?: string }) {
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || theme
  const isDark = currentTheme === "dark"

  const gradient = isDark
    ? "linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)"
    : "linear-gradient(110deg,#a1a1aa,35%,#18181b,50%,#a1a1aa,75%,#a1a1aa)"

  return (
    <motion.div
      className={`bg-clip-text font-regular text-transparent ${className}`}
      style={{
        backgroundImage: gradient,
        backgroundSize: "200% 100%"
      }}
      initial={{ backgroundPosition: "200% 0" }}
// ...
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
    >
      {text}
    </motion.div>
  )
}
