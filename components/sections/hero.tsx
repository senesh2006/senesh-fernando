"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Mail, Linkedin, Globe, Github, GraduationCap, MapPin, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VisitorCounter } from "@/components/visitor-counter"
import { GitHubActivity } from "@/components/github-activity"

const Hero3D = dynamic(() => import("@/components/hero-3d").then(mod => mod.Hero3D), {
  ssr: false,
  loading: () => null,
})

function useTypewriter(text: string, speed: number = 100, delay: number = 500) {
  const [displayText, setDisplayText] = useState("")
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isStarted) return
    if (displayText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1))
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [displayText, text, speed, isStarted])

  return displayText
}

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
  const typedName = useTypewriter("PETER SENESH FERNANDO", 80)

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <Hero3D />
      
      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 text-center">
        <div className="animate-spring-up">
          <h1 className="text-4xl sm:text-5xl lg:text-[72px] font-bold tracking-tight mb-4 leading-tight text-balance min-h-[1.2em] bg-clip-text text-transparent bg-gradient-to-b from-[#f5ede6] to-[rgba(245,237,230,0.7)]">
            {typedName}<span className="animate-pulse text-primary ml-1">|</span>
          </h1>
          <p className="text-xl sm:text-2xl text-primary font-semibold mb-8 animate-fade-in tracking-tight" style={{ animationDelay: "1500ms", opacity: 0, animationFillMode: "forwards" }}>
            Information Technology Student & Developer
          </p>
          <p className="max-w-2xl mx-auto text-foreground-muted text-base sm:text-lg leading-relaxed mb-10 text-pretty">
            Motivated IT student at Curtin University Colombo with strong skills in Python, 
            data visualization, and analytical problem-solving. I build simulations, automation 
            tools, and data-driven systems — and I enjoy applying logic to extract meaning from 
            complex data.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card px-5 py-2.5 rounded-full flex items-center gap-2.5 border-primary/20 bg-primary/5"
              >
                <stat.icon className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">{stat.text}</span>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {socialLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                className="gap-2 bg-transparent border-primary/20 text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all rounded-xl px-5 py-2.5"
                asChild
                data-magnetic
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </a>
              </Button>
            ))}
          </div>

          {/* Explore Button */}
          <Button
            variant="default"
            className="gap-2 bg-primary text-white hover:bg-primary/90 transition-all rounded-xl px-8 py-6 text-base font-medium shadow-[0_0_20px_rgba(255,106,0,0.3)]"
            asChild
            data-magnetic
          >
            <Link href="/education">
              Explore My Journey
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>

          {/* Visitor Counter */}
          <div className="mt-12 flex justify-center">
            <VisitorCounter />
          </div>
        </div>

        {/* GitHub Activity Widget */}
        <div className="mt-12 w-full max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <GitHubActivity />
        </div>
      </div>
    </section>
  )
}
