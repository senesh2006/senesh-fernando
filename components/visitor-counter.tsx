"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

export function VisitorCounter() {
  const [views, setViews] = useState<number | null>(null)
  const [hasTracked, setHasTracked] = useState(false)

  useEffect(() => {
    // Check if already tracked in this session
    const tracked = sessionStorage.getItem("visitor_tracked")
    
    if (!tracked && !hasTracked) {
      // Track new view
      fetch("/api/visitors", { method: "POST" })
        .then(res => res.json())
        .then(data => {
          setViews(data.totalViews)
          sessionStorage.setItem("visitor_tracked", "true")
          setHasTracked(true)
        })
        .catch(() => setViews(null))
    } else {
      // Just fetch current count
      fetch("/api/visitors")
        .then(res => res.json())
        .then(data => setViews(data.totalViews))
        .catch(() => setViews(null))
    }
  }, [hasTracked])

  if (views === null) return null

  return (
    <div className="flex items-center gap-2 text-sm text-[rgba(245,237,230,0.5)]">
      <Eye className="h-4 w-4" />
      <span>{views.toLocaleString()} views</span>
    </div>
  )
}
