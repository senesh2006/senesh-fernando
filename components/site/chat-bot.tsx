"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react"
import { motion } from "motion/react"
import { Bot, Sparkles, Loader2, Send, X, Mic, MicOff } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  useConversation 
} from "@elevenlabs/react"
import { useAssemblyAIVoice } from "@/hooks/use-assemblyai-voice"

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
  handleSend: (content: string) => Promise<void>
  conversation: any // ElevenLabs
  assemblyVoice: any // AssemblyAI
  voiceProvider: "elevenlabs" | "assemblyai"
  setVoiceProvider: (p: "elevenlabs" | "assemblyai") => void
  agentId: string
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
  const [voiceProvider, setVoiceProvider] = useState<"elevenlabs" | "assemblyai">("elevenlabs")
  const pathname = usePathname()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || ""

  // Initialize ElevenLabs Conversation
  const conversation = useConversation({
    onMessage: (msg) => {
      setMessages((prev) => [
        ...prev, 
        { role: msg.source === "user" ? "user" : "assistant", content: msg.message }
      ])
    },
    onError: (err) => {
      console.error("ElevenLabs Error Details:", err)
      const message = typeof err === 'string' ? err : err.message || "Failed to connect to voice agent."
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `ElevenLabs Error: ${message}. Switching to fallback...` }
      ])
      setVoiceProvider("assemblyai")
    },
  })

  // Initialize AssemblyAI Voice Agent
  const assemblyVoice = useAssemblyAIVoice({
    onMessage: (msg) => {
      setMessages((prev) => [...prev, msg])
    },
    onError: (err) => {
      console.error("AssemblyAI Error:", err)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `AssemblyAI Error: ${err}.` }
      ])
    }
  })

  const triggerClose = useCallback(() => {
    setShowForm(false)
    if (conversation.status === "connected") conversation.endSession()
    if (assemblyVoice.status === "active") assemblyVoice.stopSession()
  }, [conversation, assemblyVoice])

  const triggerOpen = useCallback(() => setShowForm(true), [])

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return

    // If voice session is active, send via active provider
    if (voiceProvider === "elevenlabs" && conversation.status === "connected") {
      try {
        await conversation.sendUserMessage(content)
        return
      } catch (err) {
        console.error("Failed to send message to ElevenLabs:", err)
      }
    } else if (voiceProvider === "assemblyai" && assemblyVoice.status === "active") {
      assemblyVoice.sendText(content)
      return
    }

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
        setMessages([...newMessages, { role: "assistant", content: "Error connecting to AI." }])
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
    () => ({ 
      showForm, triggerOpen, triggerClose, messages, isLoading, handleSend, 
      conversation, assemblyVoice, voiceProvider, setVoiceProvider, agentId 
    }),
    [showForm, triggerOpen, triggerClose, messages, isLoading, handleSend, conversation, assemblyVoice, voiceProvider, agentId]
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
  const { 
    showForm, messages, isLoading, handleSend, triggerClose, 
    conversation, assemblyVoice, voiceProvider, setVoiceProvider, agentId 
  } = useChatContext()
  
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Computed voice state based on provider
  const isVoiceActive = voiceProvider === "elevenlabs" 
    ? conversation.status === "connected" 
    : assemblyVoice.status === "active"
  
  const isVoiceConnecting = voiceProvider === "elevenlabs"
    ? conversation.status === "connecting"
    : assemblyVoice.status === "connecting"

  const isSpeaking = voiceProvider === "elevenlabs"
    ? conversation.isSpeaking
    : assemblyVoice.isSpeaking

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isLoading])

  const canSummarize = (pathname.startsWith("/projects/") || pathname.startsWith("/writing/")) && messages.length < 3

  const toggleVoice = async () => {
    if (isVoiceActive) {
      if (voiceProvider === "elevenlabs") await conversation.endSession()
      else assemblyVoice.stopSession()
    } else {
      if (voiceProvider === "elevenlabs") {
        if (!agentId) {
          handleSend("ElevenLabs Agent ID missing. Swapping to AssemblyAI Voice Agent...")
          setVoiceProvider("assemblyai")
          return
        }
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true })
          await conversation.startSession({ agentId })
        } catch (err: any) {
          console.error("ElevenLabs failed, falling back:", err)
          setVoiceProvider("assemblyai")
        }
      } else {
        await assemblyVoice.startSession()
      }
    }
  }

  if (!showForm) return null

  return (
    <div className="flex h-full w-full flex-col p-0 relative">
      {/* Header */}
      <div className="p-3 border-b border-border bg-secondary/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ColorOrb dimension="24px" tones={{ base: "oklch(15% 0 0)" }} spinDuration={isSpeaking ? 2 : 20} />
          <span className="font-mono text-xs font-bold uppercase tracking-tight">
            {voiceProvider === "assemblyai" ? "AssemblyAI Voice" : "Senesh AI"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* Provider Toggle */}
          {!isVoiceActive && !isVoiceConnecting && (
            <button 
              onClick={() => setVoiceProvider(voiceProvider === "elevenlabs" ? "assemblyai" : "elevenlabs")}
              className="text-[9px] font-mono px-1.5 py-0.5 border border-border rounded bg-background hover:bg-secondary transition-colors"
            >
              {voiceProvider === "elevenlabs" ? "SWAP TO AAI" : "SWAP TO 11LABS"}
            </button>
          )}
          
          <button 
            onClick={toggleVoice}
            className={cn(
              "p-1 hover:bg-secondary rounded-md transition-colors flex items-center gap-1.5 px-2",
              isVoiceActive ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:text-foreground"
            )}
            title={isVoiceActive ? "End Voice Session" : "Start Voice Session"}
          >
            {isVoiceActive ? (
              <>
                <div className="flex gap-0.5 items-center">
                  <span className="w-0.5 h-2 bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-0.5 h-3 bg-current animate-bounce" style={{ animationDelay: "100ms" }} />
                  <span className="w-0.5 h-2 bg-current animate-bounce" style={{ animationDelay: "200ms" }} />
                </div>
                <span className="text-[10px] font-bold">LIVE</span>
              </>
            ) : isVoiceConnecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>
          <button onClick={triggerClose} className="p-1 hover:bg-secondary rounded-md transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-none"
      >
        {isVoiceActive && (
          <div className="flex justify-center mb-4">
            <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-[10px] font-mono animate-pulse">
              Voice Session Active: Start Talking!
            </div>
          </div>
        )}
        {!isVoiceActive && messages.length > 1 && (
          <div className="flex justify-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleVoice} 
              className="text-[10px] h-7 px-3 font-mono uppercase tracking-tighter"
            >
              <Mic className="h-3 w-3 mr-1.5" /> Join {voiceProvider === "assemblyai" ? "AssemblyAI" : "ElevenLabs"} Voice
            </Button>
          </div>
        )}
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
      {canSummarize && !isLoading && !isVoiceActive && (
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
          placeholder={isVoiceActive ? "Talk or type here..." : "Type message..."}
          disabled={isLoading}
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
