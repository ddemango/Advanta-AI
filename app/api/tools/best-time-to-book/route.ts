import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });

  try {
    const { destination, travel_month, book_type, flexibility, from_city } = await req.json();
    if (!destination || !travel_month) return NextResponse.json({ error: "Destination and travel month are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a travel pricing expert who knows airline and hotel pricing algorithms, booking windows, and deal strategies. Return JSON only." },
      { role: "user", content: `Give optimal booking timing advice for:
Destination: ${destination}
Departing From: ${from_city || "USA"}
Travel Month: ${travel_month}
Booking Type: ${book_type || "flights and hotels"}
Date Flexibility: ${flexibility || "somewhat flexible (±3 days)"}

Return JSON: { "destination": "string", "travel_month": "string", "flight_strategy": { "ideal_booking_window": "string", "best_days_to_book": "string", "best_days_to_fly": "string", "time_of_day_to_search": "string", "price_drop_triggers": ["string"], "avoid": ["string"] }, "hotel_strategy": { "ideal_booking_window": "string", "best_deal_tactics": ["string"], "cancellation_tip": "string" }, "deal_tools": [{ "tool": "string", "why": "string", "pro_tip": "string" }], "savings_estimate": "string", "red_flags": ["string"], "insider_tips": ["string"] }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[best-time-to-book]", err);
    return NextResponse.json({ error: isTimeout ? "Request timed out." : "Failed to get booking advice." }, { status: isTimeout ? 504 : 500 });
  }
}
