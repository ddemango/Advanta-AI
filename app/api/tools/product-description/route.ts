import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });

  try {
    const { product_name, category, features, audience, tone, platform } = await req.json();
    if (!product_name || !features) return NextResponse.json({ error: "Product name and features are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are an e-commerce copywriter who writes high-converting product descriptions. Return JSON only." },
      { role: "user", content: `Write product descriptions for:
Product Name: ${product_name}
Category: ${category || "general"}
Key Features / Details: ${features}
Target Audience: ${audience || "general shoppers"}
Tone: ${tone || "persuasive and friendly"}
Platform: ${platform || "Shopify / Amazon"}

Return JSON: { "short_description": "string", "long_description": "string", "bullet_points": ["string"], "seo_title": "string", "meta_description": "string", "amazon_backend_keywords": ["string"], "conversion_tips": ["string"] }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[product-description]", err);
    return NextResponse.json({ error: isTimeout ? "Request timed out." : "Failed to generate description." }, { status: isTimeout ? 504 : 500 });
  }
}
