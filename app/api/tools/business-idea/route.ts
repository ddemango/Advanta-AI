import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { idea, market, budget, skills, location } = await req.json();
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a startup mentor and business analyst. Return JSON only." },
        { role: "user", content: `Validate this business idea:
Idea: ${idea}
Target Market: ${market}
Starting Budget: ${budget || "unknown"}
Founder Skills: ${skills || "general"}
Location/Scope: ${location || "online/global"}

Return JSON: { "viability_score": number, "verdict": "string", "market_size": "string", "competition_level": "string", "revenue_model": ["string"], "key_risks": ["string"], "key_advantages": ["string"], "first_steps": ["string"], "estimated_time_to_revenue": "string", "pivot_suggestions": ["string"] }` }
      ],
      response_format: { type: "json_object" },
    });
    return NextResponse.json(JSON.parse(res.choices[0].message.content || "{}"));
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
