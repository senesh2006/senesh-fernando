"use client"

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
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <Hero3D />
      
      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-semibold tracking-tight text-[#f5ede6] mb-4 leading-tight text-balance">
            Peter Senesh Fernando
          </h1>
          <p className="text-xl sm:text-2xl text-[#ff6a00] font-medium mb-8">
            Information Technology Student & Developer
          </p>
          <p className="max-w-2xl mx-auto text-[rgba(245,237,230,0.6)] text-base sm:text-lg leading-relaxed mb-10 text-pretty">
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
                className="glass-card px-5 py-2.5 rounded-full flex items-center gap-2.5"
              >
                <stat.icon className="h-4 w-4 text-[#ff6a00]" />
                <span className="text-sm text-[#f5ede6]">{stat.text}</span>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {socialLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                className="gap-2 bg-transparent border-[rgba(255,120,20,0.2)] text-[#f5ede6] hover:border-[#ff6a00] hover:bg-[rgba(255,106,0,0.1)] hover:text-[#ff6a00] transition-all rounded-xl px-5 py-2.5"
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
            className="gap-2 bg-[#ff6a00] text-white hover:bg-[#e55f00] transition-all rounded-xl px-8 py-6 text-base font-medium"
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
