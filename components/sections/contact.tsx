"use client"

import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"
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
  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-[#0a0705] flex items-center">
      <div className="max-w-2xl mx-auto text-center w-full">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-8 text-[#f5ede6] animate-fade-in-up">
          Get In Touch
        </h1>

        <p className="text-[rgba(245,237,230,0.6)] mb-12 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          Open to internships, freelance work, and collaborations.
        </p>

        {/* Contact Info */}
        <div className="glass-card p-8 mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3"
              >
                <div className="p-2.5 rounded-xl bg-[rgba(255,106,0,0.1)]">
                  <item.icon className="h-5 w-5 text-[#ff6a00]" />
                </div>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-[#f5ede6] hover:text-[#ff6a00] transition-colors text-sm sm:text-base"
                    data-magnetic
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-[#f5ede6] text-sm sm:text-base">{item.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          {socialLinks.map((link, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className="gap-2 bg-transparent border-[rgba(255,120,20,0.2)] text-[#f5ede6] hover:border-[#ff6a00] hover:bg-[rgba(255,106,0,0.1)] hover:text-[#ff6a00] transition-all rounded-xl"
              asChild
              data-magnetic
            >
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                <link.icon className="h-5 w-5" />
                {link.label}
              </a>
            </Button>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-20 text-sm text-[rgba(245,237,230,0.4)] animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          Designed & Built by Peter Senesh Fernando
        </p>
      </div>
    </section>
  )
}
