import { NextResponse } from "next/server";

export async function GET() {
  return handleRequest();
}

export async function POST() {
  return handleRequest();
}

async function handleRequest() {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  if (!apiKey) {
    console.error("DEBUG: ASSEMBLYAI_API_KEY is missing from environment variables.");
    return NextResponse.json(
      { error: "API Key not found on server. Please ensure ASSEMBLYAI_API_KEY is set in Vercel." },
      { status: 500 }
    );
  }

  // Log a safe hint for debugging
  console.log(`DEBUG: API Key found (starts with: ${apiKey.substring(0, 4)}...)`);

  try {
    const response = await fetch("https://agents.assemblyai.com/v1/token", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expires_in_seconds: 300,
        max_session_duration_seconds: 3600,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`AssemblyAI API Error (Status: ${response.status}):`, data);
      const specificError = data.error || data.message || JSON.stringify(data);
      return NextResponse.json(
        { error: `AssemblyAI rejected the request: ${specificError}` },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Fetch Error:", err);
    return NextResponse.json(
      { error: "Failed to communicate with AssemblyAI." },
      { status: 500 }
    );
  }
}
