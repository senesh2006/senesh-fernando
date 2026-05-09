"use client"

import { Reveal } from "@/components/reveal"
import { Terminal, Code2, Cpu, Globe } from "lucide-react"

const tilEntries = [
  {
    title: "Optimizing Magnetic Blob Cursors",
    date: "May 9, 2026",
    category: "Frontend",
    icon: Globe,
    content: "Used requestAnimationFrame with custom spring physics to ensure the cursor stays locked at 60fps even during complex DOM mutations. Implemented a counter-rotation transform on nested text elements to maintain readability during cursor stretching.",
    tags: ["React", "CSS", "Performance"]
  },
  {
    title: "Web Audio API for UI SFX",
    date: "May 8, 2026",
    category: "UX",
    icon: Terminal,
    content: "Discovered that synthesizing sounds using OscillatorNode is much more efficient than loading .mp3 assets for short interface 'blips'. It allows for dynamic frequency adjustments (exponentialRampToValueAtTime) to create a more organic feel.",
    tags: ["Web Audio API", "JavaScript"]
  },
  {
    title: "C Pointers & Memory Management",
    date: "May 5, 2026",
    category: "System Programming",
    icon: Cpu,
    content: "Spent 4 hours debugging a segmentation fault in my Bee Simulation project. Realized the importance of initializing pointers to NULL and checking for allocation success before dereferencing in complex struct arrays.",
    tags: ["C", "Low Level", "Debugging"]
  },
  {
    title: "Next.js 15+ Font Optimization",
    date: "May 3, 2026",
    category: "Next.js",
    icon: Code2,
    content: "Local fonts in Next.js should always use the 'variable' property to avoid layout shifts. Paired OffBit with Geist fallback to ensure a smooth loading experience on slow connections.",
    tags: ["Next.js", "Performance", "Fonts"]
  }
]

export function TILSection() {
  return (
    <section className="min-h-screen px-4 sm:px-6 py-20 bg-background">
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <div className="flex flex-col items-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-4 text-foreground">
              Today I Learned
            </h1>
            <p className="text-foreground-muted text-center max-w-2xl">
              Small snippets of code, technical hurdles overcome, and daily discoveries in my journey as a developer.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tilEntries.map((entry, index) => (
            <Reveal key={index} delay={index * 100}>
              <div className="glass-card p-6 h-full flex flex-col glass-card-hover group">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <entry.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-medium block mb-1">
                        {entry.category}
                      </span>
                      <h2 className="text-lg font-semibold text-foreground leading-tight">
                        {entry.title}
                      </h2>
                    </div>
                  </div>
                  <span className="text-[10px] text-foreground-muted font-mono whitespace-nowrap">
                    {entry.date}
                  </span>
                </div>

                <p className="text-sm text-foreground-muted leading-relaxed mb-6 flex-1">
                  {entry.content}
                </p>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-border/30">
                  {entry.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="text-[9px] px-2 py-0.5 rounded-md bg-white/5 text-foreground-muted border border-border/50 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={500}>
          <div className="mt-20 p-8 glass-card border-dashed border-primary/30 flex flex-col items-center text-center">
            <h3 className="text-xl font-medium text-foreground mb-4">Have a technical question?</h3>
            <p className="text-foreground-muted text-sm mb-6 max-w-md">
              I'm always happy to discuss these topics or collaborate on projects involving these technologies.
            </p>
            <a 
              href="/contact" 
              className="px-6 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all glow-orange"
              data-magnetic
            >
              Get in touch
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
