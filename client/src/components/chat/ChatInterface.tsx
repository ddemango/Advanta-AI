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
      content: 'Hello! I\'m your AI consultant from Advanta AI. How can I help you today?',
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

      // Generate sample AI response based on user input
      let response = '';
      
      if (inputValue.toLowerCase().includes('pricing') || inputValue.toLowerCase().includes('cost')) {
        response = "Our pricing is tailored to your specific needs. We offer three tiers: Basic (starting at $499/mo), Standard ($999/mo), and Enterprise (custom pricing). Would you like to discuss which would be best for your requirements?";
      } else if (inputValue.toLowerCase().includes('demo') || inputValue.toLowerCase().includes('trial')) {
        response = "Yes! We offer a free demonstration of our AI capabilities. I can schedule one for you with our solutions team, or you can explore our sandbox environment immediately. What would you prefer?";
      } else if (inputValue.toLowerCase().includes('help') || inputValue.toLowerCase().includes('support')) {
        response = "I'm here to help! You can ask me about our AI solutions, industry templates, pricing, implementation timelines, or anything else. What specific information are you looking for?";
      } else if (inputValue.toLowerCase().includes('contact') || inputValue.toLowerCase().includes('sales')) {
        response = "I'd be happy to connect you with our team. Please provide your email and a brief description of your needs, and a consultant will reach out within 24 hours. Alternatively, you can call us at (555) 123-4567.";
      } else {
        response = "Thanks for your message! Based on what you're asking, I think our AI solutions could help streamline your operations and boost efficiency. Would you like to explore specific industry templates or discuss a custom solution?";
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