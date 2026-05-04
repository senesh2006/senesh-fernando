import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    // Using Resend API if available, otherwise log and acknowledge
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (resendApiKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: "seneshfernando55@gmail.com",
          subject: subject || `New message from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || "No subject"}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Resend error:", errorData)
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 500 }
        )
      }
    } else {
      // Log the message if no email service is configured
      console.log("Contact form submission:", { name, email, subject, message })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Failed to process contact form:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
