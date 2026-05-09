import { getDbClient } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sql = getDbClient()
    const result = await sql`SELECT * FROM experience ORDER BY order_index ASC, created_at DESC`
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getDbClient()
    const { role, company, duration, description, achievements, order_index } = await request.json()
    const result = await sql`
      INSERT INTO experience (role, company, duration, description, achievements, order_index)
      VALUES (${role}, ${company}, ${duration}, ${description}, ${achievements || []}, ${order_index || 0})
      RETURNING *
    `
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const sql = getDbClient()
    const { id, role, company, duration, description, achievements, order_index } = await request.json()
    const result = await sql`
      UPDATE experience 
      SET role = ${role}, company = ${company}, duration = ${duration}, description = ${description}, achievements = ${achievements || []}, order_index = ${order_index || 0}
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const sql = getDbClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    await sql`DELETE FROM experience WHERE id = ${id}`
    return NextResponse.json({ message: "Experience deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
  }
}
