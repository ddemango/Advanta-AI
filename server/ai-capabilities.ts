import OpenAI from "openai";
import { storage } from "./storage";
import { getWorkflowAnalytics, generateWorkflowInsights } from "./workflow-analytics";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface DecisionNode {
  id: string;
  condition: string;
  trueAction: string | DecisionNode;
  falseAction: string | DecisionNode;
  metadata?: any;
}

export interface WorkflowQuery {
  question: string;
  workflowId?: number;
  userId: number;
}

export interface PredictiveSchedule {
  optimalTime: Date;
  confidence: number;
  reasoning: string;
  alternatives: Array<{ time: Date; score: number }>;
}

export class AdvancedAICapabilities {
  
  async generateDecisionTree(prompt: string, context: any = {}): Promise<DecisionNode[]> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Create a decision tree structure for workflow automation. 
            Generate conditional logic with if-then-else patterns.
            Return a JSON array of decision nodes with this structure:
            {
              "id": "unique_id",
              "condition": "logical condition to evaluate",
              "trueAction": "action or next node id if condition is true",
              "falseAction": "action or next node id if condition is false",
              "metadata": { "description": "human readable description" }
            }`
          },
          {
            role: "user",
            content: `Create decision logic for: ${prompt}\nContext: ${JSON.stringify(context)}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.nodes || [];
    } catch (error) {
      console.error('Error generating decision tree:', error);
      return [];
    }
  }

  async analyzeWorkflowData(workflowId: number, timeRange: { start: Date; end: Date }): Promise<any> {
    const analytics = await getWorkflowAnalytics(workflowId, timeRange);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze workflow performance data and provide insights in JSON format:
          {
            "summary": "brief performance summary",
            "keyInsights": ["insight1", "insight2", "insight3"],
            "recommendations": ["recommendation1", "recommendation2"],
            "riskFactors": ["risk1", "risk2"],
            "optimizationOpportunities": ["opportunity1", "opportunity2"]
          }`
        },
        {
          role: "user",
          content: `Analyze this workflow data: ${JSON.stringify(analytics)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    try {
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      return {
        summary: "Analysis completed",
        keyInsights: [],
        recommendations: [],
        riskFactors: [],
        optimizationOpportunities: []
      };
    }
  }

  async answerWorkflowQuery(query: WorkflowQuery): Promise<string> {
    let context = "";
    
    if (query.workflowId) {
      const workflow = await storage.getWorkflowById(query.workflowId);
      const logs = await storage.getWorkflowLogs(query.workflowId);
      context = `Workflow: ${JSON.stringify(workflow)}\nRecent logs: ${JSON.stringify(logs.slice(-10))}`;
    } else {
      const workflows = await storage.getWorkflows(query.userId);
      context = `User workflows: ${JSON.stringify(workflows)}`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that helps users understand their workflow automation data.
          Answer questions about workflow performance, execution patterns, errors, and optimization opportunities.
          Be specific and provide actionable insights based on the data provided.`
        },
        {
          role: "user",
          content: `Question: ${query.question}\n\nContext: ${context}`
        }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content || "I couldn't analyze that data right now.";
  }

  async predictOptimalScheduling(
    workflowType: string, 
    historicalData: any[], 
    constraints: any = {}
  ): Promise<PredictiveSchedule> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze historical workflow execution data to predict optimal scheduling times.
          Consider success rates, response times, resource availability, and user patterns.
          Return JSON with optimal time prediction:
          {
            "optimalTime": "ISO datetime string",
            "confidence": "number 0-100",
            "reasoning": "explanation of prediction",
            "alternatives": [
              {"time": "ISO datetime", "score": "number 0-100"}
            ]
          }`
        },
        {
          role: "user",
          content: `Predict optimal scheduling for ${workflowType} workflow.
          Historical data: ${JSON.stringify(historicalData)}
          Constraints: ${JSON.stringify(constraints)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    try {
      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        optimalTime: new Date(result.optimalTime || Date.now()),
        confidence: result.confidence || 50,
        reasoning: result.reasoning || "Based on historical patterns",
        alternatives: result.alternatives || []
      };
    } catch (error) {
      return {
        optimalTime: new Date(Date.now() + 3600000), // 1 hour from now
        confidence: 50,
        reasoning: "Default scheduling prediction",
        alternatives: []
      };
    }
  }

  async generateErrorRecoveryStrategy(error: string, context: any): Promise<any> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Generate smart error recovery strategies for workflow automation.
          Create retry logic, fallback actions, and prevention measures.
          Return JSON format:
          {
            "retryStrategy": {
              "maxAttempts": number,
              "backoffMultiplier": number,
              "retryConditions": ["condition1", "condition2"]
            },
            "fallbackActions": ["action1", "action2"],
            "preventionMeasures": ["measure1", "measure2"],
            "escalationTriggers": ["trigger1", "trigger2"]
          }`
        },
        {
          role: "user",
          content: `Error: ${error}\nContext: ${JSON.stringify(context)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    try {
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      return {
        retryStrategy: {
          maxAttempts: 3,
          backoffMultiplier: 2,
          retryConditions: ["temporary_failure", "rate_limit"]
        },
        fallbackActions: ["log_error", "notify_admin"],
        preventionMeasures: ["validate_inputs", "check_dependencies"],
        escalationTriggers: ["max_retries_exceeded", "critical_failure"]
      };
    }
  }

  async generateWorkflowOptimizations(workflowId: number): Promise<any> {
    const workflow = await storage.getWorkflowById(workflowId);
    const logs = await storage.getWorkflowLogs(workflowId);
    const analytics = await getWorkflowAnalytics(workflowId, {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze workflow structure and performance to suggest optimizations.
          Focus on performance improvements, reliability enhancements, and cost reductions.
          Return JSON format:
          {
            "performanceOptimizations": ["optimization1", "optimization2"],
            "reliabilityImprovements": ["improvement1", "improvement2"],
            "costReductions": ["reduction1", "reduction2"],
            "structuralChanges": ["change1", "change2"],
            "priorityScore": number
          }`
        },
        {
          role: "user",
          content: `Optimize workflow:
          Structure: ${JSON.stringify(workflow?.workflowJson)}
          Analytics: ${JSON.stringify(analytics)}
          Recent logs: ${JSON.stringify(logs.slice(-20))}`
        }
      ],
      response_format: { type: "json_object" }
    });

    try {
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      return {
        performanceOptimizations: [],
        reliabilityImprovements: [],
        costReductions: [],
        structuralChanges: [],
        priorityScore: 0
      };
    }
  }
}

export const aiCapabilities = new AdvancedAICapabilities();