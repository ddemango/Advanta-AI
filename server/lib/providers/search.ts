import { env } from '../env';

export type WebProvider = 'bing' | 'brave' | 'serper';

export interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
}

// Bing Search API
async function searchBing(query: string, topK: number): Promise<SearchResult[]> {
  if (!env.BING_API_KEY) {
    throw new Error('BING_API_KEY not configured');
  }

  const url = 'https://api.bing.microsoft.com/v7.0/search';
  const response = await fetch(`${url}?q=${encodeURIComponent(query)}&count=${topK}`, {
    headers: {
      'Ocp-Apim-Subscription-Key': env.BING_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Bing API error: ${response.status}`);
  }

  const data = await response.json();
  return (data.webPages?.value || []).map((item: any) => ({
    title: item.name,
    url: item.url,
    snippet: item.snippet,
    source: 'bing',
  }));
}

// Brave Search API
async function searchBrave(query: string, topK: number): Promise<SearchResult[]> {
  if (!env.BRAVE_API_KEY) {
    throw new Error('BRAVE_API_KEY not configured');
  }

  const url = 'https://api.search.brave.com/res/v1/web/search';
  const response = await fetch(`${url}?q=${encodeURIComponent(query)}&count=${topK}`, {
    headers: {
      'X-Subscription-Token': env.BRAVE_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Brave API error: ${response.status}`);
  }

  const data = await response.json();
  return (data.web?.results || []).map((item: any) => ({
    title: item.title,
    url: item.url,
    snippet: item.description,
    source: 'brave',
  }));
}

// Serper API
async function searchSerper(query: string, topK: number): Promise<SearchResult[]> {
  if (!env.SERPER_API_KEY) {
    throw new Error('SERPER_API_KEY not configured');
  }

  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': env.SERPER_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query,
      num: topK,
    }),
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status}`);
  }

  const data = await response.json();
  return (data.organic || []).map((item: any) => ({
    title: item.title,
    url: item.link,
    snippet: item.snippet,
    source: 'serper',
  }));
}

// Main search function
export async function searchWeb(
  provider: WebProvider,
  query: string,
  topK: number = 10
): Promise<SearchResult[]> {
  try {
    switch (provider) {
      case 'bing':
        return await searchBing(query, topK);
      case 'brave':
        return await searchBrave(query, topK);
      case 'serper':
        return await searchSerper(query, topK);
      default:
        throw new Error(`Unknown search provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Search error with ${provider}:`, error);
    throw error;
  }
}