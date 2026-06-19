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
    const { prospect, company, role, pain_point, your_offer, tone, sender_name } = await req.json();
    if (!prospect || !your_offer) {
      return NextResponse.json({ error: "Prospect name and your offer are required." }, { status: 400 });
    }

    const content = await callAI([
      { role: "system", content: "You are an expert cold email copywriter who writes high-converting emails. Return JSON only." },
      { role: "user", content: `Write 3 cold email variations for this prospect:
Prospect Name: ${prospect}
Their Company: ${company || ""}
Their Role: ${role || ""}
Pain Point: ${pain_point || ""}
Your Offer: ${your_offer}
Tone: ${tone || "professional"}
Sender: ${sender_name || ""}

Return JSON: { "emails": [{ "subject": "string", "body": "string", "cta": "string", "why_it_works": "string" }] }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[cold-email]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate emails. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
