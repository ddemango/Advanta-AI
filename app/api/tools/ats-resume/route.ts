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
    const { resume, job_description, job_title } = await req.json();
    if (!resume || !job_description) return NextResponse.json({ error: "Resume and job description are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are an ATS optimization expert and career coach. Return JSON only." },
      { role: "user", content: `Optimize this resume for ATS and the job description:
Resume: ${resume}
Job Title: ${job_title || ""}
Job Description: ${job_description}

Return JSON: { "ats_score": number, "missing_keywords": ["string"], "optimized_summary": "string", "optimized_bullets": ["string"], "skills_to_add": ["string"], "formatting_tips": ["string"], "overall_feedback": "string" }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[ats-resume]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to analyze resume. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
