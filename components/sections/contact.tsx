"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Send, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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

      if (!response.ok) throw new Error("Failed to send")

      setSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setSubmitted(false), 5000)
    } catch {
      setError("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-[#0a0705]">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-8 text-[#f5ede6] animate-fade-in-up">
          Get In Touch
        </h1>

        <p className="text-center text-[rgba(245,237,230,0.6)] mb-12 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          Open to internships, freelance work, and collaborations.
        </p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="glass-card p-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <h2 className="text-xl font-semibold text-[#f5ede6] mb-6 flex items-center gap-2">
              <Send className="h-5 w-5 text-[#ff6a00]" />
              Send a Message
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-[#f5ede6] mb-2">Message Sent!</h3>
                <p className="text-[rgba(245,237,230,0.6)]">
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm text-[rgba(245,237,230,0.6)]">Your Name *</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="bg-[rgba(255,255,255,0.04)] border-[rgba(255,120,20,0.2)] text-[#f5ede6] placeholder:text-[rgba(245,237,230,0.3)] focus:border-[#ff6a00] rounded-xl"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[rgba(245,237,230,0.6)]">Your Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="bg-[rgba(255,255,255,0.04)] border-[rgba(255,120,20,0.2)] text-[#f5ede6] placeholder:text-[rgba(245,237,230,0.3)] focus:border-[#ff6a00] rounded-xl"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[rgba(245,237,230,0.6)]">Subject</label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="bg-[rgba(255,255,255,0.04)] border-[rgba(255,120,20,0.2)] text-[#f5ede6] placeholder:text-[rgba(245,237,230,0.3)] focus:border-[#ff6a00] rounded-xl"
                    placeholder="Project Inquiry"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[rgba(245,237,230,0.6)]">Message *</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                    rows={5}
                    className="bg-[rgba(255,255,255,0.04)] border-[rgba(255,120,20,0.2)] text-[#f5ede6] placeholder:text-[rgba(245,237,230,0.3)] focus:border-[#ff6a00] rounded-xl resize-none"
                    placeholder="Tell me about your project or inquiry..."
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gap-2 bg-[#ff6a00] text-white hover:bg-[#e55f00] transition-all rounded-xl px-6 py-5 disabled:opacity-50"
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

          {/* Contact Info */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold text-[#f5ede6] mb-6">Contact Info</h2>
              <div className="space-y-5">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[rgba(255,106,0,0.1)]">
                      <item.icon className="h-5 w-5 text-[#ff6a00]" />
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-[#f5ede6] hover:text-[#ff6a00] transition-colors"
                        data-magnetic
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span className="text-[#f5ede6]">{item.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold text-[#f5ede6] mb-6">Connect</h2>
              <div className="flex gap-3">
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
            </div>

            {/* Availability Status */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping" />
                </div>
                <span className="text-[#f5ede6]">Currently open to opportunities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-20 text-center text-sm text-[rgba(245,237,230,0.4)] animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          Designed & Built by Peter Senesh Fernando
        </p>
      </div>
    </section>
  )
}
