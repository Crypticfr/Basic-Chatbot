import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      return Response.json(
        { error: "Empty response from model" },
        { status: 500 }
      );
    }

    return Response.json({ reply });

  } catch (error) {
    console.error("GROQ API ERROR:", error);

    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
