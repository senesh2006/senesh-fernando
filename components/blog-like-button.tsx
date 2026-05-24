"use client"

import { motion } from "motion/react"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BlogLikeButtonProps {
  blogId: string
  likes: number
  isLiked: boolean
  isLoading?: boolean
  size?: "sm" | "md"
  showCount?: boolean
  onLike: (blogId: string) => void
  className?: string
}

export function BlogLikeButton({
  blogId,
  likes,
  isLiked,
  isLoading = false,
  size = "sm",
  showCount = true,
  onLike,
  className,
}: BlogLikeButtonProps) {
  const iconSize = size === "md" ? "h-5 w-5" : "h-4 w-4"

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isLiked || isLoading}
      onClick={(e) => {
        e.stopPropagation()
        onLike(blogId)
      }}
      className={cn(
        "gap-1.5 rounded-full border transition-all",
        size === "md" ? "h-10 px-4 text-sm" : "h-8 px-3 text-xs",
        isLiked
          ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
          : "border-border bg-background text-foreground-muted hover:border-primary/30 hover:bg-paper-2 hover:text-primary",
        className
      )}
      aria-label={isLiked ? "Already liked" : "Like this blog"}
      aria-pressed={isLiked}
    >
      {isLoading ? (
        <Loader2 className={cn(iconSize, "animate-spin")} />
      ) : (
        <motion.span
          whileTap={isLiked ? undefined : { scale: 1.35 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <Heart
            className={cn(
              iconSize,
              isLiked && "fill-primary text-primary"
            )}
          />
        </motion.span>
      )}
      {showCount && (
        <span className="font-medium tabular-nums">
          {likes.toLocaleString()}
        </span>
      )}
    </Button>
  )
}

export function getLikedBlogIds(): Set<string> {
  if (typeof window === "undefined") return new Set()
  const liked = new Set<string>()
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith("blog_liked_")) {
      liked.add(key.replace("blog_liked_", ""))
    }
  }
  return liked
}

export function markBlogLiked(blogId: string) {
  localStorage.setItem(`blog_liked_${blogId}`, "true")
}

export function isBlogLiked(blogId: string) {
  return localStorage.getItem(`blog_liked_${blogId}`) === "true"
}
