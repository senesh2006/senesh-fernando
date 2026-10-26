"use client"

import { useEffect, useRef, useState } from "react"

export function PremiumCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduce) return
    setOn(true)
    document.documentElement.classList.add("has-cursor")

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let scale = 1
    let raf = 0

    const move = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      const target = event.target as HTMLElement | null
      const hot = !!target?.closest("a, button, summary, input, textarea, select")
      scale = hot ? 1.7 : 1
    }
    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`
      }
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener("pointermove", move, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", move)
      document.documentElement.classList.remove("has-cursor")
    }
  }, [])

  if (!on) return null

  return (
    <>
      <div ref={dotRef} aria-hidden className="cursor-dot" />
      <div ref={ringRef} aria-hidden className="cursor-ring" />
    </>
  )
}
