import { readFileSync, existsSync } from "fs"
import { resolve } from "path"
import { SEED_BLOGS, SEED_PROJECTS } from "../data/seed-content"
import { ensureSchema, getSql } from "../lib/neon"

function loadEnvFile(path: string) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq)
    let val = trimmed.slice(eq + 1)
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"))
loadEnvFile(resolve(process.cwd(), ".env"))

async function upsertDocument(
  collection: string,
  id: string,
  body: Record<string, unknown>,
  createdAt: string
) {
  const db = getSql()
  await db`
    INSERT INTO portfolio_documents (id, collection_name, body, created_at, updated_at)
    VALUES (${id}, ${collection}, ${JSON.stringify(body)}::jsonb, ${createdAt}, NOW())
    ON CONFLICT (id) DO UPDATE
    SET body = EXCLUDED.body,
        updated_at = NOW()
  `
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Add it to .env.local or your environment.")
    process.exit(1)
  }

  await ensureSchema()

  for (const project of SEED_PROJECTS) {
    const { id, ...body } = project
    await upsertDocument(
      "projects",
      id,
      {
        name: body.name,
        language: body.language,
        description: body.description,
        full_description: body.full_description,
        source_url: body.source_url,
        skills: body.skills,
        impact: body.impact,
        image_url: body.image_url,
        order_index: body.order_index,
      },
      `${project.year}-06-01T00:00:00.000Z`
    )
    console.log(`✓ project: ${project.name}`)
  }

  for (const blog of SEED_BLOGS) {
    await upsertDocument(
      "blogs",
      blog.id,
      {
        title: blog.title,
        content: blog.content,
        category: blog.category,
        tags: blog.tags,
        image_url: blog.image_url,
        github_url: null,
        linkedin_url: null,
        other_url: null,
        views: 0,
      },
      blog.created_at
    )
    console.log(`✓ blog: ${blog.title}`)
  }

  console.log(`\nSeeded ${SEED_PROJECTS.length} projects and ${SEED_BLOGS.length} blogs.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
