"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Play, Plus, Download } from "lucide-react";

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    tool: string;
    input?: any;
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export function AgentDagEditor() {
  const [graph, setGraph] = useState<GraphData>({
    nodes: [
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
    ],
    edges: [
      { id: "e1", source: "plan", target: "search" },
      { id: "e2", source: "search", target: "analyze" }
    ]
  });

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  const addNode = (tool: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: "default",
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { label: tool.charAt(0).toUpperCase() + tool.slice(1), tool }
    };
    
    setGraph(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  };

  const updateNodeData = (nodeId: string, updates: Partial<Node['data']>) => {
    setGraph(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    }));
  };

  const deleteNode = (nodeId: string) => {
    setGraph(prev => ({
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      edges: prev.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    }));
    setSelectedNode(null);
  };

  const saveGraph = async () => {
    setSaving(true);
    try {
      // Mock save - in production would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saved graph:', graph);
    } finally {
      setSaving(false);
    }
  };

  const executeGraph = async () => {
    setRunning(true);
    try {
      const response = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: 'Execute visual DAG workflow',
          graph: graph
        })
      });
      
      const result = await response.json();
      console.log('Graph execution result:', result);
      
      if (result.summary) {
        // Download the summary report
        const blob = new Blob([result.summary], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agent-run-${result.runId}.md`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Graph execution failed:', error);
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
        {/* Canvas */}
        <Card className="col-span-2">
          <CardContent className="p-4">
            <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-700">
              {/* Render nodes */}
              {graph.nodes.map(node => (
                <div
                  key={node.id}
                  className={`absolute bg-white dark:bg-gray-800 border-2 rounded-lg p-3 cursor-pointer shadow-md transition-all ${
                    selectedNode?.id === node.id 
                      ? 'border-blue-500 shadow-lg' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                  style={{
                    left: node.position.x,
                    top: node.position.y,
                    minWidth: '120px'
                  }}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="text-sm font-medium">{node.data.label}</div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {node.data.tool}
                  </Badge>
                </div>
              ))}

              {/* Render edges (simplified) */}
              {graph.edges.map(edge => {
                const sourceNode = graph.nodes.find(n => n.id === edge.source);
                const targetNode = graph.nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                return (
                  <svg
                    key={edge.id}
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: 1 }}
                  >
                    <line
                      x1={sourceNode.position.x + 60}
                      y1={sourceNode.position.y + 25}
                      x2={targetNode.position.x + 60}
                      y2={targetNode.position.y + 25}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill="#3b82f6"
                        />
                      </marker>
                    </defs>
                  </svg>
                );
              })}
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