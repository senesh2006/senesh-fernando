import { NextResponse } from "next/server"
import {
  createDocument,
  deleteDocument,
  listCollection,
  sortByOrderThenDate,
  updateDocument,
} from "@/lib/firestore"

export async function GET() {
  try {
    const achievements = await listCollection("achievements", sortByOrderThenDate)
    return NextResponse.json(achievements)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, date, order_index } = await request.json()
    const achievement = await createDocument("achievements", {
      title,
      description,
      date,
      order_index: order_index || 0,
    })
    return NextResponse.json(achievement, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, description, date, order_index } = await request.json()
    const achievement = await updateDocument("achievements", id, {
      title,
      description,
      date,
      order_index: order_index || 0,
    })
    if (!achievement) {
      return NextResponse.json({ error: "Achievement not found" }, { status: 404 })
    }
    return NextResponse.json(achievement)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

    await deleteDocument("achievements", id)
    return NextResponse.json({ message: "Achievement deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 })
  }
}
