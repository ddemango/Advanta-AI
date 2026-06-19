import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function callAI(
  messages: OpenAI.ChatCompletionMessageParam[],
  timeoutMs = 25_000
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages,
        response_format: { type: "json_object" },
      },
      { signal: controller.signal }
    );
    return res.choices[0]?.message?.content ?? "{}";
  } finally {
    clearTimeout(timer);
  }
}
