"use client"

import React, { useState, useEffect, useRef } from "react"
import { MessageSquare, X, Send, Sparkles, Loader2, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi! I'm Senesh's AI assistant. How can I help you today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [canSummarize, setCanSummarize] = useState(false)
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // Check if we are on a project or blog page
    const isProject = pathname.startsWith("/projects/")
    const isBlog = pathname.startsWith("/writing/")
    setCanSummarize(isProject || isBlog)
  }, [pathname])

  const handleSend = async (content: string = input) => {
    if (!content.trim() || isLoading) return

    const newMessages = [...messages, { role: "user" as const, content }]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages,
          context: {
            pathname,
            isPageContent: content.includes("summarize") || content.includes("Summary")
          }
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages([...newMessages, { role: "assistant", content: data.content }])
      } else {
        setMessages([...newMessages, { role: "assistant", content: "Sorry, I'm having trouble connecting right now." }])
      }
    } catch (err) {
      console.error("Chat error:", err)
      setMessages([...newMessages, { role: "assistant", content: "An error occurred. Please try again later." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSummarize = () => {
    const type = pathname.startsWith("/projects/") ? "project" : "blog"
    handleSend(`Please summarize this ${type} for me.`)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[380px] h-[500px] bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center">
                <Bot className="h-5 w-5 text-background" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-none">Senesh AI</div>
                <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm scrollbar-thin scrollbar-thumb-border"
          >
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[85%] px-3 py-2 rounded-lg leading-relaxed",
                  m.role === "user" 
                    ? "bg-foreground text-background" 
                    : "bg-secondary/80 text-foreground border border-border/50"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary/80 text-foreground border border-border/50 px-3 py-2 rounded-lg flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span className="text-xs opacity-70">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {canSummarize && messages.length < 3 && !isLoading && (
            <div className="px-4 pb-2">
              <button
                onClick={handleSummarize}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-secondary/50 hover:bg-secondary border border-border rounded-md text-xs font-mono transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Summarize this {pathname.startsWith("/projects/") ? "project" : "essay"}
              </button>
            </div>
          )}

          {/* Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend() }}
            className="p-4 border-t border-border flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-secondary/50 border border-border rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-foreground text-background p-1.5 rounded-md disabled:opacity-50 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95 group",
          isOpen ? "bg-secondary text-foreground rotate-90" : "bg-foreground text-background hover:scale-110"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-rose-500 rounded-full border-2 border-background" />
          </div>
        )}
      </button>
    </div>
  )
}
