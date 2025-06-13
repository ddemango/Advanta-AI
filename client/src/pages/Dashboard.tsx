import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { LogOut, User, Settings, Shield, Zap, Bot, Workflow, Clock, Play, CheckCircle, AlertCircle } from "lucide-react";
import { PromptInput } from "@/components/workflow/PromptInput";
import { WorkflowPreview } from "@/components/workflow/WorkflowPreview";
import { WorkflowList } from "@/components/workflow/WorkflowList";
import { WorkflowAnalytics } from "@/components/workflow/WorkflowAnalytics";
import { AIQueryInterface } from "@/components/workflow/AIQueryInterface";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [generatedWorkflow, setGeneratedWorkflow] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/auth/user'],
    retry: false,
    queryFn: async () => {
      const res = await fetch('/auth/user', {
        credentials: 'include',
      });
      
      if (res.status === 401) {
        return null;
      }
      
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      
      return await res.json();
    },
  });

  const workflowsQuery = useQuery({
    queryKey: ['/api/workflows'],
    queryFn: async () => {
      const response = await fetch('/api/workflows', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch workflows');
      return response.json();
    }
  });

  const saveWorkflowMutation = useMutation({
    mutationFn: async (workflow: any) => {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: workflow.name,
          description: workflow.description,
          prompt: workflow.description, // Add the required prompt field
          workflowJson: workflow,
          isActive: false
        }),
      });
      if (!response.ok) throw new Error('Failed to save workflow');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      setGeneratedWorkflow(null);
    },
  });

  const executeWorkflowMutation = useMutation({
    mutationFn: async (workflow: any) => {
      // For test execution of generated workflow
      const response = await fetch('/api/workflows/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ prompt: `Test execution: ${workflow.description}` }),
      });
      if (!response.ok) throw new Error('Failed to execute workflow');
      return response.json();
    },
  });

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
      setLocation('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleWorkflowGenerated = (workflow: any) => {
    setGeneratedWorkflow(workflow);
    setIsGenerating(false);
  };

  const handleSaveWorkflow = (workflow: any) => {
    saveWorkflowMutation.mutate(workflow);
  };

  const handleExecuteWorkflow = (workflow: any) => {
    executeWorkflowMutation.mutate(workflow);
  };

  const handleEditWorkflow = () => {
    setGeneratedWorkflow(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!isLoading && !user) {
    setLocation('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-500" />
              AI Workflow Automation
            </h1>
            <p className="text-gray-300">Build powerful automations with natural language</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.picture} alt={user.firstName || user.email} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                  {user.firstName ? user.firstName[0] : user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{user.firstName || user.email}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md border-white/20">
            <TabsTrigger value="builder" className="text-white data-[state=active]:bg-white/20">
              <Zap className="w-4 h-4 mr-2" />
              AI Builder
            </TabsTrigger>
            <TabsTrigger value="workflows" className="text-white data-[state=active]:bg-white/20">
              <Workflow className="w-4 h-4 mr-2" />
              My Workflows
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20">
              <Clock className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <PromptInput 
                  onWorkflowGenerated={handleWorkflowGenerated}
                  isLoading={isGenerating}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {generatedWorkflow ? (
                  <WorkflowPreview
                    workflow={generatedWorkflow}
                    onSave={handleSaveWorkflow}
                    onExecute={handleExecuteWorkflow}
                    onEdit={handleEditWorkflow}
                    isLoading={saveWorkflowMutation.isPending || executeWorkflowMutation.isPending}
                  />
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        AI Workflow Preview
                      </h3>
                      <p className="text-sm text-gray-500">
                        Your generated workflow will appear here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Workflow className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">12</p>
                      <p className="text-xs text-gray-400">Active Workflows</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">847</p>
                      <p className="text-xs text-gray-400">Successful Runs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Play className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">24</p>
                      <p className="text-xs text-gray-400">Runs Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">2</p>
                      <p className="text-xs text-gray-400">Need Attention</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <WorkflowList onWorkflowSelect={setSelectedWorkflow} />
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {selectedWorkflowId ? (
                    <WorkflowAnalytics workflowId={selectedWorkflowId} />
                  ) : (
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white">Select a Workflow</CardTitle>
                        <CardDescription className="text-gray-300">
                          Choose a workflow from the list to view detailed analytics
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center py-12">
                        <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">
                          Analytics Dashboard
                        </h3>
                        <p className="text-sm text-gray-500">
                          Select a workflow to see performance insights and execution statistics
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div className="space-y-6">
                  <AIQueryInterface workflowId={selectedWorkflowId || undefined} />
                  
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Your Workflows</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {workflowsQuery?.data?.map((workflow: any) => (
                          <div
                            key={workflow.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedWorkflowId === workflow.id
                                ? 'bg-blue-600/30 border border-blue-500'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                            onClick={() => setSelectedWorkflowId(workflow.id)}
                          >
                            <h4 className="text-white font-medium">{workflow.name}</h4>
                            <p className="text-gray-400 text-sm">{workflow.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                                {workflow.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}