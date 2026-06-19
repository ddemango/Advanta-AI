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
    const { niche, platform, content_type, audience } = await req.json();
    if (!niche || !audience) return NextResponse.json({ error: "Niche and target audience are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a viral content strategist. Return JSON only." },
      { role: "user", content: `Generate trending content ideas for:
Niche: ${niche}
Platform: ${platform || "Instagram/TikTok/LinkedIn"}
Content Type: ${content_type || "mixed"}
Target Audience: ${audience}

Return JSON: { "trending_hooks": ["string"], "content_ideas": [{ "title": "string", "format": "string", "hook": "string", "outline": ["string"], "viral_factor": "string", "hashtags": ["string"] }], "posting_strategy": "string", "best_times": ["string"] }
Generate 5 content ideas with high viral potential.` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[trending-content]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate content ideas. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
