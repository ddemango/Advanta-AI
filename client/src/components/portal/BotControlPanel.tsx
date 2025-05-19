import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

// Bot control panel for managing AI assistants
export function BotControlPanel() {
  // Bot states
  const [botStatus, setBotStatus] = useState(true);
  const [learningMode, setLearningMode] = useState(true);
  const [responseSpeed, setResponseSpeed] = useState<[number]>([3]); // 1-5 scale
  const [creativityLevel, setCreativityLevel] = useState<[number]>([70]); // 0-100 scale
  const [knowledgeCutoff, setKnowledgeCutoff] = useState('latest');
  const [responseTemplate, setResponseTemplate] = useState(
    "Hello {{user.name}},\n\nThank you for your question about {{query.topic}}. Here is what I found:\n\n{{ai.response}}\n\nIs there anything else I can help with?\n\nBest regards,\nYour AI Assistant"
  );
  
  // Mock bot data
  const botList = [
    { id: 'customer-service', name: 'Customer Service Bot', status: 'active', queries: 532, rating: 4.8 },
    { id: 'sales-assistant', name: 'Sales Assistant', status: 'active', queries: 347, rating: 4.6 },
    { id: 'technical-support', name: 'Technical Support', status: 'maintenance', queries: 218, rating: 4.3 },
    { id: 'onboarding-guide', name: 'Onboarding Guide', status: 'draft', queries: 0, rating: 0 }
  ];
  
  const [selectedBot, setSelectedBot] = useState(botList[0].id);
  
  // Bot training state
  const [trainingData, setTrainingData] = useState('');
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'training' | 'completed' | 'error'>('idle');
  
  // Function to handle bot training
  const handleTrainBot = () => {
    if (!trainingData.trim()) return;
    
    setTrainingStatus('training');
    setTrainingProgress(0);
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTrainingStatus('completed');
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-2xl font-bold">Bot Control Panel</h3>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="bot-status" className={botStatus ? 'text-green-500' : 'text-red-500'}>
              {botStatus ? 'Online' : 'Offline'}
            </Label>
            <Switch 
              id="bot-status" 
              checked={botStatus} 
              onCheckedChange={setBotStatus} 
            />
          </div>
          
          <Button variant="outline" size="sm">
            <span className="mr-2">🔄</span> Restart Bot
          </Button>
        </div>
      </div>
      
      {/* Bot Selection */}
      <Card className="p-6 bg-background">
        <h4 className="text-lg font-medium mb-4">Select Bot to Manage</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {botList.map(bot => (
            <div 
              key={bot.id}
              className={`cursor-pointer border rounded-lg p-4 transition-all ${
                selectedBot === bot.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50 hover:bg-background/80'
              }`}
              onClick={() => setSelectedBot(bot.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{bot.name}</div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  bot.status === 'active' 
                    ? 'bg-green-500/20 text-green-500' 
                    : bot.status === 'maintenance'
                      ? 'bg-amber-500/20 text-amber-500'
                      : 'bg-gray-500/20 text-gray-500'
                }`}>
                  {bot.status}
                </div>
              </div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>{bot.queries} queries</span>
                <span>⭐ {bot.rating || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Bot Configuration */}
      <Card className="bg-background">
        <Tabs defaultValue="general">
          <TabsList className="w-full rounded-t-lg rounded-b-none bg-muted">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>
          
          <div className="p-6">
            <TabsContent value="general" className="m-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Learning Mode</Label>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-muted-foreground">
                        Allows the bot to learn from conversations and improve over time
                      </div>
                      <Switch 
                        checked={learningMode} 
                        onCheckedChange={setLearningMode} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <Label>Response Speed</Label>
                      <span className="text-sm text-muted-foreground">
                        {responseSpeed[0] === 1 ? 'Fastest' : 
                         responseSpeed[0] === 2 ? 'Fast' :
                         responseSpeed[0] === 3 ? 'Balanced' :
                         responseSpeed[0] === 4 ? 'Thorough' : 'Most Thorough'}
                      </span>
                    </div>
                    <Slider 
                      value={responseSpeed} 
                      min={1} 
                      max={5} 
                      step={1} 
                      // @ts-ignore - Need to fix type issue here
                      onValueChange={setResponseSpeed} 
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Speed</span>
                      <span>Quality</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <Label>Creativity Level</Label>
                      <span className="text-sm text-muted-foreground">{creativityLevel[0]}%</span>
                    </div>
                    <Slider 
                      value={creativityLevel} 
                      min={0} 
                      max={100} 
                      step={10} 
                      // @ts-ignore - Need to fix type issue here
                      onValueChange={setCreativityLevel} 
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Knowledge Base</Label>
                    <Select value={knowledgeCutoff} onValueChange={setKnowledgeCutoff}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select knowledge cutoff" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">Latest Available Data</SelectItem>
                        <SelectItem value="2023">Up to 2023</SelectItem>
                        <SelectItem value="2022">Up to 2022</SelectItem>
                        <SelectItem value="2021">Up to 2021</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Bot Visibility</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button variant="outline" className="justify-start">
                        <span className="mr-2">🌐</span> Public
                      </Button>
                      <Button variant="outline" className="justify-start bg-muted">
                        <span className="mr-2">🔒</span> Private
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Language Support</Label>
                    <div className="mt-2 border border-border rounded-md p-3">
                      <div className="flex flex-wrap gap-2">
                        <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs flex items-center">
                          English <span className="ml-1 cursor-pointer">✕</span>
                        </div>
                        <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs flex items-center">
                          Spanish <span className="ml-1 cursor-pointer">✕</span>
                        </div>
                        <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs flex items-center">
                          French <span className="ml-1 cursor-pointer">✕</span>
                        </div>
                        <div className="border border-dashed border-border hover:border-primary px-2 py-1 rounded text-xs text-muted-foreground cursor-pointer">
                          + Add Language
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Changes</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="training" className="m-0 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Upload Training Data</Label>
                  <div className="border border-dashed border-border rounded-lg p-6 mt-2 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="text-3xl text-muted-foreground mb-2">
                      <i className="fas fa-upload"></i>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      Drag and drop files here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports CSV, JSON, TXT, PDF (up to 50MB)
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label>Custom Training Examples</Label>
                  <Textarea 
                    placeholder="Enter examples, one per line in the format: 'Question: What are your hours? Answer: We are open 9am-5pm Monday through Friday.'"
                    value={trainingData}
                    onChange={(e) => setTrainingData(e.target.value)}
                    className="mt-2 min-h-32"
                  />
                </div>
                
                {trainingStatus !== 'idle' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Training Progress</span>
                      <span>{trainingProgress}%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          trainingStatus === 'error' ? 'bg-red-500' : 'bg-primary'
                        }`}
                        style={{ width: `${trainingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {trainingStatus === 'training' ? 'Processing training data...' :
                       trainingStatus === 'completed' ? 'Training completed successfully' :
                       trainingStatus === 'error' ? 'Error occurred during training' : ''}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setTrainingData('')}>
                    Clear
                  </Button>
                  <Button onClick={handleTrainBot} disabled={!trainingData.trim() || trainingStatus === 'training'}>
                    {trainingStatus === 'training' ? 'Training...' : 'Train Bot'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="responses" className="m-0 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Response Template</Label>
                  <Textarea 
                    value={responseTemplate}
                    onChange={(e) => setResponseTemplate(e.target.value)}
                    className="mt-2 font-mono text-sm min-h-32"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Available variables: {{user.name}}, {{user.email}}, {{query.topic}}, {{query.text}}, {{ai.response}}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tone & Style</Label>
                    <Select defaultValue="professional">
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="empathetic">Empathetic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Response Format</Label>
                    <Select defaultValue="paragraph">
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paragraph">Paragraphs</SelectItem>
                        <SelectItem value="bullet">Bullet Points</SelectItem>
                        <SelectItem value="numbered">Numbered List</SelectItem>
                        <SelectItem value="qa">Q&A Format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Response Preview</Label>
                  <div className="mt-2 p-4 bg-muted rounded-lg text-sm">
                    <div className="mb-2 pb-2 border-b border-border">
                      <span className="font-medium">User Query:</span> What are your pricing options?
                    </div>
                    <div>
                      <span className="font-medium">Bot Response:</span>
                      <div className="mt-1">
                        Hello John,<br/><br/>
                        Thank you for your question about pricing options. Here's what I found:<br/><br/>
                        We offer three main pricing tiers: Basic ($9.99/month), Professional ($19.99/month), and Enterprise (custom pricing). Each tier comes with different features and support levels tailored to different business needs.<br/><br/>
                        Is there anything else I can help with?<br/><br/>
                        Best regards,<br/>
                        Your AI Assistant
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                  <Button variant="outline">Reset to Default</Button>
                  <Button>Save Template</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="integration" className="m-0 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Integration Method</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                    <Button variant="outline" className="justify-start bg-muted">
                      <span className="mr-2">🔌</span> API
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="mr-2">💬</span> Chat Widget
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="mr-2">📱</span> Mobile SDK
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>API Access Keys</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input 
                        value="sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                        type="password"
                        readOnly
                      />
                      <Button variant="outline" size="sm">
                        <i className="fas fa-eye"></i>
                      </Button>
                      <Button variant="outline" size="sm">
                        <i className="fas fa-copy"></i>
                      </Button>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Created 30 days ago</span>
                      <span className="text-primary cursor-pointer">Generate New Key</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Webhook Configuration</Label>
                  <div className="mt-2 space-y-2">
                    <Input 
                      placeholder="https://yourdomain.com/webhooks/ai-events" 
                    />
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm flex items-center space-x-2">
                        <span>Webhook Events:</span>
                      </Label>
                      <div className="flex space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <input type="checkbox" id="conversation-start" className="rounded" defaultChecked />
                          <label htmlFor="conversation-start">Conversation Start</label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <input type="checkbox" id="conversation-end" className="rounded" defaultChecked />
                          <label htmlFor="conversation-end">Conversation End</label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <input type="checkbox" id="feedback" className="rounded" defaultChecked />
                          <label htmlFor="feedback">User Feedback</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Embed Code</Label>
                  <div className="mt-2 relative">
                    <Textarea 
                      value={`<script src="https://cdn.advanta-ai.com/chat-widget.js" data-bot-id="${selectedBot}" async></script>`}
                      className="font-mono text-sm h-20"
                      readOnly
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-2 right-2"
                    >
                      <i className="fas fa-copy"></i>
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                  <Button>Save Integration Settings</Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}