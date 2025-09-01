import { Request, Response } from 'express';
import OpenAI from 'openai';
import { db } from '../db';
import { aiUsage, aiProjects, aiChats, aiMessages, aiDatasets, aiArtifacts, auditLogs } from '@shared/schema';
import { eq, sql, desc } from 'drizzle-orm';
import * as XLSX from 'xlsx';
import multer from 'multer';
import * as path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV, Excel, and JSON files are allowed.'));
    }
  }
});

// Token estimation utility
function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

// Record usage with token tracking
async function recordUsage(userId: number, model: string, operationType: string, inputText: string, outputText: string) {
  const inputTokens = estimateTokens(inputText);
  const outputTokens = estimateTokens(outputText);
  const totalTokens = inputTokens + outputTokens;

  await db.insert(aiUsage).values({
    userId,
    model,
    inputTokens,
    outputTokens,
    totalTokens,
    operationType
  });

  return { inputTokens, outputTokens, totalTokens };
}

// Audit logging
async function logAudit(userId: number | null, action: string, targetType?: string, targetId?: string, metadata?: any, ipAddress?: string) {
  try {
    await db.insert(auditLogs).values({
      userId,
      action,
      targetType,
      targetId,
      metadata,
      ipAddress
    });
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
}

// Get user usage statistics
export async function getUserUsage(req: Request, res: Response) {
  try {
    const userId = 1; // TODO: Get from session/auth

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usage = await db
      .select({
        model: aiUsage.model,
        tokens: sql<number>`sum(${aiUsage.totalTokens})`,
        operations: sql<number>`count(*)`,
        cost: sql<number>`sum(${aiUsage.totalTokens}) * 0.000001` // Rough cost estimation
      })
      .from(aiUsage)
      .where(sql`${aiUsage.userId} = ${userId} AND ${aiUsage.createdAt} >= ${today}`)
      .groupBy(aiUsage.model);

    res.json({ ok: true, usage });
  } catch (error: any) {
    console.error('Usage fetch error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

// Enhanced humanization with tone presets
export async function humanizeText(req: Request, res: Response) {
  try {
    const userId = 1; // TODO: Get from session/auth
    const { text, tone = 'professional', model = 'gpt-4o-mini' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ ok: false, error: 'Text is required' });
    }

    const tonePrompts = {
      professional: 'Rewrite this text to be concise, professional, and business-appropriate while maintaining all key information.',
      humorous: 'Rewrite this text with light, clever humor while keeping it tasteful and appropriate. Maintain the core message.',
      caring: 'Rewrite this text to be warm, supportive, and empathetic while preserving the essential information.',
      bold: 'Rewrite this text to be punchy, confident, and action-oriented. Make it compelling and decisive.',
      technical: 'Rewrite this text to be precise, detailed, and expert-focused with technical accuracy.',
      casual: 'Rewrite this text to be friendly, conversational, and approachable while keeping it informative.'
    };

    const systemPrompt = tonePrompts[tone as keyof typeof tonePrompts] || tonePrompts.professional;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const output = response.choices[0]?.message?.content || '';
    
    // Record usage
    await recordUsage(userId, model, 'humanize', text, output);
    
    // Log audit
    await logAudit(userId, 'HUMANIZE_TEXT', 'text', undefined, { tone, textLength: text.length }, req.ip);

    res.json({ ok: true, output });
  } catch (error: any) {
    console.error('Humanization error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

// Data upload and processing
export const uploadData = upload.single('file');

export async function processDataUpload(req: Request, res: Response) {
  try {
    const userId = 1; // TODO: Get from session/auth
    const { projectId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ ok: false, error: 'No file uploaded' });
    }

    let data: any[] = [];
    let columns: string[] = [];

    // Process different file types
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (ext === '.csv') {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (ext === '.json') {
      const fs = require('fs');
      const fileContent = fs.readFileSync(file.path, 'utf8');
      data = JSON.parse(fileContent);
    }

    if (data.length > 0) {
      columns = Object.keys(data[0]);
    }

    // Create preview (first 50 rows)
    const preview = {
      columns,
      rows: data.slice(0, 50)
    };

    // Save dataset to database
    const [dataset] = await db.insert(aiDatasets).values({
      projectId: projectId ? parseInt(projectId) : null,
      name: file.originalname,
      type: ext.substring(1),
      preview,
      fullData: data.length <= 1000 ? data : null // Only store full data for small datasets
    }).returning();

    // Create artifact entry
    await db.insert(aiArtifacts).values({
      projectId: projectId ? parseInt(projectId) : dataset.projectId!,
      name: `Dataset: ${file.originalname}`,
      type: 'dataset',
      data: { datasetId: dataset.id, preview }
    });

    // Log audit
    await logAudit(userId, 'UPLOAD_DATASET', 'dataset', dataset.id.toString(), {
      fileName: file.originalname,
      fileSize: file.size,
      rowCount: data.length,
      columnCount: columns.length
    }, req.ip);

    // Clean up uploaded file
    require('fs').unlinkSync(file.path);

    res.json({
      ok: true,
      dataset: {
        id: dataset.id,
        name: dataset.name,
        type: dataset.type,
        preview
      }
    });
  } catch (error: any) {
    console.error('Data upload error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

// Generate charts from datasets
export async function generateChart(req: Request, res: Response) {
  try {
    const userId = 1; // TODO: Get from session/auth
    const { datasetId, config } = req.body;
    const { xColumn, yColumn, chartType } = config;

    // Get dataset
    const [dataset] = await db
      .select()
      .from(aiDatasets)
      .where(eq(aiDatasets.id, datasetId));

    if (!dataset) {
      return res.status(404).json({ ok: false, error: 'Dataset not found' });
    }

    // Extract chart data
    const chartData = {
      type: chartType,
      data: {
        labels: dataset.preview.rows.map((row: any) => row[xColumn]),
        datasets: [{
          label: yColumn,
          data: dataset.preview.rows.map((row: any) => parseFloat(row[yColumn]) || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    // Save chart as artifact
    await db.insert(aiArtifacts).values({
      projectId: dataset.projectId!,
      name: `Chart: ${xColumn} vs ${yColumn}`,
      type: 'chart',
      data: chartData
    });

    // Log audit
    await logAudit(userId, 'GENERATE_CHART', 'chart', undefined, {
      datasetId,
      chartType,
      xColumn,
      yColumn
    }, req.ip);

    res.json({ ok: true, chart: chartData });
  } catch (error: any) {
    console.error('Chart generation error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

// Get project analytics
export async function getProjectAnalytics(req: Request, res: Response) {
  try {
    const userId = 1; // TODO: Get from session/auth
    const { projectId } = req.params;

    const analytics = await db
      .select({
        totalChats: sql<number>`count(distinct ${aiChats.id})`,
        totalMessages: sql<number>`count(${aiMessages.id})`,
        totalTokens: sql<number>`coalesce(sum(${aiUsage.totalTokens}), 0)`,
        totalDatasets: sql<number>`count(distinct ${aiDatasets.id})`,
        totalArtifacts: sql<number>`count(distinct ${aiArtifacts.id})`
      })
      .from(aiChats)
      .leftJoin(aiMessages, eq(aiChats.id, aiMessages.chatId))
      .leftJoin(aiUsage, eq(aiChats.userId, aiUsage.userId))
      .leftJoin(aiDatasets, eq(aiDatasets.projectId, parseInt(projectId)))
      .leftJoin(aiArtifacts, eq(aiArtifacts.projectId, parseInt(projectId)))
      .where(eq(aiChats.projectId, parseInt(projectId)));

    res.json({ ok: true, analytics: analytics[0] });
  } catch (error: any) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

// List user projects
export async function getUserProjects(req: Request, res: Response) {
  try {
    const userId = 1; // TODO: Get from session/auth

    const projects = await db
      .select()
      .from(aiProjects)
      .where(eq(aiProjects.userId, userId))
      .orderBy(desc(aiProjects.createdAt));

    res.json({ ok: true, projects });
  } catch (error: any) {
    console.error('Projects fetch error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

// Create new project
export async function createProject(req: Request, res: Response) {
  try {
    const userId = 1; // TODO: Get from session/auth
    const { name, description, defaultModel } = req.body;

    const [project] = await db.insert(aiProjects).values({
      userId,
      name,
      description,
      defaultModel: defaultModel || 'gpt-4o'
    }).returning();

    // Log audit
    await logAudit(userId, 'CREATE_PROJECT', 'project', project.id.toString(), {
      name,
      description
    }, req.ip);

    res.json({ ok: true, project });
  } catch (error: any) {
    console.error('Project creation error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}