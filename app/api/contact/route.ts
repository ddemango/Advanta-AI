import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(ip, { max: 3, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  try {
    const { name, email, company, message } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 400 });
    }

    // Log to Vercel logs (visible in Vercel dashboard → Functions → Logs)
    console.log("📬 Contact form submission:", {
      name: name.trim(),
      email: email.trim(),
      company: company?.trim() || "(not provided)",
      message: message.trim(),
      receivedAt: new Date().toISOString(),
    });

    // To enable real email delivery, add RESEND_API_KEY and CONTACT_EMAIL to your Vercel env vars, then uncomment:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "website@advanta-ai.com",
    //   to: process.env.CONTACT_EMAIL!,
    //   subject: `New contact from ${name} (${company || "no company"})`,
    //   text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`,
    // });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please email us directly at hello@advanta-ai.com" }, { status: 500 });
  }
}
