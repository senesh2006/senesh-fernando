import { NextResponse } from "next/server"
import { createDocument, listCollection, sortByDateDesc } from "@/lib/firestore"

export async function GET() {
  try {
    const recommendations = await listCollection("recommendations", sortByDateDesc)
    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Failed to fetch recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, role, company, message } = body

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      )
    }

    const recommendation = await createDocument("recommendations", {
      name,
      role: role || null,
      company: company || null,
      message,
    })

    return NextResponse.json(recommendation, { status: 201 })
  } catch (error) {
    console.error("Failed to create recommendation:", error)
    return NextResponse.json({ error: "Failed to create recommendation" }, { status: 500 })
  }
}
