"use client"

import type { ReactNode } from "react"
import { AnimatedLiquidBackground } from "@/components/site/animated-liquid-background"

export function ProjectDetailShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-20">
        <AnimatedLiquidBackground preset="Mist" speed={32} className="h-full w-full" />
        <div className="absolute inset-0 bg-background/55 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--background)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-3 sm:px-6 py-8 sm:py-12">
        <div className="project-inner-panel rounded-xl border border-border/80 bg-background/72 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="border-b border-border/70 px-5 sm:px-8 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            // project.case_study · inner.view
          </div>
          <div className="px-1 sm:px-2 pb-2">{children}</div>
        </div>
      </div>
    </div>
  )
}
