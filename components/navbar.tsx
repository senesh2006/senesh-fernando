"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import FlowingMenu from "@/components/FlowingMenu"
import { siteMenuItems } from "@/lib/site-menu-items"

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <nav>
        <Link href="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
          Senesh
        </Link>

        <ul className={`nav-links ${isMobileMenuOpen ? "nav-links-open" : ""}`}>
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
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

      {isMobileMenuOpen && (
        <div className="flowing-menu-overlay">
          <button
            type="button"
            className="flowing-menu-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
          <FlowingMenu
            items={siteMenuItems}
            speed={12}
            textColor="#e8e4dc"
            bgColor="#0a0a09"
            marqueeBgColor="#d4a853"
            marqueeTextColor="#120F17"
            borderColor="rgba(255, 255, 255, 0.13)"
          />
        </div>
      )}
    </>
  )
}
