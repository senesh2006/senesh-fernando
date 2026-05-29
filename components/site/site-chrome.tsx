"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BackgroundFX } from "@/components/site/background-fx"
import { MagneticBlobCursor } from "@/components/magnetic-blob-cursor"
import { ChatBot } from "@/components/site/chat-bot"
import { recordVisitor } from "@/lib/client-api"

const NAV = [
  { href: "/", label: "index", key: "h" },
  { href: "/about", label: "about", key: "a" },
  { href: "/projects", label: "projects", key: "p" },
  { href: "/writing", label: "writing", key: "w" },
  { href: "/contact", label: "contact", key: "c" },
] as const

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  useEffect(() => {
    const apply = () =>
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
    apply()
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        const v = e.newValue
        document.documentElement.classList.toggle("dark", v === "dark")
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
  const [mode, setMode] = useState<"VISITOR" | "EXPLORING" | "READING">("VISITOR")
  const [visitorCount, setVisitorCount] = useState<number | null>(null)

  useEffect(() => {
    recordVisitor()
      .then((data) => setVisitorCount(data.totalViews))
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    if (pathname === "/") setMode("VISITOR")
    else if (pathname.startsWith("/writing")) setMode("READING")
    else setMode("EXPLORING")
  }, [pathname])

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
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (isTyping(e.target)) return
      const k = e.key

      if (k === "?") {
        e.preventDefault()
        setHelpOpen((v) => !v)
        return
      }
      if (k === "Escape") {
        setHelpOpen(false)
        clearBuf()
        return
      }
      if (k === "j") {
        window.scrollBy({ top: 120, behavior: "smooth" })
        return
      }
      if (k === "k") {
        window.scrollBy({ top: -120, behavior: "smooth" })
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
  }, [router, toggle])

  const [nodeId, setNodeId] = useState<string>("------")
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNodeId(Math.random().toString(36).slice(2, 8).toUpperCase())
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MagneticBlobCursor />
      <BackgroundFX />
      <TopBar theme={theme} toggle={toggle} pathname={pathname} />
      <main key={pathname} className="flex-1 w-full animate-fade-in">
        {children}
      </main>
      <MetaFooter
        pathname={pathname}
        theme={theme}
        mode={mode}
        nodeId={nodeId}
        now={now}
        visitorCount={visitorCount}
      />
      <ChatBot />
      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} />}
    </div>
  )
}

function TopBar({
  theme,
  toggle,
  pathname,
}: {
  theme: string
  toggle: () => void
  pathname: string
}) {
  return (
    <header className="border-b border-border sticky top-0 z-30 bg-background/85 backdrop-blur">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 flex items-center justify-between h-12 font-mono text-xs">
        <Link href="/" className="flex items-center gap-2 link-hover px-1.5 py-0.5 rounded-sm">
          <span className="text-muted-foreground">$</span>
          <span className="font-semibold">senesh.fernando</span>
          <span className="text-muted-foreground hidden sm:inline">~/portfolio</span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href))
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`px-2 py-0.5 rounded-sm link-hover ${active ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                {n.label}
              </Link>
            )
          })}
          <a
            href="/Senesh_Fernando_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 rounded-sm link-hover text-muted-foreground"
          >
            CV
          </a>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="ml-2 px-2 py-0.5 rounded-sm link-hover text-muted-foreground"
            title="Toggle theme (t)"
          >
            [{theme === "dark" ? "dark" : "light"}]
          </button>
        </nav>
      </div>
    </header>
  )
}

function MetaFooter({
  pathname,
  theme,
  mode,
  nodeId,
  now,
  visitorCount,
}: {
  pathname: string
  theme: string
  mode: string
  nodeId: string
  now: Date | null
  visitorCount: number | null
}) {
  const t = now ? now.toISOString().slice(0, 19).replace("T", " ") : "----.--.-- --:--:--"
  const year = now ? now.getFullYear() : "----"
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8 font-mono text-[11px] text-muted-foreground space-y-3">
        <div className="text-foreground">// meta.footer</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-6">
          <div>
            <span className="text-foreground/60">node.</span> {nodeId}
          </div>
          <div>
            <span className="text-foreground/60">mode.</span> [MODE: {mode}]
          </div>
          <div>
            <span className="text-foreground/60">path.</span> {pathname}
          </div>
          <div>
            <span className="text-foreground/60">theme.</span> {theme}
          </div>
          <div>
            <span className="text-foreground/60">time.</span> {t} UTC
          </div>
          <div>
            <span className="text-foreground/60">views.</span> {visitorCount ?? "—"}
          </div>
          <div>
            <span className="text-foreground/60">audio.</span> ♪ deficit — mindvacy
          </div>
          <div className="col-span-2">
            <span className="text-foreground/60">cmd.</span> press <span className="kbd">?</span> for
            shortcuts
          </div>
        </div>
        <div className="pt-4 border-t border-border flex flex-wrap justify-between gap-3">
          <span>© {year} Senesh Fernando — all rights reserved.</span>
          <span>built minimal · zero dependencies · v1.0.0</span>
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
      onClick={onClose}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg border border-border bg-card text-card-foreground rounded-md p-6 font-mono text-sm shadow-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <span className="text-foreground">// keyboard.shortcuts</span>
          <button onClick={onClose} className="text-muted-foreground link-hover px-1.5 rounded-sm">
            [esc]
          </button>
        </div>
        <ul className="space-y-2 text-xs">
          {[
            ["j", "scroll down"],
            ["k", "scroll up"],
            ["g h", "go home"],
            ["g a", "go about"],
            ["g p", "go projects"],
            ["g w", "go writing"],
            ["g c", "go contact"],
            ["t", "toggle theme"],
            ["?", "toggle this help"],
          ].map(([k, label]) => (
            <li key={k} className="flex justify-between border-b border-border/60 pb-1">
              <span className="text-muted-foreground">{label}</span>
              <span>
                {k.split(" ").map((c, i) => (
                  <span key={i}>
                    <span className="kbd">{c}</span>
                    {i < k.split(" ").length - 1 && (
                      <span className="mx-1 text-muted-foreground">then</span>
                    )}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
