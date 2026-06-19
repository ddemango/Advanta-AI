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
    const { name, role, experience, skills, education, achievements } = await req.json();
    if (!name || !role) return NextResponse.json({ error: "Name and target role are required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a professional resume writer and career coach. Return JSON only." },
      { role: "user", content: `Create a professional ATS-optimized resume for:
Name: ${name}
Target Role: ${role}
Experience: ${experience || ""}
Skills: ${skills || ""}
Education: ${education || ""}
Key Achievements: ${achievements || ""}

Return JSON: { "summary": "string", "experience": [{"title":"string","company":"string","bullets":["string"]}], "skills": {"technical":["string"],"soft":["string"]}, "education": "string", "ats_keywords": ["string"], "score": number }` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[resume]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate resume. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
