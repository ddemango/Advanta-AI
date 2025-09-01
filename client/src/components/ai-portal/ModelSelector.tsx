import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Model {
  key: string;
  label: string;
  provider: string;
  kind: string;
  tokensPerMinute?: number;
  costPer1k?: number;
}

const MODEL_CATALOG: Model[] = [
  { key: 'gpt-4o', label: 'GPT-4o (Latest)', provider: 'OpenAI', kind: 'chat', tokensPerMinute: 10000, costPer1k: 0.03 },
  { key: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast)', provider: 'OpenAI', kind: 'chat', tokensPerMinute: 50000, costPer1k: 0.005 },
  { key: 'gpt-4', label: 'GPT-4 (Stable)', provider: 'OpenAI', kind: 'chat', tokensPerMinute: 5000, costPer1k: 0.06 },
  { key: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Economic)', provider: 'OpenAI', kind: 'chat', tokensPerMinute: 20000, costPer1k: 0.002 },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  showAdvanced?: boolean;
}

export function ModelSelector({ selectedModel, onModelChange, showAdvanced = false }: ModelSelectorProps) {
  const [usage, setUsage] = useState<{ model: string; tokens: number; cost: number }[]>([]);

  const currentModel = MODEL_CATALOG.find(m => m.key === selectedModel) || MODEL_CATALOG[0];

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/ai-portal/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data.usage || []);
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    }
  };

  useEffect(() => {
    if (showAdvanced) {
      fetchUsage();
    }
  }, [showAdvanced]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          AI Model Selection
          <Badge variant="outline">{currentModel.provider}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {MODEL_CATALOG.map((model) => (
            <div
              key={model.key}
              className={`p-3 rounded border cursor-pointer transition-colors ${
                selectedModel === model.key
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
              onClick={() => onModelChange(model.key)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{model.label}</div>
                  <div className="text-sm text-zinc-400">
                    {model.tokensPerMinute?.toLocaleString()} tokens/min • ${model.costPer1k}/1k tokens
                  </div>
                </div>
                {selectedModel === model.key && (
                  <Badge className="bg-blue-600">Selected</Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {showAdvanced && usage.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Today's Usage</h4>
            <div className="space-y-1">
              {usage.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.model}</span>
                  <span>{item.tokens.toLocaleString()} tokens (${item.cost.toFixed(4)})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}