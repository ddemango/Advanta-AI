import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { resume, job_description, job_title } = await req.json();
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an ATS optimization expert and career coach. Return JSON only." },
        { role: "user", content: `Optimize this resume for ATS and the job description:
Resume: ${resume}
Job Title: ${job_title}
Job Description: ${job_description}

Return JSON: { "ats_score": number, "missing_keywords": ["string"], "optimized_summary": "string", "optimized_bullets": ["string"], "skills_to_add": ["string"], "formatting_tips": ["string"], "overall_feedback": "string" }` }
      ],
      response_format: { type: "json_object" },
    });
    return NextResponse.json(JSON.parse(res.choices[0].message.content || "{}"));
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
