"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { motion } from "motion/react"
import { Mail, Linkedin, Globe, Github, GraduationCap, MapPin, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VisitorCounter } from "@/components/visitor-counter"
import { GitHubActivity } from "@/components/github-activity"
import { RetroGrid } from "@/registry/magicui/retro-grid"
import { LandingLoader } from "@/components/landing-loader"

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 18 },
  },
}

export function HeroSection() {
  const typedName = useTypewriter("PETER SENESH FERNANDO", 80, 900)

  return (
    <>
      <LandingLoader />

      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
        {/* Retro Grid Background */}
        <div className="absolute inset-0 z-0">
          <RetroGrid
            className="h-full w-full"
            angle={65}
            cellSize={60}
            opacity={0.35}
            lightLineColor="rgba(255, 106, 0, 0.15)"
            darkLineColor="rgba(255, 106, 0, 0.25)"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        {/* 3D Background Layer */}
        <Hero3D />

        <motion.div
          className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl sm:text-5xl lg:text-[72px] font-bold tracking-tight mb-4 leading-tight text-balance min-h-[1.2em]">
              <span className="bg-linear-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-transparent">
                {typedName}
              </span>
              <span className="animate-pulse text-primary ml-1">|</span>
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl text-primary font-semibold mb-8 tracking-tight"
          >
            Information Technology Student & Developer
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-foreground-muted text-base sm:text-lg leading-relaxed mb-10 text-pretty"
          >
            Motivated IT student at Curtin University Colombo with strong skills in Python,
            data visualization, and analytical problem-solving. I build simulations, automation
            tools, and data-driven systems — and I enjoy applying logic to extract meaning from
            complex data.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="glass-card px-5 py-2.5 rounded-full flex items-center gap-2.5 border-primary/20 bg-primary/5 backdrop-blur-xl"
              >
                <stat.icon className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">{stat.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12">
            {socialLinks.map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="gap-2 bg-background/40 backdrop-blur-md border-primary/20 text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all rounded-xl px-5 py-2.5"
                  asChild
                  data-magnetic
                >
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </a>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              variant="default"
              className="gap-2 bg-primary text-white hover:bg-primary/90 transition-all rounded-xl px-8 py-6 text-base font-medium shadow-[0_0_30px_rgba(255,106,0,0.4)] hover:shadow-[0_0_50px_rgba(255,106,0,0.5)]"
              asChild
              data-magnetic
            >
              <Link href="/education">
                Explore My Journey
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 flex justify-center">
            <VisitorCounter />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 w-full max-w-md mx-auto"
          >
            <GitHubActivity />
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
