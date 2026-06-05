import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { brand, period, channels, goals, budget, metrics } = await req.json();

    if (!brand) return NextResponse.json({ error: "Brand name is required" }, { status: 400 });

    const prompt = `Generate a comprehensive marketing report for:
Brand: ${brand}
Period: ${period || "Last 30 days"}
Channels: ${channels || "All channels"}
Goals: ${goals || "Not specified"}
Budget: ${budget || "Not specified"}
Key Metrics: ${metrics || "Standard metrics"}

Return valid JSON with this structure:
{
  "brand": "string",
  "period": "string",
  "kpis": [{"name":"string","value":"string","delta":"string"}],
  "insights": {
    "channels": [{"channel":"string","summary":"string"}],
    "recommendations": ["string"]
  }
}`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a senior marketing analyst. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(res.choices[0]?.message?.content || "{}");
    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
