import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  useNodesState, 
  useEdgesState,
  Node,
  Edge 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AgentDagEditorProps {
  agentId: string;
  initial?: { nodes: Node[]; edges: Edge[] };
}

export function AgentDagEditor({ agentId, initial }: AgentDagEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initial?.nodes || [
    { 
      id: 'plan', 
      position: { x: 0, y: 0 }, 
      data: { label: 'Plan' }, 
      type: 'input',
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #374151',
        borderRadius: '8px'
      }
    },
    { 
      id: 'llm', 
      position: { x: 220, y: 80 }, 
      data: { label: 'LLM' },
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #374151',
        borderRadius: '8px'
      }
    },
    { 
      id: 'web_search', 
      position: { x: 440, y: 160 }, 
      data: { label: 'Web Search' },
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #374151',
        borderRadius: '8px'
      }
    }
  ]);
  
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial?.edges || [
    { 
      id: 'e1', 
      source: 'plan', 
      target: 'llm', 
      animated: true,
      style: { stroke: '#6366f1' }
    }
  ]);

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1' } }, eds));
  }, [setEdges]);

  const addNode = (nodeType: string) => {
    const newNode: Node = {
      id: `${nodeType}_${Date.now()}`,
      position: { 
        x: Math.random() * 400, 
        y: Math.random() * 300 + 200 
      },
      data: { label: nodeType.replace('_', ' ').toUpperCase() },
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #374151',
        borderRadius: '8px'
      }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const save = async () => {
    setSaving(true);
    setSaveStatus('saving');
    
    try {
      const response = await fetch(`/api/agents/${agentId}/graph`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nodes, edges })
      });

      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Failed to save graph:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const availableTools = [
    'llm',
    'web_search', 
    'operator_exec',
    'data_analysis',
    'rag_search'
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Agent Workflow Designer
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={save}
              disabled={saving}
              variant={saveStatus === 'saved' ? 'default' : 'outline'}
              size="sm"
            >
              {saving ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save Graph'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Tool Palette */}
        <div className="mb-4 p-3 border rounded-lg bg-gray-50">
          <p className="text-sm font-medium mb-2">Add Tools:</p>
          <div className="flex flex-wrap gap-2">
            {availableTools.map((tool) => (
              <Button
                key={tool}
                onClick={() => addNode(tool)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                + {tool.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* ReactFlow Canvas */}
        <div className="border rounded-lg overflow-hidden" style={{ height: 500 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            className="bg-gray-50"
          >
            <Background color="#e5e7eb" gap={16} />
            <MiniMap 
              nodeColor="#1f2937"
              maskColor="rgba(0, 0, 0, 0.1)"
              className="bg-white border rounded"
            />
            <Controls className="bg-white border rounded" />
          </ReactFlow>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Drag nodes to reposition them. Connect nodes by dragging from one node's edge to another. 
            Double-click nodes to edit labels. The workflow will execute in the connected order when the agent runs.
          </p>
        </div>

        {saveStatus === 'error' && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            Failed to save workflow. Please try again.
          </div>
        )}
      </CardContent>
    </Card>
  );
}