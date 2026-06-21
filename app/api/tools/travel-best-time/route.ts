import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });

  try {
    const { destination, priorities, travel_style, duration, from_country } = await req.json();
    if (!destination) return NextResponse.json({ error: "Destination is required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a world-travel expert with deep knowledge of global destinations, weather patterns, tourism seasons, and pricing trends. Return JSON only." },
      { role: "user", content: `Give a comprehensive best-time-to-visit guide for:
Destination: ${destination}
Traveler's Home Country: ${from_country || "USA"}
Priorities: ${priorities || "good weather, fewer crowds, affordable prices"}
Travel Style: ${travel_style || "general tourist"}
Trip Duration: ${duration || "1-2 weeks"}

Return JSON: { "destination": "string", "overview": "string", "best_months": [{ "month": "string", "weather": "string", "crowds": "string", "price_level": "string", "highlights": ["string"], "rating": "string" }], "worst_months": [{ "month": "string", "reason": "string" }], "sweet_spot": { "months": "string", "why": "string" }, "festivals_events": [{ "name": "string", "month": "string", "description": "string" }], "packing_tips": ["string"], "budget_estimate": { "budget": "string", "mid_range": "string", "luxury": "string" } }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[travel-best-time]", err);
    return NextResponse.json({ error: isTimeout ? "Request timed out." : "Failed to get travel insights." }, { status: isTimeout ? 504 : 500 });
  }
}
