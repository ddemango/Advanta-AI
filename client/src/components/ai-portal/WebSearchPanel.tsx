import React, { useState } from 'react';
import { Search, Download, ExternalLink, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

interface WebSearchPanelProps {
  onSearchComplete?: (results: SearchResult[]) => void;
}

const WebSearchPanel: React.FC<WebSearchPanelProps> = ({ onSearchComplete }) => {
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('bing');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const performSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/search/web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          query,
          topK: 10
        })
      });

      const data = await response.json();
      if (data.ok) {
        setResults(data.results);
        setSearchHistory(prev => [query, ...prev.filter(q => q !== query)].slice(0, 10));
        onSearchComplete?.(data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSearchArtifact = async () => {
    try {
      await fetch('/api/search/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          query,
          results
        })
      });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Provider:</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
            >
              <option value="bing">Bing</option>
              <option value="brave">Brave</option>
              <option value="serper">Serper</option>
            </select>
          </div>
          
          {results.length > 0 && (
            <button
              onClick={saveSearchArtifact}
              className="px-3 py-1 bg-blue-600 text-xs rounded flex items-center space-x-1"
            >
              <Download className="w-3 h-3" />
              <span>Save Artifact</span>
            </button>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && performSearch()}
            placeholder="Enter your search query..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-4 pr-12 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={performSearch}
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-gray-400 mb-2 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Recent searches
            </div>
            <div className="flex flex-wrap gap-1">
              {searchHistory.slice(0, 5).map((historyQuery, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(historyQuery)}
                  className="px-2 py-1 bg-gray-700 text-xs rounded hover:bg-gray-600 transition-colors"
                >
                  {historyQuery}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-32"
            >
              <div className="text-gray-400">Searching...</div>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-sm text-gray-400 mb-4">
                Found {results.length} results for "{query}"
              </div>
              {results.map((result, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-medium text-blue-400 hover:text-blue-300 cursor-pointer mb-2 flex items-center">
                    {result.title}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </h3>
                  <p className="text-sm text-gray-300 mb-2 leading-relaxed">{result.snippet}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate max-w-md">{result.url}</span>
                    <span className="bg-gray-700 px-2 py-1 rounded">{result.source}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <div>Search the web to get started</div>
                <div className="text-sm mt-1">Use any search provider to find information</div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WebSearchPanel;