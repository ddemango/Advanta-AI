import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Loader2 } from 'lucide-react';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface WebSearchPanelProps {
  projectId?: string;
}

export function WebSearchPanel({ projectId }: WebSearchPanelProps) {
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('serper');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [artifactId, setArtifactId] = useState<string | null>(null);

  const runSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: query.trim(), 
          provider, 
          projectId 
        })
      });

      const data = await response.json();
      if (data.ok) {
        setResults(data.results || []);
        setArtifactId(data.artifactId);
      } else {
        console.error('Search failed:', data.error);
        // Handle different error cases
        if (data.error === 'no_provider_configured') {
          alert('No search provider configured. Please set up API keys for Serper, Bing, or Brave Search.');
        }
      }
    } catch (error) {
      console.error('Search request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      runSearch();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Web Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter your search query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="serper">Serper (Google)</option>
            <option value="bing">Bing</option>
            <option value="brave">Brave</option>
          </select>
          <Button
            onClick={runSearch}
            disabled={loading || !query.trim()}
            className="flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Search Results ({results.length})</h3>
              {artifactId && (
                <Badge variant="secondary">
                  Saved as artifact
                </Badge>
              )}
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-blue-600 hover:text-blue-800 line-clamp-2">
                        <a 
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {result.title}
                        </a>
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                        {result.snippet}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 truncate">
                        {result.url}
                      </p>
                    </div>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Enter a search query to find information on the web</p>
          </div>
        )}

        {/* Provider Info */}
        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
          <strong>Search Provider:</strong> {provider === 'serper' ? 'Serper (Google)' : provider === 'bing' ? 'Microsoft Bing' : 'Brave Search'}
          {artifactId && (
            <span className="ml-2">• Results saved to project artifacts</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}