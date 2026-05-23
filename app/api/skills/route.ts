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
    const skills = await listCollection("skills", sortByOrderThenDate)
    return NextResponse.json(skills)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { category, skill_list, order_index } = await request.json()
    const skill = await createDocument("skills", {
      category,
      skill_list: skill_list || [],
      order_index: order_index || 0,
    })
    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skills category" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, category, skill_list, order_index } = await request.json()
    const skill = await updateDocument("skills", id, {
      category,
      skill_list: skill_list || [],
      order_index: order_index || 0,
    })
    if (!skill) {
      return NextResponse.json({ error: "Skills category not found" }, { status: 404 })
    }
    return NextResponse.json(skill)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update skills" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

    await deleteDocument("skills", id)
    return NextResponse.json({ message: "Skills category deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete skills" }, { status: 500 })
  }
}
