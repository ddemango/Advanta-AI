// Results composer that turns a multi-step run into a single Markdown summary artifact

export type StepOutput = {
  nodeId: string;
  tool: string;
  request: any;
  response: any;
  status: string;
  error?: string;
};

export function composeResultsToMarkdown(goal: string, steps: StepOutput[]): string {
  const timestamp = new Date().toISOString();
  
  let markdown = `# Agent Execution Summary\n\n`;
  markdown += `**Goal:** ${goal}\n\n`;
  markdown += `**Executed:** ${timestamp}\n\n`;
  markdown += `**Status:** ${steps.every(s => s.status === 'done') ? 'Completed' : 'Partial/Failed'}\n\n`;

  // Mermaid diagram
  markdown += `## Execution Flow\n\n`;
  markdown += generateMermaidDiagram(steps);
  markdown += `\n\n`;

  // Execution table
  markdown += `## Execution Details\n\n`;
  markdown += generateExecutionTable(steps);
  markdown += `\n\n`;

  // Step-by-step logs
  markdown += `## Step-by-Step Logs\n\n`;
  steps.forEach((step, idx) => {
    markdown += `### Step ${idx + 1}: ${step.tool} (${step.nodeId})\n\n`;
    markdown += `**Status:** ${step.status}\n\n`;
    
    if (step.request && Object.keys(step.request).length > 0) {
      markdown += `**Input:**\n\`\`\`json\n${JSON.stringify(step.request, null, 2)}\n\`\`\`\n\n`;
    }
    
    if (step.response && Object.keys(step.response).length > 0) {
      markdown += `**Output:**\n\`\`\`json\n${JSON.stringify(step.response, null, 2)}\n\`\`\`\n\n`;
    }
    
    if (step.error) {
      markdown += `**Error:** ${step.error}\n\n`;
    }
  });

  // Summary
  markdown += `## Summary\n\n`;
  const successCount = steps.filter(s => s.status === 'done').length;
  markdown += `- **Total Steps:** ${steps.length}\n`;
  markdown += `- **Successful:** ${successCount}\n`;
  markdown += `- **Failed:** ${steps.length - successCount}\n`;
  markdown += `- **Execution Time:** ${calculateExecutionTime(steps)}\n\n`;

  return markdown;
}

function generateMermaidDiagram(steps: StepOutput[]): string {
  let mermaid = '```mermaid\ngraph TD\n';
  
  steps.forEach((step, idx) => {
    const nodeId = step.nodeId.replace(/[^a-zA-Z0-9]/g, '_');
    const status = step.status === 'done' ? '✓' : step.status === 'error' ? '✗' : '●';
    const color = step.status === 'done' ? 'fill:#d4edda' : step.status === 'error' ? 'fill:#f8d7da' : 'fill:#fff3cd';
    
    mermaid += `  ${nodeId}["${status} ${step.tool}<br/>${step.nodeId}"]\n`;
    mermaid += `  ${nodeId} --> ${nodeId}_style[${color}]\n`;
    
    if (idx < steps.length - 1) {
      const nextNodeId = steps[idx + 1].nodeId.replace(/[^a-zA-Z0-9]/g, '_');
      mermaid += `  ${nodeId} --> ${nextNodeId}\n`;
    }
  });
  
  mermaid += '```';
  return mermaid;
}

function generateExecutionTable(steps: StepOutput[]): string {
  let table = '| Step | Tool | Node ID | Status | Duration |\n';
  table += '|------|------|---------|--------|-----------|\n';
  
  steps.forEach((step, idx) => {
    const status = step.status === 'done' ? '✅' : step.status === 'error' ? '❌' : '⏳';
    const duration = 'N/A'; // Could calculate from timestamps if available
    table += `| ${idx + 1} | ${step.tool} | ${step.nodeId} | ${status} ${step.status} | ${duration} |\n`;
  });
  
  return table;
}

function calculateExecutionTime(steps: StepOutput[]): string {
  // Placeholder - would calculate from actual timestamps
  return 'N/A';
}

export async function saveMarkdownArtifact(userId: string, projectId: string | null, markdown: string, goal: string) {
  // Save the markdown artifact to storage
  const artifact = {
    id: `agent_summary_${Date.now()}`,
    userId,
    projectId,
    type: 'markdown',
    title: `Agent Execution: ${goal}`,
    content: markdown,
    createdAt: new Date().toISOString()
  };
  
  // TODO: Persist to database
  console.log('Saving artifact:', artifact.id);
  
  return artifact;
}