"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"
import { Menu, X, Moon, Sun } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChatBot } from "@/components/site/chat-bot"
import { Atmosphere } from "@/components/site/redesign/atmosphere"
import { PremiumCursor } from "@/components/site/redesign/cursor"
import { ScrollProgress } from "@/components/site/redesign/fx"
import { SmoothScroll } from "@/components/site/redesign/smooth-scroll"
import { recordVisitor } from "@/lib/client-api"
import { PROFILE } from "@/lib/profile"
import { ConversationProvider } from "@elevenlabs/react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Home", key: "h" },
  { href: "/projects", label: "Work", key: "p" },
  { href: "/about", label: "About", key: "a" },
  { href: "/writing", label: "Writing", key: "w" },
  { href: "/contact", label: "Contact", key: "c" },
] as const

const MENU_NAV = NAV.filter((item) => item.href !== "/")

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  useEffect(() => {
    const apply = () =>
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
    apply()
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        const v = e.newValue
        document.documentElement.classList.toggle("dark", v !== "light")
        apply()
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])
  const toggle = () => {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark"
    document.documentElement.classList.toggle("dark", next === "dark")
    try {
      localStorage.setItem("theme", next)
    } catch {}
    setTheme(next)
  }
  return { theme, toggle }
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const [helpOpen, setHelpOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [visitorCount, setVisitorCount] = useState<number | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    recordVisitor()
      .then((data) => setVisitorCount(data.totalViews))
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  useEffect(() => {
    let buffer = ""
    let bufferTimer: ReturnType<typeof setTimeout> | null = null
    const clearBuf = () => {
      buffer = ""
    }
    const isTyping = (el: EventTarget | null) => {
      const t = el as HTMLElement | null
      if (!t) return false
      const tag = t.tagName
      return tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setHelpOpen(false)
        setMenuOpen(false)
        clearBuf()
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (isTyping(e.target)) return
      if (menuOpen) return
      const k = e.key

      if (k === "?") {
        e.preventDefault()
        setHelpOpen((v) => !v)
        return
      }
      if (k === "j") {
        window.scrollBy({ top: 120, behavior: reduce ? "auto" : "smooth" })
        return
      }
      if (k === "k") {
        window.scrollBy({ top: -120, behavior: reduce ? "auto" : "smooth" })
        return
      }
      if (k === "t") {
        toggle()
        return
      }

      if (k === "g") {
        buffer = "g"
        if (bufferTimer) clearTimeout(bufferTimer)
        bufferTimer = setTimeout(clearBuf, 1200)
        return
      }
      if (buffer === "g") {
        const match = NAV.find((n) => n.key === k)
        if (match) {
          router.push(match.href)
          clearBuf()
          return
        }
        clearBuf()
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [router, toggle, menuOpen, reduce])

  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || ""

  return (
    <ConversationProvider agentId={agentId}>
      <div className="site-shell relative flex min-h-screen flex-col text-foreground">
        <Atmosphere />
        <SmoothScroll />
        <PremiumCursor />
        <ScrollProgress />
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <Header
          pathname={pathname}
          theme={theme}
          toggle={toggle}
          menuOpen={menuOpen}
          onMenu={() => setMenuOpen((v) => !v)}
          menuButtonRef={menuButtonRef}
        />
        <MobileMenu
          open={menuOpen}
          pathname={pathname}
          onClose={() => {
            setMenuOpen(false)
            menuButtonRef.current?.focus()
          }}
        />
        <main id="content" className="relative z-[1] flex-1" aria-hidden={menuOpen} inert={menuOpen}>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={pathname}
              initial={reduce ? false : { opacity: 0, y: 22, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <div className="relative z-[1]">
          <SiteFooter visitorCount={visitorCount} onHelp={() => setHelpOpen(true)} hidden={menuOpen} />
        </div>
        <div aria-hidden={menuOpen} inert={menuOpen}>
          <ChatBot />
        </div>
        {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} />}
      </div>
    </ConversationProvider>
  )
}

function Header({
  pathname,
  theme,
  toggle,
  menuOpen,
  onMenu,
  menuButtonRef,
}: {
  pathname: string
  theme: string
  toggle: () => void
  menuOpen: boolean
  onMenu: () => void
  menuButtonRef: React.RefObject<HTMLButtonElement | null>
}) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[70] transition-colors",
        scrolled || menuOpen
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link href="/" className="min-h-11 inline-flex items-center text-sm font-semibold tracking-tight">
          Senesh
          <span className="ml-1 hidden font-serif text-base font-normal italic text-muted-foreground sm:inline">
            Fernando
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {MENU_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex min-h-11 items-center rounded-full px-3.5 text-sm transition-colors",
                  active ? "text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-[1]">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href="/Senesh_Fernando_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center rounded-full border border-border px-4 text-sm hover:bg-secondary md:inline-flex"
          >
            CV
          </a>
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border hover:bg-secondary"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={onMenu}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}

function MobileMenu({
  open,
  pathname,
  onClose,
}: {
  open: boolean
  pathname: string
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const node = panelRef.current
    const focusable = node?.querySelectorAll<HTMLElement>("a, button")
    focusable?.[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !node) return
      const items = node.querySelectorAll<HTMLElement>("a, button")
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[60] flex flex-col bg-background/80 px-5 pt-20 pb-8 backdrop-blur-2xl md:hidden"
          initial={reduce ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <p id={titleId} className="sr-only">
            Site menu
          </p>
          <nav className="flex flex-1 flex-col justify-center gap-1" aria-label="Mobile">
            {MENU_NAV.map((item, index) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <motion.div
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="flex min-h-14 items-baseline justify-between border-b border-border py-2"
                  >
                    <span className={cn("text-4xl font-semibold tracking-tight", active && "font-serif italic")}>
                      {item.label}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                  </Link>
                </motion.div>
              )
            })}
          </nav>
          <div className="mt-8 space-y-4">
            <a
              href="/Senesh_Fernando_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background"
            >
              Download CV
            </a>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <a className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" href={PROFILE.github}>
                GitHub
              </a>
              <a className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" href={PROFILE.linkedin}>
                LinkedIn
              </a>
              <a className="inline-flex min-h-11 items-center" href={`mailto:${PROFILE.email}`}>
                {PROFILE.email}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SiteFooter({
  visitorCount,
  onHelp,
  hidden,
}: {
  visitorCount: number | null
  onHelp: () => void
  hidden?: boolean
}) {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-8 border-t border-border pb-28" aria-hidden={hidden} inert={hidden}>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Contact</p>
          <a
            href={`mailto:${PROFILE.email}`}
            className="mt-4 block break-all text-3xl font-semibold tracking-tight sm:text-5xl"
          >
            {PROFILE.email}
          </a>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {PROFILE.location}. {PROFILE.phoneDisplay}. Open to collaborations in tech, education, and AI.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-6 md:grid-cols-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Navigate</p>
            <ul className="mt-3 space-y-2 text-sm">
              {MENU_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-11 items-center hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Elsewhere</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a className="inline-flex min-h-11 items-center" href={PROFILE.github}>
                  GitHub
                </a>
              </li>
              <li>
                <a className="inline-flex min-h-11 items-center" href={PROFILE.linkedin}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a className="inline-flex min-h-11 items-center" href="https://x.com/SeneshF">
                  X
                </a>
              </li>
              <li>
                <a
                  className="inline-flex min-h-11 items-center"
                  href="https://scholar.google.com/citations?user=BQ7naRAAAAAJ&hl=en"
                >
                  Google Scholar
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Visit</p>
            <p className="mt-3 text-sm leading-relaxed">{PROFILE.address}</p>
            <p className="text-sm text-muted-foreground">{PROFILE.location}</p>
            <a className="mt-2 inline-flex min-h-11 items-center text-sm" href={`tel:${PROFILE.phone}`}>
              {PROFILE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-border px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {year} Senesh Fernando. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span>{visitorCount == null ? "—" : visitorCount.toLocaleString()} views</span>
          <button type="button" onClick={onHelp} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
            Keyboard shortcuts
          </button>
        </div>
      </div>
    </footer>
  )
}

function HelpOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcut-title"
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-background/70 p-4 backdrop-blur-sm sm:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="shortcut-title" className="text-lg font-semibold tracking-tight">
            Keyboard shortcuts
          </h2>
          <button type="button" onClick={onClose} className="inline-flex min-h-11 items-center text-sm text-muted-foreground">
            Close
          </button>
        </div>
        <ul className="space-y-2 text-sm">
          {[
            ["j", "Scroll down"],
            ["k", "Scroll up"],
            ["g h", "Go home"],
            ["g a", "Go about"],
            ["g p", "Go projects"],
            ["g w", "Go writing"],
            ["g c", "Go contact"],
            ["t", "Toggle theme"],
            ["?", "Toggle this help"],
          ].map(([k, label]) => (
            <li key={k} className="flex items-center justify-between gap-4 border-b border-border/70 py-2">
              <span>{label}</span>
              <span className="flex items-center gap-1">
                {k.split(" ").map((part) => (
                  <kbd key={part} className="kbd">
                    {part}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
