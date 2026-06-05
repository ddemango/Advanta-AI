import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { bot_name, purpose, industry, personality, capabilities, restrictions } = await req.json();
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AI prompt engineer specializing in custom GPT creation. Return JSON only." },
        { role: "user", content: `Create a custom GPT/chatbot configuration for:
Bot Name: ${bot_name}
Purpose: ${purpose}
Industry: ${industry}
Personality: ${personality || "professional and helpful"}
Capabilities: ${capabilities}
Restrictions: ${restrictions || "none"}

Return JSON: { "system_prompt": "string", "starter_messages": ["string"], "example_conversations": [{"user":"string","assistant":"string"}], "suggested_knowledge": ["string"], "deployment_tips": ["string"], "name": "${bot_name}" }` }
      ],
      response_format: { type: "json_object" },
    });
    return NextResponse.json(JSON.parse(res.choices[0].message.content || "{}"));
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
