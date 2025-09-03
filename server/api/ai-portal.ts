import { Request, Response } from 'express';
import OpenAI from 'openai';
import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { JSDOM } from 'jsdom';
import { db } from '../db';
import { 
  aiProjects, 
  aiChats, 
  aiMessages, 
  aiUsage, 
  aiDatasets, 
  aiArtifacts,
  insertAiProjectSchema,
  insertAiChatSchema,
  insertAiMessageSchema,
  insertAiUsageSchema
} from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const AVAILABLE_MODELS = {
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'gpt-4o-mini', 
  'gpt-4': 'gpt-4',
  'gpt-3.5-turbo': 'gpt-3.5-turbo'
};

// Get user projects
export async function getProjects(req: Request, res: Response) {
  try {
    const userId = (req as any).session?.userId || 1; // Default to demo user

    const projects = await db
      .select()
      .from(aiProjects)
      .where(eq(aiProjects.userId, userId))
      .orderBy(desc(aiProjects.createdAt));

    res.json({ ok: true, projects });
  } catch (error: any) {
    console.error('Get projects error:', error);
    res.status(500).json({ ok: false, error: 'Failed to load projects' });
  }
}

// Create new project
export async function createProject(req: Request, res: Response) {
  try {
    const userId = (req as any).session?.userId || 1;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ ok: false, error: 'Project name is required' });
    }

    const [project] = await db
      .insert(aiProjects)
      .values({
        userId,
        name,
        description: description || '',
        defaultModel: 'gpt-4o'
      })
      .returning();

    res.json({ ok: true, project });
  } catch (error: any) {
    console.error('Create project error:', error);
    res.status(500).json({ ok: false, error: 'Failed to create project' });
  }
}

// Get project chats
export async function getChats(req: Request, res: Response) {
  try {
    const userId = (req as any).session?.userId || 1;
    const { projectId } = req.params;

    const chats = await db
      .select()
      .from(aiChats)
      .where(eq(aiChats.projectId, parseInt(projectId)))
      .orderBy(desc(aiChats.createdAt));

    res.json({ ok: true, chats });
  } catch (error: any) {
    console.error('Get chats error:', error);
    res.status(500).json({ ok: false, error: 'Failed to load chats' });
  }
}

// Create new chat
export async function createChat(req: Request, res: Response) {
  try {
    const userId = (req as any).session?.userId || 1;
    const { projectId, title, model } = req.body;

    if (!projectId) {
      return res.status(400).json({ ok: false, error: 'Project ID is required' });
    }

    const [chat] = await db
      .insert(aiChats)
      .values({
        projectId,
        userId,
        title: title || 'New Chat',
        model: model || 'gpt-4o'
      })
      .returning();

    res.json({ ok: true, chat });
  } catch (error: any) {
    console.error('Create chat error:', error);
    res.status(500).json({ ok: false, error: 'Failed to create chat' });
  }
}

// Get chat messages
export async function getChatMessages(req: Request, res: Response) {
  try {
    const { chatId } = req.params;
    
    const messages = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.chatId, parseInt(chatId)))
      .orderBy(aiMessages.createdAt);

    res.json({ ok: true, messages });
  } catch (error: any) {
    console.error('Get messages error:', error);
    res.status(500).json({ ok: false, error: 'Failed to load messages' });
  }
}

// Enhanced chat endpoint with persistence
export async function chat(req: Request, res: Response) {
  try {
    const userId = (req as any).session?.userId || 1;
    const { messages, model = 'gpt-4o', temperature = 0.7, max_tokens = 1024, chatId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ ok: false, error: 'Invalid messages format' });
    }

    // Validate model
    const validModel = AVAILABLE_MODELS[model as keyof typeof AVAILABLE_MODELS] || 'gpt-4o';

    const response = await openai.chat.completions.create({
      model: validModel,
      messages,
      temperature,
      max_tokens,
    });

    const assistantMessage = response.choices[0]?.message?.content || 'No response generated';

    // Save messages to database if chatId provided
    if (chatId) {
      // Save user message
      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage?.role === 'user') {
        await db.insert(aiMessages).values({
          chatId: parseInt(chatId),
          role: 'user',
          content: lastUserMessage.content
        });
      }

      // Save assistant message
      await db.insert(aiMessages).values({
        chatId: parseInt(chatId),
        role: 'assistant',
        content: assistantMessage
      });

      // Track usage
      await db.insert(aiUsage).values({
        userId,
        model: validModel,
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
        operationType: 'chat'
      });
    }

    res.json({
      ok: true,
      message: assistantMessage,
      usage: response.usage,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      ok: false,
      error: error.message || 'Failed to process chat request',
    });
  }
}

// Get available models
export async function getModels(req: Request, res: Response) {
  try {
    const models = Object.keys(AVAILABLE_MODELS).map(key => ({
      id: key,
      name: key.toUpperCase().replace(/-/g, '‑'),
      provider: 'OpenAI'
    }));

    res.json({ ok: true, models });
  } catch (error: any) {
    console.error('Get models error:', error);
    res.status(500).json({ ok: false, error: 'Failed to load models' });
  }
}

// Get usage analytics
export async function getUsage(req: Request, res: Response) {
  try {
    const userId = (req as any).session?.userId || 1;

    const usage = await db
      .select()
      .from(aiUsage)
      .where(eq(aiUsage.userId, userId))
      .orderBy(desc(aiUsage.createdAt))
      .limit(100);

    res.json({ ok: true, usage });
  } catch (error: any) {
    console.error('Get usage error:', error);
    res.status(500).json({ ok: false, error: 'Failed to load usage data' });
  }
}

// Code execution endpoint
export async function runCode(req: Request, res: Response) {
  try {
    const { language, code } = req.body;

    if (language !== 'python') {
      return res.status(400).json({
        ok: false,
        error: 'Only Python is supported currently',
      });
    }

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'Code is required',
      });
    }

    // Create temporary file
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ai-portal-'));
    const tempFile = path.join(tempDir, 'script.py');
    
    try {
      await fs.writeFile(tempFile, code, 'utf8');

      // Execute Python code with timeout
      const result = await new Promise<{
        stdout: string;
        stderr: string;
        returncode: number;
      }>((resolve, reject) => {
        const child = spawn('python3', [tempFile], {
          cwd: tempDir,
          timeout: 10000, // 10 second timeout
          env: {
            ...process.env,
            PYTHONUNBUFFERED: '1',
          },
        });

        let stdout = '';
        let stderr = '';

        child.stdout?.on('data', (data) => {
          stdout += data.toString();
        });

        child.stderr?.on('data', (data) => {
          stderr += data.toString();
        });

        child.on('close', (code) => {
          resolve({
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            returncode: code || 0,
          });
        });

        child.on('error', (error) => {
          reject(error);
        });

        // Kill process after timeout
        setTimeout(() => {
          child.kill('SIGKILL');
          reject(new Error('Execution timeout (10 seconds)'));
        }, 10000);
      });

      res.json({
        ok: true,
        ...result,
      });
    } finally {
      // Cleanup temp files
      try {
        await fs.rm(tempDir, { recursive: true });
      } catch (e) {
        console.warn('Failed to cleanup temp directory:', e);
      }
    }
  } catch (error: any) {
    console.error('Code execution error:', error);
    res.status(500).json({
      ok: false,
      error: error.message || 'Code execution failed',
      stdout: '',
      stderr: error.message || 'Unknown error',
      returncode: 1,
    });
  }
}

// Web search endpoint
export async function search(req: Request, res: Response) {
  try {
    const { q: query, max_results = 10 } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'Search query is required',
      });
    }

    // Use DuckDuckGo HTML search
    const searchUrl = 'https://duckduckgo.com/html/';
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ q: query }),
    });

    if (!response.ok) {
      throw new Error(`Search request failed: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const results: Array<{
      title: string;
      url: string;
      snippet: string;
    }> = [];

    const resultElements = document.querySelectorAll('.result');
    
    for (let i = 0; i < Math.min(resultElements.length, max_results); i++) {
      const result = resultElements[i];
      const titleElement = result.querySelector('.result__title a');
      const snippetElement = result.querySelector('.result__snippet');

      if (titleElement) {
        const title = titleElement.textContent?.trim() || '';
        const url = titleElement.getAttribute('href') || '';
        const snippet = snippetElement?.textContent?.trim() || '';

        if (title && url) {
          results.push({ title, url, snippet });
        }
      }
    }

    res.json({
      ok: true,
      results,
    });
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({
      ok: false,
      error: error.message || 'Search failed',
      results: [],
    });
  }
}

// Text-to-Speech endpoint
export async function textToSpeech(req: Request, res: Response) {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'Text is required',
      });
    }

    if (text.length > 4000) {
      return res.status(400).json({
        ok: false,
        error: 'Text too long (max 4000 characters)',
      });
    }

    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
      response_format: 'mp3',
    });

    if (!response.ok) {
      throw new Error('TTS request failed');
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="speech.mp3"',
    });

    res.send(buffer);
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({
      ok: false,
      error: error.message || 'Text-to-speech failed',
    });
  }
}

// Data analysis endpoint
export async function analyzeData(req: Request, res: Response) {
  try {
    const userId = (req as any).session?.userId || 1;
    const { data, analysisType = 'summary', prompt } = req.body;

    if (!data) {
      return res.status(400).json({ ok: false, error: 'Data is required' });
    }

    // Convert data to text format for analysis
    let dataText = '';
    if (Array.isArray(data)) {
      dataText = JSON.stringify(data, null, 2);
    } else if (typeof data === 'object') {
      dataText = JSON.stringify(data, null, 2);
    } else {
      dataText = String(data);
    }

    const analysisPrompts = {
      summary: 'Provide a clear summary of this data, highlighting key insights and patterns',
      insights: 'Analyze this data and provide actionable insights and recommendations',
      trends: 'Identify trends, patterns, and anomalies in this data',
      visualization: 'Suggest the best ways to visualize this data and what charts would be most effective'
    };

    const analysisPrompt = prompt || analysisPrompts[analysisType as keyof typeof analysisPrompts] || analysisPrompts.summary;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a data analysis expert. Provide clear, actionable insights from data.' },
        { role: 'user', content: `${analysisPrompt}:\n\n${dataText}` }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const analysis = response.choices[0]?.message?.content || 'No analysis generated';

    // Track usage
    await db.insert(aiUsage).values({
      userId,
      model: 'gpt-4o',
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
      totalTokens: response.usage?.total_tokens || 0,
      operationType: 'data_analysis'
    });

    res.json({
      ok: true,
      analysis,
      analysisType,
      dataSize: dataText.length
    });
  } catch (error: any) {
    console.error('Data analysis error:', error);
    res.status(500).json({
      ok: false,
      error: error.message || 'Failed to analyze data',
    });
  }
}

// Health check endpoint
export async function health(req: Request, res: Response) {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    openai: !!process.env.OPENAI_API_KEY,
    services: {
      chat: true,
      code_execution: true,
      search: true,
      image_generation: true,
      text_humanization: true,
      data_analysis: true,
      tts: true,
      tts: true,
    },
  });
}