"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

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

  return (
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
  )
}
