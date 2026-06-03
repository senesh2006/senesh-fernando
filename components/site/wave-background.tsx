"use client"

import { lazy, Suspense, useEffect, useState, type CSSProperties } from "react"

function Fallback({ className }: { className?: string }) {
  return <div aria-hidden className={className ?? ""} />
}

const FramerWave = lazy(async () => {
  try {
    const module = await import(
      /* @vite-ignore */
      "https://framer.com/m/Wave-background-3NRXn0.js@skIhUvPOnWZO6VqOuTYq"
    )
    return { default: module.default }
  } catch {
    return {
      default: ({ style, className }: { style?: CSSProperties; className?: string }) => (
        <Fallback className={className} />
      ),
    }
  }
})

export function WaveBackground({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <Fallback className={className} />

  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <Suspense fallback={<Fallback className="absolute inset-0" />}>
        <FramerWave
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
