export type WebProvider = "bing" | "brave" | "serper";

export interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
}

async function searchSerper(query: string, topK: number = 5): Promise<SearchResult[]> {
  if (!process.env.SERPER_API_KEY) {
    throw new Error("SERPER_API_KEY not configured");
  }
  
  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ q: query })
  });
  
  const data = await response.json();
  return (data?.organic || []).slice(0, topK).map((item: any) => ({
    title: item.title,
    url: item.link,
    snippet: item.snippet,
    source: "serper"
  }));
}

async function searchBing(query: string, topK: number = 5): Promise<SearchResult[]> {
  if (!process.env.BING_API_KEY) {
    throw new Error("BING_API_KEY not configured");
  }
  
  const response = await fetch(
    `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.BING_API_KEY
      }
    }
  );
  
  const data = await response.json();
  return (data?.webPages?.value || []).slice(0, topK).map((item: any) => ({
    title: item.name,
    url: item.url,
    snippet: item.snippet,
    source: "bing"
  }));
}

async function searchBrave(query: string, topK: number = 5): Promise<SearchResult[]> {
  if (!process.env.BRAVE_API_KEY) {
    throw new Error("BRAVE_API_KEY not configured");
  }
  
  const response = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        "X-Subscription-Token": process.env.BRAVE_API_KEY
      }
    }
  );
  
  const data = await response.json();
  return (data?.web?.results || []).slice(0, topK).map((item: any) => ({
    title: item.title,
    url: item.url,
    snippet: item.description,
    source: "brave"
  }));
}

export async function searchWeb(
  provider: WebProvider,
  query: string,
  topK: number = 5
): Promise<SearchResult[]> {
  try {
    switch (provider) {
      case "bing":
        return await searchBing(query, topK);
      case "brave":
        return await searchBrave(query, topK);
      case "serper":
      default:
        return await searchSerper(query, topK);
    }
  } catch (error) {
    console.error(`Search failed with ${provider}:`, error);
    // Fallback to mock results
    return [{
      title: `Search results for "${query}" (provider ${provider} unavailable)`,
      url: "https://example.com",
      snippet: "Search provider temporarily unavailable. Please try again later.",
      source: provider
    }];
  }
}