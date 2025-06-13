import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User, Sparkles } from 'lucide-react';

interface AIQueryInterfaceProps {
  workflowId?: number;
}

interface QueryMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AIQueryInterface({ workflowId }: AIQueryInterfaceProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<QueryMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I can help you analyze your workflow performance, explain execution patterns, and suggest optimizations. What would you like to know?',
      timestamp: new Date()
    }
  ]);

  const queryMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await fetch('/api/workflows/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ question: query, workflowId })
      });
      if (!response.ok) throw new Error('Failed to process query');
      const data = await response.json();
      return data.answer;
    },
    onSuccess: (answer) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: answer,
        timestamp: new Date()
      }]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    }]);

    // Process query
    queryMutation.mutate(question);
    setQuestion('');
  };

  const suggestedQuestions = [
    "Why is my workflow failing?",
    "How can I improve performance?",
    "What's the optimal schedule?",
    "Show me error patterns",
    "Compare this month vs last month"
  ];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <span>AI Workflow Assistant</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="px-6 py-4 border-t">
            <p className="text-sm font-medium text-gray-700 mb-3">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setQuestion(q)}
                >
                  {q}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about your workflow performance..."
              disabled={queryMutation.isPending}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!question.trim() || queryMutation.isPending}
              size="icon"
            >
              {queryMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}