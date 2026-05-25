import type { Metadata } from "next"
import { HomePage } from "@/components/pages/home-page"
import { getPosts } from "@/lib/content"
import { FALLBACK_POSTS } from "@/data/posts"
import { IMAGES } from "@/lib/images"
import { PROFILE } from "@/lib/profile"

export const metadata: Metadata = {
  title: "Senesh Fernando — IT Undergraduate & Data Enthusiast",
  description: PROFILE.tagline,
  openGraph: {
    title: "Senesh Fernando — IT Undergraduate & Data Enthusiast",
    description: PROFILE.tagline,
    images: [IMAGES.indexHero],
  },
}

export default async function Page() {
  const posts = await getPosts()
  const featuredPost = posts[0] ?? FALLBACK_POSTS[0]
  return <HomePage featuredPost={featuredPost} />
}
