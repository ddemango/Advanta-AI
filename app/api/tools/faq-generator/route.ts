import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });

  try {
    const { topic, audience, product_service, num_faqs, tone } = await req.json();
    if (!topic) return NextResponse.json({ error: "Topic is required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are an SEO content expert specializing in FAQ content. Return JSON only." },
      { role: "user", content: `Generate a comprehensive FAQ section for:
Topic / Page: ${topic}
Product / Service: ${product_service || ""}
Target Audience: ${audience || "general users"}
Number of FAQs: ${num_faqs || 10}
Tone: ${tone || "professional and helpful"}

Return JSON: { "faqs": [{ "question": "string", "answer": "string", "category": "string" }], "schema_markup": "string", "seo_tips": ["string"] }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[faq-generator]", err);
    return NextResponse.json({ error: isTimeout ? "Request timed out." : "Failed to generate FAQs." }, { status: isTimeout ? 504 : 500 });
  }
}
