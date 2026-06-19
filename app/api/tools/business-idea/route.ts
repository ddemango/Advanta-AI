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
    const { idea, market, budget, skills, location } = await req.json();
    if (!idea || !market) return NextResponse.json({ error: "Business idea and target market are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a startup mentor and business analyst. Return JSON only." },
      { role: "user", content: `Validate this business idea:
Idea: ${idea}
Target Market: ${market}
Starting Budget: ${budget || "unknown"}
Founder Skills: ${skills || "general"}
Location/Scope: ${location || "online/global"}

Return JSON: { "viability_score": number, "verdict": "string", "market_size": "string", "competition_level": "string", "revenue_model": ["string"], "key_risks": ["string"], "key_advantages": ["string"], "first_steps": ["string"], "estimated_time_to_revenue": "string", "pivot_suggestions": ["string"] }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[business-idea]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to validate idea. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
