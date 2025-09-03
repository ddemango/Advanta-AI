export type ProviderID = "openai" | "anthropic" | "google" | "xai" | "cohere" | "router";

export interface ProviderCall {
  provider: ProviderID;
  model: string; // provider-native name, e.g. "gpt-4o-mini" | "claude-3-7-sonnet" | "gemini-2.5-pro"
  messages: { role: string; content: any }[];
  temperature?: number;
}

// --- OPENAI ---
export async function* streamOpenAI(p: ProviderCall): AsyncGenerator<string> {
  const OPENAI_BASE = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  
  const res = await fetch(`${OPENAI_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ 
      model: p.model, 
      messages: p.messages, 
      temperature: p.temperature ?? 0.7, 
      stream: true 
    }),
  });

  if (!res.ok || !res.body) throw new Error("OpenAI request failed");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    for (const line of chunk.split("\n")) {
      if (line.startsWith("data: ")) {
        const payload = line.replace("data: ", "").trim();
        if (payload === "[DONE]") return;
        try {
          const json = JSON.parse(payload);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) yield delta as string;
        } catch {
          // ignore keepalives
        }
      }
    }
  }
}

// --- ANTHROPIC (Claude) ---
export async function* streamAnthropic(p: ProviderCall): AsyncGenerator<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: p.model,
      max_tokens: 4096,
      temperature: p.temperature ?? 0.7,
      messages: p.messages,
      stream: true,
    }),
  });
  if (!res.ok || !res.body) throw new Error("Anthropic request failed");

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = dec.decode(value);
    for (const line of chunk.split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload);
        if (evt.type === "content_block_delta" && evt.delta?.text) yield evt.delta.text as string;
      } catch {}
    }
  }
}

// --- GOOGLE (Gemini) ---
export async function* streamGemini(p: ProviderCall): AsyncGenerator<string> {
  const key = process.env.GOOGLE_API_KEY || "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${p.model}:streamGenerateContent?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: p.messages.find(m => m.role === "user")?.content || "" }],
        },
      ],
      generationConfig: { temperature: p.temperature ?? 0.7 },
    }),
  });
  if (!res.ok || !res.body) throw new Error("Gemini request failed");

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const s = dec.decode(value);
    try {
      const lines = s.trim().split("\n");
      for (const l of lines) {
        const j = JSON.parse(l);
        const txt = j.candidates?.[0]?.content?.parts?.[0]?.text;
        if (txt) yield txt;
      }
    } catch {}
  }
}

// --- xAI (Grok) ---
export async function* streamGrok(p: ProviderCall): AsyncGenerator<string> {
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.XAI_API_KEY || ""}`,
    },
    body: JSON.stringify({ model: p.model, messages: p.messages, stream: true }),
  });
  if (!res.ok || !res.body) throw new Error("xAI request failed");
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = dec.decode(value);
    for (const line of chunk.split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (payload === "[DONE]") return;
      try {
        const j = JSON.parse(payload);
        const delta = j.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {}
    }
  }
}

// --- Cohere (chunked fallback) ---
export async function* streamCohere(p: ProviderCall): AsyncGenerator<string> {
  const res = await fetch("https://api.cohere.ai/v2/chat", {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: `Bearer ${process.env.COHERE_API_KEY || ""}` },
    body: JSON.stringify({ model: p.model, messages: p.messages }),
  });
  if (!res.ok) throw new Error("Cohere request failed");
  const data = await res.json();
  const text = data?.message?.content?.map((x: any) => x.text).join("") || "";
  for (let i = 0; i < text.length; i += 120) yield text.slice(i, i + 120);
}

// --- Main Router by modelId prefix: "provider:modelName"
export async function* streamByModelId(
  modelId: string,
  messages: { role: string; content: any }[],
  temperature = 0.7
): AsyncGenerator<string> {
  const [provider, model] = modelId.split(":", 2) as [ProviderID, string];
  const call: ProviderCall = { provider, model, messages, temperature };
  switch (provider) {
    case "openai":     return yield* streamOpenAI(call);
    case "anthropic":  return yield* streamAnthropic(call);
    case "google":     return yield* streamGemini(call);
    case "xai":        return yield* streamGrok(call);
    case "cohere":     return yield* streamCohere(call);
    case "router": {
      // trivial router example: long prompts → Claude, else GPT
      const text = (messages.find(m => m.role === "user")?.content || "") as string;
      const prefer = text.length > 1200 ? "anthropic:claude-3-5-sonnet" : "openai:gpt-4o-mini";
      return yield* streamByModelId(prefer, messages, temperature);
    }
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}