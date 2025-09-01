"use client";
import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  useNodesState, 
  useEdgesState,
  Node,
  Edge,
  Connection
} from "reactflow";
import "reactflow/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Play, Plus, Download } from "lucide-react";

interface FlowNode extends Node {
  data: {
    label: string;
    tool: string;
    input?: any;
  };
}

interface GraphData {
  nodes: FlowNode[];
  edges: Edge[];
}

export function AgentDagEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "plan",
      type: "input",
      position: { x: 100, y: 100 },
      data: { label: "Plan", tool: "plan" }
    },
    {
      id: "search",
      type: "default", 
      position: { x: 300, y: 100 },
      data: { label: "Web Search", tool: "web_search", input: { query: "{{step:plan.response.query}}" } }
    },
    {
      id: "analyze",
      type: "default",
      position: { x: 500, y: 100 },
      data: { label: "Analyze", tool: "llm", input: { prompt: "Analyze findings: {{step:search.response.results[0].snippet}}" } }
    }
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: "e1", source: "plan", target: "search", animated: true },
    { id: "e2", source: "search", target: "analyze", animated: true }
  ]);

  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const addNode = (tool: string) => {
    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      type: "default",
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { label: tool.charAt(0).toUpperCase() + tool.slice(1), tool }
    };
    
    setNodes(prev => [...prev, newNode]);
  };

  const updateNodeData = (nodeId: string, updates: Partial<FlowNode['data']>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, ...updates } }
        : node
    ));
  };

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
  };

  const saveGraph = async () => {
    setSaving(true);
    try {
      const graph = { nodes, edges };
      console.log("Saving graph:", graph);
      // Mock save - in production would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const executeGraph = async () => {
    setRunning(true);
    try {
      const graph = { nodes, edges };
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          goal: "Execute visual DAG workflow", 
          graph: graph 
        }),
      });
      
      const data = await response.json();
      if (data.summary) {
        // Create and download the summary
        const blob = new Blob([data.summary], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agent-run-${data.runId}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Run failed:", error);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Visual DAG Editor</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addNode('web_search')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Search
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addNode('llm')}
              >
                <Plus className="h-4 w-4 mr-1" />
                LLM
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addNode('operator_exec')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Code
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={saveGraph}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-1" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                onClick={executeGraph}
                disabled={running}
                size="sm"
              >
                <Play className="h-4 w-4 mr-1" />
                {running ? 'Running...' : 'Execute'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const graph = { nodes, edges };
                  const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'workflow-graph.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {/* ReactFlow Canvas */}
        <Card className="col-span-2">
          <CardContent className="p-0">
            <div style={{ height: 500 }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(_, node) => setSelectedNode(node as FlowNode)}
                fitView
                className="rounded-lg"
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>

        {/* Properties Panel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Node Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedNode ? (
              <>
                <div>
                  <label className="text-sm font-medium">Label</label>
                  <Input
                    value={selectedNode.data.label}
                    onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Tool</label>
                  <Input
                    value={selectedNode.data.tool}
                    onChange={(e) => updateNodeData(selectedNode.id, { tool: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Input (JSON)</label>
                  <Textarea
                    value={JSON.stringify(selectedNode.data.input || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const input = JSON.parse(e.target.value);
                        updateNodeData(selectedNode.id, { input });
                      } catch (err) {
                        // Invalid JSON, don't update
                      }
                    }}
                    rows={4}
                    className="mt-1 font-mono text-xs"
                  />
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteNode(selectedNode.id)}
                  className="w-full"
                >
                  Delete Node
                </Button>
              </>
            ) : (
              <div className="text-sm text-gray-500 text-center py-8">
                Select a node to edit its properties
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Template Variables Help */}
      <Card>
        <CardContent className="p-4">
          <div className="text-xs text-gray-500">
            <strong>Template Variables:</strong> Use <code>{'{{step:nodeId.response.field}}'}</code> to reference previous step outputs.
            Example: <code>{'{{step:search.response.results[0].snippet}}'}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AgentDagEditor;