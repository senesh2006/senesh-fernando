"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Bot, Sparkles, Loader2, Send, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// --- ORB COMPONENT ---

interface OrbProps {
  dimension?: string
  className?: string
  tones?: {
    base?: string
    accent1?: string
    accent2?: string
    accent3?: string
  }
  spinDuration?: number
}

const ColorOrb: React.FC<OrbProps> = ({
  dimension = "192px",
  className,
  tones,
  spinDuration = 20,
}) => {
  const fallbackTones = {
    base: "oklch(95% 0.02 264.695)",
    accent1: "oklch(75% 0.15 350)",
    accent2: "oklch(80% 0.12 200)",
    accent3: "oklch(78% 0.14 280)",
  }

  const palette = { ...fallbackTones, ...tones }
  const dimValue = parseInt(dimension.replace("px", ""), 10)
  const blurStrength = dimValue < 50 ? Math.max(dimValue * 0.008, 1) : Math.max(dimValue * 0.015, 4)
  const contrastStrength = dimValue < 50 ? Math.max(dimValue * 0.004, 1.2) : Math.max(dimValue * 0.008, 1.5)
  const pixelDot = dimValue < 50 ? Math.max(dimValue * 0.004, 0.05) : Math.max(dimValue * 0.008, 0.1)
  const shadowRange = dimValue < 50 ? Math.max(dimValue * 0.004, 0.5) : Math.max(dimValue * 0.008, 2)
  const maskRadius = dimValue < 30 ? "0%" : dimValue < 50 ? "5%" : dimValue < 100 ? "15%" : "25%"
  const adjustedContrast = dimValue < 30 ? 1.1 : dimValue < 50 ? Math.max(contrastStrength * 1.2, 1.3) : contrastStrength

  return (
    <div
      className={cn("color-orb shrink-0", className)}
      style={{
        width: dimension,
        height: dimension,
        "--base": palette.base,
        "--accent1": palette.accent1,
        "--accent2": palette.accent2,
        "--accent3": palette.accent3,
        "--spin-duration": `${spinDuration}s`,
        "--blur": `${blurStrength}px`,
        "--contrast": adjustedContrast,
        "--dot": `${pixelDot}px`,
        "--shadow": `${shadowRange}px`,
        "--mask": maskRadius,
      } as React.CSSProperties}
    >
      <style jsx>{`
        @property --angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        .color-orb {
          display: grid;
          grid-template-areas: "stack";
          overflow: hidden;
          border-radius: 50%;
          position: relative;
        }

        .color-orb::before,
        .color-orb::after {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform: translateZ(0);
        }

        .color-orb::before {
          background:
            conic-gradient(from calc(var(--angle) * 2) at 25% 70%, var(--accent3), transparent 20% 80%, var(--accent3)),
            conic-gradient(from calc(var(--angle) * 2) at 45% 75%, var(--accent2), transparent 30% 60%, var(--accent2)),
            conic-gradient(from calc(var(--angle) * -3) at 80% 20%, var(--accent1), transparent 40% 60%, var(--accent1)),
            conic-gradient(from calc(var(--angle) * 2) at 15% 5%, var(--accent2), transparent 10% 90%, var(--accent2)),
            conic-gradient(from calc(var(--angle) * 1) at 20% 80%, var(--accent1), transparent 10% 90%, var(--accent1)),
            conic-gradient(from calc(var(--angle) * -2) at 85% 10%, var(--accent3), transparent 20% 80%, var(--accent3));
          box-shadow: inset var(--base) 0 0 var(--shadow) calc(var(--shadow) * 0.2);
          filter: blur(var(--blur)) contrast(var(--contrast));
          animation: spin var(--spin-duration) linear infinite;
        }

        .color-orb::after {
          background-image: radial-gradient(circle at center, var(--base) var(--dot), transparent var(--dot));
          background-size: calc(var(--dot) * 2) calc(var(--dot) * 2);
          backdrop-filter: blur(calc(var(--blur) * 2)) contrast(calc(var(--contrast) * 2));
          mix-blend-mode: overlay;
        }

        .color-orb:not([style*="--mask: 0%"])::after {
          mask-image: radial-gradient(black var(--mask), transparent 75%);
        }

        @keyframes spin {
          to { --angle: 360deg; }
        }

        @media (prefers-reduced-motion: reduce) {
          .color-orb::before { animation: none; }
        }
      `}</style>
    </div>
  )
}

// --- CONTEXT & STATE ---

const SPEED_FACTOR = 1
const FORM_WIDTH = 380
const FORM_HEIGHT = 480

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ContextShape {
  showForm: boolean
  triggerOpen: () => void
  triggerClose: () => void
  messages: Message[]
  isLoading: boolean
  handleSend: (content?: string) => Promise<void>
}

const ChatContext = createContext({} as ContextShape)
const useChatContext = () => useContext(ChatContext)

// --- MAIN COMPONENT ---

export function ChatBot() {
  const [showForm, setShowForm] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Senesh's AI assistant. How can I help you today?" }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const triggerClose = useCallback(() => setShowForm(false), [])
  const triggerOpen = useCallback(() => setShowForm(true), [])

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return

    const newMessages = [...messages, { role: "user" as const, content }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages,
          context: { pathname }
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages([...newMessages, { role: "assistant", content: data.content }])
      } else {
        setMessages([...newMessages, { role: "assistant", content: "Error connecting to NVIDIA NIM." }])
      }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "An unexpected error occurred." }])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    function clickOutsideHandler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node) && showForm) {
        triggerClose()
      }
    }
    document.addEventListener("mousedown", clickOutsideHandler)
    return () => document.removeEventListener("mousedown", clickOutsideHandler)
  }, [showForm, triggerClose])

  const ctx = useMemo(
    () => ({ showForm, triggerOpen, triggerClose, messages, isLoading, handleSend }),
    [showForm, triggerOpen, triggerClose, messages, isLoading, handleSend]
  )

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end">
      <motion.div
        ref={wrapperRef}
        className={cn(
          "bg-background/95 backdrop-blur-md relative flex flex-col items-center overflow-hidden border shadow-2xl",
          !showForm && "hover:scale-105 transition-transform"
        )}
        initial={false}
        animate={{
          width: showForm ? FORM_WIDTH : 140,
          height: showForm ? FORM_HEIGHT : 48,
          borderRadius: showForm ? 16 : 24,
        }}
        transition={{
          type: "spring",
          stiffness: 550 / SPEED_FACTOR,
          damping: 45,
          mass: 0.7,
        }}
      >
        <ChatContext.Provider value={ctx}>
          <DockBar />
          <ChatInterface />
        </ChatContext.Provider>
      </motion.div>
    </div>
  )
}

function DockBar() {
  const { showForm, triggerOpen } = useChatContext()
  if (showForm) return null

  return (
    <button
      onClick={triggerOpen}
      className="flex h-full w-full items-center gap-2.5 px-4 font-mono text-[11px] uppercase tracking-wider text-foreground/80"
    >
      <ColorOrb dimension="20px" tones={{ base: "oklch(20% 0 0)" }} />
      <span>Ask AI</span>
      <Sparkles className="h-3 w-3 ml-auto text-amber-500" />
    </button>
  )
}

function ChatInterface() {
  const { showForm, messages, isLoading, handleSend, triggerClose } = useChatContext()
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isLoading])

  const canSummarize = (pathname.startsWith("/projects/") || pathname.startsWith("/writing/")) && messages.length < 3

  if (!showForm) return null

  return (
    <div className="flex h-full w-full flex-col p-0">
      {/* Header */}
      <div className="p-3 border-b border-border bg-secondary/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ColorOrb dimension="24px" tones={{ base: "oklch(15% 0 0)" }} />
          <span className="font-mono text-xs font-bold uppercase tracking-tight">NVIDIA NIM Assistant</span>
        </div>
        <button onClick={triggerClose} className="p-1 hover:bg-secondary rounded-md transition-colors">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-none"
      >
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[85%] px-3 py-2 rounded-lg leading-relaxed border",
              m.role === "user" 
                ? "bg-foreground text-background border-foreground" 
                : "bg-secondary/40 text-foreground border-border/50"
            )}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary/40 border border-border/50 px-3 py-2 rounded-lg flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              <span className="text-[10px] opacity-70">Computing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {canSummarize && !isLoading && (
        <div className="px-4 pb-2">
          <button
            onClick={() => handleSend(`Please summarize this ${pathname.includes("projects") ? "project" : "essay"}.`)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-secondary/50 hover:bg-secondary border border-border rounded-md text-[10px] font-mono transition-colors"
          >
            <Sparkles className="h-3 w-3 text-amber-500" />
            Summarize current page
          </button>
        </div>
      )}

      {/* Input */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(input); setInput("") }}
        className="p-3 border-t border-border flex gap-2 bg-background/50"
      >
        <input
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          className="flex-1 bg-secondary/30 border border-border rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-border transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-foreground text-background p-2 rounded-md disabled:opacity-50 transition-all hover:opacity-90"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  )
}
