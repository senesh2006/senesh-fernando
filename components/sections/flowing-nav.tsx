"use client"

import FlowingMenu from "@/components/FlowingMenu"
import { siteMenuItems } from "@/lib/site-menu-items"

export function FlowingNavSection() {
  return (
    <section id="explore" className="flowing-nav-section">
      <div className="container">
        <p className="flowing-nav-kicker">Explore</p>
        <h2 className="flowing-nav-title">Where to next?</h2>
      </div>
      <div className="flowing-nav-wrap">
        <FlowingMenu
          items={siteMenuItems}
          speed={15}
          textColor="#e8e4dc"
          bgColor="#0a0a09"
          marqueeBgColor="#d4a853"
          marqueeTextColor="#120F17"
          borderColor="rgba(255, 255, 255, 0.13)"
        />
      </div>
    </section>
  )
}
