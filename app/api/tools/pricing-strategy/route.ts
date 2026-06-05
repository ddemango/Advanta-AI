import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { product, industry, current_price, competitors, costs, target_market } = await req.json();
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a pricing strategist and business consultant. Return JSON only." },
        { role: "user", content: `Analyze pricing strategy for:
Product/Service: ${product}
Industry: ${industry}
Current Price: ${current_price || "Not set"}
Competitors: ${competitors}
Cost Structure: ${costs}
Target Market: ${target_market}

Return JSON: { "recommended_price": "string", "strategy": "string", "tiers": [{"name":"string","price":"string","features":["string"]}], "rationale": "string", "psychological_tactics": ["string"], "risks": ["string"], "revenue_projection": "string" }` }
      ],
      response_format: { type: "json_object" },
    });
    return NextResponse.json(JSON.parse(res.choices[0].message.content || "{}"));
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
