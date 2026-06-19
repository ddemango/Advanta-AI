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
    const { brand, industry, platforms, frequency, goals, audience } = await req.json();
    if (!brand || !industry) return NextResponse.json({ error: "Brand name and industry are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a content strategist. Return JSON only." },
      { role: "user", content: `Create a 4-week content calendar:
Brand: ${brand}
Industry: ${industry}
Platforms: ${platforms || "Instagram, LinkedIn, Twitter"}
Posting Frequency: ${frequency || "3x per week"}
Goals: ${goals || "brand awareness"}
Target Audience: ${audience || "general audience"}

Return JSON: { "strategy": "string", "weeks": [{ "week": number, "theme": "string", "posts": [{ "day": "string", "platform": "string", "type": "string", "caption": "string", "hashtags": ["string"] }] }], "tips": ["string"] }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[content-calendar]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate calendar. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
