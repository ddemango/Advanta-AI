import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface TrendData {
  id: string;
  title: string;
  score: number;
  velocity: number;
  acceleration: number;
  consensus: number;
  freshness: number;
  saturation: number;
  sources: string[];
  keywords: string[];
  sparkline: { timestamp: string; value: number }[];
  category: string;
  estimatedReach: number;
  riskLevel: 'low' | 'medium' | 'high';
}

// Mock trending topics data - in production this would come from real trend analysis
const generateMockTrends = (): TrendData[] => {
  const trendTopics = [
    {
      title: 'AI-Powered Workflow Automation Revolution',
      category: 'Technology',
      keywords: ['AI', 'automation', 'workflow', 'productivity', 'business'],
      sources: ['TechCrunch', 'Wired', 'Reddit r/artificial'],
      estimatedReach: 2500000,
      riskLevel: 'low' as const
    },
    {
      title: 'Remote Work Mental Health Crisis',
      category: 'Business',
      keywords: ['remote work', 'mental health', 'burnout', 'wellness', 'productivity'],
      sources: ['Harvard Business Review', 'LinkedIn', 'Twitter'],
      estimatedReach: 1800000,
      riskLevel: 'medium' as const
    },
    {
      title: 'Sustainable Energy Storage Breakthrough',
      category: 'Science',
      keywords: ['battery', 'renewable energy', 'storage', 'sustainability', 'innovation'],
      sources: ['Nature', 'MIT Technology Review', 'CleanTechnica'],
      estimatedReach: 950000,
      riskLevel: 'low' as const
    },
    {
      title: 'Small Business Digital Transformation Surge',
      category: 'Business',
      keywords: ['digital transformation', 'small business', 'technology adoption', 'e-commerce'],
      sources: ['Forbes', 'Inc.com', 'Business Insider'],
      estimatedReach: 1200000,
      riskLevel: 'low' as const
    },
    {
      title: 'Quantum Computing Commercialization Timeline',
      category: 'Technology',
      keywords: ['quantum computing', 'IBM', 'Google', 'commercial applications'],
      sources: ['MIT Technology Review', 'Ars Technica', 'Quantum Computing Report'],
      estimatedReach: 750000,
      riskLevel: 'medium' as const
    },
    {
      title: 'Creator Economy Platform Consolidation',
      category: 'Social Media',
      keywords: ['creator economy', 'social media', 'monetization', 'platforms'],
      sources: ['TikTok', 'YouTube', 'Creator Economy Report'],
      estimatedReach: 3200000,
      riskLevel: 'high' as const
    }
  ];

  return trendTopics.map((topic, index) => {
    const baseScore = 70 + Math.random() * 25;
    const velocity = 60 + Math.random() * 40;
    const acceleration = 50 + Math.random() * 50;
    const consensus = 70 + Math.random() * 30;
    const freshness = 80 + Math.random() * 20;
    const saturation = Math.random() * 50;

    return {
      id: (index + 1).toString(),
      ...topic,
      score: baseScore,
      velocity,
      acceleration,
      consensus,
      freshness,
      saturation,
      sparkline: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
        value: Math.random() * 100 + Math.sin(i / 4) * 20 + 50
      }))
    };
  });
};

// Get trending topics
router.get('/trends', async (req, res) => {
  try {
    const timeWindow = req.query.timeWindow || '24h';
    const trends = generateMockTrends();
    
    // Sort by score descending
    trends.sort((a, b) => b.score - a.score);
    
    res.json(trends);
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Generate content based on trending topic
router.post('/generate-trending-content', async (req, res) => {
  try {
    const { trendId, contentType, brandVoice, targetAudience, customPrompt } = req.body;

    if (!trendId || !contentType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Get trend data
    const trends = generateMockTrends();
    const trend = trends.find(t => t.id === trendId);
    
    if (!trend) {
      return res.status(404).json({ error: 'Trend not found' });
    }

    // Create content generation prompt
    const contentPrompts = {
      twitter_thread: `Create a compelling Twitter thread about "${trend.title}". Include 5-7 tweets with engaging hooks, data points, and actionable insights.`,
      linkedin_post: `Write a professional LinkedIn post about "${trend.title}". Include industry insights, personal perspective, and a call-to-action.`,
      youtube_script: `Create a YouTube video script outline about "${trend.title}". Include intro hook, key points, transitions, and strong conclusion.`,
      blog_outline: `Generate a comprehensive blog post outline about "${trend.title}". Include headlines, subheadings, and key points for each section.`,
      instagram_reel: `Create an Instagram Reel script about "${trend.title}". Include visual cues, text overlays, and trending audio suggestions.`
    };

    const voiceInstructions = {
      professional: 'Use a professional, authoritative tone with industry expertise.',
      casual: 'Use a conversational, approachable tone like talking to a friend.',
      humorous: 'Incorporate humor and wit while staying informative.',
      authoritative: 'Use an expert, confident tone with strong assertions.',
      inspirational: 'Use motivating, uplifting language that inspires action.'
    };

    const audienceInstructions = {
      business: 'Target business professionals and entrepreneurs.',
      tech: 'Target technology enthusiasts and developers.',
      general: 'Target general audience with varied backgrounds.',
      students: 'Target students and early-career professionals.',
      entrepreneurs: 'Target startup founders and business owners.'
    };

    const prompt = `
    ${contentPrompts[contentType as keyof typeof contentPrompts]}
    
    Trend Details:
    - Title: ${trend.title}
    - Category: ${trend.category}
    - Keywords: ${trend.keywords.join(', ')}
    - Estimated Reach: ${trend.estimatedReach.toLocaleString()}
    - Risk Level: ${trend.riskLevel}
    
    Style Requirements:
    - Brand Voice: ${voiceInstructions[brandVoice as keyof typeof voiceInstructions]}
    - Target Audience: ${audienceInstructions[targetAudience as keyof typeof audienceInstructions]}
    ${customPrompt ? `- Additional Requirements: ${customPrompt}` : ''}
    
    Please respond with a JSON object containing:
    {
      "type": "${contentType}",
      "title": "Content title",
      "content": "The actual content/script",
      "hashtags": ["relevant", "hashtags"],
      "cta": "Call to action",
      "estimatedEngagement": estimated_number
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert content creator who generates viral, engaging content based on trending topics. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.7
    });

    const generatedContent = JSON.parse(response.choices[0].message.content || '{}');

    res.json(generatedContent);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
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