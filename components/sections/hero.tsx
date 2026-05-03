"use client"

import { useEffect, useRef } from "react"
import { Mail, Linkedin, Globe, Github, GraduationCap, MapPin, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const socialLinks = [
  { icon: Mail, label: "Email", href: "mailto:seneshfernando55@gmail.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Globe, label: "Portfolio", href: "#" },
  { icon: Github, label: "GitHub", href: "https://github.com" },
]

const stats = [
  { icon: GraduationCap, text: "2nd Year - Curtin Colombo" },
  { icon: MapPin, text: "Gampaha, Sri Lanka" },
  { icon: Zap, text: "75 CWA" },
]

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`
        ctx.fill()
      })

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - dist / 150)})`
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }
    animate()

    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center pt-20">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
            Peter Senesh Fernando
          </h1>
          <p className="text-xl sm:text-2xl text-primary font-medium mb-6">
            Information Technology Student & Developer
          </p>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed mb-8">
            Motivated IT student at Curtin University Colombo with strong skills in Python, 
            data visualization, and analytical problem-solving. I build simulations, automation 
            tools, and data-driven systems — and I enjoy applying logic to extract meaning from 
            complex data.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card px-4 py-2 rounded-full flex items-center gap-2"
              >
                <stat.icon className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">{stat.text}</span>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-3">
            {socialLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                className="gap-2 border-border/50 hover:border-primary hover:bg-primary/10 transition-all"
                asChild
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
