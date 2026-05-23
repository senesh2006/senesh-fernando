import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

function getDbClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured")
  }
  return neon(process.env.DATABASE_URL)
}

async function ensureBlogViewsTable(sql: ReturnType<typeof getDbClient>) {
  await sql`
    CREATE TABLE IF NOT EXISTS blog_views (
      blog_id TEXT PRIMARY KEY,
      views INTEGER NOT NULL DEFAULT 0,
      last_updated TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sql = getDbClient()
    await ensureBlogViewsTable(sql)

    const result = await sql`
      SELECT views FROM blog_views WHERE blog_id = ${id}
    `

    return NextResponse.json({
      views: result.length > 0 ? result[0].views : 0,
    })
  } catch (error) {
    console.error("Failed to fetch blog views:", error)
    return NextResponse.json({ views: 0 })
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sql = getDbClient()
    await ensureBlogViewsTable(sql)

    const result = await sql`
      INSERT INTO blog_views (blog_id, views)
      VALUES (${id}, 1)
      ON CONFLICT (blog_id)
      DO UPDATE SET
        views = blog_views.views + 1,
        last_updated = NOW()
      RETURNING views
    `

    return NextResponse.json({ views: result[0].views })
  } catch (error) {
    console.error("Failed to update blog views:", error)
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 })
  }
}
