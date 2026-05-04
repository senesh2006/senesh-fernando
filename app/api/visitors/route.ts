import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

function getDbClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured")
  }
  return neon(process.env.DATABASE_URL)
}

export async function GET() {
  try {
    const sql = getDbClient()
    const result = await sql`SELECT total_views, unique_visitors FROM visitor_stats WHERE id = 1`
    
    if (result.length === 0) {
      return NextResponse.json({ totalViews: 0, uniqueVisitors: 0 })
    }
    
    return NextResponse.json({
      totalViews: result[0].total_views,
      uniqueVisitors: result[0].unique_visitors,
    })
  } catch (error) {
    console.error("Failed to fetch visitor stats:", error)
    return NextResponse.json({ totalViews: 0, uniqueVisitors: 0 })
  }
}

export async function POST() {
  try {
    const sql = getDbClient()
    
    // Increment total views
    const result = await sql`
      UPDATE visitor_stats 
      SET total_views = total_views + 1, last_updated = NOW()
      WHERE id = 1
      RETURNING total_views, unique_visitors
    `
    
    if (result.length === 0) {
      // Create initial row if it doesn't exist
      const newResult = await sql`
        INSERT INTO visitor_stats (id, total_views, unique_visitors)
        VALUES (1, 1, 1)
        RETURNING total_views, unique_visitors
      `
      return NextResponse.json({
        totalViews: newResult[0].total_views,
        uniqueVisitors: newResult[0].unique_visitors,
      })
    }
    
    return NextResponse.json({
      totalViews: result[0].total_views,
      uniqueVisitors: result[0].unique_visitors,
    })
  } catch (error) {
    console.error("Failed to update visitor stats:", error)
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 })
  }
}
