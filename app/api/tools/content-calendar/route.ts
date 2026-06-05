import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { brand, industry, platforms, frequency, goals, audience } = await req.json();
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a content strategist. Return JSON only." },
        { role: "user", content: `Create a 4-week content calendar:
Brand: ${brand}
Industry: ${industry}
Platforms: ${platforms || "Instagram, LinkedIn, Twitter"}
Posting Frequency: ${frequency || "3x per week"}
Goals: ${goals || "brand awareness"}
Target Audience: ${audience}

Return JSON: { "strategy": "string", "weeks": [{ "week": number, "theme": "string", "posts": [{ "day": "string", "platform": "string", "type": "string", "caption": "string", "hashtags": ["string"] }] }], "tips": ["string"] }` }
      ],
      response_format: { type: "json_object" },
    });
    return NextResponse.json(JSON.parse(res.choices[0].message.content || "{}"));
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
