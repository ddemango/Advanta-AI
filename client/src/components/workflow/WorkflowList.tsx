import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Play, Pause, Settings, Trash2, Eye, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Workflow {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  workflowJson: any;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowListProps {
  onWorkflowSelect?: (workflow: Workflow) => void;
}

export function WorkflowList({ onWorkflowSelect }: WorkflowListProps) {
  const queryClient = useQueryClient();
  
  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ['/api/workflows'],
  });

  const toggleWorkflowMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error('Failed to update workflow');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
    },
  });

  const deleteWorkflowMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete workflow');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
    },
  });

  const executeWorkflowMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/workflows/${id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ triggerData: {} }),
      });
      if (!response.ok) throw new Error('Failed to execute workflow');
      return response.json();
    },
  });

  const handleToggleActive = (workflow: Workflow) => {
    toggleWorkflowMutation.mutate({
      id: workflow.id,
      isActive: !workflow.isActive,
    });
  };

  const handleExecute = (workflow: Workflow) => {
    executeWorkflowMutation.mutate(workflow.id);
  };

  const handleDelete = (workflow: Workflow) => {
    if (confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
      deleteWorkflowMutation.mutate(workflow.id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (workflows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Workflows</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No workflows yet</p>
            <p className="text-sm">Create your first automation workflow to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Your Workflows
          <Badge variant="secondary">{workflows.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {workflows.map((workflow: Workflow, index: number) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm">{workflow.name}</h3>
                  <Badge 
                    variant={workflow.isActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {workflow.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{workflow.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(workflow.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    {workflow.workflowJson?.steps?.length || 0} steps
                  </span>
                </div>
              </div>
              <Switch
                checked={workflow.isActive}
                onCheckedChange={() => handleToggleActive(workflow)}
                size="sm"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExecute(workflow)}
                disabled={executeWorkflowMutation.isPending}
                className="text-xs"
              >
                <Play className="w-3 h-3 mr-1" />
                Test
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onWorkflowSelect?.(workflow)}
                className="text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(workflow)}
                disabled={deleteWorkflowMutation.isPending}
                className="text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}