import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { product, audience, benefit, tone, format } = await req.json();
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a world-class copywriter. Return JSON only." },
        { role: "user", content: `Write marketing copy for:
Product/Service: ${product}
Target Audience: ${audience}
Key Benefit: ${benefit}
Tone: ${tone || "persuasive"}
Format: ${format || "all"}

Return JSON: { "headline": "string", "subheadline": "string", "hero_copy": "string", "ad_copies": [{"platform":"string","copy":"string"}], "email_subject_lines": ["string"], "cta_variations": ["string"], "tagline": "string" }` }
      ],
      response_format: { type: "json_object" },
    });
    return NextResponse.json(JSON.parse(res.choices[0].message.content || "{}"));
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
