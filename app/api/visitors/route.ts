import { NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { getFirestoreDb } from "@/lib/firebase-admin"

const VISITOR_DOC_ID = "global"

export async function GET() {
  try {
    const doc = await getFirestoreDb()
      .collection("visitor_stats")
      .doc(VISITOR_DOC_ID)
      .get()

    if (!doc.exists) {
      return NextResponse.json({ totalViews: 0, uniqueVisitors: 0 })
    }

    const data = doc.data()!
    return NextResponse.json({
      totalViews: Number(data.total_views ?? 0),
      uniqueVisitors: Number(data.unique_visitors ?? 0),
    })
  } catch (error) {
    console.error("Failed to fetch visitor stats:", error)
    return NextResponse.json({ totalViews: 0, uniqueVisitors: 0 })
  }
}

export async function POST() {
  try {
    const ref = getFirestoreDb().collection("visitor_stats").doc(VISITOR_DOC_ID)
    const existing = await ref.get()

    if (!existing.exists) {
      await ref.set({
        total_views: 1,
        unique_visitors: 1,
        last_updated: FieldValue.serverTimestamp(),
      })

      return NextResponse.json({ totalViews: 1, uniqueVisitors: 1 })
    }

    await ref.update({
      total_views: FieldValue.increment(1),
      last_updated: FieldValue.serverTimestamp(),
    })

    const updated = await ref.get()
    const data = updated.data()!

    return NextResponse.json({
      totalViews: Number(data.total_views ?? 0),
      uniqueVisitors: Number(data.unique_visitors ?? 0),
    })
  } catch (error) {
    console.error("Failed to update visitor stats:", error)
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 })
  }
}
