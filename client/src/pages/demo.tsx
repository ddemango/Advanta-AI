import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { AIBrain } from '@/components/ui/ai-brain';
import { AiTypingAnimation } from '@/components/ui/ai-typing-animation';
import { useToast } from '@/hooks/use-toast';

// Helper function to generate unique IDs
const generateId = () => Math.floor(Math.random() * 1000000);

// Message type definitions
type MessageType = 'user' | 'ai' | 'system';

interface Message {
  id: number;
  type: MessageType;
  content: string;
  list?: string[];
  footer?: string;
  timestamp: Date;
}

// Pre-written AI responses
const aiResponses = [
  {
    trigger: ['hello', 'hi', 'hey', 'greetings'],
    response: "Hello! I'm the Advanta AI assistant. How can I help you today? I can answer questions about our AI services, provide information about implementation, or discuss potential solutions for your business."
  },
  {
    trigger: ['service', 'services', 'offer', 'provide'],
    response: "Here are the main AI services we offer at Advanta AI:",
    list: [
      "Custom Chatbot Development",
      "AI Consulting and Strategy",
      "Natural Language Processing Solutions",
      "Predictive Analytics Implementation",
      "Computer Vision Systems",
      "Voice & Speech Recognition",
      "AI Integration with Existing Systems"
    ],
    footer: "Would you like to know more about any specific service?"
  },
  {
    trigger: ['price', 'pricing', 'cost', 'expensive', 'package', 'subscription'],
    response: "Our pricing is customized based on your specific needs. We offer several tiers:",
    list: [
      "Starter: For small businesses just beginning with AI",
      "Professional: For growing companies needing more advanced AI capabilities",
      "Enterprise: Full-scale AI implementation with dedicated support",
      "Custom: Tailored solutions for unique requirements"
    ],
    footer: "For a detailed quote, I recommend using our AI ROI Calculator or speaking with our sales team."
  },
  {
    trigger: ['chatbot', 'bot', 'assistant'],
    response: "Our AI chatbots and virtual assistants are designed to enhance customer engagement and operational efficiency. They can be customized for:",
    list: [
      "Customer Support - 24/7 response to common questions",
      "Lead Generation - Qualifying prospects and scheduling appointments",
      "Internal Support - Helping employees with HR, IT, or knowledge management",
      "E-commerce - Assisting with product recommendations and purchasing"
    ],
    footer: "Each assistant is trained on your specific business data for accurate, relevant interactions."
  },
  {
    trigger: ['integration', 'integrate', 'connect', 'platform'],
    response: "We can integrate our AI solutions with most major platforms and systems:",
    list: [
      "CRM systems like Salesforce, HubSpot, and Microsoft Dynamics",
      "E-commerce platforms including Shopify, WooCommerce, and Magento",
      "Communication tools like Slack, Teams, and Zendesk",
      "Custom and legacy systems through our API"
    ],
    footer: "Our team handles the entire integration process to ensure seamless operation."
  },
  {
    trigger: ['implementation', 'timeline', 'deploy', 'setup'],
    response: "The implementation timeline varies based on project complexity, but here's our typical process:",
    list: [
      "Discovery & Planning: 1-2 weeks",
      "Development & Configuration: 2-6 weeks",
      "Testing & Training: 1-3 weeks",
      "Deployment: 1 week",
      "Ongoing Support & Optimization"
    ],
    footer: "We prioritize getting your solution running quickly while ensuring quality and performance."
  },
  {
    trigger: ['benefit', 'benefits', 'advantage', 'roi', 'return'],
    response: "Businesses implementing our AI solutions typically see multiple benefits:",
    list: [
      "30-50% reduction in customer support costs",
      "24/7 availability increasing customer satisfaction by ~40%",
      "15-25% increase in conversion rates for AI-assisted sales",
      "40-60% faster response times for customer inquiries",
      "Valuable insights from customer interaction data"
    ],
    footer: "Our AI ROI Calculator can provide estimates specific to your business model."
  }
];

// Default system messages
const systemMessages: Message[] = [
  {
    id: generateId(),
    type: 'system',
    content: 'Welcome to the Advanta AI Demo. Try asking about our services, pricing, or how AI can help your business.',
    timestamp: new Date()
  }
];

export default function Demo() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(systemMessages);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handle user input
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsThinking(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      respondToUser(input);
      setIsThinking(false);
    }, 1500);
  };
  
  // Generate AI response based on user input
  const respondToUser = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
    // Look for matching triggers in prepared responses
    const matchedResponse = aiResponses.find(item => 
      item.trigger.some(trigger => lowerInput.includes(trigger))
    );
    
    let aiResponse: Message;
    
    if (matchedResponse) {
      aiResponse = {
        id: generateId(),
        type: 'ai',
        content: matchedResponse.response,
        list: matchedResponse.list,
        footer: matchedResponse.footer,
        timestamp: new Date()
      };
    } else {
      // Generic response for non-matched inputs
      aiResponse = {
        id: generateId(),
        type: 'ai',
        content: "Thank you for your message. I'm still learning, but I'd be happy to connect you with one of our AI specialists who can provide more detailed information about how we can help with your specific needs. Would you like to see a demonstration of any particular AI capability?",
        timestamp: new Date()
      };
    }
    
    setMessages(prevMessages => [...prevMessages, aiResponse]);
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      <Helmet>
        <title>AI Assistant Demo | Advanta AI</title>
        <meta name="description" content="Try our AI assistant demo and experience the power of conversational AI. Ask questions, get information, and see how an AI solution could work for your business." />
      </Helmet>
      
      <NewHeader />
      
      <main className="py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="text-center mb-8"
          >
            <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              Interactive <span className="gradient-text">AI Assistant</span> Demo
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience our AI in action. Ask questions about our services, pricing, or how AI can benefit your business.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Chat Interface */}
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="show"
              className="lg:col-span-2"
            >
              <Card className="bg-muted border-border overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-background/50 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <i className="fas fa-robot text-primary"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">Advanta AI Assistant</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Online
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm">
                      <i className="fas fa-refresh"></i>
                    </Button>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] ${
                          message.type === 'system' 
                            ? 'bg-muted border border-border rounded-lg p-3 text-center text-sm text-muted-foreground w-full'
                            : message.type === 'user'
                              ? 'bg-primary text-white rounded-lg rounded-tr-none p-3'
                              : 'bg-background border border-border rounded-lg rounded-tl-none p-3'
                        }`}
                      >
                        {message.content}
                        
                        {/* Render list if available */}
                        {message.list && message.list.length > 0 && (
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            {message.list.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        )}
                        
                        {/* Render footer if available */}
                        {message.footer && (
                          <p className="mt-2 pt-2 border-t border-border/50 text-sm">
                            {message.footer}
                          </p>
                        )}
                        
                        <div className={`text-xs ${
                          message.type === 'user' 
                            ? 'text-primary-foreground/70 text-right' 
                            : 'text-muted-foreground'
                        } mt-1`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* AI Thinking animation */}
                  {isThinking && (
                    <div className="flex justify-start">
                      <div className="bg-background border border-border rounded-lg rounded-tl-none p-3">
                        <AiTypingAnimation />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Chat Input */}
                <div className="p-4 border-t border-border bg-background/50">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!input.trim() || isThinking}>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Send
                    </Button>
                  </form>
                </div>
              </Card>
              
              {/* Sample Questions */}
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Try asking:</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setInput("What services do you offer?");
                      setTimeout(() => {
                        const submitButton = document.querySelector('form button[type="submit"]');
                        if (submitButton instanceof HTMLButtonElement) {
                          submitButton.click();
                        }
                      }, 100);
                    }}
                  >
                    What services do you offer?
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setInput("Tell me about your pricing");
                      setTimeout(() => {
                        const submitButton = document.querySelector('form button[type="submit"]');
                        if (submitButton instanceof HTMLButtonElement) {
                          submitButton.click();
                        }
                      }, 100);
                    }}
                  >
                    Tell me about your pricing
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setInput("What's the implementation timeline?");
                      setTimeout(() => {
                        const submitButton = document.querySelector('form button[type="submit"]');
                        if (submitButton instanceof HTMLButtonElement) {
                          submitButton.click();
                        }
                      }, 100);
                    }}
                  >
                    What's the implementation timeline?
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setInput("What are the benefits of your AI solutions?");
                      setTimeout(() => {
                        const submitButton = document.querySelector('form button[type="submit"]');
                        if (submitButton instanceof HTMLButtonElement) {
                          submitButton.click();
                        }
                      }, 100);
                    }}
                  >
                    What are the benefits?
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Right Column - Info and Visualization */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {/* AI Visualization */}
              <Card className="bg-muted border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-bold">AI Visualization</h3>
                </div>
                <div className="p-4 flex justify-center bg-background/30">
                  <div className="w-full h-[200px] relative">
                    <AIBrain className="w-full h-full" />
                  </div>
                </div>
              </Card>
              
              {/* Key Features */}
              <Card className="bg-muted border-border">
                <div className="p-4 border-b border-border">
                  <h3 className="font-bold">Key Features</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center mr-3 mt-1">
                      <i className="fas fa-brain text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Natural Language Understanding</h4>
                      <p className="text-sm text-muted-foreground">Comprehends complex queries and context for natural conversations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-md bg-secondary/20 flex items-center justify-center mr-3 mt-1">
                      <i className="fas fa-robot text-secondary"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Custom Training</h4>
                      <p className="text-sm text-muted-foreground">Tailored to your business knowledge base and specific requirements</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-md bg-accent/20 flex items-center justify-center mr-3 mt-1">
                      <i className="fas fa-plug text-accent"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Seamless Integration</h4>
                      <p className="text-sm text-muted-foreground">Connects with your existing systems, apps, and databases</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center mr-3 mt-1">
                      <i className="fas fa-chart-line text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Analytics & Insights</h4>
                      <p className="text-sm text-muted-foreground">Provides actionable intelligence from user interactions</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* CTA */}
              <Card className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 border-primary/30">
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Ready to implement your own AI solution?</h3>
                  <p className="text-muted-foreground mb-4">Get a custom AI assistant tailored to your business needs</p>
                  <Button className="w-full">Start Building Your AI</Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}