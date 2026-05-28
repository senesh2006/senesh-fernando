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
    const lastMessage = messages[messages.length - 1].content.toLowerCase()
    
    let pageContent = ""
    
    // Check if summarization is requested
    if (context?.pathname && (lastMessage.includes("summarize") || lastMessage.includes("summary"))) {
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

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ 
        content: "I'm currently in 'offline mode' because the Gemini API key is missing. Please add GEMINI_API_KEY to your .env file." 
      })
    }

    const prompt = pageContent 
      ? `${SYSTEM_PROMPT}\n\n${pageContent}\n\nUser: ${lastMessage}`
      : `${SYSTEM_PROMPT}\n\nUser: ${lastMessage}`

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    })

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response."

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
