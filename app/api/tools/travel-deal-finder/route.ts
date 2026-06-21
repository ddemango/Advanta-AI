import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });

  try {
    const { from_city, interests, budget, travel_style, duration, flexibility } = await req.json();
    if (!from_city || !budget) return NextResponse.json({ error: "Departure city and budget are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a travel deals expert who knows how to find underrated destinations, budget hacks, and hidden travel deals. Return JSON only." },
      { role: "user", content: `Find the best travel deal opportunities for:
Departing From: ${from_city}
Budget (total per person): ${budget}
Travel Interests: ${interests || "culture, food, nature, adventure"}
Travel Style: ${travel_style || "budget-conscious but comfortable"}
Trip Length: ${duration || "7-10 days"}
Flexibility: ${flexibility || "flexible on destination, somewhat flexible on dates"}

Return JSON: { "top_destinations": [{ "destination": "string", "country": "string", "why_great_deal": "string", "estimated_total_cost": "string", "flight_estimate": "string", "hotel_per_night": "string", "best_travel_months": "string", "deal_score": "string", "highlights": ["string"] }], "deal_strategies": [{ "strategy": "string", "how_to": "string", "savings_potential": "string" }], "mistake_fares_tip": "string", "credit_card_tip": "string", "apps_to_use": [{ "name": "string", "best_for": "string" }] }
Give 5 destination recommendations.` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[travel-deal-finder]", err);
    return NextResponse.json({ error: isTimeout ? "Request timed out." : "Failed to find travel deals." }, { status: isTimeout ? 504 : 500 });
  }
}
