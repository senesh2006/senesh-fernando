import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

function getDbClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured")
  }
  return neon(process.env.DATABASE_URL)
}

export async function GET() {
  try {
    const sql = getDbClient()
    const blogs = await sql`
      SELECT id, title, content, category, tags, created_at 
      FROM blogs 
      ORDER BY created_at DESC
    `
    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Failed to fetch blogs:", error)
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const sql = getDbClient()
    const body = await request.json()
    const { title, content, category, tags } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO blogs (title, content, category, tags)
      VALUES (${title}, ${content}, ${category}, ${tags || []})
      RETURNING id, title, content, category, tags, created_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Failed to create blog:", error)
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    )
  }
}
