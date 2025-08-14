import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Loader2, Play, Eye, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { applyTheme, defaultThemes } from '@/lib/themes';
import { generateWorkflow, deployWorkflow, trackPageView, trackCTAClick, trackDeployClick } from '@/lib/data';

// Badge component inline since it's not available
const Badge = ({ children, variant = 'default', className = '' }: { children: React.ReactNode; variant?: 'default' | 'outline'; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    variant === 'outline' 
      ? 'bg-transparent border border-gray-300 text-gray-700' 
      : 'bg-blue-100 text-blue-800'
  } ${className}`}>
    {children}
  </span>
);

// Type definitions
interface TenantData {
  id: number;
  slug: string;
  name: string;
  logoUrl?: string;
  theme?: any;
  page?: {
    hero?: {
      title?: string;
      subtitle?: string;
      cta?: string;
    };
    features?: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  workflows?: Array<{
    id: number;
    name: string;
    description: string;
    status: 'idle' | 'deploying' | 'live' | 'error';
    lastRunUrl?: string;
    createdAt: string;
  }>;
}

// Tenant-specific branded landing page with workflow builder

export default function TenantLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<any>(null);
  const [workflowStatuses, setWorkflowStatuses] = useState<Record<number, any>>({});
  const { toast } = useToast();

  // Fetch tenant data
  const { data: tenantData, isLoading } = useQuery<TenantData>({
    queryKey: ['/api/tenants', slug],
    enabled: !!slug,
  });

  // Apply theme when tenant data loads
  useEffect(() => {
    if (tenantData?.theme) {
      applyTheme(tenantData.theme);
    } else {
      // Apply default theme
      applyTheme(defaultThemes['modern-blue']);
    }
  }, [tenantData]);

  // Track page view
  useEffect(() => {
    if (slug) {
      trackPageView(`/tenant/${slug}`, slug);
    }
  }, [slug]);

  // Subscribe to workflow status updates (placeholder)
  useEffect(() => {
    if (tenantData?.id) {
      // In a real implementation, this would connect to SSE
      // For now, we'll just log that the subscription would start
      console.log('Would subscribe to workflow status updates for tenant:', tenantData.id);
    }
  }, [tenantData?.id]);

  const handleGenerateWorkflow = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt Required',
        description: 'Please describe the workflow you want to create.',
        variant: 'destructive'
      });
      return;
    }

    trackCTAClick('generate_workflow', slug);
    setIsGenerating(true);

    try {
      const result = await generateWorkflow(prompt, tenantData?.id);
      setGeneratedWorkflow(result);
      toast({
        title: 'Workflow Generated',
        description: 'Your workflow has been created successfully.'
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate workflow',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeployWorkflow = async (workflowId: number) => {
    trackDeployClick(workflowId, slug);
    setIsDeploying(true);

    try {
      const result = await deployWorkflow(workflowId);
      toast({
        title: 'Deployment Started',
        description: 'Your workflow is being deployed to production.'
      });
    } catch (error) {
      toast({
        title: 'Deployment Failed',
        description: error instanceof Error ? error.message : 'Failed to deploy workflow',
        variant: 'destructive'
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'deploying': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 border-green-200';
      case 'deploying': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your automation platform...</p>
        </div>
      </div>
    );
  }

  if (!tenantData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Tenant Not Found</h1>
          <p className="text-gray-600">The requested automation platform could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {tenantData.logoUrl && (
              <img 
                src={tenantData.logoUrl} 
                alt={tenantData.name}
                className="h-8 w-8 object-cover rounded"
              />
            )}
            <h1 className="text-xl font-bold" style={{ color: 'var(--color-foreground)' }}>
              {tenantData.name}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              AI Powered
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 
              className="text-4xl lg:text-6xl font-bold mb-6"
              style={{ 
                background: 'var(--gradient-hero)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {tenantData.page?.hero?.title || 'AI Workflow Automation'}
            </h1>
            <p 
              className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto"
              style={{ color: 'var(--color-foreground)' }}
            >
              {tenantData.page?.hero?.subtitle || 'Transform your business with intelligent automation workflows.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Workflow Builder Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Build Your Workflow
                </CardTitle>
                <p className="text-center text-gray-600">
                  Describe your workflow in natural language and watch AI build it for you
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your workflow... (e.g., 'When I receive an email with 'urgent' in the subject, send a Slack notification to #alerts channel and create a task in Asana')"
                  className="min-h-[120px]"
                />
                <div className="flex justify-center">
                  <Button 
                    onClick={handleGenerateWorkflow}
                    disabled={isGenerating || !prompt.trim()}
                    size="lg"
                    style={{ 
                      background: 'var(--gradient-primary)',
                      border: 'none'
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        {tenantData.page?.hero?.cta || 'Generate Workflow'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generated Workflow Preview */}
            {generatedWorkflow && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Generated Workflow: {generatedWorkflow.name}
                      <Button 
                        onClick={() => handleDeployWorkflow(generatedWorkflow.id)}
                        disabled={isDeploying}
                      >
                        {isDeploying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Deploying...
                          </>
                        ) : (
                          'Deploy'
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{generatedWorkflow.description}</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Workflow Steps:</h4>
                      <ul className="space-y-1 text-sm">
                        {generatedWorkflow.workflowJson?.nodes?.map((node: any, index: number) => (
                          <li key={node.id} className="flex items-center space-x-2">
                            <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            <span>{node.action || node.type}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tenantData.page?.features?.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Existing Workflows */}
      {tenantData.workflows && tenantData.workflows.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Your Workflows
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {tenantData.workflows.map((workflow) => {
                const currentStatus = workflowStatuses[workflow.id]?.status || workflow.status;
                return (
                  <Card key={workflow.id} className="h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(currentStatus)}
                          <Badge className={getStatusColor(currentStatus)}>
                            {currentStatus}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{workflow.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Created {new Date(workflow.createdAt).toLocaleDateString()}</span>
                        {workflow.lastRunUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(workflow.lastRunUrl, '_blank')}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            Powered by AI Workflow Automation Platform
          </p>
        </div>
      </footer>
    </div>
  );
}