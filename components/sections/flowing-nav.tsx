"use client"

import { useEffect, useState } from "react"
import FlowingMenu from "@/components/FlowingMenu"
import { siteMenuItems } from "@/lib/site-menu-items"

export function FlowingNavSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section id="explore" className="flowing-nav-section">
      <div className="container">
        <p className="flowing-nav-kicker">Explore</p>
        <h2 className="flowing-nav-title">Where to next?</h2>
        <p className="flowing-nav-hint">Hover a row to preview — click to navigate.</p>
      </div>
      <div className="flowing-nav-wrap">
        {mounted ? (
          <FlowingMenu
            items={siteMenuItems}
            speed={14}
            textColor="#e8e4dc"
            bgColor="transparent"
            marqueeBgColor="#d4a853"
            marqueeTextColor="#120F17"
            borderColor="rgba(255, 255, 255, 0.13)"
          />
        ) : (
          <div className="flowing-nav-skeleton" aria-hidden />
        )}
      </div>
    </section>
  )
}
