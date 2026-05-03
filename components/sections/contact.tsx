"use client"

import { useRef } from "react"
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const contactInfo = [
  { icon: Mail, label: "seneshfernando55@gmail.com", href: "mailto:seneshfernando55@gmail.com" },
  { icon: Phone, label: "076 523 6834", href: "tel:+94765236834" },
  { icon: MapPin, label: "Gampaha, Negombo, Sri Lanka", href: null },
]

const socialLinks = [
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Globe, label: "Portfolio", href: "#" },
]

export function ContactSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })

  return (
    <section id="contact" ref={ref} className="py-24 px-4 sm:px-6 bg-secondary/20">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className={cn(
          "text-3xl sm:text-4xl font-bold mb-8 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Get In Touch
        </h2>

        <p className={cn(
          "text-muted-foreground mb-12 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )} style={{ transitionDelay: "100ms" }}>
          Open to internships, freelance work, and collaborations.
        </p>

        {/* Contact Info */}
        <div className={cn(
          "glass-card rounded-xl p-8 mb-8 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )} style={{ transitionDelay: "200ms" }}>
          <div className="flex flex-col gap-4">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-3"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-foreground">{item.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className={cn(
          "flex justify-center gap-4 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )} style={{ transitionDelay: "300ms" }}>
          {socialLinks.map((link, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className="gap-2 border-border/50 hover:border-primary hover:bg-primary/10 transition-all"
              asChild
            >
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                <link.icon className="h-5 w-5" />
                {link.label}
              </a>
            </Button>
          ))}
        </div>

        {/* Footer */}
        <p className={cn(
          "mt-16 text-sm text-muted-foreground transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )} style={{ transitionDelay: "400ms" }}>
          Designed & Built by Peter Senesh Fernando
        </p>
      </div>
    </section>
  )
}
