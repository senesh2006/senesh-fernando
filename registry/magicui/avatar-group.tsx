"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export interface AvatarData {
  src: string
  alt: string
  href?: string
}

interface AvatarGroupProps {
  avatars: AvatarData[]
  max?: number
  totalCount?: number
  size?: "sm" | "md" | "lg"
  className?: string
  showOverflow?: boolean
}

const sizeMap = {
  sm: { avatar: "h-7 w-7", ring: "ring-2", text: "text-[10px]" },
  md: { avatar: "h-9 w-9", ring: "ring-2", text: "text-xs" },
  lg: { avatar: "h-11 w-11", ring: "ring-[3px]", text: "text-sm" },
}

export function AvatarGroup({
  avatars,
  max = 5,
  totalCount,
  size = "md",
  className,
  showOverflow = true,
}: AvatarGroupProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const visible = avatars.slice(0, max)
  const overflow = totalCount !== undefined
    ? Math.max(0, totalCount - visible.length)
    : Math.max(0, avatars.length - max)
  const styles = sizeMap[size]

  return (
    <div
      role="group"
      aria-label="Users who liked this post"
      className={cn("flex items-center", className)}
    >
      <div className="flex items-center">
        {visible.map((avatar, index) => {
          const isHovered = hoveredIndex === index
          const isAnyHovered = hoveredIndex !== null

          const avatarNode = (
            <motion.div
              className={cn(
                "relative rounded-full bg-background cursor-pointer",
                styles.ring,
                "ring-background"
              )}
              initial={false}
              animate={{
                x: isHovered ? 8 : isAnyHovered ? -2 : 0,
                scale: isHovered ? 1.15 : 1,
                zIndex: isHovered ? 50 : visible.length - index,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ marginLeft: index === 0 ? 0 : -12 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={avatar.src}
                alt={avatar.alt}
                className={cn(
                  styles.avatar,
                  "rounded-full object-cover border border-primary/20"
                )}
              />
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-0.5 text-[10px] text-foreground shadow-lg border border-primary/20 z-50"
                >
                  {avatar.alt}
                </motion.span>
              )}
            </motion.div>
          )

          return avatar.href ? (
            <a
              key={avatar.alt + index}
              href={avatar.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative"
            >
              {avatarNode}
            </a>
          ) : (
            <div key={avatar.alt + index} className="relative">
              {avatarNode}
            </div>
          )
        })}
      </div>

      {showOverflow && overflow > 0 && (
        <motion.div
          className={cn(
            "relative -ml-3 flex items-center justify-center rounded-full bg-primary/10 border border-primary/30 font-medium text-primary",
            styles.avatar,
            styles.text
          )}
          animate={{
            scale: hoveredIndex !== null ? 0.95 : 1,
          }}
        >
          +{overflow}
        </motion.div>
      )}
    </div>
  )
}
