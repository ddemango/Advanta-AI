import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });

  try {
    const { title, topic, channel_niche, keywords, timestamps, cta_link } = await req.json();
    if (!title || !topic) return NextResponse.json({ error: "Video title and topic are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a YouTube SEO expert and content strategist. Return JSON only." },
      { role: "user", content: `Create a full YouTube description package for:
Video Title: ${title}
Topic/Summary: ${topic}
Channel Niche: ${channel_niche || "general"}
Target Keywords: ${keywords || ""}
Timestamps: ${timestamps || "none provided"}
CTA Link: ${cta_link || ""}

Return JSON: { "description": "string", "tags": ["string"], "chapters": ["string"], "seo_title_variations": ["string"], "thumbnail_text_ideas": ["string"], "pinned_comment": "string" }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[youtube-description]", err);
    return NextResponse.json({ error: isTimeout ? "Request timed out." : "Failed to generate YouTube description." }, { status: isTimeout ? 504 : 500 });
  }
}
