import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './storage';
import type { InsertWorkflow, InsertWorkflowLog } from '@shared/schema';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action';
  app: string;
  action: string;
  parameters: Record<string, any>;
  description: string;
}

export interface WorkflowDefinition {
  name: string;
  description: string;
  trigger: WorkflowStep;
  steps: WorkflowStep[];
}

const WORKFLOW_PROMPT = `You are an AI workflow generator. Convert natural language automation requests into structured JSON workflows.

Available integrations:
- Slack: send_message, get_messages, create_channel
- Notion: create_page, update_page, create_database, query_database
- Airtable: create_record, update_record, get_records
- Calendly: get_bookings, create_event
- Google Sheets: create_sheet, add_row, update_cell
- Gmail: send_email, get_emails
- Discord: send_message, create_channel
- Trello: create_card, update_card, create_board
- Asana: create_task, update_task, create_project
- HubSpot: create_contact, update_deal, get_contacts
- Stripe: create_customer, process_payment
- Zoom: create_meeting, schedule_meeting
- Webhook: send_data, receive_data

Response format (JSON only):
{
  "name": "Workflow name",
  "description": "Brief description",
  "trigger": {
    "id": "trigger_1",
    "type": "trigger",
    "app": "calendly",
    "action": "new_booking",
    "parameters": {},
    "description": "When a new Calendly booking is created"
  },
  "steps": [
    {
      "id": "step_1",
      "type": "action",
      "app": "slack",
      "action": "send_message",
      "parameters": {
        "channel": "#bookings",
        "message": "New booking from {{booking.name}} at {{booking.start_time}}"
      },
      "description": "Send Slack notification"
    }
  ]
}

Use template variables like {{booking.name}}, {{user.email}} for dynamic data.`;

export class WorkflowEngine {
  async parseWorkflow(prompt: string): Promise<WorkflowDefinition> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: WORKFLOW_PROMPT },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing workflow:', error);
      throw new Error('Failed to parse workflow with AI');
    }
  }

  async executeWorkflow(workflowId: number, triggerData: Record<string, any> = {}): Promise<string> {
    const workflow = await storage.getWorkflowById(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const runId = uuidv4();
    const workflowDef = workflow.workflowJson as WorkflowDefinition;

    try {
      // Log workflow start
      await storage.createWorkflowLog({
        workflowId,
        runId,
        status: 'running',
        stepIndex: 0,
        stepName: 'workflow_start',
        input: triggerData,
        output: null,
        error: null,
      });

      // Execute each step
      let stepIndex = 1;
      for (const step of workflowDef.steps) {
        try {
          const output = await this.executeStep(step, triggerData);
          
          await storage.createWorkflowLog({
            workflowId,
            runId,
            status: 'success',
            stepIndex,
            stepName: step.description,
            input: step.parameters,
            output,
            error: null,
          });
        } catch (error) {
          await storage.createWorkflowLog({
            workflowId,
            runId,
            status: 'error',
            stepIndex,
            stepName: step.description,
            input: step.parameters,
            output: null,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          throw error;
        }
        stepIndex++;
      }

      // Log workflow completion
      await storage.createWorkflowLog({
        workflowId,
        runId,
        status: 'success',
        stepIndex: stepIndex,
        stepName: 'workflow_complete',
        input: null,
        output: { message: 'Workflow completed successfully' },
        error: null,
      });

      return runId;
    } catch (error) {
      await storage.createWorkflowLog({
        workflowId,
        runId,
        status: 'error',
        stepIndex: 0,
        stepName: 'workflow_error',
        input: triggerData,
        output: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private async executeStep(step: WorkflowStep, context: Record<string, any>): Promise<any> {
    // Replace template variables in parameters
    const resolvedParams = this.resolveTemplateVariables(step.parameters, context);

    switch (step.app) {
      case 'slack':
        return this.executeSlackAction(step.action, resolvedParams);
      case 'notion':
        return this.executeNotionAction(step.action, resolvedParams);
      case 'airtable':
        return this.executeAirtableAction(step.action, resolvedParams);
      case 'calendly':
        return this.executeCalendlyAction(step.action, resolvedParams);
      case 'webhook':
        return this.executeWebhookAction(step.action, resolvedParams);
      default:
        // For demo purposes, simulate the action
        return this.simulateAction(step, resolvedParams);
    }
  }

  private resolveTemplateVariables(params: Record<string, any>, context: Record<string, any>): Record<string, any> {
    const resolved = { ...params };
    
    for (const [key, value] of Object.entries(resolved)) {
      if (typeof value === 'string') {
        // Replace {{variable}} patterns
        resolved[key] = value.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
          const keys = variable.split('.');
          let result = context;
          
          for (const k of keys) {
            result = result?.[k];
          }
          
          return result !== undefined ? String(result) : match;
        });
      }
    }
    
    return resolved;
  }

  private async executeSlackAction(action: string, params: Record<string, any>): Promise<any> {
    // Simulate Slack actions for now
    console.log(`Executing Slack action: ${action}`, params);
    return { success: true, message: `Slack ${action} executed`, data: params };
  }

  private async executeNotionAction(action: string, params: Record<string, any>): Promise<any> {
    // Simulate Notion actions for now
    console.log(`Executing Notion action: ${action}`, params);
    return { success: true, message: `Notion ${action} executed`, data: params };
  }

  private async executeAirtableAction(action: string, params: Record<string, any>): Promise<any> {
    // Simulate Airtable actions for now
    console.log(`Executing Airtable action: ${action}`, params);
    return { success: true, message: `Airtable ${action} executed`, data: params };
  }

  private async executeCalendlyAction(action: string, params: Record<string, any>): Promise<any> {
    // Simulate Calendly actions for now
    console.log(`Executing Calendly action: ${action}`, params);
    return { success: true, message: `Calendly ${action} executed`, data: params };
  }

  private async executeWebhookAction(action: string, params: Record<string, any>): Promise<any> {
    // Simulate webhook actions for now
    console.log(`Executing Webhook action: ${action}`, params);
    return { success: true, message: `Webhook ${action} executed`, data: params };
  }

  private async simulateAction(step: WorkflowStep, params: Record<string, any>): Promise<any> {
    // Simulate any action for demo purposes
    console.log(`Simulating ${step.app} action: ${step.action}`, params);
    return { 
      success: true, 
      message: `Simulated ${step.app} ${step.action}`, 
      data: params,
      timestamp: new Date().toISOString()
    };
  }
}

export const workflowEngine = new WorkflowEngine();