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
    const { product, audience, goal, current_headline } = await req.json();
    if (!product || !audience) return NextResponse.json({ error: "Product and audience are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a conversion rate optimization expert. Return JSON only." },
      { role: "user", content: `Generate headline A/B test variations for:
Product: ${product}
Audience: ${audience}
Goal: ${goal || "conversions"}
Current Headline: ${current_headline || "none"}

Return JSON: { "variants": [{ "headline": "string", "type": "string", "psychology": "string", "predicted_ctr": "string", "best_for": "string" }], "testing_advice": "string", "winner_prediction": "string" }
Generate 6 variants using different psychological triggers (curiosity, urgency, social proof, benefit, pain, numbers).` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[headline-split]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate headlines. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
