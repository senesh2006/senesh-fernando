"use client"

import { useEffect, useState } from "react"

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", 
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", 
  "b", "a"
]

export function EasterEgg() {
  const [sequence, setSequence] = useState<string[]>([])
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setSequence(prev => {
        const next = [...prev, e.key]
        if (next.length > KONAMI_CODE.length) {
          next.shift()
        }
        
        if (next.join(',') === KONAMI_CODE.join(',')) {
          setUnlocked(true)
        }
        return next
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!unlocked) return null

  return (
    <div className="fixed inset-0 z-[99999] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-2xl w-full bg-[#050302] border border-primary/40 p-6 rounded-lg shadow-[0_0_50px_rgba(255,106,0,0.15)] text-primary">
        <div className="flex justify-between items-center mb-6 border-b border-primary/30 pb-3">
          <span className="text-xs tracking-[0.2em] uppercase font-mono font-medium">root@senesh-os:~</span>
          <button 
            onClick={() => {
              setUnlocked(false)
              setSequence([])
            }}
            className="text-xs hover:text-white transition-colors font-mono tracking-widest"
          >
            [CLOSE]
          </button>
        </div>
        <div className="space-y-3 text-sm md:text-base font-mono">
          <p className="animate-pulse">Initiating connection to mainframe...</p>
          <p style={{ animationDelay: '500ms' }} className="animate-fade-in opacity-0">Access granted.</p>
          <p style={{ animationDelay: '1000ms' }} className="animate-fade-in opacity-0 text-white">Welcome, administrator.</p>
          <div style={{ animationDelay: '1500ms' }} className="animate-fade-in opacity-0 mt-6 space-y-2">
            <p>System Status: <span className="text-green-500">ONLINE</span></p>
            <p>Creative Engine: <span className="text-green-500">OPTIMIZED</span></p>
            <p>Coffee Levels: <span className="text-red-500">CRITICAL - REFILL REQUIRED</span></p>
            <br />
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-md">
              <p className="text-foreground-muted font-sans text-lg">
                "You found the secret! Keep building cool things."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
