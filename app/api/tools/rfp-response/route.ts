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
    const { project, description, requirements, timeline, budget, constraints } = await req.json();
    if (!project) return NextResponse.json({ error: "Project name is required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a proposal writing expert. Return only valid JSON." },
      { role: "user", content: `Create a professional RFP response for:
Project: ${project}
Description: ${description || ""}
Requirements: ${requirements || ""}
Timeline: ${timeline || "TBD"}
Budget: ${budget || "Not specified"}
Constraints: ${constraints || "None"}

Return JSON: { "project": "string", "summary": "string", "requirements": ["string"], "timeline": ["Phase 1: string","Phase 2: string","Phase 3: string"], "assumptions": ["string"], "risks": ["string"] }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[rfp-response]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate RFP response. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
