"use client"

import { lazy, Suspense, useEffect, useState, type CSSProperties } from "react"

function LiquidFallback({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden
      className={`liquid-bg-fallback ${className ?? ""}`}
      style={style}
    />
  )
}

const FramerLiquidBackground = lazy(async () => {
  try {
    const module = await import(
      /* @vite-ignore */
      "https://framer.com/m/AnimatedLiquidBackground-Prod-vIhm.js@ghH1aHLmGZ0iE7qXDFVk"
    )
    return { default: module.default }
  } catch {
    return {
      default: ({ style, className }: { style?: CSSProperties; className?: string }) => (
        <LiquidFallback className={className} style={style} />
      ),
    }
  }
})

export function AnimatedLiquidBackground({
  preset = "Mist",
  speed = 28,
  className = "",
}: AnimatedLiquidBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <LiquidFallback className={className} />
  }

  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <Suspense fallback={<LiquidFallback className="absolute inset-0" />}>
        <FramerLiquidBackground
          preset={preset}
          speed={speed}
          preview={false}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
        />
      </Suspense>
    </div>
  )
}

type Preset = "Prism" | "Lava" | "Plasma" | "Pulse" | "Vortex" | "Mist"

interface AnimatedLiquidBackgroundProps {
  preset?: Preset
  speed?: number
  className?: string
}
