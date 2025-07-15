import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    workflowId?: number;
    insights?: Array<{
      type: 'performance' | 'error' | 'optimization' | 'trend';
      title: string;
      value: string;
      icon: string;
    }>;
  };
}

interface AIQueryInterfaceProps {
  workflowId?: number;
}

const suggestedQueries = [
  "How is my workflow performing this week?",
  "What are the most common errors?",
  "Which step takes the longest to execute?",
  "Show me performance trends over the last month",
  "What optimizations do you recommend?",
  "When was my workflow last successful?",
  "Compare this month's performance to last month",
  "What's causing the recent failures?"
];

export default function AIQueryInterface({ workflowId }: AIQueryInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI workflow analyst. Ask me anything about your workflow performance, errors, trends, or optimizations. I can help you understand patterns and improve efficiency.",
      timestamp: new Date(),
    }
  ]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: queryText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/workflows/query', {
        query: queryText,
        workflowId
      });

      const data = await response.json();

      // Generate mock insights based on query type
      const insights = generateInsights(queryText);

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        type: 'assistant',
        content: data.answer || 'Unable to analyze workflow data. Please ensure your workflow has sufficient execution history.',
        timestamp: new Date(),
        metadata: {
          workflowId,
          insights
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your query",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // REMOVED: Mock insights violate zero-tolerance policy
  // All insights must come from real workflow analytics data
  const generateInsights = (query: string) => {
    return []; // Return empty until real analytics API is connected
  };

  const generateMockAnswer = (query: string) => {
    if (query.toLowerCase().includes('performance')) {
      return "Your workflow is performing well with a 94.2% success rate. Average execution time is 2.3 seconds, which is within acceptable limits. I've noticed a 12% improvement in performance over the past week, likely due to recent optimizations.";
    }
    
    if (query.toLowerCase().includes('error')) {
      return "I've analyzed your workflow errors. The most common issue is timeouts (45% of failures), followed by API rate limits (30%). Most errors occur during peak hours (9-11 AM). Consider increasing timeout values and implementing retry logic with exponential backoff.";
    }
    
    if (query.toLowerCase().includes('trend')) {
      return "Your workflow shows positive trends with 23% growth in successful executions this month. Peak performance is on Tuesdays between 9-11 AM. Weekend performance is consistently lower, suggesting business-day scheduling might be optimal.";
    }
    
    if (query.toLowerCase().includes('optimization')) {
      return "Based on analysis, I recommend: 1) Implement caching for frequently accessed data (potential 30% speed improvement), 2) Add parallel processing for independent tasks, 3) Set up monitoring alerts for error spikes, 4) Consider auto-scaling during peak hours.";
    }

    return "I've analyzed your workflow data. Could you be more specific about what aspect you'd like me to focus on? I can help with performance metrics, error analysis, trend identification, or optimization recommendations.";
  };

  const getInsightIcon = (iconName: string) => {
    const icons = {
      CheckCircle,
      AlertCircle,
      Clock,
      TrendingUp
    };
    return icons[iconName as keyof typeof icons] || CheckCircle;
  };

  const getInsightColor = (type: string) => {
    const colors = {
      performance: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800',
      optimization: 'bg-green-100 text-green-800',
      trend: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Workflow Analyst
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Suggested Queries */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Suggested questions:</h4>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.slice(0, 4).map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleQuery(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    
                    {/* Insights */}
                    {message.metadata?.insights && message.metadata.insights.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {message.metadata.insights.map((insight, index) => {
                          const Icon = getInsightIcon(insight.icon);
                          return (
                            <div
                              key={index}
                              className={`p-3 rounded-lg ${getInsightColor(insight.type)}`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <div>
                                  <p className="text-xs font-medium">{insight.title}</p>
                                  <p className="text-sm font-bold">{insight.value}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span className="text-sm">Analyzing your workflow...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about your workflow performance, errors, or optimizations..."
              onKeyDown={(e) => e.key === 'Enter' && handleQuery(query)}
              disabled={isLoading}
            />
            <Button 
              onClick={() => handleQuery(query)}
              disabled={isLoading || !query.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}