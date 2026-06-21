import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });

  try {
    const { mood, genres, loved, disliked, streaming, type, length } = await req.json();
    if (!mood && !genres) return NextResponse.json({ error: "Tell us your mood or favorite genres." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are an expert film and TV critic with encyclopedic knowledge of movies and shows. Return JSON only." },
      { role: "user", content: `Recommend movies and TV shows based on these preferences:
Current Mood: ${mood || ""}
Favorite Genres: ${genres || ""}
Recently Loved: ${loved || ""}
Disliked: ${disliked || ""}
Streaming Services: ${streaming || "any"}
Looking For: ${type || "both movies and shows"}
Preferred Length: ${length || "any"}

Return JSON: { "picks": [{ "title": "string", "type": "Movie or TV Show", "year": "string", "genre": "string", "streaming_on": "string", "why_youll_love_it": "string", "vibe": "string", "rating": "string", "seasons_or_runtime": "string" }], "mood_summary": "string", "hidden_gems": [{ "title": "string", "why": "string", "streaming_on": "string" }] }
Give 6 main picks and 3 hidden gems.` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[movie-matchmaker]", err);
    return NextResponse.json({ error: isTimeout ? "Request timed out." : "Failed to get recommendations." }, { status: isTimeout ? 504 : 500 });
  }
}
