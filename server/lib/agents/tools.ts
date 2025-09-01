import { openai } from '../openai';

type Ctx = {
  userId: string;
  projectId?: string | null;
  model: string;
  bill: (inTok: number, outTok: number, label: string, meta?: any) => Promise<number>;
};

export const Tools = {
  async plan(ctx: Ctx, goal: string) {
    const sys = { role: "system", content: "Decompose the user's goal into 2-6 concrete steps. Respond as JSON: {steps:[{tool:string, input:any, note?:string}]} . Tools: llm, web_search, operator_exec, rag_search. Choose minimal steps." };
    const user = { role: "user", content: goal };
    
    const response = await openai.chat.completions.create({
      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      model: "gpt-5",
      messages: [sys as any, user as any],
      temperature: 0.2
    });
    
    const out = response.choices[0]?.message?.content || '';
    const inTok = goal.length / 4; // rough estimate
    const outTok = out.length / 4;
    await ctx.bill(inTok, outTok, "agent.plan");
    
    try {
      const js = JSON.parse(out);
      if (!Array.isArray(js.steps)) throw new Error("bad plan");
      return js.steps as { tool: keyof typeof Tools; input: any; note?: string }[];
    } catch {
      return [{ tool: "llm", input: { prompt: goal } }];
    }
  },

  async llm(ctx: Ctx, input: { prompt: string }) {
    const response = await openai.chat.completions.create({
      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      model: "gpt-5",
      messages: [{ role:"user", content: input.prompt }],
      temperature: 0.3
    });
    
    const out = response.choices[0]?.message?.content || '';
    const inTok = input.prompt.length / 4;
    const outTok = out.length / 4;
    await ctx.bill(inTok, outTok, "agent.llm");
    return { text: out };
  },

  async web_search(ctx: Ctx, input: { query: string; provider?: string }) {
    try {
      const { searchWeb } = await import('../providers/search');
      const results = await searchWeb(input.provider || 'bing', input.query, 5);
      await ctx.bill(5, 20, "agent.web_search");
      return { results };
    } catch (e) {
      // Fallback to mock results if search fails
      const text = `Search results for "${input.query}" (fallback placeholder).`;
      await ctx.bill(5, 20, "agent.web_search");
      return { results: [{ title: "Placeholder", snippet: text, url: "https://example.com" }] };
    }
  },

  async operator_exec(ctx: Ctx, input: { cmd: string }) {
    // Mock execution for now - in production use secure sandbox
    const mockOutput = `Executed: ${input.cmd}\nOutput: Success`;
    await ctx.bill(20, mockOutput.length / 4, "agent.operator");
    return { stdout: mockOutput, stderr: '', returncode: 0 };
  },

  async rag_search(ctx: Ctx, input: { question: string }) {
    // Funnel through llm for now
    const out = await Tools.llm(ctx, { prompt: `Answer using known docs (if any): ${input.question}` });
    return { passages: [], answer: out.text };
  }
};