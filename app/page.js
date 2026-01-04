"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "API request failed");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);

    } catch (err) {
      console.error("FRONTEND ERROR:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error talking to AI" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1>Bondhu, Your private chatbot</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          minHeight: 300,
          overflowY: "auto",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <b>{msg.role === "user" ? "You" : "Bot"}:</b>{" "}
            {msg.content}
          </div>
        ))}
        {loading && <div><b>Bot:</b> typing…</div>}
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "80%", padding: 8 }}
          placeholder="Say something..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{ padding: 8 }}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </main>
  );
}
