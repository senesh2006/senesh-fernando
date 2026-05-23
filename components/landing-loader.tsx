"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/registry/magicui/terminal"

const LOADER_KEY = "portfolio-loader-seen"

export function LandingLoader() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const seen = sessionStorage.getItem(LOADER_KEY)
    if (!seen) {
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    if (!visible) return

    const timer = setTimeout(() => {
      sessionStorage.setItem(LOADER_KEY, "true")
      setVisible(false)
    }, 8500)

    return () => clearTimeout(timer)
  }, [visible])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 backdrop-blur-xl"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,106,0,0.08)_0%,transparent_60%)]" />

          <motion.div
            className="relative w-full max-w-2xl px-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
          >
            <Terminal className="max-h-[70vh] overflow-hidden border-primary/20 shadow-[0_0_60px_rgba(255,106,0,0.15)]">
              <TypingAnimation>&gt; pnpm dlx shadcn@latest init</TypingAnimation>

              <AnimatedSpan className="text-green-500">
                ✔ Preflight checks.
              </AnimatedSpan>

              <AnimatedSpan className="text-green-500">
                ✔ Verifying framework. Found Next.js.
              </AnimatedSpan>

              <AnimatedSpan className="text-green-500">
                ✔ Validating Tailwind CSS.
              </AnimatedSpan>

              <AnimatedSpan className="text-green-500">
                ✔ Validating import alias.
              </AnimatedSpan>

              <AnimatedSpan className="text-green-500">
                ✔ Writing components.json.
              </AnimatedSpan>

              <AnimatedSpan className="text-green-500">
                ✔ Checking registry.
              </AnimatedSpan>

              <AnimatedSpan className="text-green-500">
                ✔ Updating tailwind.config.ts
              </AnimatedSpan>

              <AnimatedSpan className="text-green-500">
                ✔ Updating app/globals.css
              </AnimatedSpan>

              <AnimatedSpan className="text-green-500">
                ✔ Installing dependencies.
              </AnimatedSpan>

              <AnimatedSpan className="text-blue-500">
                <span>ℹ Updated 1 file:</span>
                <span className="pl-2">- lib/utils.ts</span>
              </AnimatedSpan>

              <TypingAnimation className="text-muted-foreground">
                Success! Project initialization completed.
              </TypingAnimation>

              <TypingAnimation className="text-muted-foreground">
                You may now add components.
              </TypingAnimation>
            </Terminal>

            <motion.p
              className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-foreground-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Loading portfolio
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
