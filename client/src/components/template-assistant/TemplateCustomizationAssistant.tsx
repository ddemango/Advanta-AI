import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiTypingAnimation } from '@/components/ui/ai-typing-animation';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Code, Send, Settings, Clipboard, Download, ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Default template types available for customization
const templateTypes = [
  { 
    id: 'chatbot', 
    name: 'Customer Service Chatbot',
    description: 'An AI chatbot that handles customer inquiries, provides support, and routes complex issues to human agents.',
    complexity: 'Intermediate'
  },
  { 
    id: 'analytics', 
    name: 'Predictive Analytics Dashboard',
    description: 'A dashboard that analyzes historical data to forecast trends, identify opportunities, and provide actionable insights.',
    complexity: 'Advanced'
  },
  { 
    id: 'content', 
    name: 'Content Generation Suite',
    description: 'AI tools for creating marketing copy, blog posts, product descriptions, and other content based on your brand guidelines.',
    complexity: 'Beginner'
  },
  { 
    id: 'pricing', 
    name: 'Dynamic Pricing Optimizer',
    description: 'An AI system that adjusts pricing based on demand, competitor analysis, inventory levels, and other market factors.',
    complexity: 'Advanced'
  },
  { 
    id: 'personalization', 
    name: 'Customer Experience Personalizer',
    description: 'AI-driven personalization for web experiences, product recommendations, and customer communications.',
    complexity: 'Intermediate'
  }
];

// Sample implementation languages
const implementationLanguages = [
  { id: 'js', name: 'JavaScript/TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'csharp', name: 'C#' },
  { id: 'php', name: 'PHP' }
];

// Message types for the chat interaction
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  codeSnippet?: string;
  codeLanguage?: string;
}

export function TemplateCustomizationAssistant() {
  // State for the customization form and chat
  const [activeTab, setActiveTab] = useState('customize');
  const [selectedTemplate, setSelectedTemplate] = useState(templateTypes[0].id);
  const [industry, setIndustry] = useState('');
  const [language, setLanguage] = useState(implementationLanguages[0].id);
  const [requirements, setRequirements] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI template customization assistant. I can help you customize an AI template based on your specific needs and generate implementation code. Start by selecting a template type, your industry, and describing your requirements.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedCode, setGeneratedCode] = useState<{
    snippet: string;
    language: string;
    description: string;
  } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when new ones arrive
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handle submitting the customization form
  const handleCustomizationSubmit = () => {
    if (!industry.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your industry to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (!requirements.trim()) {
      toast({
        title: "Missing information",
        description: "Please describe your specific requirements to continue.",
        variant: "destructive"
      });
      return;
    }
    
    const templateInfo = templateTypes.find(t => t.id === selectedTemplate);
    
    // Add a user message summarizing their selections
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `I'd like to customize the ${templateInfo?.name} template for the ${industry} industry using ${implementationLanguages.find(l => l.id === language)?.name}. Here are my specific requirements: ${requirements}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI typing response
    setTimeout(() => {
      const loadingMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true
      };
      
      setMessages(prev => [...prev, loadingMessage]);
      
      // Simulate AI generating a response with progress
      setIsGenerating(true);
      setGenerationProgress(0);
      
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          if (newProgress >= 100) {
            clearInterval(interval);
            
            // Replace loading message with actual response
            setTimeout(() => {
              setMessages(prev => {
                const filtered = prev.filter(msg => !msg.isLoading);
                return [...filtered, {
                  id: (Date.now() + 2).toString(),
                  role: 'assistant',
                  content: `I'll customize the ${templateInfo?.name} template for your ${industry} business. Based on your requirements, here's my recommendation for implementation:`,
                  timestamp: new Date()
                }];
              });
              
              // Generate a code snippet based on the selections
              generateCodeSnippet(selectedTemplate, industry, language, requirements);
              setIsGenerating(false);
            }, 500);
            
            return 100;
          }
          return newProgress;
        });
      }, 300);
      
      // Switch to Chat tab to show the assistant response
      setActiveTab('chat');
    }, 500);
  };
  
  // Generate a code snippet based on the user selections
  const generateCodeSnippet = (template: string, industry: string, programmingLanguage: string, reqs: string) => {
    // Sample code snippets for different templates and languages
    let snippet = '';
    let language = '';
    let description = '';
    
    // Generate different snippets based on template type and programming language
    if (template === 'chatbot') {
      if (programmingLanguage === 'js') {
        language = 'javascript';
        description = `A JavaScript implementation of a customer service chatbot for the ${industry} industry. This uses a modern React-based approach with state management.`;
        snippet = `// AI Customer Service Chatbot for ${industry} industry
import React, { useState, useEffect } from 'react';
import { createChatBotClient } from '@advanta-ai/chatbot-sdk';

// Initialize the chatbot client with your configuration
const chatbot = createChatBotClient({
  apiKey: process.env.CHATBOT_API_KEY,
  industry: '${industry}',
  // Custom training based on specific requirements
  trainingParams: {
    specializedFor: '${requirements.substring(0, 30)}...',
    responseStyle: 'professional',
    knowledgeBase: '${industry.toLowerCase()}-kb'
  }
});

export function CustomerServiceBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle user input
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get response from AI
      const response = await chatbot.getResponse(input, {
        context: { previousMessages: messages }
      });
      
      // Add AI response to chat
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now() + 1,
          text: response.text,
          sender: 'bot',
          actions: response.suggestedActions
        }
      ]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="chatbot-container">
      {/* Chat messages display */}
      <div className="messages-container">
        {messages.map(msg => (
          <div key={msg.id} className={\`message \${msg.sender}\`}>
            {msg.text}
            {msg.actions && msg.actions.length > 0 && (
              <div className="suggested-actions">
                {msg.actions.map(action => (
                  <button 
                    key={action.id}
                    onClick={() => handleActionClick(action)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && <div className="message bot loading">Typing...</div>}
      </div>
      
      {/* Input area */}
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}`;
      } else if (programmingLanguage === 'python') {
        language = 'python';
        description = `A Python implementation of a customer service chatbot for the ${industry} industry using FastAPI and modern NLP techniques.`;
        snippet = `# AI Customer Service Chatbot for ${industry} industry
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from advanta_ai.chatbot import ChatbotClient

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="${industry} Customer Service Bot")

# Initialize the chatbot client
chatbot = ChatbotClient(
    api_key=os.getenv("CHATBOT_API_KEY"),
    industry="${industry}",
    training_params={
        "specialized_for": "${requirements.substring(0, 30)}...",
        "response_style": "professional",
        "knowledge_base": "${industry.toLowerCase()}-kb"
    }
)

# Define request and response models
class Message(BaseModel):
    text: str
    sender: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    context: Optional[dict] = None

class SuggestedAction(BaseModel):
    id: str
    label: str
    payload: dict

class ChatResponse(BaseModel):
    message: str
    conversation_id: str
    suggested_actions: List[SuggestedAction] = []
    confidence_score: float

@app.post("/api/chat", response_model=ChatResponse)
async def get_bot_response(request: ChatRequest):
    try:
        # Get response from the chatbot
        response = chatbot.get_response(
            message=request.message,
            conversation_id=request.conversation_id,
            context=request.context
        )
        
        return ChatResponse(
            message=response.text,
            conversation_id=response.conversation_id,
            suggested_actions=response.suggested_actions,
            confidence_score=response.confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`;
      }
    } else if (template === 'analytics') {
      if (programmingLanguage === 'js') {
        language = 'javascript';
        description = `A JavaScript-based predictive analytics dashboard for the ${industry} industry. This implementation uses React and visualization libraries.`;
        snippet = `// Predictive Analytics Dashboard for ${industry} industry
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { AdvantaAnalytics } from '@advanta-ai/analytics-sdk';

// Initialize analytics with your configuration
const analytics = new AdvantaAnalytics({
  apiKey: process.env.ANALYTICS_API_KEY,
  industry: '${industry}',
  modelParams: {
    predictionHorizon: 90, // 90-day forecasting
    confidenceInterval: 0.95,
    seasonalityDetection: true,
    anomalyDetection: true
  }
});

export function PredictiveDashboard() {
  const [timeframe, setTimeframe] = useState('month');
  const [metrics, setMetrics] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load initial data
    loadDashboardData();
  }, [timeframe]);
  
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch historical metrics
      const metricsData = await analytics.getMetrics({
        timeframe,
        dimensions: ['date', 'channel', 'segment'],
        metrics: ['revenue', 'conversion_rate', 'customer_acquisition_cost']
      });
      
      // Generate forecast based on historical data
      const forecastData = await analytics.generateForecast({
        baseData: metricsData,
        targetMetrics: ['revenue', 'conversion_rate'],
        additionalFactors: [
          'seasonality',
          'market_trends',
          '${requirements.substring(0, 20)}...'
        ]
      });
      
      setMetrics(metricsData);
      setForecast(forecastData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="dashboard-container">
      {/* Dashboard controls */}
      <div className="dashboard-controls">
        <select 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
        <button onClick={() => loadDashboardData()}>Refresh Data</button>
      </div>
      
      {isLoading ? (
        <div className="loading-indicator">Loading dashboard data...</div>
      ) : (
        <>
          {/* Charts Section */}
          <div className="charts-section">
            {/* Revenue Trend with Forecast */}
            <div className="chart-container">
              <h3>Revenue Trend & Forecast</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[...metrics, ...forecast]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    name="Historical Revenue" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue_forecast" 
                    stroke="#82ca9d" 
                    strokeDasharray="5 5" 
                    name="Forecasted Revenue" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}`;
      }
    }
    
    // Set the generated code snippet
    setGeneratedCode({
      snippet,
      language,
      description
    });
  };
  
  // Handle sending a chat message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'll help you with that. Based on your request about "${inputMessage}", I can provide additional information or adjust the template further.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1500);
  };
  
  // Copy the generated code
  const handleCopyCode = () => {
    if (generatedCode?.snippet) {
      navigator.clipboard.writeText(generatedCode.snippet);
      toast({
        title: "Code copied",
        description: "The code snippet has been copied to your clipboard."
      });
    }
  };
  
  // Download the generated code
  const handleDownloadCode = () => {
    if (generatedCode?.snippet) {
      const templateInfo = templateTypes.find(t => t.id === selectedTemplate);
      const fileName = `${templateInfo?.name.toLowerCase().replace(/\s+/g, '-')}-${industry.toLowerCase().replace(/\s+/g, '-')}.${generatedCode.language === 'javascript' ? 'js' : 'py'}`;
      
      const element = document.createElement('a');
      const file = new Blob([generatedCode.snippet], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Code downloaded",
        description: `File "${fileName}" has been downloaded.`
      });
    }
  };
  
  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customize">
            <Settings className="w-4 h-4 mr-2" />
            Customize Template
          </TabsTrigger>
          <TabsTrigger value="chat">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Assistant
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="customize" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Customization</CardTitle>
              <CardDescription>
                Configure your AI template parameters and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="template-type">Template Type</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateTypes.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center">
                          <span>{template.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {template.complexity}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  {templateTypes.find(t => t.id === selectedTemplate)?.description}
                </p>
              </div>
              
              {/* Industry Input */}
              <div className="space-y-2">
                <Label htmlFor="industry">Your Industry</Label>
                <Input 
                  id="industry" 
                  placeholder="e.g., Healthcare, Retail, Finance" 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              
              {/* Implementation Language */}
              <div className="space-y-2">
                <Label htmlFor="implementation-language">Implementation Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {implementationLanguages.map(lang => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Specific Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements">Specific Requirements</Label>
                <Textarea 
                  id="requirements" 
                  placeholder="Describe your specific needs, features, integrations, etc."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCustomizationSubmit}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Custom Template
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="chat" className="mt-4 space-y-4">
          {/* Chat Interface */}
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Template Assistant</CardTitle>
              <CardDescription>
                Chat with our AI to refine your template requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex flex-col">
                <ScrollArea className="flex-grow pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          {message.isLoading ? (
                            <div className="flex items-center space-x-2">
                              <AiTypingAnimation />
                              <span>Generating response...</span>
                            </div>
                          ) : (
                            <div>
                              <p>{message.content}</p>
                              {message.codeSnippet && (
                                <div className="mt-2 bg-background rounded p-2 text-sm">
                                  <code>{message.codeSnippet}</code>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Input Area */}
                <div className="mt-4 flex items-center space-x-2">
                  <Input 
                    placeholder="Type your message..." 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="flex-grow"
                  />
                  <Button 
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Generated Code */}
          {isGenerating && (
            <Card>
              <CardHeader>
                <CardTitle>Generating Your Custom Template</CardTitle>
                <CardDescription>
                  Our AI is processing your requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={generationProgress} className="h-2" />
                <p className="text-center mt-2 text-sm text-muted-foreground">
                  {Math.round(generationProgress)}% complete
                </p>
              </CardContent>
            </Card>
          )}
          
          {generatedCode && !isGenerating && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Generated Code
                </CardTitle>
                <CardDescription>
                  {generatedCode.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleCopyCode}
                      title="Copy code"
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleDownloadCode}
                      title="Download code"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-[300px] rounded-md border p-4 bg-muted font-mono">
                    <pre>
                      <code className={`language-${generatedCode.language}`}>
                        {generatedCode.snippet}
                      </code>
                    </pre>
                  </ScrollArea>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('customize')}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Customize Again
                </Button>
                <Button>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Implement Solution
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}