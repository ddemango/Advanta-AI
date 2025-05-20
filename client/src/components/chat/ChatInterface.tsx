import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AiTypingAnimation } from '@/components/ui/ai-typing-animation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Maximize2, Minimize2, X, Bot, Paperclip, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Message type definition
export type MessageType = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onToggle: () => void;
  minimized: boolean;
  onMinimize: () => void;
}

export function ChatInterface({ isOpen, onToggle, minimized, onMinimize }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your Virtual AI Consultant from Advanta AI. I can help with AI solution recommendations, ROI calculations, implementation timelines, and technical guidance. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Advanced response generation with more intelligence and domain knowledge
      let response = '';
      const userMessageLower = inputValue.toLowerCase();
      
      // Pricing and ROI questions
      if (userMessageLower.includes('pricing') || userMessageLower.includes('cost') || userMessageLower.includes('price')) {
        response = "Our pricing is tailored to your specific needs and projected ROI. We offer three tiers:\n\n• Basic ($499/mo): AI-powered analytics and one custom automation\n• Standard ($999/mo): Advanced AI solutions with 3 custom integrations\n• Enterprise (custom pricing): Full suite with unlimited AI capabilities\n\nWould you like me to estimate which would deliver the best ROI for your business?";
      } 
      // Implementation and technical questions
      else if (userMessageLower.includes('implementation') || userMessageLower.includes('setup') || userMessageLower.includes('deploy')) {
        response = "Our implementation process is designed for speed and efficiency. Most solutions are deployed within 14-30 days following our methodology:\n\n1. Strategic discovery session (2-3 days)\n2. AI solution customization (7-14 days)\n3. Integration with your systems (3-7 days)\n4. Testing and optimization (2-5 days)\n\nWould you like to see our implementation timeline for your specific industry?";
      } 
      // Demo and trial requests
      else if (userMessageLower.includes('demo') || userMessageLower.includes('trial') || userMessageLower.includes('try')) {
        response = "Absolutely! We offer a fully interactive demonstration of our AI capabilities. You have two options:\n\n1. Schedule a personalized demo with our solutions team who can tailor the experience to your industry\n2. Explore our AI Sandbox right now where you can test our technology with your own scenarios\n\nWhich would you prefer?";
      } 
      // Industry-specific questions
      else if (userMessageLower.includes('industry') || userMessageLower.includes('template') || userMessageLower.includes('solution')) {
        response = "We offer specialized AI solutions for several industries including:\n\n• Finance: Fraud detection, algorithmic trading, risk assessment\n• Healthcare: Patient outcome prediction, medical imaging analysis\n• Retail: Inventory optimization, personalized recommendations\n• Manufacturing: Predictive maintenance, quality control\n• Legal: Document analysis, case outcome prediction\n\nWhich industry are you in? I can provide specific examples of how our AI has delivered measurable results.";
      }
      // Integration questions
      else if (userMessageLower.includes('integrate') || userMessageLower.includes('connect') || userMessageLower.includes('api')) {
        response = "Our platform features robust API capabilities and pre-built integrations with most enterprise systems. We support:\n\n• CRM systems (Salesforce, HubSpot, Microsoft Dynamics)\n• ERP solutions (SAP, Oracle, NetSuite)\n• Marketing platforms (Marketo, Mailchimp, HubSpot)\n• Custom systems via our REST/GraphQL APIs\n\nDo you have specific systems you'd like to integrate with?";
      }
      // Help and support requests
      else if (userMessageLower.includes('help') || userMessageLower.includes('support') || userMessageLower.includes('assistance')) {
        response = "I'm your AI consultant and can help with:\n\n• AI solution recommendations tailored to your business\n• ROI projections and cost-benefit analysis\n• Implementation timelines and technical requirements\n• Integration capabilities with your existing systems\n• Industry-specific use cases and success stories\n\nWhat specific aspect would you like to explore first?";
      } 
      // Contact and sales inquiries
      else if (userMessageLower.includes('contact') || userMessageLower.includes('sales') || userMessageLower.includes('consultant')) {
        response = "I'd be happy to connect you with our team of AI specialists. You have several options:\n\n• Provide your email and I'll have a consultant reach out within 24 hours\n• Schedule a call directly through our calendar: calendly.com/advanta-ai\n• Call our solutions team: (555) 123-4567\n• Email: solutions@advanta-ai.com\n\nWhat's your preferred contact method?";
      }
      // Technical capabilities questions
      else if (userMessageLower.includes('technology') || userMessageLower.includes('tech stack') || userMessageLower.includes('machine learning')) {
        response = "Our technology stack leverages state-of-the-art AI/ML capabilities including:\n\n• Large Language Models for natural language understanding\n• Computer vision systems for image/video analysis\n• Predictive analytics using proprietary algorithms\n• Neural networks for pattern recognition\n• Reinforcement learning for optimization tasks\n\nAll solutions run on our secure, scalable cloud infrastructure with 99.9% uptime guarantee. Would you like more details on a specific technology?";
      }
      // Security and compliance questions
      else if (userMessageLower.includes('security') || userMessageLower.includes('compliance') || userMessageLower.includes('data')) {
        response = "Security and compliance are foundational to our platform. We maintain:\n\n• SOC 2 Type II certification\n• GDPR and CCPA compliance\n• HIPAA compliance for healthcare solutions\n• End-to-end encryption for all data\n• Regular penetration testing and security audits\n\nOur data processing agreements ensure you maintain ownership and control of your data at all times. Would you like our detailed security whitepaper?";
      }
      // Greeting or introduction
      else if (userMessageLower.includes('hello') || userMessageLower.includes('hi') || userMessageLower.includes('hey') || userMessageLower.includes('greetings')) {
        response = "Hello! I'm your Virtual AI Consultant from Advanta AI. I'm here to help you discover how our AI solutions can transform your business operations, boost efficiency, and drive growth. What brings you here today?";
      }
      // Default response for other queries
      else {
        response = "Thanks for your message! Based on what you're asking, I believe our AI solutions could help streamline your operations and boost efficiency. To provide the most relevant information, could you share:\n\n1. Your industry or business type\n2. The specific challenges you're looking to address\n3. Any current systems you'd want to integrate with\n\nThis will help me tailor my recommendations to your specific needs.";
      }

      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          height: minimized ? '60px' : '500px',
        }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-4 right-4 w-80 sm:w-96 bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 flex flex-col"
        style={{ 
          backdropFilter: 'blur(16px)', 
          backgroundColor: 'rgba(0, 0, 0, 0.75)' 
        }}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-primary/90 to-primary/75 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-primary-foreground">
              <AvatarFallback className="bg-primary-foreground text-primary">
                <Bot size={16} />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white text-sm">AI Consultant</h3>
              {!minimized && <p className="text-xs text-white/80">Advanta AI</p>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10"
              onClick={onMinimize}
            >
              {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10"
              onClick={onToggle}
            >
              <X size={14} />
            </Button>
          </div>
        </div>
        
        {!minimized && (
          <>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-xl p-3 
                    ${message.type === 'user' 
                      ? 'bg-primary text-white ml-4 rounded-tr-none' 
                      : 'bg-muted ml-0 rounded-tl-none'}`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block text-right">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-xl p-3 bg-muted">
                    <AiTypingAnimation className="h-5" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full flex-shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <Paperclip size={16} />
                </Button>
                <div className="relative flex-1">
                  <Input
                    className="pr-10 py-2 bg-muted border-muted"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 absolute right-1 top-1/2 -translate-y-1/2 rounded-full flex-shrink-0 text-muted-foreground hover:text-primary"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}