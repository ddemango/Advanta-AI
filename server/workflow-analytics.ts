import { storage } from "./storage";
import { workflowLogs } from "@shared/schema";
import { db } from "./db";
import { sql, desc, and, gte, lte } from "drizzle-orm";

export interface WorkflowAnalytics {
  totalExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  errorRate: number;
  topErrors: Array<{ error: string; count: number }>;
  executionTrend: Array<{ date: string; executions: number; successes: number }>;
  performanceMetrics: {
    fastestExecution: number;
    slowestExecution: number;
    medianExecutionTime: number;
  };
}

export interface WorkflowInsights {
  optimizationSuggestions: string[];
  performanceScore: number;
  reliabilityScore: number;
  recommendations: string[];
}

export async function getWorkflowAnalytics(
  workflowId: number,
  timeRange: { start: Date; end: Date }
): Promise<WorkflowAnalytics> {
  // Get basic execution stats
  const executionStats = await db
    .select({
      total: sql<number>`count(*)`,
      successes: sql<number>`count(case when status = 'success' then 1 end)`,
      errors: sql<number>`count(case when status = 'error' then 1 end)`,
      avgTime: sql<number>`avg(extract(epoch from (executed_at - executed_at)))`,
    })
    .from(workflowLogs)
    .where(
      and(
        sql`workflow_id = ${workflowId}`,
        gte(workflowLogs.executedAt, timeRange.start),
        lte(workflowLogs.executedAt, timeRange.end)
      )
    );

  // Get error breakdown
  const errorBreakdown = await db
    .select({
      error: workflowLogs.error,
      count: sql<number>`count(*)`,
    })
    .from(workflowLogs)
    .where(
      and(
        sql`workflow_id = ${workflowId}`,
        sql`status = 'error'`,
        sql`error IS NOT NULL`,
        gte(workflowLogs.executedAt, timeRange.start),
        lte(workflowLogs.executedAt, timeRange.end)
      )
    )
    .groupBy(workflowLogs.error)
    .orderBy(desc(sql`count(*)`))
    .limit(5);

  // Get daily execution trend
  const executionTrend = await db
    .select({
      date: sql<string>`date(executed_at)`,
      executions: sql<number>`count(*)`,
      successes: sql<number>`count(case when status = 'success' then 1 end)`,
    })
    .from(workflowLogs)
    .where(
      and(
        sql`workflow_id = ${workflowId}`,
        gte(workflowLogs.executedAt, timeRange.start),
        lte(workflowLogs.executedAt, timeRange.end)
      )
    )
    .groupBy(sql`date(executed_at)`)
    .orderBy(sql`date(executed_at)`);

  const stats = executionStats[0];
  const successRate = stats.total > 0 ? (stats.successes / stats.total) * 100 : 0;
  const errorRate = stats.total > 0 ? (stats.errors / stats.total) * 100 : 0;

  return {
    totalExecutions: stats.total,
    successRate: Math.round(successRate * 100) / 100,
    averageExecutionTime: Math.round((stats.avgTime || 0) * 100) / 100,
    errorRate: Math.round(errorRate * 100) / 100,
    topErrors: errorBreakdown.map(e => ({
      error: e.error || 'Unknown Error',
      count: e.count,
    })),
    executionTrend: executionTrend.map(t => ({
      date: t.date,
      executions: t.executions,
      successes: t.successes,
    })),
    performanceMetrics: {
      fastestExecution: 0, // Would need more complex query
      slowestExecution: 0, // Would need more complex query
      medianExecutionTime: stats.avgTime || 0,
    },
  };
}

export async function generateWorkflowInsights(
  workflowId: number,
  analytics: WorkflowAnalytics
): Promise<WorkflowInsights> {
  const optimizationSuggestions: string[] = [];
  const recommendations: string[] = [];

  // Performance analysis
  if (analytics.successRate < 90) {
    optimizationSuggestions.push("Consider adding error handling and retry logic to improve success rate");
  }

  if (analytics.averageExecutionTime > 30) {
    optimizationSuggestions.push("Optimize workflow steps to reduce execution time");
  }

  if (analytics.errorRate > 10) {
    optimizationSuggestions.push("Review and fix common error patterns");
    recommendations.push("Implement better input validation");
  }

  // Usage pattern analysis
  if (analytics.totalExecutions > 1000) {
    recommendations.push("Consider implementing caching for frequently used data");
  }

  if (analytics.topErrors.length > 0) {
    const topError = analytics.topErrors[0];
    recommendations.push(`Address the most common error: ${topError.error}`);
  }

  // Calculate scores
  const performanceScore = Math.min(100, Math.max(0, 100 - analytics.averageExecutionTime));
  const reliabilityScore = analytics.successRate;

  return {
    optimizationSuggestions,
    performanceScore: Math.round(performanceScore),
    reliabilityScore: Math.round(reliabilityScore),
    recommendations,
  };
}

export async function generatePerformanceReport(userId: number): Promise<any> {
  const workflows = await storage.getWorkflows(userId);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const now = new Date();

  const reports = await Promise.all(
    workflows.map(async (workflow) => {
      const analytics = await getWorkflowAnalytics(workflow.id, {
        start: thirtyDaysAgo,
        end: now,
      });
      const insights = await generateWorkflowInsights(workflow.id, analytics);

      return {
        workflow,
        analytics,
        insights,
      };
    })
  );

  return {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.isActive).length,
    reports,
    overallMetrics: {
      totalExecutions: reports.reduce((sum, r) => sum + r.analytics.totalExecutions, 0),
      averageSuccessRate: reports.reduce((sum, r) => sum + r.analytics.successRate, 0) / reports.length || 0,
      topPerformingWorkflows: reports
        .sort((a, b) => b.insights.performanceScore - a.insights.performanceScore)
        .slice(0, 5),
    },
  };
}