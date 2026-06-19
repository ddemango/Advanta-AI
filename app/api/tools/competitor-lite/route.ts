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
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required." }, { status: 400 });

    let domain = url;
    try { domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname; } catch {}

    const content = await callAI([
      { role: "system", content: "You are a competitive intelligence analyst. Return only valid JSON." },
      { role: "user", content: `Analyze the competitor website: ${domain}
Generate a realistic competitive analysis. Return JSON:
{ "domain": "${domain}", "tech": { "frameworks": ["string","string"], "cms": "string or null", "thirdParties": ["string","string","string"] }, "performance": { "weightKB": number, "reqImages": number, "reqScripts": number }, "seo": { "title": "string", "metaDescription": "string", "headings": {"h1": number, "h2": number, "h3": number} }, "score": { "total": number, "performance": number, "seo": number, "tech": number }, "insights": ["string","string","string"] }
Make it realistic for the domain type.` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[competitor-lite]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to analyze competitor. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
