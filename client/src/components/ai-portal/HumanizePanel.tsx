import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wand2, Copy, Check } from 'lucide-react';

interface HumanizePanelProps {
  model?: string;
}

const TONE_PRESETS = [
  { key: 'professional', label: 'Professional', description: 'Concise, business-appropriate tone' },
  { key: 'humorous', label: 'Humorous', description: 'Light, clever humor while staying tasteful' },
  { key: 'caring', label: 'Caring', description: 'Warm, supportive, and empathetic' },
  { key: 'bold', label: 'Bold', description: 'Punchy, confident, and action-oriented' },
  { key: 'technical', label: 'Technical', description: 'Precise, detailed, and expert-focused' },
  { key: 'casual', label: 'Casual', description: 'Friendly, conversational, and approachable' },
];

export function HumanizePanel({ model = 'gpt-4o-mini' }: HumanizePanelProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleHumanize = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          tone: selectedTone,
          model
        })
      });

      const data = await response.json();
      if (data.ok) {
        setOutputText(data.output);
      } else {
        setOutputText(`Error: ${data.error}`);
      }
    } catch (error) {
      setOutputText(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (outputText) {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const selectedPreset = TONE_PRESETS.find(t => t.key === selectedTone) || TONE_PRESETS[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          Text Humanizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tone Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Tone Preset</label>
          <div className="grid grid-cols-2 gap-2">
            {TONE_PRESETS.map((tone) => (
              <div
                key={tone.key}
                className={`p-2 rounded border cursor-pointer transition-colors ${
                  selectedTone === tone.key
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-zinc-700 hover:border-zinc-600'
                }`}
                onClick={() => setSelectedTone(tone.key)}
              >
                <div className="font-medium text-sm">{tone.label}</div>
                <div className="text-xs text-zinc-400">{tone.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Selection */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Selected:</span>
          <Badge variant="outline">{selectedPreset.label}</Badge>
        </div>

        {/* Input Text */}
        <div>
          <label className="text-sm font-medium mb-2 block">Original Text</label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to humanize and improve..."
            className="min-h-[120px]"
            maxLength={2000}
          />
          <div className="text-xs text-zinc-400 mt-1">
            {inputText.length}/2000 characters
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleHumanize} 
          disabled={loading || !inputText.trim()}
          className="w-full"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          {loading ? 'Humanizing...' : `Rewrite as ${selectedPreset.label}`}
        </Button>

        {/* Output Text */}
        {outputText && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Humanized Text</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-8"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={outputText}
              readOnly
              className="min-h-[120px] bg-zinc-900/50"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}