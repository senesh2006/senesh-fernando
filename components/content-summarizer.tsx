"use client"

import React, { useState } from "react"
import { Sparkles, X, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { ShiningText } from "@/components/shining-text"
import { cn } from "@/lib/utils"

interface SummarizerProps {
  id: string
  type: "projects" | "writing"
  className?: string
}

export function ContentSummarizer({ id, type, className }: SummarizerProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSummarize = async () => {
    if (summary) {
      setIsOpen(!isOpen)
      return
    }

    setIsLoading(true)
    setIsOpen(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Please summarize this ${type === "projects" ? "project" : "essay"}.` }],
          context: { pathname: `/${type}/${id}` }
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setSummary(data.content)
      } else {
        setSummary("Failed to generate summary. Please try again.")
      }
    } catch (err) {
      setSummary("An error occurred while summarizing.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <button
        onClick={handleSummarize}
        disabled={isLoading}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono text-[11px] uppercase tracking-wider transition-all duration-300",
          summary 
            ? "text-amber-500 border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10" 
            : "text-muted-foreground border border-border hover:text-foreground hover:border-foreground"
        )}
      >
        <motion.span
          animate={isLoading ? { rotate: 360, scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }}
          transition={isLoading ? { rotate: { duration: 1.2, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity } } : { duration: 0.3 }}
        >
          <Sparkles className={cn("h-3.5 w-3.5", summary && "fill-current")} />
        </motion.span>
        {isLoading ? "Analyzing content..." : summary ? (isOpen ? "Hide Summary" : "Show AI Summary") : "AI Summarize"}
        {summary && (
          isOpen ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4"
          >
            <div className="p-5 rounded-md border border-amber-500/20 bg-amber-500/[0.02] backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <Sparkles className="h-12 w-12 text-amber-500/10 rotate-12" />
              </div>
              
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-500/60 mb-3 flex items-center gap-2">
                <span className="h-px w-4 bg-amber-500/30" />
                AI-Generated insights
              </div>

              {isLoading ? (
                <div className="py-4">
                  <ShiningText text="Synthesizing key highlights and architectural patterns..." className="text-sm" />
                </div>
              ) : (
                <div className="prose-summary prose-invert max-w-none">
                  <motion.div
                    className="text-sm text-foreground/90 leading-relaxed"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.015 } },
                    }}
                  >
                    {(summary ?? "").split(/(\s+)/).map((word, i) => (
                      <motion.span
                        key={i}
                        variants={{
                          hidden: { opacity: 0, filter: "blur(4px)", y: 4 },
                          visible: { opacity: 1, filter: "blur(0px)", y: 0 },
                        }}
                        transition={{ duration: 0.25 }}
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
