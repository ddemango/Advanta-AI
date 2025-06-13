import { storage } from "./storage";
import OpenAI from "openai";
import { workflowEngine } from "./workflow-engine";
import cron from "node-cron";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TriggerConfig {
  type: 'webhook' | 'schedule' | 'database' | 'email' | 'file';
  config: any;
  workflowId: number;
  isActive: boolean;
}

export interface ScheduleTrigger {
  cronExpression: string;
  naturalLanguageSchedule: string;
  timezone: string;
}

export interface WebhookTrigger {
  url: string;
  method: string;
  headers?: Record<string, string>;
  authentication?: {
    type: 'bearer' | 'basic' | 'api_key';
    token?: string;
    username?: string;
    password?: string;
  };
}

class AdvancedTriggerSystem {
  private activeTriggers: Map<string, any> = new Map();
  private webhookEndpoints: Map<string, number> = new Map(); // URL -> workflowId

  async parseNaturalLanguageSchedule(naturalSchedule: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Convert natural language time expressions to cron expressions. 
            Examples:
            - "every day at 9am" -> "0 9 * * *"
            - "every Monday at 2pm" -> "0 14 * * 1"
            - "every hour" -> "0 * * * *"
            - "every 30 minutes" -> "*/30 * * * *"
            - "every workday at 8:30am" -> "30 8 * * 1-5"
            
            Respond with only the cron expression, no explanation.`
          },
          {
            role: "user",
            content: naturalSchedule
          }
        ],
        max_tokens: 50
      });

      return response.choices[0].message.content?.trim() || "0 9 * * *";
    } catch (error) {
      console.error('Error parsing schedule:', error);
      return "0 9 * * *"; // Default to daily at 9am
    }
  }

  async createScheduleTrigger(workflowId: number, schedule: ScheduleTrigger): Promise<string> {
    const cronExpression = schedule.cronExpression || 
      await this.parseNaturalLanguageSchedule(schedule.naturalLanguageSchedule);

    const triggerId = `schedule_${workflowId}_${Date.now()}`;

    try {
      const task = cron.schedule(cronExpression, async () => {
        console.log(`Executing scheduled workflow ${workflowId}`);
        await this.executeWorkflow(workflowId, {
          trigger: 'schedule',
          scheduledAt: new Date().toISOString(),
          cronExpression
        });
      }, {
        scheduled: true,
        timezone: schedule.timezone || 'UTC'
      });

      this.activeTriggers.set(triggerId, {
        type: 'schedule',
        task,
        workflowId,
        config: schedule
      });

      return triggerId;
    } catch (error) {
      console.error('Error creating schedule trigger:', error);
      throw new Error('Failed to create schedule trigger');
    }
  }

  async createWebhookTrigger(workflowId: number, webhook: WebhookTrigger): Promise<string> {
    const triggerId = `webhook_${workflowId}_${Date.now()}`;
    const webhookPath = `/webhook/${triggerId}`;

    this.webhookEndpoints.set(webhookPath, workflowId);
    
    this.activeTriggers.set(triggerId, {
      type: 'webhook',
      workflowId,
      config: webhook,
      path: webhookPath
    });

    return triggerId;
  }

  async handleWebhookRequest(path: string, data: any, headers: any): Promise<any> {
    const workflowId = this.webhookEndpoints.get(path);
    if (!workflowId) {
      throw new Error('Webhook not found');
    }

    console.log(`Executing webhook workflow ${workflowId}`);
    return await this.executeWorkflow(workflowId, {
      trigger: 'webhook',
      data,
      headers,
      receivedAt: new Date().toISOString()
    });
  }

  async createDatabaseTrigger(workflowId: number, config: any): Promise<string> {
    const triggerId = `database_${workflowId}_${Date.now()}`;
    
    // This would integrate with database change streams or polling
    // For now, we'll implement a polling mechanism
    const interval = setInterval(async () => {
      try {
        const hasChanges = await this.checkDatabaseChanges(config);
        if (hasChanges) {
          await this.executeWorkflow(workflowId, {
            trigger: 'database',
            config,
            triggeredAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Database trigger error:', error);
      }
    }, config.pollInterval || 60000); // Default 1 minute polling

    this.activeTriggers.set(triggerId, {
      type: 'database',
      interval,
      workflowId,
      config
    });

    return triggerId;
  }

  private async checkDatabaseChanges(config: any): Promise<boolean> {
    // Implement database change detection logic
    // This could check for new records, updated records, etc.
    return false; // Placeholder
  }

  async createEmailTrigger(workflowId: number, config: any): Promise<string> {
    const triggerId = `email_${workflowId}_${Date.now()}`;
    
    // This would integrate with email services like Gmail API, IMAP, etc.
    // For now, we'll create a placeholder that could be extended
    this.activeTriggers.set(triggerId, {
      type: 'email',
      workflowId,
      config
    });

    return triggerId;
  }

  async executeWorkflow(workflowId: number, triggerData: any): Promise<any> {
    try {
      const workflow = await storage.getWorkflowById(workflowId);
      if (!workflow || !workflow.isActive) {
        console.log(`Workflow ${workflowId} not found or inactive`);
        return;
      }

      const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Add trigger data to workflow context
      const contextWithTrigger = {
        ...triggerData,
        workflowId,
        runId
      };

      return await workflowEngine.executeWorkflow(workflow, contextWithTrigger);
    } catch (error) {
      console.error(`Error executing triggered workflow ${workflowId}:`, error);
      throw error;
    }
  }

  async removeTrigger(triggerId: string): Promise<void> {
    const trigger = this.activeTriggers.get(triggerId);
    if (!trigger) {
      throw new Error('Trigger not found');
    }

    switch (trigger.type) {
      case 'schedule':
        if (trigger.task) {
          trigger.task.stop();
        }
        break;
      case 'webhook':
        this.webhookEndpoints.delete(trigger.path);
        break;
      case 'database':
        if (trigger.interval) {
          clearInterval(trigger.interval);
        }
        break;
    }

    this.activeTriggers.delete(triggerId);
  }

  getTrigger(triggerId: string): any {
    return this.activeTriggers.get(triggerId);
  }

  getWorkflowTriggers(workflowId: number): any[] {
    const triggers = [];
    for (const [id, trigger] of this.activeTriggers) {
      if (trigger.workflowId === workflowId) {
        triggers.push({ id, ...trigger });
      }
    }
    return triggers;
  }

  getAllWebhookPaths(): string[] {
    return Array.from(this.webhookEndpoints.keys());
  }
}

export const triggerSystem = new AdvancedTriggerSystem();

// Natural language processing for advanced scheduling
export async function parseAdvancedSchedule(input: string): Promise<{
  cronExpression: string;
  description: string;
  timezone?: string;
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Parse natural language scheduling requests and convert to cron expressions.
        Also extract timezone if mentioned. Respond in JSON format:
        {
          "cronExpression": "cron expression",
          "description": "human readable description",
          "timezone": "timezone if mentioned, otherwise null"
        }`
      },
      {
        role: "user",
        content: input
      }
    ],
    response_format: { type: "json_object" }
  });

  try {
    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    return {
      cronExpression: "0 9 * * *",
      description: "Daily at 9 AM UTC"
    };
  }
}