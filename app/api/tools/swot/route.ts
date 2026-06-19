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
    const { company, industry, description, goals, challenges } = await req.json();
    if (!company) return NextResponse.json({ error: "Company name is required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a strategic business analyst. Return only valid JSON." },
      { role: "user", content: `Generate a comprehensive SWOT analysis for:
Company: ${company}
Industry: ${industry || "General"}
Description: ${description || ""}
Goals: ${goals || ""}
Challenges: ${challenges || ""}

Return JSON: { "company": "string", "strengths": ["string","string","string","string"], "weaknesses": ["string","string","string"], "opportunities": ["string","string","string","string"], "threats": ["string","string","string"] }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[swot]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate SWOT. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
