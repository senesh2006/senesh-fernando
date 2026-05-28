"use client"

import React, { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LikeButtonProps {
  id: string
  type: "projects" | "blogs"
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  showCount?: boolean
}

export function LikeButton({
  id,
  type,
  variant = "outline",
  size = "md",
  className,
  showCount = true,
}: LikeButtonProps) {
  const [likes, setLikes] = useState<number | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Fetch initial likes
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/${type}/${id}/likes`)
        if (res.ok) {
          const data = await res.json()
          setLikes(data.likes)
        }
      } catch (err) {
        console.error("Failed to fetch likes:", err)
      }
    }

    // Check local storage if already liked
    const likedItems = JSON.parse(localStorage.getItem("liked_items") || "[]")
    if (likedItems.includes(`${type}_${id}`)) {
      setIsLiked(true)
    }

    fetchLikes()
  }, [id, type])

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLiked) return

    setIsAnimating(true)
    setIsLiked(true)
    setLikes((prev) => (prev !== null ? prev + 1 : 1))

    // Save to local storage
    const likedItems = JSON.parse(localStorage.getItem("liked_items") || "[]")
    likedItems.push(`${type}_${id}`)
    localStorage.setItem("liked_items", JSON.stringify(likedItems))

    try {
      const res = await fetch(`/api/${type}/${id}/likes`, { method: "POST" })
      if (!res.ok) {
        // Rollback on error
        setLikes((prev) => (prev !== null ? prev - 1 : 0))
        setIsLiked(false)
        const updatedItems = likedItems.filter((item: string) => item !== `${type}_${id}`)
        localStorage.setItem("liked_items", JSON.stringify(updatedItems))
      }
    } catch (err) {
      console.error("Failed to send like:", err)
    }

    setTimeout(() => setIsAnimating(false), 1000)
  }

  const sizeClasses = {
    sm: "h-7 px-2 text-[10px]",
    md: "h-9 px-3 text-xs",
    lg: "h-11 px-4 text-sm",
  }

  const variantClasses = {
    default: "bg-foreground text-background hover:opacity-90",
    outline: "border border-border bg-background/50 backdrop-blur-sm hover:bg-secondary/50",
    ghost: "hover:bg-secondary/50",
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLiked}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm font-mono transition-all duration-300 active:scale-95 disabled:cursor-default",
        sizeClasses[size],
        variantClasses[variant],
        isLiked && "text-rose-500 border-rose-500/30 bg-rose-500/5",
        className
      )}
    >
      <div className="relative">
        <Heart
          className={cn(
            "h-3.5 w-3.5 transition-all duration-300",
            isLiked ? "fill-current" : "fill-none",
            isAnimating && "animate-ping absolute inset-0 opacity-75"
          )}
        />
        <Heart
          className={cn(
            "h-3.5 w-3.5 transition-all duration-300",
            isLiked ? "fill-current scale-110" : "fill-none",
            isAnimating && "scale-125"
          )}
        />
      </div>
      {showCount && likes !== null && (
        <span className={cn(
          "tabular-nums",
          isAnimating && "animate-bounce"
        )}>
          {likes}
        </span>
      )}
      {!showCount && isLiked && <span>Liked</span>}
    </button>
  )
}
