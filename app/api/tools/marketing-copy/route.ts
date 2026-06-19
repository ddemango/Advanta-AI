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
    const { product, audience, benefit, tone, format } = await req.json();
    if (!product || !audience) return NextResponse.json({ error: "Product and target audience are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a world-class copywriter. Return JSON only." },
      { role: "user", content: `Write marketing copy for:
Product/Service: ${product}
Target Audience: ${audience}
Key Benefit: ${benefit || ""}
Tone: ${tone || "persuasive"}
Format: ${format || "all"}

Return JSON: { "headline": "string", "subheadline": "string", "hero_copy": "string", "ad_copies": [{"platform":"string","copy":"string"}], "email_subject_lines": ["string"], "cta_variations": ["string"], "tagline": "string" }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[marketing-copy]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate copy. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
