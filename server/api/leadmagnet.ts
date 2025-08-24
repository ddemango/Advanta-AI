import { Request, Response } from 'express';

// Lead Magnet API endpoints for the frontend
// This provides basic CRUD operations and publishing for lead magnets

interface LeadMagnetConfig {
  name: string;
  type: string;
  theme: {
    accent: string;
    bg: string;
    fg: string;
    font: string;
    logoText: string;
  };
  content: {
    headline: string;
    subheadline: string;
    bullets: string[];
    cta: string;
  };
  form: {
    fields: Array<{
      id: string;
      label: string;
      type: string;
      required: boolean;
    }>;
    consent: {
      enabled: boolean;
      text: string;
      required: boolean;
    };
    hidden: Record<string, boolean>;
    scoring: Array<{
      fieldId: string;
      points: number;
    }>;
  };
  delivery: {
    method: string;
    emailSubject: string;
    emailBody: string;
    assetUrl: string;
    redirectUrl: string;
    bookingUrl: string;
  };
  integrations: Record<string, any>;
  abtest: {
    enabled: boolean;
    variants: Array<{
      key: string;
      weight: number;
      changes: any;
    }>;
  };
  launch: {
    slug: string;
    publishedUrl: string;
  };
  analytics: {
    views: number;
    conversions: number;
    rate: number;
    last24h: Array<{
      ts: number;
      views: number;
      conv: number;
    }>;
  };
}

// In-memory storage for demo purposes
// In production, this would be replaced with database operations
const leadMagnets = new Map<string, LeadMagnetConfig & { id: string; status: string; createdAt: Date; updatedAt: Date }>();

export async function createLeadMagnet(req: Request, res: Response) {
  try {
    const config = req.body as LeadMagnetConfig;
    
    // Generate unique ID and slug
    const id = `lm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const slug = config.launch.slug || config.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const leadMagnet = {
      id,
      ...config,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      launch: {
        ...config.launch,
        slug,
        publishedUrl: `${process.env.APP_URL || 'https://advantaai.com'}/lead/${slug}`
      }
    };

    leadMagnets.set(id, leadMagnet);

    return res.json({
      id,
      slug,
      publishedUrl: leadMagnet.launch.publishedUrl,
      message: 'Lead magnet created successfully'
    });
  } catch (error: any) {
    console.error('Create lead magnet error:', error);
    return res.status(500).json({ 
      error: 'Failed to create lead magnet', 
      details: error.message 
    });
  }
}

export async function updateLeadMagnet(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const config = req.body as Partial<LeadMagnetConfig>;
    
    const existing = leadMagnets.get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Lead magnet not found' });
    }

    const updated = {
      ...existing,
      ...config,
      updatedAt: new Date()
    };

    leadMagnets.set(id, updated);

    return res.json({
      id,
      slug: updated.launch.slug,
      publishedUrl: updated.launch.publishedUrl,
      message: 'Lead magnet updated successfully'
    });
  } catch (error: any) {
    console.error('Update lead magnet error:', error);
    return res.status(500).json({ 
      error: 'Failed to update lead magnet', 
      details: error.message 
    });
  }
}

export async function publishLeadMagnet(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const existing = leadMagnets.get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Lead magnet not found' });
    }

    const published = {
      ...existing,
      status: 'published',
      updatedAt: new Date()
    };

    leadMagnets.set(id, published);

    return res.json({
      id,
      slug: published.launch.slug,
      publishedUrl: published.launch.publishedUrl,
      status: 'published',
      message: 'Lead magnet published successfully'
    });
  } catch (error: any) {
    console.error('Publish lead magnet error:', error);
    return res.status(500).json({ 
      error: 'Failed to publish lead magnet', 
      details: error.message 
    });
  }
}

export async function getLeadMagnet(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    
    // Find lead magnet by slug
    const leadMagnet = Array.from(leadMagnets.values()).find(lm => lm.launch.slug === slug);
    
    if (!leadMagnet) {
      return res.status(404).json({ error: 'Lead magnet not found' });
    }

    if (leadMagnet.status !== 'published') {
      return res.status(404).json({ error: 'Lead magnet not published' });
    }

    // Simple A/B variant selection (in production, use deterministic bucketing)
    let variantKey = 'A';
    if (leadMagnet.abtest.enabled && leadMagnet.abtest.variants.length > 0) {
      const random = Math.random() * 100;
      let cumulative = 0;
      
      for (const variant of leadMagnet.abtest.variants) {
        cumulative += variant.weight;
        if (random <= cumulative) {
          variantKey = variant.key;
          break;
        }
      }
    }

    // Apply variant changes
    let config = { ...leadMagnet };
    if (leadMagnet.abtest.enabled) {
      const variant = leadMagnet.abtest.variants.find(v => v.key === variantKey);
      if (variant && variant.changes) {
        config = {
          ...config,
          ...variant.changes
        };
      }
    }

    return res.json({
      config,
      variantKey,
      id: leadMagnet.id,
      slug: leadMagnet.launch.slug
    });
  } catch (error: any) {
    console.error('Get lead magnet error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch lead magnet', 
      details: error.message 
    });
  }
}

export async function submitLead(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const { data, captchaToken } = req.body;
    
    // Find lead magnet
    const leadMagnet = Array.from(leadMagnets.values()).find(lm => lm.launch.slug === slug);
    
    if (!leadMagnet) {
      return res.status(404).json({ error: 'Lead magnet not found' });
    }

    // Simple lead scoring
    let score = 0;
    leadMagnet.form.scoring.forEach(rule => {
      if (data[rule.fieldId]) {
        score += rule.points;
      }
    });

    // Simulate analytics update
    leadMagnet.analytics.conversions += 1;
    leadMagnet.analytics.rate = (leadMagnet.analytics.conversions / leadMagnet.analytics.views * 100);
    
    leadMagnets.set(leadMagnet.id, leadMagnet);

    // In production, this would:
    // 1. Save lead to database
    // 2. Send delivery email
    // 3. Trigger integrations
    // 4. Update analytics

    return res.json({
      success: true,
      score,
      message: 'Lead submitted successfully',
      deliveryMethod: leadMagnet.delivery.method
    });
  } catch (error: any) {
    console.error('Submit lead error:', error);
    return res.status(500).json({ 
      error: 'Failed to submit lead', 
      details: error.message 
    });
  }
}

export async function trackView(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    
    // Find lead magnet
    const leadMagnet = Array.from(leadMagnets.values()).find(lm => lm.launch.slug === slug);
    
    if (!leadMagnet) {
      return res.status(404).json({ error: 'Lead magnet not found' });
    }

    // Update analytics
    leadMagnet.analytics.views += 1;
    leadMagnet.analytics.rate = leadMagnet.analytics.conversions > 0 
      ? (leadMagnet.analytics.conversions / leadMagnet.analytics.views * 100) 
      : 0;
    
    leadMagnets.set(leadMagnet.id, leadMagnet);

    return res.json({
      success: true,
      views: leadMagnet.analytics.views
    });
  } catch (error: any) {
    console.error('Track view error:', error);
    return res.status(500).json({ 
      error: 'Failed to track view', 
      details: error.message 
    });
  }
}

export async function getAnalytics(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    
    // Find lead magnet
    const leadMagnet = Array.from(leadMagnets.values()).find(lm => lm.launch.slug === slug);
    
    if (!leadMagnet) {
      return res.status(404).json({ error: 'Lead magnet not found' });
    }

    return res.json({
      views: leadMagnet.analytics.views,
      conversions: leadMagnet.analytics.conversions,
      rate: Math.round(leadMagnet.analytics.rate * 10) / 10,
      last24h: leadMagnet.analytics.last24h
    });
  } catch (error: any) {
    console.error('Get analytics error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch analytics', 
      details: error.message 
    });
  }
}