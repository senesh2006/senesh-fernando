"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Mail, Linkedin, Github, GraduationCap, MapPin, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VisitorCounter } from "@/components/visitor-counter"
import { GitHubActivity } from "@/components/github-activity"
import { LandingLoader } from "@/components/landing-loader"

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
  { icon: Github, label: "GitHub", href: "https://github.com/senesh2006" },
]

const stats = [
  { icon: GraduationCap, text: "2nd Year — Curtin Colombo" },
  { icon: MapPin, text: "Gampaha, Sri Lanka" },
  { icon: Zap, text: "75 CWA" },
]

export function HeroSection() {
  const typedName = useTypewriter("PETER SENESH FERNANDO", 80, 900)

  return (
    <>
      <LandingLoader />

      <section id="about" className="editorial-hero min-h-[calc(100vh-4rem)] flex items-center border-b border-paper-3">
        <div className="editorial-hero-inner max-w-[860px] mx-auto px-4 sm:px-8 py-16 sm:py-24 w-full">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="editorial-kicker mb-8"
          >
            <span className="editorial-kicker-line" />
            Portfolio · IT Student & Developer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="font-serif text-[clamp(2.4rem,7vw,4.5rem)] leading-[1.08] font-normal tracking-tight text-foreground mb-6"
          >
            {typedName}
            <span className="text-primary italic">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-foreground-muted max-w-xl leading-relaxed mb-10 font-light"
          >
            Information Technology student building simulations, automation tools, and
            data-driven systems — applying logic to extract meaning from complex data.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            {stats.map((stat) => (
              <span key={stat.text} className="editorial-badge editorial-badge-muted">
                <stat.icon className="h-3.5 w-3.5 opacity-70" />
                {stat.text}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            {socialLinks.map((link) => (
              <Button
                key={link.label}
                variant="outline"
                className="gap-2 rounded-sm border-border bg-background text-foreground hover:border-primary hover:text-primary font-mono text-xs"
                asChild
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </a>
              </Button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="flex flex-wrap items-center gap-6"
          >
            <Button
              className="gap-2 rounded-sm bg-foreground text-background hover:bg-foreground/90 font-mono text-xs tracking-wide px-6"
              asChild
            >
              <Link href="/projects">
                View projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <VisitorCounter />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-14 max-w-md"
          >
            <GitHubActivity />
          </motion.div>
        </div>
      </section>
    </>
  )
}
