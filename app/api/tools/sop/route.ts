import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { title, process, department, frequency, tools, requirements } = await req.json();
    if (!title) return NextResponse.json({ error: "SOP title is required" }, { status: 400 });

    const prompt = `Create a comprehensive SOP for:
Title: ${title}
Process: ${process || ""}
Department: ${department || "General"}
Frequency: ${frequency || "As needed"}
Tools/Systems: ${tools || "Standard tools"}
Requirements: ${requirements || ""}

Return valid JSON:
{
  "title": "string",
  "owner": "string",
  "frequency": "string",
  "purpose": "string",
  "steps": [{"name":"string","detail":"string"}],
  "tools": ["string"]
}
Include 6-10 detailed steps.`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a business process expert. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(res.choices[0]?.message?.content || "{}");
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate SOP" }, { status: 500 });
  }
}
