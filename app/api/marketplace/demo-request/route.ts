import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, agent, message } = await req.json();
    if (!email || !name) return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    // In production: save to DB, send notification email via Resend, add to CRM
    console.log("Demo request:", { name, email, company, agent, message });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
