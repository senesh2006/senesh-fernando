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
    const projects = await listCollection("projects", sortByOrderThenDate)
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      language,
      description,
      full_description,
      source_url,
      skills,
      impact,
      image_url,
      gallery,
      order_index,
    } = body

    const project = await createDocument("projects", {
      name,
      language,
      description,
      full_description,
      source_url: source_url || null,
      skills: skills || [],
      impact,
      image_url,
      gallery: gallery || [],
      order_index: order_index || 0,
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      language,
      description,
      full_description,
      source_url,
      skills,
      impact,
      image_url,
      gallery,
      order_index,
    } = body

    const project = await updateDocument("projects", id, {
      name,
      language,
      description,
      full_description,
      source_url: source_url || null,
      skills: skills || [],
      impact,
      image_url,
      gallery: gallery || [],
      order_index: order_index || 0,
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Failed to update project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

    const deleted = await deleteDocument("projects", id)
    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Failed to delete project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
