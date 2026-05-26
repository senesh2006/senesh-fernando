import type { Metadata } from "next"
import { HomePage } from "@/components/pages/home-page"
import { getPosts, getProjects } from "@/lib/content"
import { FALLBACK_POSTS } from "@/data/posts"
import { FALLBACK_PROJECTS } from "@/data/projects"
import { IMAGES } from "@/lib/images"
import { PROFILE } from "@/lib/profile"

export const metadata: Metadata = {
  title: "Senesh Fernando — IT Undergraduate & Data Enthusiast",
  description: PROFILE.tagline,
  openGraph: {
    title: "Senesh Fernando — IT Undergraduate & Data Enthusiast",
    description: PROFILE.tagline,
    images: [IMAGES.portrait],
  },
}

export default async function Page() {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()])
  const featuredPost = posts[0] ?? FALLBACK_POSTS[0]
  const displayProjects = projects.length > 0 ? projects : FALLBACK_PROJECTS

  return <HomePage featuredPost={featuredPost} projects={displayProjects} />
}
