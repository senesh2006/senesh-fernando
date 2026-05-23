import type { AvatarData } from "@/registry/magicui/avatar-group"

const LIKER_POOL: AvatarData[] = [
  { src: "https://avatars.githubusercontent.com/u/16860528", alt: "Dillion", href: "https://github.com/dillionverma" },
  { src: "https://avatars.githubusercontent.com/u/20110627", alt: "Tom", href: "https://github.com/tomonarifeehan" },
  { src: "https://avatars.githubusercontent.com/u/739984", alt: "Shadcn", href: "https://github.com/shadcn" },
  { src: "https://avatars.githubusercontent.com/u/59228569", alt: "Magic UI", href: "https://github.com/magicuidesign" },
  { src: "https://avatars.githubusercontent.com/u/89644704", alt: "Vercel", href: "https://github.com/vercel" },
  { src: "https://avatars.githubusercontent.com/u/6751787", alt: "Lee", href: "https://github.com/leerob" },
  { src: "https://avatars.githubusercontent.com/u/29084286", alt: "Josh", href: "https://github.com/joshwcomeau" },
  { src: "https://avatars.githubusercontent.com/u/35613825", alt: "Theo", href: "https://github.com/t3dotgg" },
]

function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getBlogLikers(blogId: string, count?: number): AvatarData[] {
  const hash = hashString(blogId)
  const total = Math.min(count ?? 4, LIKER_POOL.length)
  const start = hash % LIKER_POOL.length
  const likers: AvatarData[] = []

  for (let i = 0; i < total; i++) {
    likers.push(LIKER_POOL[(start + i) % LIKER_POOL.length])
  }

  return likers
}
