"use client"

import { useEffect, useRef } from "react"

export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const spot = spotRef.current
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const fine = window.matchMedia("(pointer: fine)").matches
    const narrow = window.matchMedia("(max-width: 767px)").matches

    if (spot) {
      if (!fine) spot.style.display = "none"
      else {
        const move = (event: PointerEvent) => {
          spot.style.transform = `translate3d(${event.clientX - 280}px, ${event.clientY - 280}px, 0)`
        }
        window.addEventListener("pointermove", move, { passive: true })
        spot.dataset.bound = "1"
        ;(spot as HTMLDivElement & { __move?: (e: PointerEvent) => void }).__move = move
      }
    }

    if (!canvas || reduce) {
      return () => {
        const move = (spot as HTMLDivElement & { __move?: (e: PointerEvent) => void } | null)?.__move
        if (move) window.removeEventListener("pointermove", move)
      }
    }

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const count = narrow ? 18 : 52
    const link = !narrow
    let width = 0
    let height = 0
    let raf = 0
    const dots = Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * (narrow ? 0.28 : 0.42),
      vy: (Math.random() - 0.5) * (narrow ? 0.28 : 0.42),
      r: Math.random() * 1.5 + 0.5,
    }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, narrow ? 1.25 : 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (const dot of dots) {
        if (dot.x === 0 && dot.y === 0) {
          dot.x = Math.random() * width
          dot.y = Math.random() * height
        }
      }
    }
    resize()

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const dot of dots) {
        dot.x += dot.vx
        dot.y += dot.vy
        if (dot.x < 0 || dot.x > width) dot.vx *= -1
        if (dot.y < 0 || dot.y > height) dot.vy *= -1
        ctx.beginPath()
        ctx.fillStyle = "rgba(243, 212, 150, 0.55)"
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (link) {
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x
            const dy = dots[i].y - dots[j].y
            const dist = dx * dx + dy * dy
            if (dist < 140 * 140) {
              ctx.strokeStyle = `rgba(196, 181, 253, ${0.14 * (1 - dist / (140 * 140))})`
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(dots[i].x, dots[i].y)
              ctx.lineTo(dots[j].x, dots[j].y)
              ctx.stroke()
            }
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(draw)
    }
    window.addEventListener("resize", resize)
    document.addEventListener("visibilitychange", onVis)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVis)
      const move = (spot as HTMLDivElement & { __move?: (e: PointerEvent) => void } | null)?.__move
      if (move) window.removeEventListener("pointermove", move)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="aurora-a absolute -left-24 top-[-10%] h-[42rem] w-[42rem] rounded-full bg-[oklch(0.55_0.16_285/0.45)] blur-[90px]" />
      <div className="aurora-b absolute right-[-12%] top-[20%] h-[36rem] w-[36rem] rounded-full bg-[oklch(0.72_0.14_85/0.28)] blur-[100px]" />
      <div className="aurora-c absolute bottom-[-20%] left-[30%] h-[32rem] w-[32rem] rounded-full bg-[oklch(0.5_0.14_230/0.28)] blur-[100px]" />
      <div className="grid-plane absolute inset-x-[-10%] top-0 h-[70vh]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />
      <div
        ref={spotRef}
        className="absolute left-0 top-0 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,oklch(0.85_0.12_88/0.16),transparent_62%)] mix-blend-screen"
      />
      <div className="noise-layer absolute inset-0" />
    </div>
  )
}
