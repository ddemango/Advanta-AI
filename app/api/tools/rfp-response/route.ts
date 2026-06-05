import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { project, description, requirements, timeline, budget, constraints } = await req.json();
    if (!project) return NextResponse.json({ error: "Project name is required" }, { status: 400 });

    const prompt = `Create a professional RFP response for:
Project: ${project}
Description: ${description || ""}
Requirements: ${requirements || ""}
Timeline: ${timeline || "TBD"}
Budget: ${budget || "Not specified"}
Constraints: ${constraints || "None"}

Return valid JSON:
{
  "project": "string",
  "summary": "string",
  "requirements": ["string"],
  "timeline": ["Phase 1: string","Phase 2: string","Phase 3: string"],
  "assumptions": ["string"],
  "risks": ["string"]
}`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a proposal writing expert. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(res.choices[0]?.message?.content || "{}");
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate RFP response" }, { status: 500 });
  }
}
