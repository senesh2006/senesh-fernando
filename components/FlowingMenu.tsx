"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import "./FlowingMenu.css"

export interface FlowingMenuItem {
  link: string
  text: string
  image: string
}

interface FlowingMenuProps {
  items?: FlowingMenuItem[]
  speed?: number
  textColor?: string
  bgColor?: string
  marqueeBgColor?: string
  marqueeTextColor?: string
  borderColor?: string
}

interface MenuItemProps extends FlowingMenuItem {
  speed: number
  textColor: string
  marqueeBgColor: string
  marqueeTextColor: string
  borderColor: string
}

function MenuItem({
  link,
  text,
  image,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
}: MenuItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const marqueeTrackRef = useRef<HTMLDivElement>(null)
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null)
  const imageLoadedRef = useRef(false)
  const [repetitions, setRepetitions] = useState(4)
  const [imagesReady, setImagesReady] = useState(false)

  const animationDefaults = { duration: 0.6, ease: "expo.inOut" }

  const distMetric = (x: number, y: number, x2: number, y2: number) => {
    const xDiff = x - x2
    const yDiff = y - y2
    return xDiff * xDiff + yDiff * yDiff
  }

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0)
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height)
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom"
  }

  const handleImageLoad = useCallback(() => {
    if (imageLoadedRef.current) return
    imageLoadedRef.current = true
    setImagesReady(true)
  }, [])

  useEffect(() => {
    imageLoadedRef.current = false
    setImagesReady(false)

    const img = new Image()
    img.src = image
    if (img.complete) {
      handleImageLoad()
    } else {
      img.onload = handleImageLoad
      img.onerror = handleImageLoad
    }

    const fallback = window.setTimeout(handleImageLoad, 2500)
    return () => window.clearTimeout(fallback)
  }, [image, handleImageLoad])

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeTrackRef.current) return

      const marqueeContent = marqueeTrackRef.current.querySelector(".marquee__part")
      if (!marqueeContent) return

      const contentWidth = (marqueeContent as HTMLElement).offsetWidth
      if (contentWidth === 0) return

      const viewportWidth = window.innerWidth
      const needed = Math.ceil(viewportWidth / contentWidth) + 2
      setRepetitions(Math.max(4, needed))
    }

    calculateRepetitions()
    window.addEventListener("resize", calculateRepetitions)
    return () => window.removeEventListener("resize", calculateRepetitions)
  }, [text, image, imagesReady])

  useEffect(() => {
    const setupMarquee = () => {
      const track = marqueeTrackRef.current
      if (!track) return

      const marqueeContent = track.querySelector(".marquee__part")
      if (!marqueeContent) return

      const contentWidth = (marqueeContent as HTMLElement).offsetWidth
      if (contentWidth === 0) return

      scrollTweenRef.current?.kill()
      gsap.set(track, { x: 0 })

      scrollTweenRef.current = gsap.to(track, {
        x: -contentWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      })
    }

    const timer = window.setTimeout(setupMarquee, 100)
    return () => {
      window.clearTimeout(timer)
      scrollTweenRef.current?.kill()
    }
  }, [text, image, repetitions, speed, imagesReady])

  const handleMouseEnter = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    const edge = findClosestEdge(x, y, rect.width, rect.height)

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(marqueeRef.current, { y: "0%" }, 0)
  }

  const handleMouseLeave = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    const edge = findClosestEdge(x, y, rect.width, rect.height)

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
  }

  const isExternal = link.startsWith("http")

  const linkProps = {
    className: "menu__item-link",
    style: { color: textColor },
  }

  return (
    <div
      className="menu__item"
      ref={itemRef}
      style={{ borderColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isExternal ? (
        <a {...linkProps} href={link} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ) : (
        <Link {...linkProps} href={link}>
          {text}
        </Link>
      )}
      <div className="marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className="marquee__inner-wrap">
          <div className="marquee__track" ref={marqueeTrackRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, idx) => (
              <div className="marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                <span>{text}</span>
                <div className="marquee__img-wrap">
                  <img
                    className="marquee__img"
                    src={image}
                    alt=""
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    onLoad={idx === 0 ? handleImageLoad : undefined}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FlowingMenu({
  items = [],
  speed = 15,
  textColor = "#fff",
  bgColor = "#120F17",
  marqueeBgColor = "#fff",
  marqueeTextColor = "#120F17",
  borderColor = "#fff",
}: FlowingMenuProps) {
  return (
    <div className="menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem
            key={`${item.link}-${idx}`}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
          />
        ))}
      </nav>
    </div>
  )
}
