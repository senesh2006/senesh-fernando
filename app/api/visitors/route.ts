import { NextResponse } from "next/server"
import { ensureSchema, getSql } from "@/lib/neon"

const VISITOR_DOC_ID = "global"

export async function GET() {
  try {
    await ensureSchema()
    const rows = await getSql()`
      SELECT total_views, unique_visitors
      FROM visitor_stats
      WHERE id = ${VISITOR_DOC_ID}
      LIMIT 1
    `

    if (!rows[0]) {
      return NextResponse.json({ totalViews: 0, uniqueVisitors: 0 })
    }

    const row = rows[0] as { total_views: number; unique_visitors: number }
    return NextResponse.json({
      totalViews: Number(row.total_views ?? 0),
      uniqueVisitors: Number(row.unique_visitors ?? 0),
    })
  } catch (error) {
    console.error("Failed to fetch visitor stats:", error)
    return NextResponse.json({ totalViews: 0, uniqueVisitors: 0 })
  }
}

export async function POST() {
  try {
    await ensureSchema()

    const rows = await getSql()`
      INSERT INTO visitor_stats (id, total_views, unique_visitors, last_updated)
      VALUES (${VISITOR_DOC_ID}, 1, 1, NOW())
      ON CONFLICT (id) DO UPDATE
      SET total_views = visitor_stats.total_views + 1,
          last_updated = NOW()
      RETURNING total_views, unique_visitors
    `

    const row = rows[0] as { total_views: number; unique_visitors: number }
    return NextResponse.json({
      totalViews: Number(row.total_views ?? 0),
      uniqueVisitors: Number(row.unique_visitors ?? 0),
    })
  } catch (error) {
    console.error("Failed to update visitor stats:", error)
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 })
  }
}
