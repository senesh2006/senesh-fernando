import { NextResponse } from "next/server"
import { getDocument, incrementField } from "@/lib/firestore"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const blog = await getDocument("blogs", id)

    return NextResponse.json({
      views: Number(blog?.views ?? 0),
    })
  } catch (error) {
    console.error("Failed to fetch blog views:", error)
    return NextResponse.json({ views: 0 })
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const views = await incrementField("blogs", id, "views", 1)

    if (views === null) {
      return NextResponse.json({ error: "Failed to update views" }, { status: 500 })
    }

    return NextResponse.json({ views })
  } catch (error) {
    console.error("Failed to update blog views:", error)
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 })
  }
}
