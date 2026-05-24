"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/hooks/use-sound"

const navItems = [
  { label: "About", href: "/" },
  { label: "Education", href: "/education" },
  { label: "Experience", href: "/experience" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Achievements", href: "/achievements" },
  { label: "Recommendations", href: "/recommendations" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false)
  const { playBlip, playClick } = useSound()

  const handleNavClick = () => {
    if (isSoundEnabled) playBlip()
    setIsMobileMenuOpen(false)
  }

  const toggleSound = () => {
    const nextValue = !isSoundEnabled
    setIsSoundEnabled(nextValue)
    if (nextValue) playClick()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 bg-background/90 border-b border-border backdrop-blur-sm">
      <nav className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              onClick={handleNavClick}
              className="flex items-center justify-center w-10 h-10 rounded-sm bg-foreground text-background font-mono text-xs font-medium hover:opacity-90 transition-opacity"
            >
              PS
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-paper-2">
              <div className="w-2 h-2 rounded-full bg-accent-green" />
              <span className="text-[10px] text-foreground-muted tracking-wider uppercase font-mono">
                Available for work
              </span>
            </div>
          </div>

          <ul className="hidden lg:flex items-center gap-0.5 flex-wrap justify-end">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "px-3 py-2 text-xs font-medium transition-all duration-200 rounded-sm block font-mono tracking-wide",
                      isActive
                        ? "text-foreground nav-pill-active"
                        : "text-foreground-muted hover:text-foreground hover:bg-paper-2"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSound}
              className={cn(
                "w-9 h-9 rounded-sm",
                isSoundEnabled ? "text-primary bg-paper-2" : "text-foreground-muted"
              )}
              title={isSoundEnabled ? "Disable SFX" : "Enable SFX"}
            >
              {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 glass-card rounded-sm p-4">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleNavClick}
                      className={cn(
                        "w-full px-4 py-3 text-sm font-mono transition-all rounded-sm block",
                        isActive
                          ? "text-primary bg-paper-2"
                          : "text-foreground-muted hover:text-foreground hover:bg-paper-2"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
