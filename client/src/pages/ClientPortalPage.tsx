"use client";
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  Eye, 
  Code, 
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

// Types for the workflow system
type WorkflowStatus = 'idle' | 'deploying' | 'live' | 'error';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  lastRunUrl?: string;
  createdAt: string;
  nodes: Array<{
    id: string;
    type: string;
    action: string;
    inputs: Record<string, any>;
    outputs: string[];
  }>;
}

interface WorkflowGenerationState {
  prompt: string;
  isGenerating: boolean;
  generatedWorkflow: any;
  workflowId: string | null;
  isDeploying: boolean;
}

export default function ClientPortalPage() {
  const [activeWorkflows, setActiveWorkflows] = useState<Workflow[]>([]);
  const [workflowState, setWorkflowState] = useState<WorkflowGenerationState>({
    prompt: '',
    isGenerating: false,
    generatedWorkflow: null,
    workflowId: null,
    isDeploying: false
  });

  // Fetch existing workflows on component mount
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await fetch('/api/workflows?userId=1'); // Mock user ID
        if (response.ok) {
          const workflows = await response.json();
          setActiveWorkflows(workflows);
        }
      } catch (error) {
        console.error('Error fetching workflows:', error);
        // Fallback to example workflows for demo
        setActiveWorkflows([
          {
            id: '1',
            name: 'Lead Scoring Automation',
            description: 'Automatically score leads from form submissions and route to sales team',
            status: 'live',
            lastRunUrl: '#',
            createdAt: '2025-01-15T10:00:00Z',
            nodes: [
              { id: 'trigger', type: 'webhook', action: 'receive', inputs: {}, outputs: ['data'] },
              { id: 'enrich', type: 'data', action: 'enrich', inputs: {}, outputs: ['enriched'] },
              { id: 'score', type: 'ai', action: 'score', inputs: {}, outputs: ['score'] },
              { id: 'route', type: 'condition', action: 'evaluate', inputs: {}, outputs: ['high', 'low'] }
            ]
          },
          {
            id: '2',
            name: 'Content Publishing Pipeline',
            description: 'Review, approve, and publish content across multiple channels',
            status: 'idle',
            createdAt: '2025-01-14T15:30:00Z',
            nodes: [
              { id: 'content', type: 'input', action: 'receive', inputs: {}, outputs: ['content'] },
              { id: 'review', type: 'ai', action: 'review', inputs: {}, outputs: ['approved'] },
              { id: 'publish', type: 'social', action: 'post', inputs: {}, outputs: ['posted'] }
            ]
          }
        ]);
      }
    };

    fetchWorkflows();
  }, []);

  const generateWorkflow = async () => {
    if (!workflowState.prompt.trim()) return;
    
    setWorkflowState(prev => ({ ...prev, isGenerating: true }));
    
    try {
      const response = await fetch('/api/workflows/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: workflowState.prompt,
          userId: 1 // Mock user ID - replace with actual user session
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate workflow');
      }

      const data = await response.json();
      
      setWorkflowState(prev => ({ 
        ...prev, 
        generatedWorkflow: data.workflow,
        workflowId: data.workflowId,
        isGenerating: false 
      }));
    } catch (error) {
      console.error('Error generating workflow:', error);
      setWorkflowState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const deployWorkflow = async () => {
    if (!workflowState.workflowId) return;
    
    setWorkflowState(prev => ({ ...prev, isDeploying: true }));
    
    try {
      const response = await fetch('/api/workflows/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId: workflowState.workflowId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to deploy workflow');
      }

      const data = await response.json();
      
      // Add to active workflows
      const newWorkflow: Workflow = {
        id: workflowState.workflowId,
        name: workflowState.generatedWorkflow.name,
        description: workflowState.generatedWorkflow.description,
        status: 'live',
        lastRunUrl: data.viewUrl,
        createdAt: new Date().toISOString(),
        nodes: workflowState.generatedWorkflow.nodes
      };
      
      setActiveWorkflows(prev => [newWorkflow, ...prev]);
      setWorkflowState({
        prompt: '',
        isGenerating: false,
        generatedWorkflow: null,
        workflowId: null,
        isDeploying: false
      });
    } catch (error) {
      console.error('Error deploying workflow:', error);
      setWorkflowState(prev => ({ ...prev, isDeploying: false }));
    }
  };

  const getStatusIcon = (status: WorkflowStatus) => {
    switch (status) {
      case 'live': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'deploying': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Pause className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: WorkflowStatus) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 border-green-200';
      case 'deploying': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Workflow Builder - Advanta AI</title>
        <meta name="description" content="Build, deploy, and manage AI-powered workflows with natural language." />
      </Helmet>
      
      <NewHeader />
      
      <main className="pt-20">
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI Workflow Builder
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Describe what you want in plain English. We'll generate, validate, and deploy your automation workflow in minutes.
              </p>
            </motion.div>

            {/* Workflow Generator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Card className="p-6 bg-background/70 backdrop-blur-sm border-primary/20">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  Create New Workflow
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Describe your automation workflow
                    </label>
                    <textarea
                      className="w-full p-4 border border-border rounded-lg bg-background resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={4}
                      value={workflowState.prompt}
                      onChange={(e) => setWorkflowState(prev => ({ ...prev, prompt: e.target.value }))}
                      placeholder="Example: When a form is submitted, enrich the lead data, score it using AI, and if the score is above 80, send a Slack notification to sales. Otherwise, add to CRM for nurturing."
                      disabled={workflowState.isGenerating || workflowState.isDeploying}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={generateWorkflow}
                      disabled={!workflowState.prompt.trim() || workflowState.isGenerating || workflowState.isDeploying}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {workflowState.isGenerating ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Code className="h-4 w-4 mr-2" />
                          Generate Workflow
                        </>
                      )}
                    </Button>
                    
                    {workflowState.generatedWorkflow && (
                      <Button 
                        onClick={deployWorkflow}
                        disabled={workflowState.isDeploying}
                        variant="outline"
                      >
                        {workflowState.isDeploying ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                            Deploying...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Deploy Workflow
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Generated Workflow Preview */}
                {workflowState.generatedWorkflow && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 p-4 bg-muted/50 rounded-lg border"
                  >
                    <h3 className="font-semibold mb-2">Generated Workflow</h3>
                    <div className="text-sm text-muted-foreground mb-3">
                      <strong>Name:</strong> {workflowState.generatedWorkflow.name}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      <strong>Steps:</strong> {workflowState.generatedWorkflow.nodes.length} nodes
                    </div>
                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium">View JSON Schema</summary>
                      <pre className="mt-2 p-3 bg-background rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(workflowState.generatedWorkflow, null, 2)}
                      </pre>
                    </details>
                  </motion.div>
                )}
              </Card>
            </motion.div>

            {/* Active Workflows */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-background/70 backdrop-blur-sm border-primary/20">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Activity className="h-6 w-6 text-primary" />
                  Active Workflows
                </h2>
                
                <div className="space-y-4">
                  {activeWorkflows.map((workflow) => (
                    <motion.div
                      key={workflow.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-border rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{workflow.name}</h3>
                            <Badge className={`${getStatusColor(workflow.status)} flex items-center gap-1`}>
                              {getStatusIcon(workflow.status)}
                              {workflow.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {workflow.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{workflow.nodes.length} steps</span>
                            <span>Created {new Date(workflow.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                          {workflow.lastRunUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={workflow.lastRunUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {activeWorkflows.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No workflows created yet. Generate your first automation above!</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 grid md:grid-cols-3 gap-6"
            >
              <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
                <div className="text-2xl mb-3">⚡️</div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  From natural language description to live workflow in under 2 minutes.
                </p>
              </Card>
              
              <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
                <div className="text-2xl mb-3">🧩</div>
                <h3 className="font-semibold mb-2">Infinitely Composable</h3>
                <p className="text-sm text-muted-foreground">
                  Generic building blocks combine into unlimited automation possibilities.
                </p>
              </Card>
              
              <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
                <div className="text-2xl mb-3">🔒</div>
                <h3 className="font-semibold mb-2">Enterprise Secure</h3>
                <p className="text-sm text-muted-foreground">
                  API keys and credentials never touch the browser. Zero-trust architecture.
                </p>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}