import { Request, Response } from 'express';
import OpenAI from 'openai';
import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { JSDOM } from 'jsdom';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat endpoint
export async function chat(req: Request, res: Response) {
  try {
    const { messages, model = 'gpt-4o', temperature = 0.7, max_tokens = 1024 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ ok: false, error: 'Invalid messages format' });
    }

    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
    });

    const message = response.choices[0]?.message?.content || 'No response generated';

    res.json({
      ok: true,
      message,
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
      tts: true,
    },
  });
}