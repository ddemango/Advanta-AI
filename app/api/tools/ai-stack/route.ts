import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  try {
    const { businessType, challenge, teamSize, budget } = await req.json();
    if (!businessType || !challenge) {
      return NextResponse.json({ error: "Business type and challenge are required." }, { status: 400 });
    }

    const content = await callAI([
      { role: "system", content: "You are an AI tools advisor who helps businesses build the right AI stack. Be specific and practical. Return JSON only." },
      { role: "user", content: `Build a personalized AI tool stack recommendation for this business:

Business Type: ${businessType}
Biggest Challenge: ${challenge}
Team Size: ${teamSize || "1-10 people"}
Monthly Budget: ${budget || "Under $200/month"}

Return JSON with this structure:
{
  "summary": "2-sentence overview of their recommended approach",
  "tools": [
    {
      "name": "Tool Name",
      "category": "category (e.g. CRM, Email, Analytics)",
      "purpose": "What this tool solves for them specifically",
      "price": "price per month",
      "priority": "Must Have" | "High Priority" | "Nice to Have",
      "why": "one sentence on why this fits their specific situation"
    }
  ],
  "quick_wins": ["specific action they can take this week"],
  "estimated_monthly_cost": "string",
  "estimated_time_saved": "X hours per week",
  "next_step": "The single most important thing to do first"
}

Give 4-6 specific tools. Make recommendations specific to ${businessType} dealing with ${challenge} on a ${budget || "tight"} budget with ${teamSize || "a small team"}.` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[ai-stack]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to build your stack. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
