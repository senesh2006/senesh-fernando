import { getDbClient } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sql = getDbClient()
    const projects = await sql`
      SELECT * FROM projects ORDER BY order_index ASC, created_at DESC
    `
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getDbClient()
    const body = await request.json()
    const { name, language, description, full_description, source_url, skills, impact, image_url, order_index } = body

    const result = await sql`
      INSERT INTO projects (name, language, description, full_description, source_url, skills, impact, image_url, order_index)
      VALUES (${name}, ${language}, ${description}, ${full_description}, ${source_url || null}, ${skills || []}, ${impact}, ${image_url}, ${order_index || 0})
      RETURNING *
    `
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const sql = getDbClient()
    const body = await request.json()
    const { id, name, language, description, full_description, source_url, skills, impact, image_url, order_index } = body

    const result = await sql`
      UPDATE projects 
      SET name = ${name}, 
          language = ${language}, 
          description = ${description}, 
          full_description = ${full_description}, 
          source_url = ${source_url || null}, 
          skills = ${skills || []}, 
          impact = ${impact}, 
          image_url = ${image_url}, 
          order_index = ${order_index || 0}
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Failed to update project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const sql = getDbClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

    await sql`DELETE FROM projects WHERE id = ${id}`
    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Failed to delete project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
