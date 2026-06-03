"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CodeTabsProps {
  codes: Record<string, string>
  lang?: string
  defaultValue?: string
  className?: string
}

export function CodeTabs({ codes, lang, defaultValue, className }: CodeTabsProps) {
  const tabs = React.useMemo(() => Object.keys(codes), [codes])
  const [active, setActive] = React.useState(defaultValue ?? tabs[0])
  const [copied, setCopied] = React.useState(false)

  // Keep the active tab valid when the set of codes changes.
  React.useEffect(() => {
    if (!tabs.includes(active)) setActive(tabs[0])
  }, [tabs, active])

  const current = codes[active] ?? ""
  const lines = current.split("\n")

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(current)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-background/80 backdrop-blur overflow-hidden font-mono text-xs",
        className
      )}
    >
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/30">
        <div className="flex items-center overflow-x-auto">
          {tabs.map((tab: string) => {
            const isActive = tab === active
            return (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={cn(
                  "relative px-3.5 py-2 whitespace-nowrap transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
                {isActive && (
                  <motion.span
                    layoutId="code-tabs-underline"
                    className="absolute left-2 right-2 -bottom-px h-px bg-foreground"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2 pr-3 pl-2 shrink-0">
          {lang && (
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:inline">
              {lang}
            </span>
          )}
          <button
            onClick={copy}
            className="flex items-center gap-1 px-1.5 py-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Code body */}
      <div className="relative max-h-[460px] overflow-auto">
        <pre className="flex text-[12.5px] leading-[1.7]">
          <code className="select-none text-right text-muted-foreground/50 px-3 py-3 border-r border-border/60 sticky left-0 bg-background/80 backdrop-blur">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </code>
          <code className="px-4 py-3 text-foreground/90 whitespace-pre">{current}</code>
        </pre>
      </div>
    </div>
  )
}
