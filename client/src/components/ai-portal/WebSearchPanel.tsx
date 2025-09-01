"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Save, ExternalLink } from "lucide-react";

interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
}

export function WebSearchPanel({ projectId }: { projectId?: string }) {
  const [query, setQuery] = useState("latest AI automation trends");
  const [provider, setProvider] = useState("bing");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const searchWeb = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/search/web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          query,
          topK: 10
        }),
      });
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Web search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveResults = async () => {
    if (results.length === 0) return;
    
    try {
      await fetch("/api/search/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          query,
          results,
          projectId
        }),
      });
      console.log("Search results saved as artifact");
    } catch (error) {
      console.error("Save search failed:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Web Search Connector
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter search query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && searchWeb()}
          />
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bing">Bing</SelectItem>
              <SelectItem value="brave">Brave</SelectItem>
              <SelectItem value="serper">Serper</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={searchWeb} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {results.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Found {results.length} results
              </div>
              <Button size="sm" variant="outline" onClick={saveResults}>
                <Save className="h-4 w-4 mr-2" />
                Save as Artifact
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((result, i) => (
                <div key={i} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {result.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {result.source && (
                        <Badge variant="secondary" className="text-xs">
                          {result.source}
                        </Badge>
                      )}
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  {result.snippet && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {result.snippet}
                    </p>
                  )}
                  <div className="text-xs text-gray-400 truncate">
                    {result.url}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}