import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Loader2,
  Settings,
  Play,
  Save,
  Minimize2,
  Maximize2
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  workflowSuggestion?: {
    title: string;
    steps: string[];
    type: string;
  };
}

interface ChatbotWorkflowBuilderProps {
  onWorkflowCreate?: (workflow: any) => void;
}

export default function ChatbotWorkflowBuilder({ onWorkflowCreate }: ChatbotWorkflowBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI workflow assistant. I can help you create automations, GPTs, and integrations using natural language. Try asking me to 'Create a GPT that summarizes daily emails' or 'Build a Slack bot for weekly reports'.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const processUserMessage = async (userInput: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple NLP-like processing to generate workflow suggestions
    const botResponse = generateBotResponse(userInput);
    
    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const generateBotResponse = (input: string): Message => {
    const lowerInput = input.toLowerCase();
    
    // Email summarization workflow
    if (lowerInput.includes('email') && (lowerInput.includes('summar') || lowerInput.includes('digest'))) {
      return {
        id: Date.now().toString(),
        content: "I'll create an email summarization workflow for you! This will analyze your emails and create concise summaries.",
        sender: 'bot',
        timestamp: new Date(),
        workflowSuggestion: {
          title: "Email Summarization GPT",
          steps: [
            "Connect to email provider (Gmail, Outlook)",
            "Filter emails by date range and importance",
            "Use GPT-4 to generate summaries",
            "Send digest to your preferred channel"
          ],
          type: "Email Automation"
        }
      };
    }

    // LinkedIn post creation
    if (lowerInput.includes('linkedin') && (lowerInput.includes('post') || lowerInput.includes('content'))) {
      return {
        id: Date.now().toString(),
        content: "Perfect! I'll set up a LinkedIn content creator that transforms your meeting notes into engaging posts.",
        sender: 'bot',
        timestamp: new Date(),
        workflowSuggestion: {
          title: "LinkedIn Post Generator",
          steps: [
            "Upload or sync meeting notes",
            "Extract key insights and achievements",
            "Generate LinkedIn-optimized content",
            "Schedule posts for optimal engagement"
          ],
          type: "Content Generation"
        }
      };
    }

    // Slack bot creation
    if (lowerInput.includes('slack') && (lowerInput.includes('bot') || lowerInput.includes('report'))) {
      return {
        id: Date.now().toString(),
        content: "Excellent! I'll create a Slack bot that generates and sends AI-powered reports automatically.",
        sender: 'bot',
        timestamp: new Date(),
        workflowSuggestion: {
          title: "Slack Reporting Bot",
          steps: [
            "Connect to Slack workspace",
            "Set up data sources and metrics",
            "Configure AI report generation",
            "Schedule automated delivery"
          ],
          type: "Integration Bot"
        }
      };
    }

    // CRM automation
    if (lowerInput.includes('crm') || lowerInput.includes('follow') || lowerInput.includes('customer')) {
      return {
        id: Date.now().toString(),
        content: "Great idea! I'll build a CRM automation that sends personalized follow-up emails using GPT.",
        sender: 'bot',
        timestamp: new Date(),
        workflowSuggestion: {
          title: "CRM Follow-up Automation",
          steps: [
            "Connect to CRM system (Salesforce, HubSpot)",
            "Identify follow-up opportunities",
            "Generate personalized email content",
            "Send and track engagement"
          ],
          type: "CRM Automation"
        }
      };
    }

    // Generic response for other inputs
    return {
      id: Date.now().toString(),
      content: "I understand you want to create an automation! Could you provide more details? For example, try: 'Create a workflow that monitors my social media mentions' or 'Build a GPT that writes marketing copy from product descriptions'.",
      sender: 'bot',
      timestamp: new Date()
    };
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    await processUserMessage(currentMessage);
    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const createWorkflow = (suggestion: any) => {
    if (onWorkflowCreate) {
      onWorkflowCreate({
        title: suggestion.title,
        steps: suggestion.steps,
        type: suggestion.type,
        created: new Date()
      });
    }
  };

  const quickPrompts = [
    "Create a content calendar GPT",
    "Automate invoice processing",
    "Build a customer support bot",
    "Generate social media posts"
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <div className={`fixed ${isMinimized ? 'bottom-6 right-6' : 'bottom-0 right-0 top-0'} z-50 ${
      isMinimized ? 'w-80 h-16' : 'w-full md:w-96 md:right-4 md:top-4 md:bottom-4'
    } transition-all duration-300`}>
      <Card className={`h-full flex flex-col ${isMinimized ? 'h-16' : ''} shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <span className="font-semibold">AI Workflow Builder</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto max-h-96">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    } rounded-lg p-3`}>
                      <div className="flex items-start gap-2">
                        {message.sender === 'bot' && <Bot className="w-4 h-4 mt-0.5 text-blue-600" />}
                        {message.sender === 'user' && <User className="w-4 h-4 mt-0.5" />}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          {message.workflowSuggestion && (
                            <div className="mt-3 p-3 bg-white/10 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-sm">{message.workflowSuggestion.title}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {message.workflowSuggestion.type}
                                </Badge>
                              </div>
                              <ul className="text-xs space-y-1 mb-3">
                                {message.workflowSuggestion.steps.map((step, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-300">{index + 1}.</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => createWorkflow(message.workflowSuggestion)}
                                  className="text-xs"
                                >
                                  <Save className="w-3 h-3 mr-1" />
                                  Create Workflow
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs">
                                  <Settings className="w-3 h-3 mr-1" />
                                  Customize
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        <span className="text-sm text-gray-500">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="p-4 border-t bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">Quick prompts:</p>
              <div className="flex flex-wrap gap-1">
                {quickPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => setCurrentMessage(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe the automation you want to create..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}