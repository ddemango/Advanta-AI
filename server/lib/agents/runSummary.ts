// Mock database operations for now - replace with actual Drizzle operations
const mockDb = {
  async findAgentRun(runId: string) {
    return {
      id: runId,
      agentId: 'agent-1',
      userId: 'user-1',
      projectId: 'project-1',
      goal: 'Test agent execution',
      status: 'succeeded',
      output: { result: 'Execution completed successfully' },
      creditsUsed: 150,
      tokensIn: 1000,
      tokensOut: 500,
      startedAt: new Date(),
      finishedAt: new Date(),
      agent: {
        name: 'Research Agent',
        graph: {
          nodes: [
            { id: 'plan', data: { label: 'Plan' } },
            { id: 'search', data: { label: 'Web Search' } },
            { id: 'llm', data: { label: 'LLM Analysis' } }
          ],
          edges: [
            { source: 'plan', target: 'search' },
            { source: 'search', target: 'llm' }
          ]
        }
      },
      steps: [
        {
          id: 'step-1',
          index: 0,
          tool: 'plan',
          status: 'done',
          request: { mode: 'graph' },
          response: { compiled: [] },
          credits: 20,
          tokensIn: 100,
          tokensOut: 50
        },
        {
          id: 'step-2',
          index: 1,
          tool: 'web_search',
          status: 'done',
          request: { query: 'AI developments' },
          response: { results: [{ title: 'AI News', snippet: 'Latest developments...' }] },
          credits: 30,
          tokensIn: 200,
          tokensOut: 150
        },
        {
          id: 'step-3',
          index: 2,
          tool: 'llm',
          status: 'done',
          request: { prompt: 'Analyze findings' },
          response: { text: 'Based on the search results, here are the key insights...' },
          credits: 100,
          tokensIn: 700,
          tokensOut: 300
        }
      ]
    };
  },

  async createArtifact(data: any) {
    const artifact = {
      id: `artifact-${Date.now()}`,
      ...data,
      createdAt: new Date()
    };
    console.log('Created artifact:', artifact);
    return artifact;
  }
};

function codeBlock(lang: string, s: string) {
  return "```" + lang + "\n" + s + "\n```";
}

function asTable(rows: Array<{ idx:number; tool:string; status:string; credits:number; inTok:number; outTok:number }>) {
  const header = "| # | tool | status | credits | in | out |\n|---|---|---|---:|---:|---:|";
  const lines = rows.map(r => `| ${r.idx} | ${r.tool} | ${r.status} | ${r.credits} | ${r.inTok} | ${r.outTok} |`);
  return [header, ...lines].join("\n");
}

function mermaidFromGraph(graph: any) {
  if (!graph?.nodes?.length || !graph?.edges?.length) return "";
  const nodeLabel = (n:any) => (n?.data?.label || n?.data?.tool || n.id);
  const lines = ["graph TD"];
  for (const n of graph.nodes) lines.push(`  ${n.id}[${nodeLabel(n)}]`);
  for (const e of graph.edges) lines.push(`  ${e.source} --> ${e.target}`);
  return "```mermaid\n" + lines.join("\n") + "\n```";
}

export async function composeAndSaveRunArtifact(runId: string) {
  const run = await mockDb.findAgentRun(runId);
  if (!run) return;

  // Roll up per-step credits/tokens from step.response meta if present (optional)
  const rows = run.steps.map(s => ({
    idx: s.index,
    tool: s.tool,
    status: s.status,
    credits: s.credits ?? 0,
    inTok: s.tokensIn ?? 0,
    outTok: s.tokensOut ?? 0
  }));

  const header = `# Agent Run Summary

**Agent:** ${run.agent?.name ?? run.agentId}  
**Run ID:** ${run.id}  
**Status:** ${run.status}  
**Goal:** ${run.goal || "(graph-run)"}  

**Credits:** ${run.creditsUsed}  
**Tokens:** in ${run.tokensIn} • out ${run.tokensOut}  

**Started:** ${run.startedAt?.toISOString() ?? ""}  
**Finished:** ${run.finishedAt?.toISOString() ?? ""}`;

  const table = asTable(rows);

  const details = run.steps.map(s => {
    const req = codeBlock("json", JSON.stringify(s.request ?? {}, null, 2));
    const res = s.response ? codeBlock("json", JSON.stringify(s.response ?? {}, null, 2)) : "";
    const err = s.error ? ("\n**Error:** " + codeBlock("text", s.error)) : "";
    return `### Step ${s.index}: ${s.tool} — ${s.status}\n\n**Request**\n${req}\n\n**Response**\n${res}${err}`;
  }).join("\n\n");

  const mermaid = run.agent?.graph ? mermaidFromGraph(run.agent.graph) : "";

  const tail = `## Final Output

${codeBlock("json", JSON.stringify(run.output ?? {}, null, 2))}

---

*This summary was automatically generated from the agent execution. All steps, inputs, outputs, and resource usage are documented above.*`;

  const md = [header, "", mermaid, "", "## Execution Steps", "", table, "", "## Step Details", "", details, "", tail].join("\n");

  // Save as markdown artifact for the project (or user if no project)
  const artifact = await mockDb.createArtifact({
    name: `Agent Run Summary — ${run.agent?.name ?? run.agentId}`,
    kind: "markdown",
    data: { md },
    userId: run.userId,
    projectId: run.projectId || undefined
  });

  console.log(`Created run summary artifact: ${artifact.id} for run: ${runId}`);
  return artifact;
}