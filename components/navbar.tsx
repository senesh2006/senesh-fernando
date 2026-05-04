"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "About", href: "/" },
  { label: "Education", href: "/education" },
  { label: "Experience", href: "/experience" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Achievements", href: "/achievements" },
  { label: "Recommendations", href: "/recommendations" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 backdrop-blur-xl bg-[rgba(10,7,5,0.7)] border-b border-[rgba(255,120,20,0.1)]">
      <nav className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* PS Monogram Logo */}
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[rgba(255,106,0,0.15)] border border-[rgba(255,106,0,0.3)] text-[#ff6a00] font-semibold text-sm hover:bg-[rgba(255,106,0,0.25)] transition-all glow-orange"
            data-magnetic
          >
            PS
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full block",
                      isActive
                        ? "text-[#f5ede6] nav-pill-active"
                        : "text-[rgba(245,237,230,0.5)] hover:text-[#f5ede6]"
                    )}
                    data-magnetic
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-[#ff6a00] shadow-[0_0_8px_rgba(255,106,0,0.6)]" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#f5ede6] hover:bg-[rgba(255,106,0,0.1)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-magnetic
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 glass-card rounded-xl p-4">
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "w-full text-left px-4 py-3 text-sm font-medium transition-all rounded-lg block",
                        isActive
                          ? "text-[#ff6a00] bg-[rgba(255,106,0,0.1)]"
                          : "text-[rgba(245,237,230,0.6)] hover:text-[#f5ede6] hover:bg-[rgba(255,255,255,0.04)]"
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
