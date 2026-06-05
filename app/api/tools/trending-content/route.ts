import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { niche, platform, content_type, audience } = await req.json();
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a viral content strategist. Return JSON only." },
        { role: "user", content: `Generate trending content ideas for:
Niche: ${niche}
Platform: ${platform || "Instagram/TikTok/LinkedIn"}
Content Type: ${content_type || "mixed"}
Target Audience: ${audience}

Return JSON: { "trending_hooks": ["string"], "content_ideas": [{ "title": "string", "format": "string", "hook": "string", "outline": ["string"], "viral_factor": "string", "hashtags": ["string"] }], "posting_strategy": "string", "best_times": ["string"] }
Generate 5 content ideas with high viral potential.` }
      ],
      response_format: { type: "json_object" },
    });
    return NextResponse.json(JSON.parse(res.choices[0].message.content || "{}"));
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
