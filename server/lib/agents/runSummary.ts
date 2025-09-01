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
  for (const n of graph.nodes) lines.push(`${n.id}[${nodeLabel(n)}]`);
  for (const e of graph.edges) lines.push(`${e.source} --> ${e.target}`);
  return "```mermaid\n" + lines.join("\n") + "\n```";
}

export async function generateRunSummary(runData: {
  id: string;
  status: string;
  goal?: string;
  creditsUsed: number;
  tokensIn: number;
  tokensOut: number;
  startedAt?: Date;
  finishedAt?: Date;
  output?: any;
  agent?: { name?: string; graph?: any };
  steps: Array<{
    index: number;
    tool: string;
    status: string;
    request?: any;
    response?: any;
    error?: string;
    credits?: number;
    tokensIn?: number;
    tokensOut?: number;
  }>;
}) {
  // Roll up per-step credits/tokens from step data
  const rows = runData.steps.map(s => ({
    idx: s.index,
    tool: s.tool,
    status: s.status,
    credits: s.credits ?? 0,
    inTok: s.tokensIn ?? 0,
    outTok: s.tokensOut ?? 0
  }));

  const header = `# Agent Run Summary

**Agent:** ${runData.agent?.name ?? 'Unknown Agent'}  
**Run ID:** ${runData.id}  
**Status:** ${runData.status}  
**Goal:** ${runData.goal || "(graph-run)"}  

**Credits:** ${runData.creditsUsed}  
**Tokens:** in ${runData.tokensIn} • out ${runData.tokensOut}  

**Started:** ${runData.startedAt?.toISOString() ?? ""}  
**Finished:** ${runData.finishedAt?.toISOString() ?? ""}`;

  const table = asTable(rows);

  const details = runData.steps.map(s => {
    const req = codeBlock("json", JSON.stringify(s.request ?? {}, null, 2));
    const res = s.response ? codeBlock("json", JSON.stringify(s.response ?? {}, null, 2)) : "";
    const err = s.error ? ("\n**Error:** " + codeBlock("text", s.error)) : "";
    return `### Step ${s.index}: ${s.tool} — ${s.status}\n**Request**\n${req}\n\n**Response**\n${res}${err}`;
  }).join("\n\n");

  const mermaid = runData.agent?.graph ? mermaidFromGraph(runData.agent.graph) : "";

  const tail = `## Output
${codeBlock("json", JSON.stringify(runData.output ?? {}, null, 2))}`;

  const md = [header, "", mermaid, "", "## Steps", table, "", details, "", tail].join("\n");

  return md;
}