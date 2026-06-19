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
    const { topic, duration, style, audience, platform } = await req.json();
    if (!topic) return NextResponse.json({ error: "Topic is required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a professional voiceover scriptwriter. Return JSON only." },
      { role: "user", content: `Write a voiceover script:
Topic: ${topic}
Duration: ${duration || "60 seconds"}
Style: ${style || "conversational"}
Target Audience: ${audience || "general"}
Platform: ${platform || "YouTube"}

Return JSON: { "title": "string", "hook": "string", "script": "string", "word_count": number, "estimated_duration": "string", "delivery_notes": ["string"], "cta": "string" }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[voiceover]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate script. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
