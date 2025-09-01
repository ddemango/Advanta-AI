import { Request, Response } from 'express';
import { getUserPlan, requirePlan, checkDailyUsage, createPlanError } from '../lib/gates';

// Mock user endpoint for development
export async function handleGetMe(req: Request, res: Response) {
  try {
    // In production, this would get from actual authentication
    const userId = '1'; // TODO: Get from auth token
    const plan = await getUserPlan(userId);
    
    const user = {
      id: userId,
      email: 'admin@advanta.ai',
      plan,
      credits: 50000,
      defaultModel: 'gpt-4o'
    };
    
    res.json({ ok: true, user });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
}

// Enhanced chat endpoint with plan gating
export async function handleChat(req: Request, res: Response) {
  try {
    const userId = '1'; // TODO: Get from auth token
    const { messages, model } = req.body;
    
    // Check if user has access to the requested model
    const plan = await getUserPlan(userId);
    
    // Free users can only use basic models
    if (plan === 'free' && !['gpt-3.5-turbo', 'gpt-4o-mini'].includes(model)) {
      return res.status(403).json(createPlanError(plan, ['pro', 'enterprise'], 'Advanced AI Models'));
    }
    
    // Check daily usage limits
    const usage = await checkDailyUsage(userId);
    if (usage.tokensUsed >= usage.tokensLimit) {
      return res.status(429).json({
        error: 'DAILY_LIMIT_EXCEEDED',
        message: 'Daily token limit exceeded',
        usage
      });
    }
    
    // Simulate chat response for now
    const response = `I'm an AI assistant with ${plan} plan capabilities. You asked: "${messages[messages.length - 1]?.content || 'Hello'}"`;
    
    res.json({ ok: true, response, model, tokensUsed: 100 });
  } catch (error: any) {
    if (error.code === 'PLAN_FORBIDDEN') {
      return res.status(403).json(createPlanError(error.userPlan, error.requiredPlans, 'Chat Feature'));
    }
    res.status(500).json({ ok: false, error: error.message });
  }
}

// Enhanced operator endpoints with plan gating
export async function handleOperatorSessions(req: Request, res: Response) {
  try {
    const userId = '1'; // TODO: Get from auth token
    await requirePlan(userId, ['pro', 'enterprise']);
    
    // Mock sessions for now
    const sessions = [
      {
        id: 'session-1',
        userId,
        status: 'active',
        createdAt: new Date(),
        lastActivity: new Date()
      }
    ];
    
    res.json({ ok: true, sessions });
  } catch (error: any) {
    if (error.code === 'PLAN_FORBIDDEN') {
      return res.status(403).json(createPlanError(error.userPlan, error.requiredPlans, 'Virtual Computer'));
    }
    res.status(500).json({ ok: false, error: error.message });
  }
}

export async function handleCreateOperatorSession(req: Request, res: Response) {
  try {
    const userId = '1'; // TODO: Get from auth token
    await requirePlan(userId, ['pro', 'enterprise']);
    
    // Check operator time limits
    const usage = await checkDailyUsage(userId);
    if (usage.operatorMinutesUsed >= usage.operatorMinutesLimit) {
      return res.status(429).json({
        error: 'OPERATOR_LIMIT_EXCEEDED',
        message: 'Daily virtual computer time limit exceeded',
        usage
      });
    }
    
    const session = {
      id: `session-${Date.now()}`,
      userId,
      status: 'active',
      createdAt: new Date(),
      workspaceDirectory: `.operator-sessions/session-${Date.now()}`
    };
    
    res.json({ ok: true, session });
  } catch (error: any) {
    if (error.code === 'PLAN_FORBIDDEN') {
      return res.status(403).json(createPlanError(error.userPlan, error.requiredPlans, 'Virtual Computer'));
    }
    res.status(500).json({ ok: false, error: error.message });
  }
}

// Enhanced data analysis with plan gating
export async function handleDataAnalysis(req: Request, res: Response) {
  try {
    const userId = '1'; // TODO: Get from auth token
    const { data, analysisType } = req.body;
    
    // Free users have limited data analysis
    const plan = await getUserPlan(userId);
    if (plan === 'free' && data.length > 1000) {
      return res.status(403).json(createPlanError(plan, ['pro', 'enterprise'], 'Large Dataset Analysis'));
    }
    
    // Mock analysis result
    const result = {
      summary: `Analyzed ${data.length} rows with ${plan} plan capabilities`,
      insights: [
        'Data quality: Good',
        'Missing values: 2%',
        'Recommended actions: Clean null values'
      ],
      plan
    };
    
    res.json({ ok: true, result });
  } catch (error: any) {
    if (error.code === 'PLAN_FORBIDDEN') {
      return res.status(403).json(createPlanError(error.userPlan, error.requiredPlans, 'Data Analysis'));
    }
    res.status(500).json({ ok: false, error: error.message });
  }
}

// Web search with plan gating
export async function handleWebSearch(req: Request, res: Response) {
  try {
    const userId = '1'; // TODO: Get from auth token
    await requirePlan(userId, ['pro', 'enterprise']);
    
    const { query } = req.body;
    
    // Mock search results
    const results = [
      {
        title: `Search results for: ${query}`,
        url: 'https://example.com',
        snippet: 'This is a mock search result for demonstration purposes.'
      }
    ];
    
    res.json({ ok: true, results });
  } catch (error: any) {
    if (error.code === 'PLAN_FORBIDDEN') {
      return res.status(403).json(createPlanError(error.userPlan, error.requiredPlans, 'Web Search'));
    }
    res.status(500).json({ ok: false, error: error.message });
  }
}

// Humanization with plan gating
export async function handleHumanization(req: Request, res: Response) {
  try {
    const userId = '1'; // TODO: Get from auth token
    const { text, tone, style } = req.body;
    
    const plan = await getUserPlan(userId);
    
    // Free users get basic humanization only
    if (plan === 'free' && ['professional', 'technical'].includes(tone)) {
      return res.status(403).json(createPlanError(plan, ['pro', 'enterprise'], 'Advanced Humanization Tones'));
    }
    
    // Mock humanized text
    const humanizedText = `[${plan.toUpperCase()} ${tone}]: ${text}`;
    
    res.json({ ok: true, humanizedText, originalLength: text.length, plan });
  } catch (error: any) {
    if (error.code === 'PLAN_FORBIDDEN') {
      return res.status(403).json(createPlanError(error.userPlan, error.requiredPlans, 'Text Humanization'));
    }
    res.status(500).json({ ok: false, error: error.message });
  }
}