// Creates comprehensive Markdown summaries of agent runs with Mermaid diagrams

function codeBlock(language: string, content: string) {
  return "```" + language + "\n" + content + "\n```";
}

function createStepsTable(steps: Array<{
  idx: number;
  tool: string;
  status: string;
  credits: number;
  inTok: number;
  outTok: number;
}>) {
  const header = "| # | Tool | Status | Credits | Tokens In | Tokens Out |\n|---|---|---|---:|---:|---:|";
  const rows = steps.map(step => 
    `| ${step.idx} | ${step.tool} | ${step.status} | ${step.credits} | ${step.inTok} | ${step.outTok} |`
  );
  return [header, ...rows].join("\n");
}

function generateMermaidDiagram(graph: any) {
  if (!graph?.nodes?.length || !graph?.edges?.length) return "";
  
  const getNodeLabel = (node: any) => node?.data?.label || node?.data?.tool || node.id;
  const lines = ["graph TD"];
  
  // Add nodes
  for (const node of graph.nodes) {
    lines.push(`${node.id}[${getNodeLabel(node)}]`);
  }
  
  // Add edges
  for (const edge of graph.edges) {
    lines.push(`${edge.source} --> ${edge.target}`);
  }
  
  return "```mermaid\n" + lines.join("\n") + "\n```";
}

export async function composeAndSaveRunArtifact(runId: string) {
  // Mock data for demonstration - in production this would fetch from database
  const mockRun = {
    id: runId,
    agentName: 'Research Agent',
    agentId: 'agent-demo',
    status: 'succeeded',
    goal: 'Execute visual DAG workflow',
    creditsUsed: 150,
    tokensIn: 300,
    tokensOut: 600,
    startedAt: new Date(Date.now() - 60000),
    finishedAt: new Date(),
    output: { summary: 'Workflow executed successfully' },
    userId: 'demo',
    projectId: null,
    agentGraph: {
      nodes: [
        { id: 'search', data: { label: 'Web Search', tool: 'web_search' } },
        { id: 'analyze', data: { label: 'Analyze', tool: 'llm' } }
      ],
      edges: [
        { source: 'search', target: 'analyze' }
      ]
    }
  };

  const mockSteps = [
    {
      index: 1,
      tool: 'web_search',
      status: 'done',
      request: { query: 'AI automation trends 2025' },
      response: { results: [{ title: 'AI Trends', snippet: 'AI is growing rapidly...' }] },
      credits: 25,
      tokensIn: 50,
      tokensOut: 100,
      error: null
    },
    {
      index: 2,
      tool: 'llm',
      status: 'done',
      request: { prompt: 'Analyze the search results' },
      response: { text: 'Key findings show significant growth in AI automation...' },
      credits: 75,
      tokensIn: 150,
      tokensOut: 300,
      error: null
    }
  ];
  
  // Calculate step metrics
  const stepRows = mockSteps.map((step: any) => ({
    idx: step.index,
    tool: step.tool,
    status: step.status,
    credits: step.credits ?? 0,
    inTok: step.tokensIn ?? 0,
    outTok: step.tokensOut ?? 0
  }));

  // Generate report sections
  const header = `# Agent Run Summary

**Agent:** ${mockRun.agentName || mockRun.agentId}  
**Run ID:** ${mockRun.id}  
**Status:** ${mockRun.status}  
**Goal:** ${mockRun.goal || "(graph-based execution)"}  

**Credits Used:** ${mockRun.creditsUsed}  
**Tokens:** ${mockRun.tokensIn} in • ${mockRun.tokensOut} out  

**Started:** ${mockRun.startedAt?.toISOString() || ""}  
**Finished:** ${mockRun.finishedAt?.toISOString() || ""}`;

  const stepsTable = createStepsTable(stepRows);

  // Generate detailed step logs
  const stepDetails = mockSteps.map((step: any) => {
    const requestBlock = codeBlock("json", JSON.stringify(step.request ?? {}, null, 2));
    const responseBlock = step.response 
      ? codeBlock("json", JSON.stringify(step.response ?? {}, null, 2))
      : "";
    const errorBlock = step.error 
      ? "\n**Error:** " + codeBlock("text", step.error)
      : "";
    
    return `### Step ${step.index}: ${step.tool} — ${step.status}
**Request**
${requestBlock}

**Response**
${responseBlock}${errorBlock}`;
  }).join("\n\n");

  // Add Mermaid diagram if graph execution was used
  const mermaidDiagram = mockRun.agentGraph ? generateMermaidDiagram(mockRun.agentGraph) : "";

  const outputSection = `## Final Output
${codeBlock("json", JSON.stringify(mockRun.output ?? {}, null, 2))}`;

  // Compose full markdown report
  const markdownContent = [
    header,
    "",
    mermaidDiagram,
    "",
    "## Execution Steps",
    stepsTable,
    "",
    stepDetails,
    "",
    outputSection
  ].filter(Boolean).join("\n");

  console.log(`Generated agent run summary for ${runId}:`, markdownContent.length, 'characters');

  return markdownContent;
}