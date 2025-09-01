import { Tools } from './tools';

export type RFNode = { id: string; data?: any; type?: string };
export type RFEdge = { id?: string; source: string; target: string };
export type RFGraph = { nodes: RFNode[]; edges: RFEdge[] };

export type CompiledStep = {
  nodeId: string;
  tool: keyof typeof Tools;
  input: any;
};

// --- compile: topological order with cycle checks
export function compileGraphToSteps(graph: RFGraph): CompiledStep[] {
  const { nodes, edges } = graph || { nodes: [], edges: [] };
  if (!nodes?.length) return [];

  const idToNode = new Map(nodes.map(n => [n.id, n]));
  const indeg = new Map<string, number>(nodes.map(n => [n.id, 0]));
  const adj = new Map<string, string[]>();

  for (const e of edges || []) {
    if (!idToNode.has(e.source) || !idToNode.has(e.target)) continue;
    indeg.set(e.target, (indeg.get(e.target) ?? 0) + 1);
    adj.set(e.source, [ ...(adj.get(e.source) || []), e.target ]);
  }

  // Kahn's algorithm
  const q: string[] = [];
  for (const [id, d] of indeg.entries()) if (d === 0) q.push(id);

  const order: string[] = [];
  while (q.length) {
     const id = q.shift()!;
     order.push(id);
     for (const nb of (adj.get(id) || [])) {
       indeg.set(nb, (indeg.get(nb) ?? 0) - 1);
       if ((indeg.get(nb) ?? 0) === 0) q.push(nb);
     }
  }

  if (order.length !== nodes.length) {
    // cycle or disconnected w/ back edge
    throw new Error("Graph contains a cycle or invalid edges. Please adjust edges so the graph is a DAG.");
  }

  // map to steps; expect node.data.tool + node.data.input
  const steps: CompiledStep[] = order.map(nodeId => {
    const n = idToNode.get(nodeId)!;
    const label = n?.data?.label?.toString?.().toLowerCase?.() || "";
    const tool = (n?.data?.tool || label || "llm") as keyof typeof Tools;
    const input = n?.data?.input ?? {};
    return { nodeId, tool, input };
  });

  // heuristic: if there is an explicit "plan" node, put it first (already true if indegree==0)
  return steps;
}

// --- tiny template resolver: replaces {{step:<nodeId>.<path.to.value>}}
export function resolveTemplates<T=any>(value: T, bag: Record<string, any>): T {
  if (value == null) return value;
  if (typeof value === "string") {
    return value.replace(/\{\{\s*step:([\w-]+)\.([\w.\[\]0-9]+)\s*\}\}/g, (_, id, path) => {
      const base = bag[id]?.response ?? bag[id];
      const v = pick(base, path);
      return (typeof v === "string") ? v : JSON.stringify(v ?? "");
    }) as unknown as T;
  }
  if (Array.isArray(value)) return value.map(v => resolveTemplates(v, bag)) as unknown as T;
  if (typeof value === "object") {
    const out: any = {};
    for (const [k,v] of Object.entries(value as any)) out[k] = resolveTemplates(v, bag);
    return out;
  }
  return value;
}

function pick(obj: any, path: string) {
  if (!obj) return undefined;
  return path.split(".").reduce((acc, key) => {
    // support simple [index]
    const m = key.match(/^(.+)\[(\d+)\]$/);
    if (m) return acc?.[m[1]]?.[Number(m[2])];
    return acc?.[key];
  }, obj);
}

// --- execute compiled steps with Tools; returns step outputs keyed by nodeId
export async function executeCompiledSteps(ctx: {
  bill: (inTok: number, outTok: number, label: string, meta?: any) => Promise<number>;
  projectId?: string | null;
  userId: string;
  model: string;
  persistStep: (idx: number, nodeId: string, tool: string, status: string, request?: any, response?: any, error?: string) => Promise<void>;
}, compiled: CompiledStep[]) {
  const outputs: Record<string, any> = {};
  let idx = 1;

  for (const st of compiled) {
    const req = resolveTemplates(st.input, outputs);

    await ctx.persistStep(idx, st.nodeId, st.tool, "running", req);
    try {
      // @ts-ignore (tool key is runtime)
      const res = await Tools[st.tool]({ ...ctx, bill: ctx.bill }, req);
      outputs[st.nodeId] = { request: req, response: res };
      await ctx.persistStep(idx, st.nodeId, st.tool, "done", req, res);
    } catch (e: any) {
      await ctx.persistStep(idx, st.nodeId, st.tool, "error", req, undefined, e.message);
      throw e;
    }
    idx++;
  }
  return outputs;
}