"use client"

import { useState, useEffect } from "react"
import { Quote, Send, User, Briefcase, Star, Loader2, LayoutGrid, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { SectionHeader } from "@/components/editorial/section-header"

interface Recommendation {
  id: string
  name: string
  role: string | null
  company: string | null
  message: string
  created_at: string
}

export function RecommendationsSection() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel")

  // Fetch recommendations from API
  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch("/api/recommendations")
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        setRecommendations(data)
      } catch (e) {
        console.error("Failed to load recommendations:", e)
        setError("Failed to load recommendations")
      } finally {
        setIsLoading(false)
      }
    }
    fetchRecommendations()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to submit")

      const newRec = await response.json()
      setRecommendations(prev => [newRec, ...prev])
      setFormData({ name: "", role: "", company: "", message: "" })
      setSubmitted(true)
      setShowForm(false)

      setTimeout(() => setSubmitted(false), 3000)
    } catch (e) {
      console.error("Failed to submit recommendation:", e)
      setError("Failed to submit. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  return (
    <section id="recommendations">
      <div className="container">
        <SectionHeader
          num="09"
          title="Recommendations"
          description="What colleagues and mentors say about working with me."
        />

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2 rounded-sm px-6"
            data-magnetic
          >
            <Star className="h-4 w-4" />
            {showForm ? "Close Form" : "Leave a Recommendation"}
          </Button>
          
          {recommendations.length > 0 && (
            <div className="flex gap-2 p-1 glass-card rounded-xl">
              <Button
                variant="ghost"
                onClick={() => setViewMode("carousel")}
                className={`gap-2 rounded-lg px-4 ${viewMode === "carousel" ? "bg-primary/10 text-primary" : "text-foreground"}`}
              >
                <Play className="h-4 w-4" />
                Carousel
              </Button>
              <Button
                variant="ghost"
                onClick={() => setViewMode("grid")}
                className={`gap-2 rounded-lg px-4 ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-foreground"}`}
              >
                <LayoutGrid className="h-4 w-4" />
                Grid
              </Button>
            </div>
          )}
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mb-8 p-4 rounded-xl bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] text-center animate-fade-in-up">
            <p className="text-green-400">Thank you for your recommendation!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-center animate-fade-in-up">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Recommendation Form */}
        {showForm && (
          <div className="mb-12 glass-card p-8 animate-scale-in">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Quote className="h-5 w-5 text-primary" />
              Write a Recommendation
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm text-foreground-muted flex items-center gap-2">
                    <User className="h-4 w-4" /> Your Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="bg-background border-border text-foreground placeholder:text-foreground-muted/50 focus:border-primary rounded-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-foreground-muted flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Your Role
                  </label>
                  <Input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="bg-background border-border text-foreground placeholder:text-foreground-muted/50 focus:border-primary rounded-sm"
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted">Company / Organization</label>
                <Input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="bg-background border-border text-foreground placeholder:text-foreground-muted/50 focus:border-primary rounded-sm"
                  placeholder="Tech Company Inc."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground-muted">Your Recommendation *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  required
                  rows={4}
                  className="bg-background border-border text-foreground placeholder:text-foreground-muted/50 focus:border-primary rounded-sm resize-none"
                  placeholder="Write your recommendation here..."
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 rounded-sm px-6 disabled:opacity-50"
                data-magnetic
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? "Submitting..." : "Submit Recommendation"}
              </Button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && recommendations.length === 0 && (
          <div className="text-center py-16 animate-fade-in-up">
            <Quote className="h-16 w-16 text-[rgba(255,106,0,0.3)] mx-auto mb-4" />
            <p className="text-foreground-muted">No recommendations yet. Be the first to leave one!</p>
          </div>
        )}

        {/* Testimonials Display */}
        {!isLoading && recommendations.length > 0 && (
          <>
            {viewMode === "carousel" ? (
              <TestimonialCarousel testimonials={recommendations} autoPlayInterval={5000} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.map((rec, index) => (
                  <div 
                    key={rec.id}
                    className="glass-card p-6 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Quote className="h-8 w-8 text-primary mb-4 opacity-50" />
                    <p className="text-foreground-muted/70 leading-relaxed mb-6 italic">
                      &quot;{rec.message}&quot;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[rgba(255,106,0,0.2)] flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-lg">
                          {rec.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground truncate">{rec.name}</h3>
                        {(rec.role || rec.company) && (
                          <p className="text-sm text-foreground-muted truncate">
                            {rec.role}{rec.role && rec.company && ' at '}{rec.company}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-foreground-muted/50 flex-shrink-0">
                        {formatDate(rec.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
