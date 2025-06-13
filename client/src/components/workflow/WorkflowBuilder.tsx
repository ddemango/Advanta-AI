import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Save, Trash2, Settings, ArrowRight, Database, Mail, Calendar, Webhook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  title: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface WorkflowBuilderProps {
  workflowId?: number;
  initialWorkflow?: any;
  onSave?: (workflow: any) => void;
}

const nodeTypes = [
  { type: 'trigger', icon: Calendar, label: 'Schedule Trigger', color: 'bg-blue-500' },
  { type: 'trigger', icon: Webhook, label: 'Webhook Trigger', color: 'bg-green-500' },
  { type: 'trigger', icon: Database, label: 'Database Trigger', color: 'bg-purple-500' },
  { type: 'action', icon: Mail, label: 'Send Email', color: 'bg-orange-500' },
  { type: 'action', icon: Database, label: 'Update Database', color: 'bg-red-500' },
  { type: 'condition', icon: Settings, label: 'IF Condition', color: 'bg-yellow-500' },
];

export default function WorkflowBuilder({ workflowId, initialWorkflow, onSave }: WorkflowBuilderProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialWorkflow?.nodes || []);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [workflowName, setWorkflowName] = useState(initialWorkflow?.name || '');
  const [workflowDescription, setWorkflowDescription] = useState(initialWorkflow?.description || '');
  const [isExecuting, setIsExecuting] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);
  const { toast } = useToast();

  const addNode = useCallback((type: string, x: number = 100, y: number = 100) => {
    const nodeType = nodeTypes.find(nt => nt.label === type);
    if (!nodeType) return;

    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type: nodeType.type as 'trigger' | 'action' | 'condition',
      title: nodeType.label,
      config: {},
      position: { x, y }
    };

    setNodes(prev => [...prev, newNode]);
  }, []);

  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setSelectedNode(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (draggedNodeType) {
      addNode(draggedNodeType, x, y);
      setDraggedNodeType(null);
    }
  }, [draggedNodeType, addNode]);

  const saveWorkflow = async () => {
    if (!workflowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workflow name",
        variant: "destructive",
      });
      return;
    }

    try {
      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        workflowJson: {
          nodes,
          connections: [] // For now, simplified
        },
        isActive: true
      };

      if (workflowId) {
        await apiRequest('PUT', `/api/workflows/${workflowId}`, workflowData);
      } else {
        await apiRequest('POST', '/api/workflows', workflowData);
      }

      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      onSave?.(workflowData);
      
      toast({
        title: "Success",
        description: `Workflow ${workflowId ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${workflowId ? 'update' : 'create'} workflow`,
        variant: "destructive",
      });
    }
  };

  const executeWorkflow = async () => {
    if (!workflowId) {
      toast({
        title: "Error",
        description: "Please save the workflow before executing",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    try {
      await apiRequest('POST', `/api/workflows/${workflowId}/execute`, {});
      toast({
        title: "Success",
        description: "Workflow executed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute workflow",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Node Palette */}
      <div className="w-64 border-r border-white/20 bg-white/10 backdrop-blur-sm p-4">
        <h3 className="font-semibold mb-4 text-white">Components</h3>
        <div className="space-y-2">
          {nodeTypes.map((nodeType, index) => {
            const Icon = nodeType.icon;
            return (
              <div
                key={index}
                draggable
                onDragStart={() => setDraggedNodeType(nodeType.label)}
                className="flex items-center p-2 bg-white/90 rounded border border-white/20 cursor-grab hover:bg-white hover:shadow-sm transition-colors"
              >
                <div className={`w-3 h-3 rounded-full ${nodeType.color} mr-2`} />
                <Icon className="w-4 h-4 mr-2 text-gray-700" />
                <span className="text-sm text-gray-700 font-medium">{nodeType.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-white/20 p-4 bg-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 max-w-md">
              <Label htmlFor="workflow-name" className="text-white font-medium">Workflow Name</Label>
              <Input
                id="workflow-name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Enter workflow name..."
                className="bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={saveWorkflow} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button 
                onClick={executeWorkflow} 
                disabled={!workflowId || isExecuting}
                variant="outline"
                className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
              >
                <Play className="w-4 h-4" />
                {isExecuting ? 'Executing...' : 'Run'}
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="workflow-description" className="text-white font-medium">Description</Label>
            <Textarea
              id="workflow-description"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Describe what this workflow does..."
              rows={2}
              className="bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          className="flex-1 relative bg-gray-900/50 overflow-auto"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {nodes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-white/70">
              <div className="text-center">
                <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-white">Drag components from the palette to start building</p>
              </div>
            </div>
          ) : (
            nodes.map((node, index) => {
              const nodeTypeInfo = nodeTypes.find(nt => nt.label === node.title);
              const Icon = nodeTypeInfo?.icon || Settings;
              
              return (
                <div key={node.id} className="absolute">
                  <Card 
                    className={`w-48 cursor-pointer transition-all ${
                      selectedNode?.id === node.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{ 
                      left: node.position.x, 
                      top: node.position.y 
                    }}
                    onClick={() => setSelectedNode(node)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-sm">
                        <div className={`w-3 h-3 rounded-full ${nodeTypeInfo?.color} mr-2`} />
                        <Icon className="w-4 h-4 mr-2" />
                        {node.title}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-auto h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNode(node.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Badge variant="outline" className="text-xs">
                        {node.type}
                      </Badge>
                      {index < nodes.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground mt-2" />
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Properties Panel */}
      {selectedNode && (
        <div className="w-80 border-l border-white/20 bg-white/10 backdrop-blur-sm p-4">
          <h3 className="font-semibold mb-4 text-white">Node Properties</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="node-title" className="text-white font-medium">Title</Label>
              <Input
                id="node-title"
                value={selectedNode.title}
                onChange={(e) => updateNode(selectedNode.id, { title: e.target.value })}
                className="bg-white/90 border-white/20 text-gray-900"
              />
            </div>
            
            {selectedNode.type === 'trigger' && selectedNode.title.includes('Schedule') && (
              <div>
                <Label htmlFor="schedule" className="text-white font-medium">Schedule</Label>
                <Input
                  id="schedule"
                  placeholder="0 9 * * 1 (Every Monday at 9 AM)"
                  value={selectedNode.config.schedule || ''}
                  onChange={(e) => updateNode(selectedNode.id, { 
                    config: { ...selectedNode.config, schedule: e.target.value }
                  })}
                  className="bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-500"
                />
              </div>
            )}
            
            {selectedNode.type === 'action' && selectedNode.title.includes('Email') && (
              <>
                <div>
                  <Label htmlFor="email-to" className="text-white font-medium">To</Label>
                  <Input
                    id="email-to"
                    placeholder="recipient@example.com"
                    value={selectedNode.config.to || ''}
                    onChange={(e) => updateNode(selectedNode.id, { 
                      config: { ...selectedNode.config, to: e.target.value }
                    })}
                    className="bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="email-subject" className="text-white font-medium">Subject</Label>
                  <Input
                    id="email-subject"
                    placeholder="Email subject"
                    value={selectedNode.config.subject || ''}
                    onChange={(e) => updateNode(selectedNode.id, { 
                      config: { ...selectedNode.config, subject: e.target.value }
                    })}
                    className="bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="email-body" className="text-white font-medium">Body</Label>
                  <Textarea
                    id="email-body"
                    placeholder="Email content..."
                    value={selectedNode.config.body || ''}
                    onChange={(e) => updateNode(selectedNode.id, { 
                      config: { ...selectedNode.config, body: e.target.value }
                    })}
                    rows={4}
                    className="bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </>
            )}
            
            {selectedNode.type === 'condition' && (
              <>
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Input
                    id="condition"
                    placeholder="variable == 'value'"
                    value={selectedNode.config.condition || ''}
                    onChange={(e) => updateNode(selectedNode.id, { 
                      config: { ...selectedNode.config, condition: e.target.value }
                    })}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}