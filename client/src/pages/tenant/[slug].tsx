import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';

// Tenant-specific workflow builder landing page as per checklist requirements

interface TenantTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  gradients: {
    primary: string;
  };
  font: {
    family: string;
  };
  rounded: string;
}

interface TenantData {
  id: number;
  slug: string;
  name: string;
  logoUrl?: string;
  theme: TenantTheme;
  page: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
    };
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  workflows: Array<{
    id: number;
    name: string;
    description: string;
    status: 'idle' | 'deploying' | 'live' | 'error';
    lastRunUrl?: string;
    createdAt: string;
  }>;
}

export default function TenantLandingPage() {
  const { slug } = useParams();

  const { data: tenant, isLoading, error } = useQuery<TenantData>({
    queryKey: ['/api/tenants', slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return <TenantSkeleton />;
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Tenant Not Found</CardTitle>
            <CardDescription>
              The workflow automation site "{slug}" could not be found.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: tenant.theme.gradients.primary,
        fontFamily: tenant.theme.font.family,
      }}
    >
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {tenant.logoUrl && (
              <img 
                src={tenant.logoUrl} 
                alt={tenant.name}
                className="h-8 w-8 object-cover rounded"
              />
            )}
            <h1 className="text-xl font-bold" style={{ color: tenant.theme.colors.primary }}>
              {tenant.name}
            </h1>
          </div>
          <Badge variant="outline">AI Workflow Automation</Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            {tenant.page.hero.title}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {tenant.page.hero.subtitle}
          </p>
          <Button 
            size="lg"
            style={{ 
              backgroundColor: tenant.theme.colors.accent,
              borderRadius: tenant.theme.rounded 
            }}
            className="text-white hover:opacity-90"
          >
            {tenant.page.hero.cta}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/5">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Automated Workflows
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {tenant.page.features.map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/80">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Workflow Status
          </h2>
          
          {tenant.workflows.length > 0 ? (
            <div className="grid gap-6 max-w-3xl mx-auto">
              {tenant.workflows.map((workflow) => (
                <WorkflowStatusCard key={workflow.id} workflow={workflow} theme={tenant.theme} />
              ))}
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto bg-white/10 border-white/20">
              <CardContent className="py-16 text-center">
                <h3 className="text-xl font-semibold text-white mb-4">
                  No Workflows Yet
                </h3>
                <p className="text-white/80 mb-6">
                  Your AI automation workflows will appear here once created.
                </p>
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Create Your First Workflow
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/20">
        <div className="container mx-auto text-center text-white/60">
          <p>Powered by AI Workflow Automation • {tenant.name}</p>
        </div>
      </footer>
    </div>
  );
}

function WorkflowStatusCard({ workflow, theme }: { workflow: any; theme: TenantTheme }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'deploying':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-500';
      case 'deploying':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-white/10 border-white/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(workflow.status)}
            <div>
              <h3 className="font-semibold text-white">{workflow.name}</h3>
              <p className="text-sm text-white/70">{workflow.description}</p>
            </div>
          </div>
          <Badge 
            className={`${getStatusColor(workflow.status)} text-white`}
            variant="secondary"
          >
            {workflow.status}
          </Badge>
        </div>
        
        {workflow.status === 'live' && workflow.lastRunUrl && (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <a href={workflow.lastRunUrl} target="_blank" rel="noopener noreferrer">
                View Runs <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TenantSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <header className="bg-white/90 backdrop-blur-sm border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
      </header>
      
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-128 mx-auto mb-8" />
          <Skeleton className="h-12 w-48 mx-auto" />
        </div>
      </section>
    </div>
  );
}