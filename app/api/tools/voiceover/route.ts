import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { topic, duration, style, audience, platform } = await req.json();
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional voiceover scriptwriter. Return JSON only." },
        { role: "user", content: `Write a voiceover script:
Topic: ${topic}
Duration: ${duration || "60 seconds"}
Style: ${style || "conversational"}
Target Audience: ${audience || "general"}
Platform: ${platform || "YouTube"}

Return JSON: { "title": "string", "hook": "string", "script": "string", "word_count": number, "estimated_duration": "string", "delivery_notes": ["string"], "cta": "string" }` }
      ],
      response_format: { type: "json_object" },
    });
    return NextResponse.json(JSON.parse(res.choices[0].message.content || "{}"));
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
