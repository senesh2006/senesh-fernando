"use client"

import { useEffect, useState } from "react"

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches
    setEnabled(!coarse)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const cursor = document.getElementById("cursor")
    const ring = document.getElementById("cursorRing")
    if (!cursor || !ring) return

    let mx = 0
    let my = 0
    let rx = 0
    let ry = 0
    let frame = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      cursor.style.left = `${mx}px`
      cursor.style.top = `${my}px`
    }

    const animateRing = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = `${rx}px`
      ring.style.top = `${ry}px`
      frame = requestAnimationFrame(animateRing)
    }

    document.addEventListener("mousemove", onMove)
    frame = requestAnimationFrame(animateRing)

    return () => {
      document.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div className="cursor" id="cursor" />
      <div className="cursor-ring" id="cursorRing" />
    </>
  )
}
