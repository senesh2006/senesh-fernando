"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number
}

interface FireParticlesProps {
  /** Number of particles spawned per frame */
  intensity?: number
  className?: string
}

export function FireParticles({ intensity = 4, className = "" }: FireParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf: number
    const particles: Particle[] = []

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    function spawn() {
      if (!canvas) return
      for (let i = 0; i < intensity; i++) {
        const x = Math.random() * canvas.width
        const maxLife = 60 + Math.random() * 80
        particles.push({
          x,
          y: canvas.height + 4,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(1.2 + Math.random() * 2.0),
          life: maxLife,
          maxLife,
          size: 2 + Math.random() * 4,
          hue: 10 + Math.random() * 30, // orange-red band
        })
      }
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      spawn()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        const t = p.life / p.maxLife // 1 → 0 as particle ages

        // drift vx slightly for flickering
        p.vx += (Math.random() - 0.5) * 0.12
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.015 // accelerate upward
        p.life--

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        // color: white-yellow core → orange → red → transparent
        const alpha = t * 0.55
        const lightness = 40 + t * 50
        const sat = 90 + t * 10
        const size = p.size * (0.4 + t * 0.6)

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 2.5)
        grad.addColorStop(0, `hsla(${p.hue + t * 30}, ${sat}%, ${lightness + 20}%, ${alpha})`)
        grad.addColorStop(0.5, `hsla(${p.hue}, ${sat}%, ${lightness}%, ${alpha * 0.6})`)
        grad.addColorStop(1, `hsla(${p.hue - 5}, ${sat}%, 20%, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  )
}
