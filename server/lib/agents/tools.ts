import OpenAI from 'openai';
import { estimateCredits, getTokenCount } from '../pricing';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AgentContext = {
  userId: string;
  projectId?: string | null;
  model: string;
  bill: (inTok: number, outTok: number, label: string, meta?: any) => Promise<number>;
};

export const Tools = {
  async plan(ctx: AgentContext, goal: string) {
    const systemMessage = {
      role: "system" as const,
      content: "Decompose the user's goal into 2-6 concrete steps. Respond as JSON: {steps:[{tool:string, input:any, note?:string}]}. Available tools: llm, web_search, operator_exec, data_analysis. Choose minimal steps that accomplish the goal efficiently."
    };
    
    const userMessage = {
      role: "user" as const,
      content: goal
    };

    try {
      const completion = await openai.chat.completions.create({
        model: ctx.model,
        messages: [systemMessage, userMessage],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0]?.message?.content || '{"steps":[]}';
      const inTok = getTokenCount(systemMessage.content + goal);
      const outTok = getTokenCount(response);
      
      await ctx.bill(inTok, outTok, "agent.plan");

      try {
        const parsed = JSON.parse(response);
        if (!Array.isArray(parsed.steps)) throw new Error("Invalid plan format");
        return parsed.steps as { tool: keyof typeof Tools; input: any; note?: string }[];
      } catch {
        // Fallback to simple LLM call if planning fails
        return [{ tool: "llm" as keyof typeof Tools, input: { prompt: goal } }];
      }
    } catch (error) {
      console.error('Planning failed:', error);
      return [{ tool: "llm" as keyof typeof Tools, input: { prompt: goal } }];
    }
  },

  async llm(ctx: AgentContext, input: { prompt: string; system?: string }) {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    
    if (input.system) {
      messages.push({ role: "system", content: input.system });
    }
    
    messages.push({ role: "user", content: input.prompt });

    try {
      const completion = await openai.chat.completions.create({
        model: ctx.model,
        messages,
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
      const inTok = getTokenCount(messages.map(m => m.content).join('\n'));
      const outTok = getTokenCount(response);
      
      await ctx.bill(inTok, outTok, "agent.llm");

      return { text: response, model: ctx.model };
    } catch (error) {
      console.error('LLM call failed:', error);
      throw new Error(`LLM execution failed: ${error}`);
    }
  },

  async web_search(ctx: AgentContext, input: { query: string; limit?: number }) {
    // In production, integrate with real search API (Google, Bing, etc.)
    // For now, provide a structured response that can be enhanced
    const mockResults = [
      {
        title: `Search Results for: ${input.query}`,
        url: `https://example.com/search?q=${encodeURIComponent(input.query)}`,
        snippet: `This is a placeholder for web search results. In production, this would contain real search results for "${input.query}".`,
        relevanceScore: 0.9
      }
    ];

    // Minimal billing for web search operation
    await ctx.bill(10, 50, "agent.web_search", { query: input.query });

    return { 
      results: mockResults.slice(0, input.limit || 5),
      query: input.query,
      totalResults: mockResults.length
    };
  },

  async operator_exec(ctx: AgentContext, input: { cmd: string; timeout?: number }) {
    try {
      // This would integrate with your existing operator terminal system
      // For now, simulate command execution
      const mockOutput = {
        stdout: `Executed: ${input.cmd}\nCommand completed successfully.`,
        stderr: "",
        returncode: 0,
        executionTime: Math.random() * 1000 + 500
      };

      // Bill based on command complexity and output size
      const outSize = getTokenCount(mockOutput.stdout + mockOutput.stderr);
      await ctx.bill(20, Math.min(outSize, 200), "agent.operator", { cmd: input.cmd });

      return mockOutput;
    } catch (error) {
      console.error('Operator execution failed:', error);
      throw new Error(`Command execution failed: ${error}`);
    }
  },

  async data_analysis(ctx: AgentContext, input: { data: any; question: string; type?: string }) {
    // Analyze data using LLM with specific prompts
    const systemPrompt = `You are a data analyst. Analyze the provided data and answer the user's question. 
    Provide insights, patterns, and actionable recommendations. Format your response in markdown.`;
    
    const dataStr = typeof input.data === 'string' ? input.data : JSON.stringify(input.data, null, 2);
    const prompt = `Data to analyze:\n\`\`\`\n${dataStr.slice(0, 2000)}\n\`\`\`\n\nQuestion: ${input.question}`;

    const result = await this.llm(ctx, { 
      prompt, 
      system: systemPrompt 
    });

    return {
      analysis: result.text,
      dataSize: dataStr.length,
      question: input.question,
      type: input.type || 'general'
    };
  }
};

export type ToolName = keyof typeof Tools;
export type ToolInput<T extends ToolName> = Parameters<typeof Tools[T]>[1];
export type ToolOutput<T extends ToolName> = Awaited<ReturnType<typeof Tools[T]>>;