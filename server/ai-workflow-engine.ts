import OpenAI from 'openai';
import { db } from './db';
import { workflows, workflowLogs, users } from '../shared/schema';
import { eq, and, desc, gte, sql } from 'drizzle-orm';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'loop' | 'delay';
  name: string;
  config: Record<string, any>;
  connections: string[];
  position: { x: number; y: number };
}

export interface DecisionNode {
  id: string;
  condition: string;
  trueAction: string | DecisionNode;
  falseAction: string | DecisionNode;
  metadata?: any;
}

export interface WorkflowAnalytics {
  totalExecutions: number;
  successRate: number;
  avgExecutionTime: number;
  errorRate: number;
  lastExecuted: Date | null;
  commonErrors: Array<{ error: string; count: number; lastOccurred: Date }>;
  performanceTrends: Array<{
    date: string;
    executions: number;
    successRate: number;
    avgTime: number;
  }>;
}

export interface PredictiveSchedule {
  optimalTime: Date;
  confidence: number;
  reasoning: string;
  alternatives: Array<{ time: Date; score: number; reason: string }>;
}

export class AIWorkflowEngine {
  // Natural Language Workflow Parsing
  async parseNaturalLanguageWorkflow(prompt: string, userId: number): Promise<any> {
    try {
      const systemPrompt = `You are an AI workflow automation expert. Convert natural language descriptions into structured workflow configurations.

Rules:
1. Identify triggers (when something happens)
2. Identify actions (what should be done)
3. Identify conditions (if/then logic)
4. Return a JSON workflow with steps, connections, and configurations
5. Include realistic step configurations based on common integrations

Example output structure:
{
  "name": "Workflow Name",
  "description": "Brief description",
  "steps": [
    {
      "id": "trigger_1",
      "type": "trigger",
      "name": "Form Submission",
      "config": {
        "source": "website",
        "formId": "contact-form"
      },
      "position": { "x": 100, "y": 100 },
      "connections": ["action_1"]
    },
    {
      "id": "action_1", 
      "type": "action",
      "name": "Send Email",
      "config": {
        "to": "team@company.com",
        "subject": "New Contact Form Submission",
        "template": "contact_notification"
      },
      "position": { "x": 300, "y": 100 },
      "connections": []
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const workflowConfig = JSON.parse(response.choices[0].message.content);
      
      // Enhance with AI-generated optimizations
      const optimizedConfig = await this.optimizeWorkflow(workflowConfig);
      
      return {
        ...optimizedConfig,
        prompt,
        userId,
        aiGenerated: true,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error parsing natural language workflow:', error);
      throw new Error('Failed to parse workflow description');
    }
  }

  // AI-Powered Workflow Optimization
  async optimizeWorkflow(workflowConfig: any): Promise<any> {
    try {
      const optimizationPrompt = `Analyze this workflow configuration and suggest optimizations:

${JSON.stringify(workflowConfig, null, 2)}

Provide optimizations for:
1. Performance improvements
2. Error handling
3. Parallel execution opportunities
4. Resource efficiency
5. User experience enhancements

Return the optimized workflow with improvements and explanations.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a workflow optimization expert. Improve workflows for better performance, reliability, and user experience." },
          { role: "user", content: optimizationPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const optimizations = JSON.parse(response.choices[0].message.content);
      
      return {
        ...workflowConfig,
        optimizations: optimizations.improvements,
        aiOptimized: true
      };
    } catch (error) {
      console.error('Error optimizing workflow:', error);
      return workflowConfig;
    }
  }

  // Natural Language Scheduling
  async parseNaturalLanguageSchedule(scheduleText: string): Promise<string> {
    try {
      const schedulePrompt = `Convert this natural language schedule to a cron expression:
"${scheduleText}"

Examples:
- "every Monday at 9am" → "0 9 * * 1"
- "daily at 2:30pm" → "30 14 * * *"
- "every 15 minutes" → "*/15 * * * *"
- "first day of each month at midnight" → "0 0 1 * *"

Return only the cron expression as a string.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a cron expression expert. Convert natural language to valid cron expressions." },
          { role: "user", content: schedulePrompt }
        ],
        temperature: 0.1
      });

      return response.choices[0].message.content.trim().replace(/"/g, '');
    } catch (error) {
      console.error('Error parsing schedule:', error);
      throw new Error('Failed to parse schedule');
    }
  }

  // Predictive Scheduling with ML
  async generatePredictiveSchedule(workflowId: number): Promise<PredictiveSchedule> {
    try {
      // Get historical execution data
      const logs = await db.select()
        .from(workflowLogs)
        .where(eq(workflowLogs.workflowId, workflowId))
        .orderBy(desc(workflowLogs.executedAt))
        .limit(100);

      const analytics = await this.analyzeWorkflowPerformance(workflowId);
      
      const analysisPrompt = `Based on this workflow execution history, predict the optimal execution schedule:

Execution Data:
${JSON.stringify(logs.slice(0, 20), null, 2)}

Performance Analytics:
${JSON.stringify(analytics, null, 2)}

Consider:
1. Success rates at different times
2. System load patterns
3. User timezone preferences
4. Business hours impact
5. Resource availability

Provide optimal scheduling recommendations with confidence scores.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a predictive scheduling AI. Analyze execution patterns to recommend optimal schedules." },
          { role: "user", content: analysisPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const predictions = JSON.parse(response.choices[0].message.content);
      
      return {
        optimalTime: new Date(predictions.optimalTime || Date.now() + 3600000),
        confidence: predictions.confidence || 0.7,
        reasoning: predictions.reasoning || "Based on historical performance patterns",
        alternatives: predictions.alternatives || []
      };
    } catch (error) {
      console.error('Error generating predictive schedule:', error);
      return {
        optimalTime: new Date(Date.now() + 3600000),
        confidence: 0.5,
        reasoning: "Default recommendation due to insufficient data",
        alternatives: []
      };
    }
  }

  // Advanced Workflow Analytics
  async analyzeWorkflowPerformance(workflowId: number): Promise<WorkflowAnalytics> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      // Get execution logs
      const logs = await db.select()
        .from(workflowLogs)
        .where(and(
          eq(workflowLogs.workflowId, workflowId),
          gte(workflowLogs.executedAt, thirtyDaysAgo)
        ))
        .orderBy(desc(workflowLogs.executedAt));

      // Calculate basic metrics
      const totalExecutions = logs.length;
      const successfulExecutions = logs.filter(log => log.status === 'success').length;
      const successRate = totalExecutions > 0 ? successfulExecutions / totalExecutions : 0;
      const errorRate = 1 - successRate;

      // Calculate average execution time (simulated for now)
      const avgExecutionTime = logs.length > 0 ? 
        logs.reduce((sum, log) => sum + (Math.random() * 5000 + 1000), 0) / logs.length : 0;

      // Find common errors
      const errorLogs = logs.filter(log => log.error);
      const errorCounts = errorLogs.reduce((acc, log) => {
        const error = log.error || 'Unknown error';
        acc[error] = (acc[error] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const commonErrors = Object.entries(errorCounts)
        .map(([error, count]) => ({
          error,
          count,
          lastOccurred: errorLogs.find(log => log.error === error)?.executedAt || new Date()
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Generate performance trends
      const trends = this.generatePerformanceTrends(logs);

      return {
        totalExecutions,
        successRate,
        avgExecutionTime,
        errorRate,
        lastExecuted: logs[0]?.executedAt || null,
        commonErrors,
        performanceTrends: trends
      };
    } catch (error) {
      console.error('Error analyzing workflow performance:', error);
      return {
        totalExecutions: 0,
        successRate: 0,
        avgExecutionTime: 0,
        errorRate: 0,
        lastExecuted: null,
        commonErrors: [],
        performanceTrends: []
      };
    }
  }

  // AI Query Interface for Conversational Analytics
  async answerWorkflowQuery(query: string, workflowId?: number, userId?: number): Promise<string> {
    try {
      let contextData = {};
      
      if (workflowId) {
        const analytics = await this.analyzeWorkflowPerformance(workflowId);
        const workflow = await db.select()
          .from(workflows)
          .where(eq(workflows.id, workflowId))
          .limit(1);
        
        contextData = {
          workflow: workflow[0],
          analytics
        };
      } else if (userId) {
        const userWorkflows = await db.select()
          .from(workflows)
          .where(eq(workflows.userId, userId))
          .limit(10);
        
        contextData = { userWorkflows };
      }

      const queryPrompt = `Answer this workflow-related question using the provided context data:

Question: "${query}"

Context Data:
${JSON.stringify(contextData, null, 2)}

Provide a helpful, specific answer based on the actual data. If asking about performance, include specific metrics. If asking about optimization, provide actionable recommendations.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an AI workflow analyst. Provide helpful insights and recommendations based on workflow data." },
          { role: "user", content: queryPrompt }
        ],
        temperature: 0.4
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error answering workflow query:', error);
      return "I apologize, but I'm unable to process that query at the moment. Please try again or rephrase your question.";
    }
  }

  // Smart Error Recovery System
  async generateErrorRecoveryStrategy(error: string, workflowId: number): Promise<any> {
    try {
      const workflow = await db.select()
        .from(workflows)
        .where(eq(workflows.id, workflowId))
        .limit(1);

      const recentErrors = await db.select()
        .from(workflowLogs)
        .where(and(
          eq(workflowLogs.workflowId, workflowId),
          sql`error IS NOT NULL`
        ))
        .orderBy(desc(workflowLogs.executedAt))
        .limit(10);

      const recoveryPrompt = `Generate an error recovery strategy for this workflow error:

Error: "${error}"

Workflow Configuration:
${JSON.stringify(workflow[0]?.workflowJson, null, 2)}

Recent Error History:
${JSON.stringify(recentErrors, null, 2)}

Provide:
1. Immediate recovery actions
2. Retry strategy with backoff
3. Fallback mechanisms
4. Prevention measures
5. Monitoring improvements

Return as structured JSON with actionable steps.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an expert in workflow error recovery and system resilience." },
          { role: "user", content: recoveryPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating recovery strategy:', error);
      return {
        immediateActions: ["Restart workflow step", "Check system status"],
        retryStrategy: { maxRetries: 3, backoffMs: [1000, 5000, 15000] },
        fallbackMechanisms: ["Switch to backup service", "Alert administrator"],
        preventionMeasures: ["Add input validation", "Implement health checks"]
      };
    }
  }

  // Generate Decision Trees for Complex Logic
  async generateDecisionTree(prompt: string, context: any = {}): Promise<DecisionNode[]> {
    try {
      const decisionPrompt = `Create a decision tree for this workflow logic:

Prompt: "${prompt}"

Context: ${JSON.stringify(context, null, 2)}

Generate a structured decision tree with conditions, true/false actions, and nested decision points. Return as an array of decision nodes.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an expert in workflow decision logic and conditional branching." },
          { role: "user", content: decisionPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.decisionTree || [];
    } catch (error) {
      console.error('Error generating decision tree:', error);
      return [];
    }
  }

  private generatePerformanceTrends(logs: any[]): Array<{ date: string; executions: number; successRate: number; avgTime: number }> {
    const dailyStats = logs.reduce((acc, log) => {
      const date = log.executedAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { total: 0, successful: 0, totalTime: 0 };
      }
      acc[date].total++;
      if (log.status === 'success') acc[date].successful++;
      acc[date].totalTime += Math.random() * 5000 + 1000; // Simulated execution time
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      executions: stats.total,
      successRate: stats.successful / stats.total,
      avgTime: stats.totalTime / stats.total
    })).slice(0, 30);
  }
}

export const aiWorkflowEngine = new AIWorkflowEngine();