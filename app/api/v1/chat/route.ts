import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_input } = body

    await new Promise((resolve) => setTimeout(resolve, 1000))

    let response

    if (user_input.toLowerCase().includes("hello") || user_input.toLowerCase().includes("hi")) {
      response = "Hello there! How can I assist you today?"
    } else if (user_input.toLowerCase().includes("help")) {
      response = "I'm here to help! You can ask me questions, request information, or just chat."
    } else if (user_input.toLowerCase().includes("feature") || user_input.toLowerCase().includes("can you")) {
      response =
        "I can provide information, answer questions, and have conversations on a wide range of topics. What would you like to know?"
    } else if (user_input.toLowerCase().includes("thank")) {
      response = "You're welcome! Is there anything else I can help you with?"
    } else {
      response = `I received your message: "${user_input}". How can I help you further with this?`
    }

    return NextResponse.json({ model_response: response })
  } catch (error) {
    console.error("Error processing chat request:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}

