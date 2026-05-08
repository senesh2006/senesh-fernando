"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Send, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Reveal } from "@/components/reveal"

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      setSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-background">
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-8 text-foreground">
            Get In Touch
          </h1>
        </Reveal>

        <Reveal delay={100}>
          <p className="text-center text-foreground-muted mb-12">
            Open to internships, freelance work, and collaborations.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <Reveal delay={200}>
            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Send a Message
              </h2>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-foreground-muted">
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm text-foreground-muted">Your Name *</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="bg-white/5 border-primary/20 text-foreground placeholder:text-foreground-muted/30 focus:border-primary rounded-xl"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-foreground-muted">Your Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="bg-white/5 border-primary/20 text-foreground placeholder:text-foreground-muted/30 focus:border-primary rounded-xl"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-foreground-muted">Subject</label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="bg-white/5 border-primary/20 text-foreground placeholder:text-foreground-muted/30 focus:border-primary rounded-xl"
                      placeholder="Project Inquiry"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-foreground-muted">Message *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      required
                      rows={5}
                      className="bg-white/5 border-primary/20 text-foreground placeholder:text-foreground-muted/30 focus:border-primary rounded-xl resize-none"
                      placeholder="Tell me about your project or inquiry..."
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gap-2 bg-primary text-white hover:bg-primary/90 transition-all rounded-xl px-6 py-5 disabled:opacity-50 shadow-[0_0_20px_rgba(255,106,0,0.3)]"
                    data-magnetic
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Contact Info */}
          <div className="space-y-6">
            <Reveal delay={300}>
              <div className="glass-card p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Contact Info</h2>
                <div className="space-y-5">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-foreground hover:text-primary transition-colors"
                          data-magnetic
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
            </Reveal>

            <Reveal delay={400}>
              <div className="glass-card p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Connect</h2>
                <div className="flex gap-3">
                  {socialLinks.map((link, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="lg"
                      className="gap-2 bg-transparent border-primary/20 text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all rounded-xl"
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
              </div>
            </Reveal>

            {/* Availability Status */}
            <Reveal delay={500}>
              <div className="glass-card p-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping" />
                  </div>
                  <span className="text-foreground">Currently open to opportunities</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Footer */}
        <Reveal delay={600}>
          <p className="mt-20 text-center text-sm text-foreground-muted/40">
            Designed & Built by PETER SENESH FERNANDO
          </p>
        </Reveal>
      </div>
    </section>
  )
}
