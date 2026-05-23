"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
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
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = ""
      return
    }

    document.body.style.overflow = "hidden"

    const timer = setTimeout(() => {
      sessionStorage.setItem(LOADER_KEY, "true")
      setVisible(false)
    }, 10000)

    return () => clearTimeout(timer)
  }, [visible])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-background/98 px-4 py-8 backdrop-blur-xl sm:py-12"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,106,0,0.1)_0%,transparent_65%)]" />

          <motion.div
            className="relative my-auto w-full max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
          >
            <Terminal
              startOnView={false}
              className="!max-h-none min-h-[min(640px,78vh)] w-full max-w-none border-primary/25 shadow-[0_0_80px_rgba(255,106,0,0.2)] [&_pre]:max-h-[min(560px,68vh)] [&_pre]:overflow-y-auto [&_code]:text-sm sm:[&_code]:text-base"
            >
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
    </AnimatePresence>,
    document.body
  )
}
