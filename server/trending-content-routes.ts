import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface TrendComponents {
  velZ: number;
  accZ: number;
  consensus: number;
  audienceFit: number;
  freshness: number;
  saturation: number;
  risk: number;
}

interface TrendData {
  id: string;
  title: string;
  score: number;
  rank: number;
  window: '15m' | '60m' | '24h';
  components: TrendComponents;
  sparkline: { ts: string; value: number }[];
  category: string;
  entities: string[];
  sources: string[];
  estimatedReach: number;
  riskLevel: 'low' | 'medium' | 'high';
  updatedAt: string;
}

interface GeneratedAsset {
  id: string;
  kind: 'x_post' | 'instagram_caption' | 'tiktok_script' | 'youtube_short_outline' | 'linkedin_post' | 'facebook_post' | 'blog_outline';
  content: {
    title: string;
    body: string;
    hashtags: string[];
    cta: string;
    hooks?: string[];
    structure?: string[];
  };
  citations: {
    source: string;
    url: string;
    excerpt: string;
  }[];
  estimatedPerformance: {
    engagement: number;
    reach: number;
    viralPotential: number;
  };
  createdAt: string;
}

interface BrandVoice {
  tone: string;
  readingLevel: string;
  emoji: boolean;
  taboo: string[];
}

// Enhanced trending topics data with multi-component scoring
const generateMockTrends = (timeWindow: string = '24h'): TrendData[] => {
  const trendTopics = [
    {
      title: 'AI-Powered Workflow Automation Revolution',
      category: 'Technology',
      entities: ['AI', 'automation', 'workflow', 'productivity', 'business', 'machine learning'],
      sources: ['TechCrunch', 'Wired', 'Reddit r/artificial', 'Hacker News'],
      estimatedReach: 2500000,
      riskLevel: 'low' as const,
      components: { velZ: 2.4, accZ: 1.8, consensus: 2.1, audienceFit: 2.7, freshness: 1.9, saturation: -0.3, risk: -0.1 }
    },
    {
      title: 'Remote Work Mental Health Crisis',
      category: 'Business',
      entities: ['remote work', 'mental health', 'burnout', 'wellness', 'productivity', 'work-life balance'],
      sources: ['Harvard Business Review', 'LinkedIn', 'Twitter', 'Psychology Today'],
      estimatedReach: 1800000,
      riskLevel: 'medium' as const,
      components: { velZ: 3.1, accZ: 0.8, consensus: 1.9, audienceFit: 2.3, freshness: 1.4, saturation: -0.7, risk: -0.5 }
    },
    {
      title: 'Sustainable Energy Storage Breakthrough',
      category: 'Science',
      entities: ['battery', 'renewable energy', 'storage', 'sustainability', 'innovation', 'clean tech'],
      sources: ['Nature', 'MIT Technology Review', 'CleanTechnica', 'Scientific American'],
      estimatedReach: 950000,
      riskLevel: 'low' as const,
      components: { velZ: 1.6, accZ: 2.3, consensus: 1.7, audienceFit: 2.0, freshness: 2.1, saturation: -0.4, risk: -0.2 }
    },
    {
      title: 'Small Business Digital Transformation Surge',
      category: 'Business',
      entities: ['digital transformation', 'small business', 'technology adoption', 'e-commerce', 'SMB'],
      sources: ['Forbes', 'Inc.com', 'Business Insider', 'Small Business Trends'],
      estimatedReach: 1200000,
      riskLevel: 'low' as const,
      components: { velZ: 2.0, accZ: 1.5, consensus: 2.2, audienceFit: 2.4, freshness: 1.7, saturation: -0.5, risk: -0.3 }
    },
    {
      title: 'Quantum Computing Commercialization Timeline',
      category: 'Technology',
      entities: ['quantum computing', 'IBM', 'Google', 'commercial applications', 'quantum supremacy'],
      sources: ['MIT Technology Review', 'Ars Technica', 'Quantum Computing Report', 'IEEE Spectrum'],
      estimatedReach: 750000,
      riskLevel: 'medium' as const,
      components: { velZ: 1.2, accZ: 1.9, consensus: 1.6, audienceFit: 1.8, freshness: 2.0, saturation: -0.6, risk: -0.4 }
    },
    {
      title: 'Creator Economy Platform Consolidation',
      category: 'Entertainment',
      entities: ['creator economy', 'social media', 'monetization', 'platforms', 'influencers'],
      sources: ['TikTok', 'YouTube', 'Creator Economy Report', 'Social Media Today'],
      estimatedReach: 3200000,
      riskLevel: 'high' as const,
      components: { velZ: 2.8, accZ: 1.1, consensus: 1.8, audienceFit: 2.6, freshness: 1.3, saturation: -0.8, risk: -0.6 }
    }
  ];

  // Calculate composite score using weighted components
  const calculateScore = (components: TrendComponents) => {
    const weights = { w1: 1.2, w2: 1.0, w3: 1.0, w4: 1.1, w5: 0.6, w6: 0.8, w7: 0.7 };
    return (
      weights.w1 * components.velZ +
      weights.w2 * components.accZ +
      weights.w3 * components.consensus +
      weights.w4 * components.audienceFit +
      weights.w5 * components.freshness -
      weights.w6 * Math.abs(components.saturation) -
      weights.w7 * Math.abs(components.risk)
    );
  };

  return trendTopics.map((topic, index) => {
    const score = calculateScore(topic.components);
    const dataPoints = timeWindow === '15m' ? 15 : timeWindow === '60m' ? 60 : 48;
    
    return {
      id: (index + 1).toString(),
      ...topic,
      score,
      rank: index + 1,
      window: timeWindow as any,
      sparkline: Array.from({ length: dataPoints }, (_, i) => ({
        ts: new Date(Date.now() - (dataPoints - 1 - i) * (timeWindow === '15m' ? 60000 : timeWindow === '60m' ? 60000 : 1800000)).toISOString(),
        value: Math.random() * 30 + Math.sin(i / 8) * 15 + 60
      })),
      updatedAt: new Date().toISOString()
    };
  }).sort((a, b) => b.score - a.score);
};

// Get trending topics with enhanced filtering
router.get('/trends', async (req, res) => {
  try {
    const timeWindow = (req.query.timeWindow as string) || '24h';
    const category = req.query.category as string;
    
    let trends = generateMockTrends(timeWindow);
    
    // Filter by category if specified
    if (category && category !== 'all') {
      trends = trends.filter(trend => 
        trend.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Re-rank after filtering
    trends.forEach((trend, index) => {
      trend.rank = index + 1;
    });
    
    res.json(trends);
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Get generated assets
router.get('/assets', async (req, res) => {
  try {
    // In production, this would fetch from database
    // For now, return empty array - assets are managed client-side
    res.json([]);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// Generate asset based on trending topic
router.post('/generate-asset', async (req, res) => {
  try {
    const { trendId, kind, brandVoice, targetAudience, customPrompt, includeAnalytics } = req.body;

    if (!trendId || !kind) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Get trend data
    const trends = generateMockTrends();
    const trend = trends.find(t => t.id === trendId);
    
    if (!trend) {
      return res.status(404).json({ error: 'Trend not found' });
    }

    // Enhanced content generation prompts
    const assetPrompts = {
      x_post: `Create an engaging Twitter/X post about "${trend.title}". Include hooks, key insights, and strategic hashtags for maximum engagement.`,
      linkedin_post: `Write a professional LinkedIn post about "${trend.title}". Include industry insights, thought leadership perspective, and professional call-to-action.`,
      instagram_caption: `Create an Instagram caption about "${trend.title}". Include visual storytelling elements, engaging hooks, and trending hashtags.`,
      youtube_short_outline: `Create a YouTube Short script outline about "${trend.title}". Include hook, key points, visual cues, and retention tactics.`,
      tiktok_script: `Create a TikTok script about "${trend.title}". Include trending hooks, visual transitions, and viral potential elements.`,
      facebook_post: `Write a Facebook post about "${trend.title}". Include community engagement elements, discussion starters, and shareability.`,
      blog_outline: `Generate a comprehensive blog post outline about "${trend.title}". Include SEO-optimized headings, key sections, and content flow.`
    };

    const voiceInstructions = {
      professional: 'Authoritative, industry-expert tone with data-driven insights.',
      casual: 'Conversational, friendly tone that feels like talking to a peer.',
      humorous: 'Witty and entertaining while maintaining credibility.',
      authoritative: 'Confident expert voice with strong, definitive statements.',
      inspirational: 'Motivating and uplifting language that drives action.',
      conversational: 'Natural, dialogue-style writing that encourages engagement.'
    };

    const audienceInstructions = {
      business: 'Business executives, decision-makers, and industry professionals.',
      tech: 'Developers, engineers, and technology early adopters.',
      general: 'Broad consumer audience with varied interests and backgrounds.',
      students: 'University students and early-career professionals.',
      entrepreneurs: 'Startup founders, business owners, and innovation-focused individuals.',
      creators: 'Content creators, influencers, and creative professionals.'
    };

    const prompt = `
    ${assetPrompts[kind as keyof typeof assetPrompts]}
    
    Trend Analysis:
    - Title: ${trend.title}
    - Category: ${trend.category}
    - Entities: ${trend.entities.join(', ')}
    - Trend Score: ${trend.score.toFixed(2)} (Velocity: ${trend.components.velZ.toFixed(1)}, Consensus: ${trend.components.consensus.toFixed(1)})
    - Estimated Reach: ${trend.estimatedReach.toLocaleString()}
    - Risk Level: ${trend.riskLevel}
    - Sources: ${trend.sources.join(', ')}
    
    Brand Voice: ${brandVoice.tone ? voiceInstructions[brandVoice.tone as keyof typeof voiceInstructions] : 'Professional tone'}
    Target Audience: ${audienceInstructions[targetAudience as keyof typeof audienceInstructions]}
    ${customPrompt ? `Additional Requirements: ${customPrompt}` : ''}
    
    Please create content with citations and performance predictions. Respond with JSON:
    {
      "id": "unique_asset_id",
      "kind": "${kind}",
      "content": {
        "title": "Compelling title",
        "body": "Main content with hooks and structure",
        "hashtags": ["relevant", "hashtags"],
        "cta": "Strong call to action",
        "hooks": ["opening hooks"],
        "structure": ["content sections"]
      },
      "citations": [
        {
          "source": "Source name",
          "url": "https://example.com",
          "excerpt": "Key quote or data point"
        }
      ],
      "estimatedPerformance": {
        "engagement": estimated_likes_comments,
        "reach": estimated_views,
        "viralPotential": percentage_0_to_100
      },
      "createdAt": "${new Date().toISOString()}"
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert content strategist who creates viral, platform-optimized content with source citations and performance predictions. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 3000,
      temperature: 0.7
    });

    const generatedAsset = JSON.parse(response.choices[0].message.content || '{}');

    // Enhance with trend-based performance estimates if includeAnalytics is true
    if (includeAnalytics) {
      const baseEngagement = Math.floor(trend.estimatedReach * 0.03 * (trend.score / 4));
      const baseReach = Math.floor(trend.estimatedReach * 0.15 * (trend.components.velZ / 3));
      const viralPotential = Math.min(95, Math.floor(trend.score * 20 + trend.components.freshness * 10));

      generatedAsset.estimatedPerformance = {
        engagement: baseEngagement + Math.floor(Math.random() * baseEngagement * 0.5),
        reach: baseReach + Math.floor(Math.random() * baseReach * 0.3),
        viralPotential
      };
    }

    res.json(generatedAsset);
  } catch (error) {
    console.error('Error generating asset:', error);
    res.status(500).json({ error: 'Failed to generate asset' });
  }
});

// Get trend sparkline data
router.get('/sparkline/:trendId', async (req, res) => {
  try {
    const { trendId } = req.params;
    const trends = generateMockTrends();
    const trend = trends.find(t => t.id === trendId);
    
    if (!trend) {
      return res.status(404).json({ error: 'Trend not found' });
    }

    res.json({ sparkline: trend.sparkline });
  } catch (error) {
    console.error('Error fetching sparkline:', error);
    res.status(500).json({ error: 'Failed to fetch sparkline data' });
  }
});

// Analyze custom topic for trending potential
router.post('/analyze-topic', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const analysisPrompt = `
    Analyze the trending potential of this topic: "${topic}"
    
    Provide analysis on:
    1. Current trend score (0-100)
    2. Velocity (how fast it's growing)
    3. Estimated reach potential
    4. Risk level (low/medium/high)
    5. Key keywords and hashtags
    6. Recommended content types
    7. Target audience suggestions
    
    Respond with JSON format:
    {
      "score": number,
      "velocity": number,
      "estimatedReach": number,
      "riskLevel": "low|medium|high",
      "keywords": ["keyword1", "keyword2"],
      "recommendedTypes": ["twitter_thread", "linkedin_post"],
      "targetAudiences": ["business", "tech"],
      "insights": "Analysis summary"
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a trend analysis expert who evaluates topics for viral potential and content creation opportunities."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing topic:', error);
    res.status(500).json({ error: 'Failed to analyze topic' });
  }
});

export default router;