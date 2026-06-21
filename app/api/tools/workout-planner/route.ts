import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });

  try {
    const { goal, fitness_level, equipment, days_per_week, session_length, limitations } = await req.json();
    if (!goal) return NextResponse.json({ error: "Fitness goal is required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a certified personal trainer and nutrition coach. Return JSON only." },
      { role: "user", content: `Create a personalized weekly workout plan for:
Goal: ${goal}
Fitness Level: ${fitness_level || "beginner"}
Equipment Available: ${equipment || "no equipment / bodyweight only"}
Days Per Week: ${days_per_week || "3"}
Session Length: ${session_length || "45 minutes"}
Injuries / Limitations: ${limitations || "none"}

Return JSON: { "plan_name": "string", "goal_summary": "string", "weekly_schedule": [{ "day": "string", "focus": "string", "warmup": "string", "exercises": [{ "name": "string", "sets": "string", "reps": "string", "rest": "string", "tip": "string" }], "cooldown": "string", "duration": "string" }], "nutrition_tips": ["string"], "recovery_tips": ["string"], "progress_milestones": ["string"], "weekly_tip": "string" }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[workout-planner]", err);
    return NextResponse.json({ error: isTimeout ? "Request timed out." : "Failed to generate workout plan." }, { status: isTimeout ? 504 : 500 });
  }
}
