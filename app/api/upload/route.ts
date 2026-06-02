import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function POST(request: Request): Promise<NextResponse> {
  // Security check: Only allow authenticated admins to upload
  const session = await getServerSession();
  
  // Note: Depending on your NextAuth config, you might need to check for a specific role
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  try {
    const body = request.body;
    if (!body) {
      return NextResponse.json({ error: "No file content provided" }, { status: 400 });
    }

    const blob = await put(filename, body, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
