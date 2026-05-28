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
      likes: Number(blog?.likes ?? 0),
    })
  } catch (error) {
    console.error("Failed to fetch blog likes:", error)
    return NextResponse.json({ likes: 0 })
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const likes = await incrementField("blogs", id, "likes", 1)

    if (likes === null) {
      return NextResponse.json({ error: "Failed to update likes" }, { status: 500 })
    }

    return NextResponse.json({ likes })
  } catch (error) {
    console.error("Failed to update blog likes:", error)
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 })
  }
}
