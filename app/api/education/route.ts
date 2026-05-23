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
    const education = await listCollection("education", sortByOrderThenDate)
    return NextResponse.json(education)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { degree, institution, duration, description, order_index } =
      await request.json()
    const entry = await createDocument("education", {
      degree,
      institution,
      duration,
      description: description || null,
      order_index: order_index || 0,
    })
    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, degree, institution, duration, description, order_index } =
      await request.json()
    const entry = await updateDocument("education", id, {
      degree,
      institution,
      duration,
      description: description || null,
      order_index: order_index || 0,
    })
    if (!entry) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 })
    }
    return NextResponse.json(entry)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

    await deleteDocument("education", id)
    return NextResponse.json({ message: "Education deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 })
  }
}
