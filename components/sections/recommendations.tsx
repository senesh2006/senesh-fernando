"use client"

import { useState, useEffect } from "react"
import { Quote, Send, User, Briefcase, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

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

  const supabase = createClient()

  // Fetch recommendations on mount
  useEffect(() => {
    async function fetchRecommendations() {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching recommendations:', error)
        setError('Failed to load recommendations')
      } else {
        setRecommendations(data || [])
      }
      setIsLoading(false)
    }

    fetchRecommendations()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const { data, error } = await supabase
      .from('recommendations')
      .insert([
        {
          name: formData.name,
          role: formData.role || null,
          company: formData.company || null,
          message: formData.message,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error submitting recommendation:', error)
      setError('Failed to submit recommendation. Please try again.')
      setIsSubmitting(false)
      return
    }

    if (data) {
      setRecommendations(prev => [data, ...prev])
    }
    
    setFormData({ name: "", role: "", company: "", message: "" })
    setIsSubmitting(false)
    setSubmitted(true)
    setShowForm(false)

    // Reset submitted state after 3 seconds
    setTimeout(() => setSubmitted(false), 3000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-[#0a0705]">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-6 text-[#f5ede6] animate-fade-in-up">
          Recommendations
        </h1>
        <p className="text-center text-[rgba(245,237,230,0.6)] mb-12 max-w-2xl mx-auto animate-fade-in-up">
          What colleagues and mentors say about working with me
        </p>

        {/* Add Recommendation Button */}
        <div className="flex justify-center mb-12 animate-fade-in-up">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2 bg-[#ff6a00] text-white hover:bg-[#e55f00] transition-all rounded-xl px-6 py-5"
            data-magnetic
          >
            <Star className="h-4 w-4" />
            {showForm ? "Close Form" : "Leave a Recommendation"}
          </Button>
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
            <h2 className="text-xl font-semibold text-[#f5ede6] mb-6 flex items-center gap-2">
              <Quote className="h-5 w-5 text-[#ff6a00]" />
              Write a Recommendation
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm text-[rgba(245,237,230,0.6)] flex items-center gap-2">
                    <User className="h-4 w-4" /> Your Name *
                  </label>
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
                  <label className="text-sm text-[rgba(245,237,230,0.6)] flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Your Role
                  </label>
                  <Input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="bg-[rgba(255,255,255,0.04)] border-[rgba(255,120,20,0.2)] text-[#f5ede6] placeholder:text-[rgba(245,237,230,0.3)] focus:border-[#ff6a00] rounded-xl"
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[rgba(245,237,230,0.6)]">Company / Organization</label>
                <Input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="bg-[rgba(255,255,255,0.04)] border-[rgba(255,120,20,0.2)] text-[#f5ede6] placeholder:text-[rgba(245,237,230,0.3)] focus:border-[#ff6a00] rounded-xl"
                  placeholder="Tech Company Inc."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[rgba(245,237,230,0.6)]">Your Recommendation *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  required
                  rows={4}
                  className="bg-[rgba(255,255,255,0.04)] border-[rgba(255,120,20,0.2)] text-[#f5ede6] placeholder:text-[rgba(245,237,230,0.3)] focus:border-[#ff6a00] rounded-xl resize-none"
                  placeholder="Write your recommendation here..."
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 bg-[#ff6a00] text-white hover:bg-[#e55f00] transition-all rounded-xl px-6 py-5 disabled:opacity-50"
                data-magnetic
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Recommendation
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff6a00]" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && recommendations.length === 0 && (
          <div className="text-center py-20">
            <Quote className="h-16 w-16 text-[rgba(255,106,0,0.3)] mx-auto mb-4" />
            <p className="text-[rgba(245,237,230,0.5)]">No recommendations yet. Be the first to leave one!</p>
          </div>
        )}

        {/* Recommendations Grid */}
        {!isLoading && recommendations.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <div 
                key={rec.id}
                className="glass-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Quote className="h-8 w-8 text-[#ff6a00] mb-4 opacity-50" />
                <p className="text-[rgba(245,237,230,0.8)] leading-relaxed mb-6 italic">
                  &quot;{rec.message}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[rgba(255,106,0,0.2)] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#ff6a00] font-semibold text-lg">
                      {rec.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#f5ede6] truncate">{rec.name}</h3>
                    {(rec.role || rec.company) && (
                      <p className="text-sm text-[rgba(245,237,230,0.5)] truncate">
                        {rec.role}{rec.role && rec.company && ' at '}{rec.company}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-[rgba(245,237,230,0.4)] flex-shrink-0">
                    {formatDate(rec.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
