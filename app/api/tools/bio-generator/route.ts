import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });

  try {
    const { name, role, company, achievements, personality, platforms } = await req.json();
    if (!name || !role) return NextResponse.json({ error: "Name and role are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a personal branding expert who writes compelling professional bios. Return JSON only." },
      { role: "user", content: `Write professional bios for:
Name: ${name}
Role / Title: ${role}
Company / Brand: ${company || ""}
Key Achievements: ${achievements || ""}
Personality / Tone: ${personality || "professional and approachable"}
Platforms Needed: ${platforms || "LinkedIn, Twitter, Website"}

Return JSON: { "bios": { "linkedin": "string", "twitter": "string", "website_short": "string", "website_long": "string", "speaker": "string" }, "headline_options": ["string"], "tagline_options": ["string"] }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[bio-generator]", err);
    return NextResponse.json({ error: isTimeout ? "Request timed out." : "Failed to generate bios." }, { status: isTimeout ? 504 : 500 });
  }
}
