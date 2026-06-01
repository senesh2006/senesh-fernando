import { NextResponse } from "next/server";

async function handleRequest() {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  if (!apiKey) {
    console.error("DEBUG: ASSEMBLYAI_API_KEY is missing from process.env");
    return NextResponse.json(
      { error: "ASSEMBLYAI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  console.log("DEBUG: Attempting to fetch AssemblyAI token...");

  try {
    // Voice Agent API requires "Bearer " prefix for authorization
    const response = await fetch("https://agents.assemblyai.com/v1/token", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expires_in_seconds: 300,
        max_session_duration_seconds: 3600, // 1 hour cap
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("AssemblyAI Token Error:", errorData);
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch AssemblyAI token" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("AssemblyAI Token Route Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return handleRequest();
}

export async function GET() {
  return handleRequest();
}
