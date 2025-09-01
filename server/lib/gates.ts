import { db } from './database';

export type UserPlan = 'free' | 'pro' | 'enterprise';

export interface PlanLimits {
  dailyTokens: number;
  concurrentSessions: number;
  features: string[];
  operatorTime: number; // minutes per day
  dataAnalysisSize: number; // MB
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: {
    dailyTokens: 10000,
    concurrentSessions: 1,
    features: ['chat', 'basic_humanization'],
    operatorTime: 15, // 15 minutes per day
    dataAnalysisSize: 5 // 5MB max
  },
  pro: {
    dailyTokens: 100000,
    concurrentSessions: 3,
    features: ['chat', 'humanization', 'operator', 'data_analysis', 'web_search'],
    operatorTime: 120, // 2 hours per day
    dataAnalysisSize: 50 // 50MB max
  },
  enterprise: {
    dailyTokens: 1000000,
    concurrentSessions: 10,
    features: ['chat', 'humanization', 'operator', 'data_analysis', 'web_search', 'team_management', 'audit_logs'],
    operatorTime: 480, // 8 hours per day
    dataAnalysisSize: 500 // 500MB max
  }
};

export async function getUserPlan(userId: string): Promise<UserPlan> {
  try {
    // Check if user exists and get their plan
    const users = await db.query('SELECT plan FROM users WHERE id = ?', [userId]);
    
    if (users && users.length > 0) {
      return (users[0].plan as UserPlan) || 'free';
    }
    
    return 'free';
  } catch (error) {
    console.error('Error getting user plan:', error);
    return 'free';
  }
}

export async function requirePlan(userId: string, allowedPlans: UserPlan[]): Promise<void> {
  const userPlan = await getUserPlan(userId);
  
  if (!allowedPlans.includes(userPlan)) {
    const needed = allowedPlans.join(' or ');
    const error: any = new Error(`Feature requires ${needed} plan. Current plan: ${userPlan}`);
    error.code = 'PLAN_FORBIDDEN';
    error.userPlan = userPlan;
    error.requiredPlans = allowedPlans;
    throw error;
  }
}

export function hasFeature(plan: UserPlan, feature: string): boolean {
  return PLAN_LIMITS[plan].features.includes(feature);
}

export async function checkDailyUsage(userId: string): Promise<{
  tokensUsed: number;
  tokensLimit: number;
  operatorMinutesUsed: number;
  operatorMinutesLimit: number;
}> {
  const plan = await getUserPlan(userId);
  const limits = PLAN_LIMITS[plan];
  
  try {
    // Get today's usage
    const today = new Date().toISOString().split('T')[0];
    
    const tokenUsage = await db.query(
      'SELECT SUM(tokens_used) as total FROM ai_portal_usage WHERE user_id = ? AND DATE(created_at) = ?',
      [userId, today]
    );
    
    const operatorUsage = await db.query(
      'SELECT SUM(duration_minutes) as total FROM operator_sessions WHERE user_id = ? AND DATE(created_at) = ? AND status = "completed"',
      [userId, today]
    );
    
    return {
      tokensUsed: (tokenUsage && tokenUsage[0]?.total) || 0,
      tokensLimit: limits.dailyTokens,
      operatorMinutesUsed: (operatorUsage && operatorUsage[0]?.total) || 0,
      operatorMinutesLimit: limits.operatorTime
    };
  } catch (error) {
    console.error('Error checking daily usage:', error);
    return {
      tokensUsed: 0,
      tokensLimit: limits.dailyTokens,
      operatorMinutesUsed: 0,
      operatorMinutesLimit: limits.operatorTime
    };
  }
}

export function createPlanError(userPlan: UserPlan, requiredPlans: UserPlan[], feature: string) {
  return {
    error: 'PLAN_REQUIRED',
    message: `${feature} requires ${requiredPlans.join(' or ')} plan`,
    userPlan,
    requiredPlans,
    feature
  };
}