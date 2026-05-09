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
      SELECT id, title, content, category, tags, image_url, github_url, linkedin_url, other_url, created_at 
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
    const { title, content, category, tags, image_url, github_url, linkedin_url, other_url } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO blogs (title, content, category, tags, image_url, github_url, linkedin_url, other_url)
      VALUES (${title}, ${content}, ${category}, ${tags || []}, ${image_url || null}, ${github_url || null}, ${linkedin_url || null}, ${other_url || null})
      RETURNING id, title, content, category, tags, image_url, github_url, linkedin_url, other_url, created_at
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

export async function PUT(request: Request) {
  try {
    const sql = getDbClient()
    const body = await request.json()
    const { id, title, content, category, tags, image_url, github_url, linkedin_url, other_url } = body

    if (!id || !title || !content || !category) {
      return NextResponse.json(
        { error: "ID, title, content, and category are required" },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE blogs 
      SET title = ${title}, 
          content = ${content}, 
          category = ${category}, 
          tags = ${tags || []}, 
          image_url = ${image_url || null}, 
          github_url = ${github_url || null}, 
          linkedin_url = ${linkedin_url || null}, 
          other_url = ${other_url || null}
      WHERE id = ${id}
      RETURNING id, title, content, category, tags, image_url, github_url, linkedin_url, other_url, created_at
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Failed to update blog:", error)
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const sql = getDbClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await sql`DELETE FROM blogs WHERE id = ${id}`

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Failed to delete blog:", error)
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    )
  }
}
