import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { product, audience, goal, current_headline } = await req.json();
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a conversion rate optimization expert. Return JSON only." },
        { role: "user", content: `Generate headline A/B test variations for:
Product: ${product}
Audience: ${audience}
Goal: ${goal || "conversions"}
Current Headline: ${current_headline || "none"}

Return JSON: { "variants": [{ "headline": "string", "type": "string", "psychology": "string", "predicted_ctr": "string", "best_for": "string" }], "testing_advice": "string", "winner_prediction": "string" }
Generate 6 variants using different psychological triggers (curiosity, urgency, social proof, benefit, pain, numbers).` }
      ],
      response_format: { type: "json_object" },
    });
    return NextResponse.json(JSON.parse(res.choices[0].message.content || "{}"));
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
