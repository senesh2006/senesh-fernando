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
    const recommendations = await sql`
      SELECT id, name, role, company, message, created_at 
      FROM recommendations 
      ORDER BY created_at DESC
    `
    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Failed to fetch recommendations:", error)
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("[v0] POST /api/recommendations - Starting")
    
    if (!process.env.DATABASE_URL) {
      console.log("[v0] DATABASE_URL not found")
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }
    
    const sql = getDbClient()
    const body = await request.json()
    console.log("[v0] Request body:", body)
    
    const { name, role, company, message } = body

    if (!name || !message) {
      console.log("[v0] Validation failed - missing name or message")
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      )
    }

    console.log("[v0] Inserting recommendation into database")
    const result = await sql`
      INSERT INTO recommendations (name, role, company, message)
      VALUES (${name}, ${role || null}, ${company || null}, ${message})
      RETURNING id, name, role, company, message, created_at
    `
    console.log("[v0] Insert successful:", result)

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Failed to create recommendation:", error)
    return NextResponse.json(
      { error: "Failed to create recommendation" },
      { status: 500 }
    )
  }
}
