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
    const experience = await listCollection("experience", sortByOrderThenDate)
    return NextResponse.json(experience)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { role, company, duration, description, achievements, order_index } =
      await request.json()
    const entry = await createDocument("experience", {
      role,
      company,
      duration,
      description,
      achievements: achievements || [],
      order_index: order_index || 0,
    })
    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, role, company, duration, description, achievements, order_index } =
      await request.json()
    const entry = await updateDocument("experience", id, {
      role,
      company,
      duration,
      description,
      achievements: achievements || [],
      order_index: order_index || 0,
    })
    if (!entry) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }
    return NextResponse.json(entry)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

    await deleteDocument("experience", id)
    return NextResponse.json({ message: "Experience deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
  }
}
