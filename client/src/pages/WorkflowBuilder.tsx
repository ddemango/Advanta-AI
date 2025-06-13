import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Play, Settings } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import WorkflowBuilder from '@/components/workflow/WorkflowBuilder';
import AIQueryInterface from '@/components/workflow/AIQueryInterface';
import { apiRequest } from '@/lib/queryClient';

export default function WorkflowBuilderPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [activeWorkflow, setActiveWorkflow] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const workflowId = id ? parseInt(id, 10) : undefined;

  const { data: workflow, isLoading } = useQuery({
    queryKey: ['/api/workflows', workflowId],
    enabled: !!workflowId,
  });

  const saveWorkflowMutation = useMutation({
    mutationFn: async (workflowData: any) => {
      if (workflowId) {
        const response = await apiRequest('PUT', `/api/workflows/${workflowId}`, workflowData);
        return response.json();
      } else {
        const response = await apiRequest('POST', '/api/workflows', workflowData);
        return response.json();
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      if (!workflowId) {
        setLocation(`/workflow-builder/${data.id}`);
      }
      toast({
        title: "Success",
        description: "Workflow saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save workflow",
        variant: "destructive",
      });
    }
  });

  const executeWorkflowMutation = useMutation({
    mutationFn: async () => {
      if (!workflowId) throw new Error('No workflow ID');
      const response = await apiRequest('POST', `/api/workflows/${workflowId}/execute`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Workflow executed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to execute workflow",
        variant: "destructive",
      });
    }
  });

  const handleSave = (workflowData: any) => {
    saveWorkflowMutation.mutate(workflowData);
  };

  const handleExecute = () => {
    executeWorkflowMutation.mutate();
  };

  useEffect(() => {
    if (workflow) {
      setActiveWorkflow(workflow);
    }
  }, [workflow]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-lg">Loading workflow...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/dashboard')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {workflowId ? 'Edit Workflow' : 'Create New Workflow'}
                </h1>
                {activeWorkflow && (
                  <p className="text-gray-300 text-sm">{activeWorkflow.name}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {activeWorkflow && (
                <Badge variant={activeWorkflow.isActive ? 'default' : 'secondary'}>
                  {activeWorkflow.isActive ? 'Active' : 'Inactive'}
                </Badge>
              )}
              <Button
                onClick={handleExecute}
                disabled={!workflowId || executeWorkflowMutation.isPending}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {executeWorkflowMutation.isPending ? 'Running...' : 'Test Run'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
          {/* Main Workflow Builder */}
          <div className="lg:col-span-3">
            <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-0 h-full">
                <WorkflowBuilder
                  workflowId={workflowId}
                  initialWorkflow={activeWorkflow}
                  onSave={handleSave}
                />
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <div className="h-1/2">
              <AIQueryInterface workflowId={workflowId} />
            </div>

            {/* Workflow Info */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Workflow Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeWorkflow ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-400">Created</p>
                      <p className="text-white">
                        {new Date(activeWorkflow.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Last Modified</p>
                      <p className="text-white">
                        {new Date(activeWorkflow.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <Badge variant={activeWorkflow.isActive ? 'default' : 'secondary'}>
                        {activeWorkflow.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">
                      Create your workflow to see details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-white border-white/20 hover:bg-white/10"
                  disabled={saveWorkflowMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveWorkflowMutation.isPending ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-white border-white/20 hover:bg-white/10"
                  onClick={() => setLocation('/dashboard?tab=analytics')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}