"use client"

import { useEffect, useState } from "react"

/**
 * Full-screen Pac-Man preloader. Stays until the window `load` event fires
 * (all images, fonts and assets ready), then fades out. A safety timeout
 * guarantees it never blocks the page if `load` is slow/never fires.
 */
export function SitePreloader() {
  const [hidden, setHidden] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    let safety: ReturnType<typeof setTimeout>

    const finish = () => {
      setHidden(true)
      // remove from DOM after the fade-out transition
      setTimeout(() => setRemoved(true), 600)
    }

    if (document.readyState === "complete") {
      // already loaded — brief beat so the animation is seen, then go
      const t = setTimeout(finish, 400)
      return () => clearTimeout(t)
    }

    window.addEventListener("load", finish)
    // never trap the user — bail out after 6s no matter what
    safety = setTimeout(finish, 6000)

    return () => {
      window.removeEventListener("load", finish)
      clearTimeout(safety)
    }
  }, [])

  if (removed) return null

  return (
    <div
      aria-hidden
      className={`site-preloader${hidden ? " site-preloader--hidden" : ""}`}
    >
      <div className="loader">
        <div className="pac-man" />
        <div className="point p1" />
        <div className="point p2" />
      </div>
    </div>
  )
}
