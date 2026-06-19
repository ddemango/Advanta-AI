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
    const { brand_name, industry, values, audience, style } = await req.json();
    if (!brand_name || !industry) return NextResponse.json({ error: "Brand name and industry are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a brand identity designer. Return JSON only." },
      { role: "user", content: `Create a brand kit for:
Brand Name: ${brand_name}
Industry: ${industry}
Core Values: ${values || ""}
Target Audience: ${audience || "general audience"}
Style Preference: ${style || "modern and professional"}

Return JSON: { "brand_name": "${brand_name}", "tagline": "string", "brand_story": "string", "colors": [{"name":"string","hex":"string","usage":"string"}], "typography": {"primary":"string","secondary":"string","usage":"string"}, "voice": {"tone":"string","words_to_use":["string"],"words_to_avoid":["string"]}, "logo_concepts": ["string"], "brand_values": ["string"] }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[brand-kit]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate brand kit. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
