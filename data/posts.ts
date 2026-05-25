import { FALLBACK_POSTS } from "@/data/seed-content"

export type { Post, PostBlock } from "@/data/seed-content"
export {
  FALLBACK_POSTS,
  SEED_BLOGS,
  seedBlogToFrontend,
} from "@/data/seed-content"

export const POSTS = FALLBACK_POSTS

export const getPost = (slug: string) => FALLBACK_POSTS.find((p) => p.slug === slug)
