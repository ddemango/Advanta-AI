import { estimateCredits, getTokenCount, getPlanLimits } from '../pricing';
import { Tools } from './tools';

// Mock database operations for now - replace with actual Drizzle operations
const mockDb = {
  async updateRun(id: string, data: any) {
    console.log(`Updating run ${id}:`, data);
    return data;
  },
  
  async createStep(data: any) {
    const step = { id: `step_${Date.now()}`, ...data };
    console.log('Created step:', step);
    return step;
  },
  
  async updateStep(id: string, data: any) {
    console.log(`Updating step ${id}:`, data);
    return data;
  },
  
  async getRun(id: string) {
    return {
      id,
      userId: 'user_1',
      agentId: 'agent_1',
      projectId: 'project_1',
      goal: 'Test goal',
      status: 'running',
      agent: {
        defaultModel: 'gpt-4o',
        graph: null
      }
    };
  }
};

// Mock credit charging function
async function chargeCredits(userId: string, credits: number, label: string, meta: any = {}) {
  console.log(`Charging ${credits} credits to user ${userId} for ${label}:`, meta);
  return credits;
}

export async function executeAgentRun(runId: string, userPlan: string = 'free') {
  console.log(`Starting agent run: ${runId}`);
  
  const run = await mockDb.getRun(runId);
  const model = run.agent.defaultModel || 'gpt-4o';
  const limits = getPlanLimits(userPlan as keyof typeof getPlanLimits);
  
  let totalInTokens = 0;
  let totalOutTokens = 0;
  let totalCredits = 0;
  let stepCount = 0;

  await mockDb.updateRun(runId, { 
    status: 'running', 
    startedAt: new Date().toISOString() 
  });

  const bill = async (inTok: number, outTok: number, label: string, meta: any = {}) => {
    const credits = estimateCredits(model, inTok, outTok);
    await chargeCredits(run.userId, credits, "agent_step", { 
      runId, 
      label, 
      model,
      ...meta 
    });
    
    totalInTokens += inTok;
    totalOutTokens += outTok;
    totalCredits += credits;
    
    return credits;
  };

  const ctx = { 
    userId: run.userId, 
    projectId: run.projectId, 
    model, 
    bill 
  };

  try {
    // Step 0: Planning (unless saved graph exists)
    let steps: any[] = [];
    
    if (run.agent.graph && (run.agent.graph as any).steps) {
      steps = (run.agent.graph as any).steps;
      console.log('Using saved workflow graph');
    } else {
      console.log('Planning steps for goal:', run.goal);
      const planResult = await Tools.plan(ctx, run.goal);
      steps = planResult;
      
      // Log planning step
      await mockDb.createStep({
        runId: run.id,
        index: 0,
        tool: 'plan',
        status: 'done',
        request: { goal: run.goal },
        response: { steps: planResult },
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString()
      });
    }

    // Enforce plan limits
    if (steps.length > limits.maxStepsPerRun) {
      throw new Error(`Step limit exceeded. Plan: ${userPlan} allows max ${limits.maxStepsPerRun} steps, requested ${steps.length}`);
    }

    console.log(`Executing ${steps.length} steps`);
    let stepIndex = 1;
    let lastResult: any = null;

    // Execute each step
    for (const step of steps) {
      if (stepCount >= limits.maxStepsPerRun) {
        throw new Error(`Step execution limit reached for plan: ${userPlan}`);
      }

      console.log(`Executing step ${stepIndex}: ${step.tool}`);
      
      const stepRecord = await mockDb.createStep({
        runId: run.id,
        index: stepIndex,
        tool: step.tool,
        status: 'running',
        request: step.input || {},
        startedAt: new Date().toISOString()
      });

      try {
        // Check if tool exists
        if (!(step.tool in Tools)) {
          throw new Error(`Unknown tool: ${step.tool}`);
        }

        // Execute the tool
        const toolResult = await (Tools as any)[step.tool](ctx, step.input || {});
        
        await mockDb.updateStep(stepRecord.id, {
          status: 'done',
          response: toolResult,
          finishedAt: new Date().toISOString()
        });

        lastResult = toolResult;
        stepCount++;
        stepIndex++;
        
      } catch (error: any) {
        console.error(`Step ${stepIndex} failed:`, error);
        
        await mockDb.updateStep(stepRecord.id, {
          status: 'error',
          error: error.message,
          finishedAt: new Date().toISOString()
        });

        await mockDb.updateRun(runId, {
          status: 'failed',
          error: `Step ${stepIndex} (${step.tool}) failed: ${error.message}`,
          finishedAt: new Date().toISOString(),
          tokensIn: totalInTokens,
          tokensOut: totalOutTokens,
          creditsUsed: totalCredits
        });

        throw error;
      }
    }

    // Mark run as successful
    await mockDb.updateRun(runId, {
      status: 'succeeded',
      output: lastResult,
      finishedAt: new Date().toISOString(),
      tokensIn: totalInTokens,
      tokensOut: totalOutTokens,
      creditsUsed: totalCredits
    });

    console.log(`Agent run ${runId} completed successfully. Used ${totalCredits} credits.`);
    
    return {
      ok: true,
      result: lastResult,
      tokensUsed: { in: totalInTokens, out: totalOutTokens },
      creditsUsed: totalCredits,
      stepsExecuted: stepCount
    };

  } catch (error: any) {
    console.error(`Agent run ${runId} failed:`, error);
    
    await mockDb.updateRun(runId, {
      status: 'failed',
      error: error.message,
      finishedAt: new Date().toISOString(),
      tokensIn: totalInTokens,
      tokensOut: totalOutTokens,
      creditsUsed: totalCredits
    });

    return {
      ok: false,
      error: error.message,
      tokensUsed: { in: totalInTokens, out: totalOutTokens },
      creditsUsed: totalCredits,
      stepsExecuted: stepCount
    };
  }
}