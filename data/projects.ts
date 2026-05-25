import { FALLBACK_PROJECTS } from "@/data/seed-content"

export type { Project } from "@/data/seed-content"
export {
  FALLBACK_PROJECTS,
  SEED_PROJECTS,
  seedProjectToFrontend,
} from "@/data/seed-content"

export const PROJECTS = FALLBACK_PROJECTS

export const getProject = (slug: string) =>
  FALLBACK_PROJECTS.find((p) => p.slug === slug)
