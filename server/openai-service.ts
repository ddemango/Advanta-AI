import OpenAI from 'openai';
import { OpenAIWorkflowSchema, WORKFLOW_SYSTEM_PROMPT, validateWorkflow } from '@shared/WorkflowSchema';

// OpenAI service for strict JSON workflow generation as per checklist requirements

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY not found. Workflow generation will use mock data.");
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export interface WorkflowGenerationRequest {
  prompt: string;
  tenantId?: number;
  userId?: number;
}

export interface WorkflowGenerationResponse {
  success: true;
  workflow: any;
  tokensUsed: number;
  latencyMs: number;
} | {
  success: false;
  error: string;
  fallbackWorkflow?: any;
}

export async function generateWorkflow(request: WorkflowGenerationRequest): Promise<WorkflowGenerationResponse> {
  const startTime = Date.now();
  
  try {
    if (!openai) {
      console.log("Using mock workflow generation (no OpenAI API key)");
      return generateMockWorkflow(request);
    }

    // Use OpenAI Responses API with strict JSON schema as per checklist
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06", // Latest model with structured outputs
      messages: [
        {
          role: "system",
          content: WORKFLOW_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Create a workflow for: ${request.prompt}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "workflow",
          strict: true,
          schema: OpenAIWorkflowSchema
        }
      },
      temperature: 0.2,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    let workflowData;
    try {
      workflowData = JSON.parse(content);
    } catch (parseError) {
      throw new Error(`Invalid JSON returned: ${parseError}`);
    }

    // Validate against our Zod schema
    const validation = validateWorkflow(workflowData);
    if (!validation.success) {
      throw new Error(`Workflow validation failed: ${validation.error}`);
    }

    const latencyMs = Date.now() - startTime;
    const tokensUsed = completion.usage?.total_tokens || 0;

    console.log(`[OpenAI] Workflow generated - ${tokensUsed} tokens, ${latencyMs}ms`);

    return {
      success: true,
      workflow: validation.data,
      tokensUsed,
      latencyMs
    };

  } catch (error) {
    console.error("OpenAI workflow generation failed:", error);
    
    // Return mock workflow as fallback
    const mockResult = generateMockWorkflow(request);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallbackWorkflow: mockResult.success ? mockResult.workflow : undefined
    };
  }
}

function generateMockWorkflow(request: WorkflowGenerationRequest): WorkflowGenerationResponse {
  const latencyMs = Date.now() - Date.now() + Math.random() * 100; // Simulate latency
  
  // Generate contextual mock workflow based on prompt keywords
  const prompt = request.prompt.toLowerCase();
  
  let mockWorkflow;
  
  if (prompt.includes('email') || prompt.includes('contact') || prompt.includes('form')) {
    mockWorkflow = {
      name: "Contact Form Email Workflow",
      description: `Automated workflow: ${request.prompt}`,
      env: {
        ADMIN_EMAIL: "admin@company.com",
        SLACK_WEBHOOK: "{{slack_webhook}}"
      },
      nodes: [
        {
          id: "trigger",
          type: "webhook",
          action: "receive",
          inputs: { method: "POST", path: "/contact" },
          outputs: ["data"]
        },
        {
          id: "validate",
          type: "transform",
          action: "validate",
          inputs: { 
            data: "{{trigger.data}}",
            required: ["name", "email", "message"]
          },
          outputs: ["validated"]
        },
        {
          id: "send_email",
          type: "email",
          action: "send",
          inputs: {
            to: "{{env.ADMIN_EMAIL}}",
            subject: "New Contact Form Submission",
            body: "Name: {{validate.validated.name}}\nEmail: {{validate.validated.email}}\nMessage: {{validate.validated.message}}"
          },
          outputs: ["sent"],
          authRef: "smtp_gmail"
        },
        {
          id: "slack_notify",
          type: "slack",
          action: "send",
          inputs: {
            webhook: "{{env.SLACK_WEBHOOK}}",
            text: "New contact form submission from {{validate.validated.name}}"
          },
          outputs: ["notified"],
          authRef: "slack_webhook"
        }
      ],
      edges: [
        { fromNodeId: "trigger", fromPort: "data", toNodeId: "validate", toPort: "data" },
        { fromNodeId: "validate", fromPort: "validated", toNodeId: "send_email", toPort: "data" },
        { fromNodeId: "validate", fromPort: "validated", toNodeId: "slack_notify", toPort: "data" }
      ],
      triggers: [
        { 
          type: "webhook", 
          config: { 
            path: "/contact",
            method: "POST"
          } 
        }
      ]
    };
  } else if (prompt.includes('content') || prompt.includes('blog') || prompt.includes('post')) {
    mockWorkflow = {
      name: "Content Generation & Publishing",
      description: `Automated workflow: ${request.prompt}`,
      env: {
        CMS_API_KEY: "{{cms_api_key}}",
        SOCIAL_TOKEN: "{{social_token}}"
      },
      nodes: [
        {
          id: "schedule_trigger",
          type: "webhook",
          action: "receive",
          inputs: { schedule: "daily" },
          outputs: ["time"]
        },
        {
          id: "generate_content",
          type: "ai",
          action: "generate",
          inputs: {
            prompt: "Generate a blog post about {{schedule_trigger.time.topic}}",
            model: "gpt-4"
          },
          outputs: ["content"],
          authRef: "openai_api"
        },
        {
          id: "publish_cms",
          type: "http",
          action: "post",
          inputs: {
            url: "https://api.cms.com/posts",
            headers: { "Authorization": "Bearer {{env.CMS_API_KEY}}" },
            body: { "title": "{{generate_content.content.title}}", "content": "{{generate_content.content.body}}" }
          },
          outputs: ["published"],
          authRef: "cms_api"
        },
        {
          id: "social_share",
          type: "http",
          action: "post",
          inputs: {
            url: "https://api.social.com/posts",
            headers: { "Authorization": "Bearer {{env.SOCIAL_TOKEN}}" },
            body: { "text": "New blog post: {{generate_content.content.title}}" }
          },
          outputs: ["shared"],
          authRef: "social_api"
        }
      ],
      edges: [
        { fromNodeId: "schedule_trigger", fromPort: "time", toNodeId: "generate_content", toPort: "trigger" },
        { fromNodeId: "generate_content", fromPort: "content", toNodeId: "publish_cms", toPort: "data" },
        { fromNodeId: "publish_cms", fromPort: "published", toNodeId: "social_share", toPort: "trigger" }
      ],
      triggers: [
        { 
          type: "schedule", 
          config: { 
            cron: "0 9 * * *",
            timezone: "UTC"
          } 
        }
      ]
    };
  } else {
    // Generic workflow
    mockWorkflow = {
      name: "Generic Data Workflow",
      description: `Automated workflow: ${request.prompt}`,
      env: {},
      nodes: [
        {
          id: "trigger",
          type: "webhook",
          action: "receive",
          inputs: { method: "POST" },
          outputs: ["data"]
        },
        {
          id: "process",
          type: "transform",
          action: "process",
          inputs: { data: "{{trigger.data}}" },
          outputs: ["processed"]
        },
        {
          id: "notify",
          type: "email",
          action: "send",
          inputs: {
            to: "admin@example.com",
            subject: "Workflow Completed",
            body: "Data processed: {{process.processed}}"
          },
          outputs: ["sent"],
          authRef: "smtp_default"
        }
      ],
      edges: [
        { fromNodeId: "trigger", fromPort: "data", toNodeId: "process", toPort: "data" },
        { fromNodeId: "process", fromPort: "processed", toNodeId: "notify", toPort: "data" }
      ],
      triggers: [
        { 
          type: "webhook", 
          config: { 
            path: "/webhook",
            method: "POST"
          } 
        }
      ]
    };
  }

  // Validate the mock workflow
  const validation = validateWorkflow(mockWorkflow);
  if (!validation.success) {
    console.error("Mock workflow validation failed:", validation.error);
    throw new Error("Generated mock workflow is invalid");
  }

  return {
    success: true,
    workflow: validation.data,
    tokensUsed: 0,
    latencyMs
  };
}