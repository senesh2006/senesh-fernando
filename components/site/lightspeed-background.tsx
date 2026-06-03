"use client"

import { lazy, Suspense, useEffect, useState, type CSSProperties } from "react"

function Fallback({ className }: { className?: string }) {
  return <div aria-hidden className={className ?? ""} />
}

const FramerLightspeed = lazy(async () => {
  try {
    const module = await import(
      /* @vite-ignore */
      "https://framer.com/m/Lightspeed-o3LM.js@LDifcJbnX2IvcgG0JuMw"
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

export function LightspeedBackground({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <Fallback className={className} />

  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <Suspense fallback={<Fallback className="absolute inset-0" />}>
        <FramerLightspeed
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
