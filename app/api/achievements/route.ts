import { getDbClient } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sql = getDbClient()
    const result = await sql`SELECT * FROM achievements ORDER BY order_index ASC, created_at DESC`
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getDbClient()
    const { title, description, date, order_index } = await request.json()
    const result = await sql`
      INSERT INTO achievements (title, description, date, order_index)
      VALUES (${title}, ${description}, ${date}, ${order_index || 0})
      RETURNING *
    `
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const sql = getDbClient()
    const { id, title, description, date, order_index } = await request.json()
    const result = await sql`
      UPDATE achievements 
      SET title = ${title}, description = ${description}, date = ${date}, order_index = ${order_index || 0}
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const sql = getDbClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    await sql`DELETE FROM achievements WHERE id = ${id}`
    return NextResponse.json({ message: "Achievement deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 })
  }
}
