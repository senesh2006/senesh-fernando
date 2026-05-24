"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Blog", href: "/#blog" },
  { label: "Contact", href: "/#contact" },
]

const sectionIds = navItems.map((item) => item.href.replace("/#", ""))

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const onScroll = () => {
      let current = "hero"
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          current = id
        }
      }
      setActiveSection(current)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav>
      <Link href="/#hero" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
        Senesh
      </Link>

      <ul className={`nav-links ${isMobileMenuOpen ? "nav-links-open" : ""}`}>
        {navItems.map((item) => {
          const id = item.href.replace("/#", "")
          const isActive = activeSection === id
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={isActive ? { color: "var(--accent)" } : undefined}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="nav-right">
        <div className="nav-status">
          <span className="status-dot" />
          Open to opportunities
        </div>
        <button
          type="button"
          className="nav-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </nav>
  )
}
