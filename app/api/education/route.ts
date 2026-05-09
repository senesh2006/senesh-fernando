import { getDbClient } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sql = getDbClient()
    const result = await sql`SELECT * FROM education ORDER BY order_index ASC, created_at DESC`
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getDbClient()
    const { degree, institution, duration, description, order_index } = await request.json()
    const result = await sql`
      INSERT INTO education (degree, institution, duration, description, order_index)
      VALUES (${degree}, ${institution}, ${duration}, ${description || null}, ${order_index || 0})
      RETURNING *
    `
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const sql = getDbClient()
    const { id, degree, institution, duration, description, order_index } = await request.json()
    const result = await sql`
      UPDATE education 
      SET degree = ${degree}, institution = ${institution}, duration = ${duration}, description = ${description || null}, order_index = ${order_index || 0}
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const sql = getDbClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    await sql`DELETE FROM education WHERE id = ${id}`
    return NextResponse.json({ message: "Education deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 })
  }
}
