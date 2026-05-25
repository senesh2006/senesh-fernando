import type { Metadata } from "next"
import { HomePage } from "@/components/pages/home-page"
import { getPosts } from "@/lib/content"
import { FALLBACK_POSTS } from "@/data/posts"
import { IMAGES } from "@/lib/images"

export const metadata: Metadata = {
  title: "Senesh Fernando — Engineer / Designer",
  description:
    "Senesh Fernando — software engineer and designer building fast, opinionated, well-mannered software.",
  openGraph: {
    title: "Senesh Fernando — Engineer / Designer",
    description:
      "Software engineer and designer building fast, opinionated, well-mannered software.",
    images: [IMAGES.indexHero],
  },
}

export default async function Page() {
  const posts = await getPosts()
  const featuredPost = posts[0] ?? FALLBACK_POSTS[0]
  return <HomePage featuredPost={featuredPost} />
}
