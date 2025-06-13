import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface PromptInputProps {
  onWorkflowGenerated: (workflow: any) => void;
  isLoading: boolean;
}

export function PromptInput({ onWorkflowGenerated, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      const response = await fetch('/api/workflows/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse workflow');
      }

      const workflow = await response.json();
      onWorkflowGenerated(workflow);
    } catch (error) {
      console.error('Error generating workflow:', error);
    }
  };

  const examples = [
    "When I get a new Calendly booking, send a Slack message to #bookings and create a Notion page",
    "When someone submits a contact form, add them to Airtable and send a welcome email",
    "When a Stripe payment succeeds, update HubSpot deal and notify the team on Discord",
    "When I receive a Gmail with 'urgent' in subject, create a Trello card and send SMS alert"
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          AI Workflow Builder
        </CardTitle>
        <p className="text-sm text-gray-600">
          Describe your automation in plain English and our AI will create the workflow for you
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your automation workflow..."
            rows={4}
            className="resize-none"
          />
          <Button 
            type="submit" 
            disabled={!prompt.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Workflow...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Workflow
              </>
            )}
          </Button>
        </form>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Example prompts:</h4>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => setPrompt(example)}
                className="w-full text-left p-3 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              >
                {example}
              </motion.button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}