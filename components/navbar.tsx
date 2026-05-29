"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import FlowingMenu from "@/components/FlowingMenu"
import { AnimatedMenuButton } from "@/components/animated-menu-button"
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <>
      <nav>
        <ul className="nav-links">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
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
          <AnimatedMenuButton
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </div>
      </nav>

      <button
        type="button"
        className={`nav-menu-backdrop ${isMenuOpen ? "nav-menu-backdrop--open" : ""}`}
        aria-label="Close menu"
        onClick={() => setIsMenuOpen(false)}
        tabIndex={isMenuOpen ? 0 : -1}
      />

      <aside
        className={`nav-menu-drawer ${isMenuOpen ? "nav-menu-drawer--open" : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <div className="nav-menu-drawer-header">
          <p className="nav-menu-drawer-label">Navigate</p>
          <AnimatedMenuButton
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(false)}
            label="Close menu"
          />
        </div>
        <div className="nav-menu-drawer-body">
          <FlowingMenu
            items={siteMenuItems}
            speed={12}
          />
        </div>
      </aside>
    </>
  )
}
