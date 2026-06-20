import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });

  try {
    const { name, role, company, experience, skills, reason, job_description } = await req.json();
    if (!name || !role || !company) return NextResponse.json({ error: "Name, role, and company are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are an expert career coach and cover letter writer. Return JSON only." },
      { role: "user", content: `Write a compelling cover letter for:
Applicant Name: ${name}
Target Role: ${role}
Company: ${company}
Relevant Experience: ${experience || ""}
Key Skills: ${skills || ""}
Why This Company: ${reason || ""}
Job Description: ${job_description || ""}

Return JSON: { "subject_line": "string", "cover_letter": "string", "key_selling_points": ["string"], "tone_analysis": "string", "customization_tips": ["string"] }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[cover-letter]", err);
    return NextResponse.json({ error: isTimeout ? "Request timed out." : "Failed to generate cover letter." }, { status: isTimeout ? 504 : 500 });
  }
}
