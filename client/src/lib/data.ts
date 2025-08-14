// Data fetching utilities for tenant/workflow data

export interface TenantData {
  id: number;
  slug: string;
  name: string;
  logoUrl?: string;
  theme: any;
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

export interface WorkflowStatus {
  id: number;
  status: 'idle' | 'deploying' | 'live' | 'error';
  lastRunUrl?: string;
  updatedAt: string;
}

// Fetch tenant data by slug
export async function fetchTenantData(slug: string): Promise<TenantData> {
  const response = await fetch(`/api/tenants/${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tenant data: ${response.statusText}`);
  }
  return response.json();
}

// Fetch workflow status updates via Server-Sent Events
export function subscribeToWorkflowStatus(
  tenantId: string | number, 
  onUpdate: (status: WorkflowStatus) => void,
  onError?: (error: Error) => void
): () => void {
  const eventSource = new EventSource(`/api/workflows/status?tenantId=${tenantId}`);
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onUpdate(data);
    } catch (error) {
      console.error('Error parsing workflow status:', error);
      onError?.(error as Error);
    }
  };
  
  eventSource.onerror = (error) => {
    console.error('EventSource error:', error);
    onError?.(new Error('Connection to status updates lost'));
  };
  
  // Return cleanup function
  return () => {
    eventSource.close();
  };
}

// Trigger workflow generation
export async function generateWorkflow(prompt: string, tenantId?: number): Promise<any> {
  const response = await fetch('/api/workflows/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      tenantId,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to generate workflow: ${response.statusText}`);
  }
  
  return response.json();
}

// Deploy workflow
export async function deployWorkflow(workflowId: number): Promise<any> {
  const response = await fetch('/api/workflows/deploy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workflowId,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to deploy workflow: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch workflow list for tenant
export async function fetchWorkflows(tenantId?: number): Promise<any[]> {
  const params = new URLSearchParams();
  if (tenantId) {
    params.append('tenantId', tenantId.toString());
  }
  
  const response = await fetch(`/api/workflows?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch workflows: ${response.statusText}`);
  }
  
  return response.json();
}

// Analytics tracking
export function trackEvent(event: string, properties?: Record<string, any>) {
  // First-party analytics tracking
  if (typeof window !== 'undefined') {
    try {
      // Send to analytics endpoint
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          properties: {
            ...properties,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          },
        }),
      }).catch(console.error);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }
}

// Page view tracking
export function trackPageView(path: string, tenantSlug?: string) {
  trackEvent('page_view', {
    path,
    tenantSlug,
  });
}

// CTA click tracking
export function trackCTAClick(ctaType: string, tenantSlug?: string) {
  trackEvent('cta_click', {
    ctaType,
    tenantSlug,
  });
}

// Deploy click tracking
export function trackDeployClick(workflowId: number, tenantSlug?: string) {
  trackEvent('deploy_click', {
    workflowId,
    tenantSlug,
  });
}