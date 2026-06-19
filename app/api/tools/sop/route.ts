import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  try {
    const { title, process, department, frequency, tools, requirements } = await req.json();
    if (!title) return NextResponse.json({ error: "SOP title is required." }, { status: 400 });

    const content = await callAI([
      { role: "system", content: "You are a business process expert. Return only valid JSON." },
      { role: "user", content: `Create a comprehensive SOP for:
Title: ${title}
Process: ${process || ""}
Department: ${department || "General"}
Frequency: ${frequency || "As needed"}
Tools/Systems: ${tools || "Standard tools"}
Requirements: ${requirements || ""}

Return JSON: { "title": "string", "owner": "string", "frequency": "string", "purpose": "string", "steps": [{"name":"string","detail":"string"}], "tools": ["string"] }
Include 6-10 detailed steps.` },
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[sop]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Failed to generate SOP. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
