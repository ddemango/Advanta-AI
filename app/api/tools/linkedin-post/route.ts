import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });

  try {
    const { topic, angle, audience, tone, include_cta } = await req.json();
    if (!topic) return NextResponse.json({ error: "Topic is required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a LinkedIn content strategist who writes viral posts. Return JSON only." },
      { role: "user", content: `Write 3 LinkedIn post variations about:
Topic: ${topic}
Angle/Perspective: ${angle || "thought leadership"}
Target Audience: ${audience || "professionals"}
Tone: ${tone || "professional but conversational"}
Include CTA: ${include_cta || "yes"}

Return JSON: { "posts": [{ "hook": "string", "body": "string", "cta": "string", "hashtags": ["string"], "estimated_reach": "string", "why_it_works": "string" }] }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[linkedin-post]", err);
    return NextResponse.json({ error: isTimeout ? "Request timed out." : "Failed to generate post." }, { status: isTimeout ? 504 : 500 });
  }
}
