import { Tools } from "./tools";

export type RFNode = { 
  id: string; 
  data?: any; 
  type?: string; 
  position?: { x: number; y: number };
};

export type RFEdge = { 
  id?: string; 
  source: string; 
  target: string;
  animated?: boolean;
};

export type RFGraph = { 
  nodes: RFNode[]; 
  edges: RFEdge[] 
};

export type CompiledStep = {
  nodeId: string;
  tool: keyof typeof Tools;
  input: any;
};

// Compile ReactFlow graph to ordered steps using topological sort
export function compileGraphToSteps(graph: RFGraph): CompiledStep[] {
  const { nodes, edges } = graph || { nodes: [], edges: [] };
  if (!nodes?.length) return [];

  const idToNode = new Map(nodes.map(n => [n.id, n]));
  const indeg = new Map<string, number>(nodes.map(n => [n.id, 0]));
  const adj = new Map<string, string[]>();

  // Build adjacency list and count in-degrees
  for (const e of edges || []) {
    if (!idToNode.has(e.source) || !idToNode.has(e.target)) continue;
    indeg.set(e.target, (indeg.get(e.target) ?? 0) + 1);
    adj.set(e.source, [...(adj.get(e.source) || []), e.target]);
  }

  // Kahn's algorithm for topological sorting
  const queue: string[] = [];
  for (const [id, degree] of Array.from(indeg.entries())) {
    if (degree === 0) queue.push(id);
  }

  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    
    for (const neighbor of (adj.get(id) || [])) {
      indeg.set(neighbor, (indeg.get(neighbor) ?? 0) - 1);
      if ((indeg.get(neighbor) ?? 0) === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Check for cycles
  if (order.length !== nodes.length) {
    throw new Error("Graph contains a cycle or invalid edges. Please adjust edges so the graph is a DAG.");
  }

  // Map nodes to compiled steps
  const steps: CompiledStep[] = order.map(nodeId => {
    const node = idToNode.get(nodeId)!;
    const label = node?.data?.label?.toString?.().toLowerCase?.() || "";
    const tool = (node?.data?.tool || label || "llm") as keyof typeof Tools;
    const input = node?.data?.input ?? {};
    return { nodeId, tool, input };
  });

  return steps;
}

// Template resolver: replaces {{step:<nodeId>.<path>}} with actual values
export function resolveTemplates<T = any>(value: T, outputs: Record<string, any>): T {
  if (value == null) return value;
  
  if (typeof value === "string") {
    return value.replace(/\{\{\s*step:([\w-]+)\.([\w.\[\]0-9]+)\s*\}\}/g, (_, nodeId, path) => {
      const stepOutput = outputs[nodeId]?.response ?? outputs[nodeId];
      const resolvedValue = getNestedValue(stepOutput, path);
      return typeof resolvedValue === "string" ? resolvedValue : JSON.stringify(resolvedValue ?? "");
    }) as unknown as T;
  }
  
  if (Array.isArray(value)) {
    return value.map(v => resolveTemplates(v, outputs)) as unknown as T;
  }
  
  if (typeof value === "object") {
    const result: any = {};
    for (const [key, val] of Object.entries(value as any)) {
      result[key] = resolveTemplates(val, outputs);
    }
    return result;
  }
  
  return value;
}

function getNestedValue(obj: any, path: string) {
  if (!obj) return undefined;
  
  return path.split(".").reduce((acc, key) => {
    // Support array indexing like [0]
    const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      return acc?.[arrayMatch[1]]?.[Number(arrayMatch[2])];
    }
    return acc?.[key];
  }, obj);
}

// Execute compiled steps with the Tools registry
export async function executeCompiledSteps(
  ctx: {
    bill: (inTok: number, outTok: number, label: string, meta?: any) => Promise<number>;
    projectId?: string | null;
    userId: string;
    model: string;
    persistStep: (idx: number, nodeId: string, tool: string, status: string, request?: any, response?: any, error?: string) => Promise<void>;
  },
  compiledSteps: CompiledStep[]
) {
  const outputs: Record<string, any> = {};
  let stepIndex = 1;

  for (const step of compiledSteps) {
    // Resolve templates in input using previous step outputs
    const resolvedInput = resolveTemplates(step.input, outputs);

    await ctx.persistStep(stepIndex, step.nodeId, step.tool, "running", resolvedInput);
    
    try {
      // Execute the tool
      // @ts-ignore (dynamic tool access)
      const response = await Tools[step.tool](
        { ...ctx, bill: ctx.bill },
        resolvedInput
      );
      
      outputs[step.nodeId] = { request: resolvedInput, response };
      await ctx.persistStep(stepIndex, step.nodeId, step.tool, "done", resolvedInput, response);
      
    } catch (error: any) {
      await ctx.persistStep(stepIndex, step.nodeId, step.tool, "error", resolvedInput, undefined, error.message);
      throw error;
    }
    
    stepIndex++;
  }

  return outputs;
}