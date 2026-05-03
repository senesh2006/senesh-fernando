"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, useRef } from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const previousPathname = useRef(pathname)

  useEffect(() => {
    // If pathname changed, trigger transition
    if (pathname !== previousPathname.current) {
      setIsTransitioning(true)
      
      // After fade out, update children
      const fadeOutTimer = setTimeout(() => {
        setDisplayChildren(children)
        setIsTransitioning(false)
        previousPathname.current = pathname
      }, 300)
      
      return () => clearTimeout(fadeOutTimer)
    } else {
      // Same page, just update children
      setDisplayChildren(children)
    }
  }, [pathname, children])

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isTransitioning 
          ? "opacity-0 translate-y-4" 
          : "opacity-100 translate-y-0"
      }`}
    >
      {displayChildren}
    </div>
  )
}
