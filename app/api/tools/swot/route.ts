import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { company, industry, description, goals, challenges } = await req.json();
    if (!company) return NextResponse.json({ error: "Company name is required" }, { status: 400 });

    const prompt = `Generate a comprehensive SWOT analysis for:
Company: ${company}
Industry: ${industry || "General"}
Description: ${description || ""}
Goals: ${goals || ""}
Challenges: ${challenges || ""}

Return valid JSON:
{
  "company": "string",
  "strengths": ["string","string","string","string"],
  "weaknesses": ["string","string","string"],
  "opportunities": ["string","string","string","string"],
  "threats": ["string","string","string"]
}`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a strategic business analyst. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(res.choices[0]?.message?.content || "{}");
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate SWOT" }, { status: 500 });
  }
}
