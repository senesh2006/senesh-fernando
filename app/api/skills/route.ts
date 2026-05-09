import { getDbClient } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sql = getDbClient()
    const result = await sql`SELECT * FROM skills ORDER BY order_index ASC, created_at DESC`
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getDbClient()
    const { category, skill_list, order_index } = await request.json()
    const result = await sql`
      INSERT INTO skills (category, skill_list, order_index)
      VALUES (${category}, ${skill_list || []}, ${order_index || 0})
      RETURNING *
    `
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skills category" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const sql = getDbClient()
    const { id, category, skill_list, order_index } = await request.json()
    const result = await sql`
      UPDATE skills 
      SET category = ${category}, skill_list = ${skill_list || []}, order_index = ${order_index || 0}
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update skills" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const sql = getDbClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    await sql`DELETE FROM skills WHERE id = ${id}`
    return NextResponse.json({ message: "Skills category deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete skills" }, { status: 500 })
  }
}
