import { NextResponse } from "next/server"
import { PROFILE } from "@/lib/profile"
import { getProject, getPost } from "@/lib/content"

const SYSTEM_PROMPT = `You are Senesh's AI assistant. You are helpful, professional, and concise. 
Here is information about Senesh Fernando:
- Name: ${PROFILE.name}
- Title: ${PROFILE.title}
- Summary: ${PROFILE.summary}
- Skills: ${PROFILE.skills.join(", ")}
- Interests: ${PROFILE.interests.join(", ")}
- Location: ${PROFILE.location}

Rules:
1. Be friendly and helpful.
2. If asked about a project or blog post, and content is provided, summarize it in 3 clear bullet points.
3. If you don't know the answer, say you're not sure and suggest contacting Senesh directly at ${PROFILE.email}.
4. Keep responses short and readable.
`

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json()
    const lastMessage = messages[messages.length - 1].content
    
    let pageContent = ""
    
    // Check if summarization is requested
    const lastMessageLower = lastMessage.toLowerCase()
    if (context?.pathname && (lastMessageLower.includes("summarize") || lastMessageLower.includes("summary"))) {
      const parts = context.pathname.split("/").filter(Boolean)
      if (parts.length >= 2) {
        const type = parts[0] // "projects" or "writing"
        const slug = parts[1]
        
        if (type === "projects") {
          const project = await getProject(slug)
          if (project) {
            pageContent = `PROJECT CONTENT TO SUMMARIZE:\nName: ${project.name}\nDescription: ${project.longDescription}\nStack: ${project.stack.join(", ")}`
          }
        } else if (type === "writing") {
          const post = await getPost(slug)
          if (post) {
            pageContent = `BLOG POST CONTENT TO SUMMARIZE:\nTitle: ${post.title}\nDescription: ${post.dek}\nContent: ${post.contentHtml || post.contentMarkdown || "No content available."}`
          }
        }
      }
    }

    const apiKey = process.env.NVIDIA_NIM_API_KEY
    if (!apiKey) {
      return NextResponse.json({ 
        content: "NVIDIA NIM API key is missing. Please add NVIDIA_NIM_API_KEY to your .env file." 
      })
    }

    const fullPrompt = pageContent 
      ? `${SYSTEM_PROMPT}\n\n${pageContent}\n\nUser: ${lastMessage}`
      : `${SYSTEM_PROMPT}\n\nUser: ${lastMessage}`

    // Call NVIDIA NIM API (standard OpenAI-compatible format)
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct", // More available high-quality model
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m: any) => ({ role: m.role, content: m.content })),
          ...(pageContent ? [{ role: "user", content: `Context for current page: ${pageContent}` }] : [])
        ],
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: 1024,
      })
    })

    const contentType = response.headers.get("content-type")
    const text = await response.text()

    if (!response.ok) {
      console.error("NVIDIA NIM Error Status:", response.status)
      console.error("NVIDIA NIM Error Body:", text)
      return NextResponse.json({ 
        content: `NVIDIA API Error (${response.status}). Please check your API key and model availability.` 
      })
    }

    try {
      const data = JSON.parse(text)
      const content = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response."
      return NextResponse.json({ content })
    } catch (parseError) {
      console.error("Failed to parse NVIDIA response as JSON:", text)
      return NextResponse.json({ 
        content: "Received an invalid response from the AI provider. Please try again later." 
      })
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
