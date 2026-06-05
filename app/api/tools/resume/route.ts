import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { name, role, experience, skills, education, achievements } = await req.json();
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional resume writer and career coach. Return JSON only." },
        { role: "user", content: `Create a professional ATS-optimized resume for:
Name: ${name}
Target Role: ${role}
Experience: ${experience}
Skills: ${skills}
Education: ${education}
Key Achievements: ${achievements}

Return JSON: { "summary": "string", "experience": [{"title":"string","company":"string","bullets":["string"]}], "skills": {"technical":["string"],"soft":["string"]}, "education": "string", "ats_keywords": ["string"], "score": number }` }
      ],
      response_format: { type: "json_object" },
    });
    return NextResponse.json(JSON.parse(res.choices[0].message.content || "{}"));
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
