import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    let domain = url;
    try { domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname; } catch {}

    const prompt = `Analyze the competitor website: ${domain}
Generate a realistic competitive analysis. Return valid JSON:
{
  "domain": "${domain}",
  "tech": {
    "frameworks": ["string","string"],
    "cms": "string or null",
    "thirdParties": ["string","string","string"]
  },
  "performance": {
    "weightKB": number,
    "reqImages": number,
    "reqScripts": number
  },
  "seo": {
    "title": "string",
    "metaDescription": "string",
    "headings": {"h1": number, "h2": number, "h3": number}
  },
  "score": {
    "total": number,
    "performance": number,
    "seo": number,
    "tech": number
  },
  "insights": ["string","string","string"]
}
Make it realistic for the domain type.`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a competitive intelligence analyst. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(res.choices[0]?.message?.content || "{}");
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to analyze competitor" }, { status: 500 });
  }
}
