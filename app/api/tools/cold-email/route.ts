import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prospect, company, role, pain_point, your_offer, tone, sender_name } = await req.json();
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert cold email copywriter who writes high-converting emails. Return JSON only." },
        { role: "user", content: `Write 3 cold email variations for this prospect:
Prospect Name: ${prospect}
Their Company: ${company}
Their Role: ${role}
Pain Point: ${pain_point}
Your Offer: ${your_offer}
Tone: ${tone || "professional"}
Sender: ${sender_name || ""}

Return JSON: { "emails": [{ "subject": "string", "body": "string", "cta": "string", "why_it_works": "string" }] }` }
      ],
      response_format: { type: "json_object" },
    });
    return NextResponse.json(JSON.parse(res.choices[0].message.content || "{}"));
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
