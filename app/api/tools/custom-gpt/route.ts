import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  try {
    const { bot_name, purpose, industry, personality, capabilities, restrictions } = await req.json();
    if (!bot_name || !purpose) return NextResponse.json({ error: "Bot name and purpose are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are an AI prompt engineer specializing in custom GPT creation. Return JSON only." },
      { role: "user", content: `Create a custom GPT/chatbot configuration for:
Bot Name: ${bot_name}
Purpose: ${purpose}
Industry: ${industry || "General"}
Personality: ${personality || "professional and helpful"}
Capabilities: ${capabilities || "general assistance"}
Restrictions: ${restrictions || "none"}

Return JSON: { "system_prompt": "string", "starter_messages": ["string"], "example_conversations": [{"user":"string","assistant":"string"}], "suggested_knowledge": ["string"], "deployment_tips": ["string"], "name": "${bot_name}" }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[custom-gpt]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate bot config. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
