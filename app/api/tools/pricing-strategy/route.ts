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
    const { product, industry, current_price, competitors, costs, target_market } = await req.json();
    if (!product) return NextResponse.json({ error: "Product or service name is required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a pricing strategist and business consultant. Return JSON only." },
      { role: "user", content: `Analyze pricing strategy for:
Product/Service: ${product}
Industry: ${industry || "General"}
Current Price: ${current_price || "Not set"}
Competitors: ${competitors || "Not specified"}
Cost Structure: ${costs || "Not specified"}
Target Market: ${target_market || "General market"}

Return JSON: { "recommended_price": "string", "strategy": "string", "tiers": [{"name":"string","price":"string","features":["string"]}], "rationale": "string", "psychological_tactics": ["string"], "risks": ["string"], "revenue_projection": "string" }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[pricing-strategy]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate strategy. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
