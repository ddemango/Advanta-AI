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
    const { brand, period, channels, goals, budget, metrics } = await req.json();
    if (!brand) return NextResponse.json({ error: "Brand name is required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a senior marketing analyst. Return only valid JSON." },
      { role: "user", content: `Generate a comprehensive marketing report for:
Brand: ${brand}
Period: ${period || "Last 30 days"}
Channels: ${channels || "All channels"}
Goals: ${goals || "Not specified"}
Budget: ${budget || "Not specified"}
Key Metrics: ${metrics || "Standard metrics"}

Return JSON: { "brand": "string", "period": "string", "kpis": [{"name":"string","value":"string","delta":"string"}], "insights": { "channels": [{"channel":"string","summary":"string"}], "recommendations": ["string"] } }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[marketing-report]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate report. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
