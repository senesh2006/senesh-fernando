import { NextResponse } from "next/server"
import {
  createDocument,
  deleteDocument,
  getDocument,
  listCollection,
  sortByDateDesc,
  updateDocument,
} from "@/lib/firestore"

export async function GET() {
  try {
    const blogs = await listCollection("blogs", sortByDateDesc)
    const withViews = blogs.map((blog) => ({
      ...blog,
      views: Number(blog.views ?? 0),
    }))
    return NextResponse.json(withViews)
  } catch (error) {
    console.error("Failed to fetch blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      category,
      tags,
      image_url,
      github_url,
      linkedin_url,
      other_url,
    } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      )
    }

    const blog = await createDocument("blogs", {
      title,
      content,
      category,
      tags: tags || [],
      image_url: image_url || null,
      github_url: github_url || null,
      linkedin_url: linkedin_url || null,
      other_url: other_url || null,
      views: 0,
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error("Failed to create blog:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      title,
      content,
      category,
      tags,
      image_url,
      github_url,
      linkedin_url,
      other_url,
    } = body

    if (!id || !title || !content || !category) {
      return NextResponse.json(
        { error: "ID, title, content, and category are required" },
        { status: 400 }
      )
    }

    const existing = await getDocument("blogs", id)
    if (!existing) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const blog = await updateDocument("blogs", id, {
      title,
      content,
      category,
      tags: tags || [],
      image_url: image_url || null,
      github_url: github_url || null,
      linkedin_url: linkedin_url || null,
      other_url: other_url || null,
    })

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Failed to update blog:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const deleted = await deleteDocument("blogs", id)
    if (!deleted) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Failed to delete blog:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}
