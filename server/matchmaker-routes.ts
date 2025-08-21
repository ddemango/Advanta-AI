import { Request, Response } from 'express';
import OpenAI from 'openai';

// TMDB API configuration
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

// Service to TMDB provider mapping
const SERVICE_TO_TMDB_PROVIDER: Record<string, number> = {
  netflix: 8,
  prime: 9,
  disney: 337,
  hulu: 15,
  max: 384, // HBO Max
  peacock: 387,
  paramount: 531,
  apple: 350,
};

// Mood to genre weights for heuristic scoring
const MOOD_GENRE_WEIGHTS: Record<string, Record<number, number>> = {
  cozy: { 35: 1.0, 10749: 0.6, 16: 0.3 }, // Comedy, Romance, Animation
  light: { 35: 0.8, 12: 0.6 }, // Comedy, Adventure
  intense: { 53: 1.0, 28: 0.8, 80: 0.6 }, // Thriller, Action, Crime
  smart: { 18: 0.6, 9648: 0.8, 99: 0.6, 878: 0.5 }, // Drama, Mystery, Documentary, Sci-Fi
  gritty: { 80: 0.9, 18: 0.5, 53: 0.7 },
  comfort: { 35: 0.7, 10751: 0.6 }, // Family
  high_energy: { 28: 0.8, 12: 0.7 },
  low_energy: { 18: 0.6, 10749: 0.4 },
  multitask: { 35: 0.5, 10751: 0.4 },
  focus: { 9648: 0.7, 18: 0.6, 99: 0.6 },
};

interface ContentItem {
  id: number;
  media_type: 'movie' | 'tv';
  title: string;
  year?: number;
  runtime?: number;
  overview: string;
  poster_url?: string;
  tmdb_url?: string;
  providers?: {
    flatrate?: string[];
    ads?: string[];
    rent?: string[];
    buy?: string[];
  };
  popularity?: number;
  genres?: number[];
  match_score?: number;
}

// Helper function to get TMDB API key
function getTMDBApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error('TMDB_API_KEY not configured. Please add your TMDB API key to environment variables.');
  }
  return key;
}

// Helper function to create poster URL
function createPosterUrl(path?: string | null): string | undefined {
  return path ? `${IMG_BASE}${path}` : undefined;
}

// Gaussian penalty function for time-based scoring
function gaussianPenalty(x: number, mu: number, sigma: number): number {
  const diff = x - mu;
  return Math.exp(-(diff * diff) / (2 * sigma * sigma));
}

// Heuristic scoring function
function calculateHeuristicScore(item: ContentItem, moods: string[], timeWindow: number): number {
  const timeFit = item.runtime 
    ? gaussianPenalty(item.runtime, timeWindow, Math.max(15, timeWindow * 0.25)) 
    : 0.8;
    
  const moodGenre = moods.reduce((acc, mood) => {
    const weights = MOOD_GENRE_WEIGHTS[mood] || {};
    return acc + (item.genres?.reduce((s, g) => s + (weights[g] || 0), 0) || 0);
  }, 0);

  const recency = item.year ? Math.max(0, Math.min(1, (item.year - 1990) / 35)) : 0.3;
  const popularity = item.popularity ? Math.min(1, item.popularity / 100) : 0.3;

  return 0.35 * timeFit + 0.25 * (moodGenre / 2) + 0.20 * recency + 0.20 * popularity;
}

// Retrieve content from TMDB based on preferences
export async function retrieveContent(req: Request, res: Response) {
  try {
    const { services, timeWindow, languages = ['en-US'], mediaTypes = ['movie', 'tv'], count = 100 } = req.body;
    
    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: 'At least one streaming service must be selected' });
    }

    const apiKey = getTMDBApiKey();
    const region = process.env.WATCH_REGION || 'US';
    const providers = services.map((s: string) => SERVICE_TO_TMDB_PROVIDER[s]).filter(Boolean);
    const providerCsv = providers.join('|');
    const results: ContentItem[] = [];

    // Function to fetch a page of content
    const fetchPage = async (media: 'movie' | 'tv', page: number = 1) => {
      const params = new URLSearchParams();
      params.set('api_key', apiKey);
      params.set('language', languages[0]);
      params.set('sort_by', 'popularity.desc');
      params.set('watch_region', region);
      if (providerCsv) params.set('with_watch_providers', providerCsv);
      if (timeWindow && media === 'movie') params.set('with_runtime.lte', String(timeWindow));
      params.set('page', String(page));

      const url = `${TMDB_BASE}/discover/${media}?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`TMDB discover ${media} failed: ${response.status}`);
      }
      
      return await response.json();
    };

    // Fetch content for each media type
    for (const media of mediaTypes as ('movie' | 'tv')[]) {
      try {
        const page1 = await fetchPage(media, 1);
        const items = page1.results?.slice(0, Math.ceil(count / mediaTypes.length)) || [];
        
        for (const item of items) {
          const contentItem: ContentItem = {
            id: item.id,
            media_type: media,
            title: media === 'movie' ? item.title : item.name,
            year: (item.release_date || item.first_air_date)?.slice(0, 4) 
              ? Number((item.release_date || item.first_air_date).slice(0, 4)) 
              : undefined,
            runtime: item.runtime,
            overview: item.overview || 'No description available.',
            poster_url: createPosterUrl(item.poster_path),
            tmdb_url: `https://www.themoviedb.org/${media}/${item.id}`,
            popularity: item.popularity,
            genres: item.genre_ids || [],
          };
          
          results.push(contentItem);
        }
      } catch (error) {
        console.error(`Error fetching ${media} content:`, error);
      }
    }

    res.json({ items: results, total: results.length });
  } catch (error) {
    console.error('Error in retrieveContent:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve content',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

// Rerank content based on mood preferences
export async function rerankContent(req: Request, res: Response) {
  try {
    const { candidates, moods, timeWindow } = req.body;
    
    if (!candidates || !Array.isArray(candidates)) {
      return res.status(400).json({ error: 'Candidates array is required' });
    }
    
    if (!moods || !Array.isArray(moods) || moods.length === 0) {
      return res.status(400).json({ error: 'At least one mood must be selected' });
    }

    // Calculate scores for each candidate
    const scored = candidates.map((item: ContentItem) => ({
      ...item,
      match_score: Math.round(calculateHeuristicScore(item, moods, timeWindow || 120) * 100)
    }));

    // Sort by score and limit results
    scored.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
    const topResults = scored.slice(0, 12);

    res.json({ items: topResults, total: topResults.length });
  } catch (error) {
    console.error('Error in rerankContent:', error);
    res.status(500).json({ 
      error: 'Failed to rank content',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

// Generate explanation for why an item was recommended
export async function explainRecommendation(req: Request, res: Response) {
  try {
    const { item, moods, timeWindow } = req.body;
    
    if (!item) {
      return res.status(400).json({ error: 'Content item is required' });
    }

    // Try to use OpenAI for intelligent explanations
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (openaiKey) {
      try {
        const openai = new OpenAI({ apiKey: openaiKey });
        
        const moodText = moods?.join(', ') || 'general entertainment';
        const timeText = timeWindow ? `${timeWindow} minutes` : 'any amount of time';
        
        const prompt = `Explain in one concise sentence (max 20 words) why "${item.title}" is perfect for someone seeking ${moodText} content with ${timeText} available. Focus on mood and tone match, not plot details.`;

        const response = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 50,
          temperature: 0.7
        });

        const explanation = response.choices[0]?.message?.content?.trim();
        
        if (explanation) {
          return res.json({ reason: explanation });
        }
      } catch (openaiError) {
        console.warn('OpenAI explanation failed:', openaiError);
      }
    }

    // Fallback to heuristic explanation
    const moodDescriptions: Record<string, string> = {
      cozy: 'warm and comforting',
      light: 'fun and easy-going',
      intense: 'thrilling and engaging',
      smart: 'thought-provoking',
      gritty: 'raw and realistic',
      comfort: 'familiar and soothing',
      high_energy: 'action-packed',
      low_energy: 'relaxing',
      multitask: 'perfect for background viewing',
      focus: 'deserves your full attention'
    };

    const primaryMood = moods?.[0] || 'entertaining';
    const description = moodDescriptions[primaryMood] || 'engaging';
    
    const fallbackReason = `Perfect ${description} ${item.media_type} that matches your current mood`;
    
    res.json({ reason: fallbackReason });
  } catch (error) {
    console.error('Error in explainRecommendation:', error);
    res.status(500).json({ 
      error: 'Failed to generate explanation',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

// Fetch detailed provider information for content
export async function fetchProviders(req: Request, res: Response) {
  try {
    const { id, media_type } = req.body;
    
    if (!id || !media_type) {
      return res.status(400).json({ error: 'Content ID and media type are required' });
    }

    const apiKey = getTMDBApiKey();
    const region = process.env.WATCH_REGION || 'US';
    const url = `${TMDB_BASE}/${media_type}/${id}/watch/providers?api_key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch providers: ${response.status}`);
    }
    
    const data = await response.json();
    const regionInfo = data.results?.[region];
    
    if (regionInfo) {
      res.json({
        providers: {
          flatrate: regionInfo.flatrate?.map((p: any) => p.provider_name) || [],
          ads: regionInfo.ads?.map((p: any) => p.provider_name) || [],
          rent: regionInfo.rent?.map((p: any) => p.provider_name) || [],
          buy: regionInfo.buy?.map((p: any) => p.provider_name) || []
        }
      });
    } else {
      res.json({ providers: {} });
    }
  } catch (error) {
    console.error('Error in fetchProviders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch provider information',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

// Track user interactions for analytics
export async function trackInteraction(req: Request, res: Response) {
  try {
    const { event, item_id, media_type, action } = req.body;
    
    // For now, just log the interaction
    // In production, you might want to store this in a database
    console.log('User interaction tracked:', {
      event,
      item_id,
      media_type,
      action,
      timestamp: new Date().toISOString(),
      user_session: req.sessionID
    });
    
    res.json({ success: true, message: 'Interaction tracked' });
  } catch (error) {
    console.error('Error in trackInteraction:', error);
    res.status(500).json({ 
      error: 'Failed to track interaction',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}