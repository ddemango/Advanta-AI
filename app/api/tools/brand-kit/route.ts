import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { brand_name, industry, values, audience, style } = await req.json();
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a brand identity designer. Return JSON only." },
        { role: "user", content: `Create a brand kit for:
Brand Name: ${brand_name}
Industry: ${industry}
Core Values: ${values}
Target Audience: ${audience}
Style Preference: ${style || "modern and professional"}

Return JSON: { "brand_name": "${brand_name}", "tagline": "string", "brand_story": "string", "colors": [{"name":"string","hex":"string","usage":"string"}], "typography": {"primary":"string","secondary":"string","usage":"string"}, "voice": {"tone":"string","words_to_use":["string"],"words_to_avoid":["string"]}, "logo_concepts": ["string"], "brand_values": ["string"] }` }
      ],
      response_format: { type: "json_object" },
    });
    return NextResponse.json(JSON.parse(res.choices[0].message.content || "{}"));
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
