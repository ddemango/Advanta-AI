import { z } from 'zod';

// Strict JSON schema for OpenAI workflow generation as per checklist requirements

// Node input/output schema
const NodeInputSchema = z.record(z.union([z.string(), z.number(), z.boolean(), z.null()]));
const NodeOutputSchema = z.array(z.string());

// Workflow node schema
const WorkflowNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['webhook', 'email', 'transform', 'http', 'slack', 'database', 'ai', 'conditional']),
  action: z.string().min(1),
  inputs: NodeInputSchema,
  outputs: NodeOutputSchema,
  authRef: z.string().optional(), // Reference to API key for authenticated actions
});

// Workflow edge schema
const WorkflowEdgeSchema = z.object({
  fromNodeId: z.string(),
  fromPort: z.string(),
  toNodeId: z.string(),
  toPort: z.string(),
});

// Workflow trigger schema
const WorkflowTriggerSchema = z.object({
  type: z.enum(['webhook', 'schedule', 'event']),
  config: z.record(z.union([z.string(), z.number(), z.boolean()])),
});

// Environment variables schema
const WorkflowEnvSchema = z.record(z.string());

// Complete workflow schema
export const WorkflowSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(1000),
  env: WorkflowEnvSchema,
  nodes: z.array(WorkflowNodeSchema).min(1),
  edges: z.array(WorkflowEdgeSchema),
  triggers: z.array(WorkflowTriggerSchema).min(1),
});

// OpenAI JSON Schema format for strict outputs
export const OpenAIWorkflowSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 255,
      description: "A descriptive name for the workflow"
    },
    description: {
      type: "string",
      minLength: 1,
      maxLength: 1000,
      description: "Detailed description of what this workflow does"
    },
    env: {
      type: "object",
      additionalProperties: {
        type: "string"
      },
      description: "Environment variables needed for this workflow"
    },
    nodes: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            minLength: 1,
            description: "Unique identifier for this node"
          },
          type: {
            type: "string",
            enum: ["webhook", "email", "transform", "http", "slack", "database", "ai", "conditional"],
            description: "Type of action this node performs"
          },
          action: {
            type: "string",
            minLength: 1,
            description: "Specific action to perform (e.g., 'send', 'receive', 'process')"
          },
          inputs: {
            type: "object",
            additionalProperties: true,
            description: "Input parameters for this node"
          },
          outputs: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Output ports that other nodes can connect to"
          },
          authRef: {
            type: "string",
            description: "Reference to stored API credentials for authenticated actions"
          }
        },
        required: ["id", "type", "action", "inputs", "outputs"],
        additionalProperties: false
      }
    },
    edges: {
      type: "array",
      items: {
        type: "object",
        properties: {
          fromNodeId: {
            type: "string",
            description: "Source node ID"
          },
          fromPort: {
            type: "string",
            description: "Source node output port"
          },
          toNodeId: {
            type: "string",
            description: "Target node ID"
          },
          toPort: {
            type: "string",
            description: "Target node input port"
          }
        },
        required: ["fromNodeId", "fromPort", "toNodeId", "toPort"],
        additionalProperties: false
      }
    },
    triggers: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["webhook", "schedule", "event"],
            description: "Type of trigger that starts this workflow"
          },
          config: {
            type: "object",
            additionalProperties: true,
            description: "Configuration specific to this trigger type"
          }
        },
        required: ["type", "config"],
        additionalProperties: false
      }
    }
  },
  required: ["name", "description", "env", "nodes", "edges", "triggers"],
  additionalProperties: false
} as const;

// System prompt for OpenAI workflow generation
export const WORKFLOW_SYSTEM_PROMPT = `You are a Workflow Architect AI that converts natural language descriptions into structured workflow JSON.

CONSTRAINTS:
- Only use these node types: webhook, email, transform, http, slack, database, ai, conditional
- All workflows must have at least 1 trigger and 1 node
- Use authRef for any nodes requiring API credentials (email, slack, external APIs)
- Variable interpolation uses {{node.output}} syntax
- Keep workflows practical and implementable

NODE VOCABULARY:
- webhook: receive/send HTTP requests
- email: send emails via SMTP/API
- transform: process/transform data
- http: make HTTP requests to external APIs
- slack: send Slack messages/notifications
- database: read/write to databases
- ai: AI processing (GPT, analysis, etc.)
- conditional: if/then logic branching

AUTHREF USAGE:
- Use authRef for nodes that need API keys: email, slack, external http calls
- Format: "provider_action" (e.g., "slack_webhook", "gmail_smtp", "openai_api")

Return only valid JSON matching the exact schema provided.`;

// Type exports
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;
export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>;
export type WorkflowTrigger = z.infer<typeof WorkflowTriggerSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;

// Validation helper
export function validateWorkflow(data: unknown): { success: true; data: Workflow } | { success: false; error: string } {
  try {
    const validated = WorkflowSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
    }
    return { success: false, error: 'Unknown validation error' };
  }
}