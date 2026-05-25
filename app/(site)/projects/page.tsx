import type { Metadata } from "next"
import { ProjectsPage } from "@/components/pages/projects-page"
import { getProjects } from "@/lib/content"
import { IMAGES } from "@/lib/images"

export const metadata: Metadata = {
  title: "Projects — Senesh Fernando",
  description: "Selected open source, client work, and experiments by Senesh Fernando.",
  openGraph: {
    title: "Projects — Senesh Fernando",
    description: "Selected open source, client work, and experiments.",
    images: [IMAGES.projectsHero],
  },
}

export default async function Page() {
  const projects = await getProjects()
  return <ProjectsPage projects={projects} />
}
