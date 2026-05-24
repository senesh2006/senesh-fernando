import { BlogsSection } from "@/components/sections/blogs"
import { SiteFooter } from "@/components/site-footer"

export default function BlogsPage() {
  return (
    <>
      <div className="pt-20">
        <BlogsSection />
      </div>
      <SiteFooter />
    </>
  )
}
