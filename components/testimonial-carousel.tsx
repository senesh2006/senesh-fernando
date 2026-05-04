"use client"

import { useState, useEffect, useCallback } from "react"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Testimonial {
  id: string
  name: string
  role: string | null
  company: string | null
  message: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  autoPlayInterval?: number
}

export function TestimonialCarousel({ 
  testimonials, 
  autoPlayInterval = 5000 
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const goToNext = useCallback(() => {
    if (isAnimating || testimonials.length <= 1) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, testimonials.length])

  const goToPrev = useCallback(() => {
    if (isAnimating || testimonials.length <= 1) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, testimonials.length])

  useEffect(() => {
    if (testimonials.length <= 1) return
    const interval = setInterval(goToNext, autoPlayInterval)
    return () => clearInterval(interval)
  }, [goToNext, autoPlayInterval, testimonials.length])

  if (testimonials.length === 0) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Main testimonial */}
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <Quote className="absolute top-6 left-6 h-12 w-12 text-[#ff6a00] opacity-20" />
        
        <div
          key={currentIndex}
          className="animate-fade-in-up"
        >
          <p className="text-lg md:text-xl text-[rgba(245,237,230,0.9)] leading-relaxed mb-8 italic text-center relative z-10 px-8">
            &quot;{currentTestimonial.message}&quot;
          </p>
          
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[rgba(255,106,0,0.2)] flex items-center justify-center mb-3">
              <span className="text-[#ff6a00] font-semibold text-lg">
                {currentTestimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <h3 className="font-semibold text-[#f5ede6] text-lg">{currentTestimonial.name}</h3>
            {(currentTestimonial.role || currentTestimonial.company) && (
              <p className="text-sm text-[rgba(245,237,230,0.5)]">
                {currentTestimonial.role}{currentTestimonial.role && currentTestimonial.company && ' at '}{currentTestimonial.company}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 p-2 rounded-full bg-[rgba(255,106,0,0.2)] hover:bg-[rgba(255,106,0,0.3)] transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 text-[#ff6a00]" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 p-2 rounded-full bg-[rgba(255,106,0,0.2)] hover:bg-[rgba(255,106,0,0.3)] transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 text-[#ff6a00]" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true)
                  setCurrentIndex(index)
                  setTimeout(() => setIsAnimating(false), 500)
                }
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex
                  ? "w-6 bg-[#ff6a00]"
                  : "bg-[rgba(255,106,0,0.3)] hover:bg-[rgba(255,106,0,0.5)]"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
