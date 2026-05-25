import type { Metadata } from "next"
import { WritingPage } from "@/components/pages/writing-page"
import { getPosts } from "@/lib/content"

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPosts()
  return {
    title: "Writing — Senesh Fernando",
    description: "Field notes on software, design systems, performance, and shipping fast.",
    openGraph: {
      title: "Writing — Senesh Fernando",
      description: "Field notes on software, design systems, performance, and shipping fast.",
      images: posts[0]?.cover ? [posts[0].cover] : undefined,
    },
  }
}

export default async function Page() {
  const posts = await getPosts()
  return <WritingPage posts={posts} />
}
