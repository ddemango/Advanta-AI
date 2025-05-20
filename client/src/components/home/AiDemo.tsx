import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { SectionDivider } from '@/components/ui/section-divider';

// Demo messages
const initialMessages = [
  {
    id: 1,
    type: 'ai',
    content: 'Hello! I\'m the Advanta AI assistant. I can help you explore our AI solutions, answer questions about our services, or help you determine which of our offerings might be right for your business. What would you like to know?'
  },
  {
    id: 2,
    type: 'user',
    content: 'What kinds of AI solutions do you offer for eCommerce businesses?'
  },
  {
    id: 3,
    type: 'ai',
    content: 'For eCommerce businesses, we offer several tailored AI solutions:',
    list: [
      'NeuroAds™ - Our AI marketing platform that optimizes ad spend, personalizes campaigns, and improves conversion rates',
      'Predictive inventory management that reduces stockouts and overstock situations',
      'Personalized recommendation engines that increase average order value',
      'Customer behavior analysis to identify patterns and trends'
    ],
    footer: 'Our clients in the eCommerce sector typically see a 25-40% increase in conversion rates and 15-30% higher average order values. Would you like to hear about a specific solution in more detail?'
  }
];

type Message = {
  id: number;
  type: 'ai' | 'user';
  content: string;
  list?: string[];
  footer?: string;
};

export default function AiDemo() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: `Thanks for your question about "${input}". This is a demo of our AI assistant. In a real implementation, this would be powered by our PromptCore™ technology with specific knowledge about our services and your business needs.`
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <section id="ai-demo" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">Try Our AI in Action</motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience a live demo of our conversational AI assistant that can answer questions about our services and help determine the right solution for your needs.
          </motion.p>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-background rounded-2xl overflow-hidden border border-border">
            <div className="border-b border-border p-4 flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-muted-foreground ml-2 text-sm">AI Assistant Demo (PromptCore™)</span>
            </div>
            
            <div className="p-6 space-y-4 h-[350px] overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start ${message.type === 'user' ? 'justify-end' : ''}`}>
                  {message.type === 'ai' && (
                    <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <i className="fas fa-robot text-white"></i>
                    </div>
                  )}
                  
                  <div className={`${
                    message.type === 'ai' 
                      ? 'bg-muted rounded-lg rounded-tl-none' 
                      : 'bg-primary/80 rounded-lg rounded-tr-none'
                  } p-4 max-w-[80%]`}>
                    <p className="text-white">{message.content}</p>
                    
                    {message.list && (
                      <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                        {message.list.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}
                    
                    {message.footer && (
                      <p className="text-white mt-2">{message.footer}</p>
                    )}
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="bg-muted h-8 w-8 rounded-lg flex items-center justify-center ml-3 flex-shrink-0">
                      <i className="fas fa-user text-white text-sm"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="border-t border-border p-4">
              <form onSubmit={handleSubmit} className="flex items-center">
                <Input
                  type="text"
                  placeholder="Ask anything about our AI services..."
                  className="bg-muted border border-border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 h-12 w-12 rounded-lg flex items-center justify-center ml-2 flex-shrink-0"
                >
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </form>
              <div className="text-xs text-gray-500 mt-2">
                This is a demonstration. For a full consultation, please contact our team.
              </div>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <i className="fas fa-code-branch text-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Custom Training</h3>
              <p className="text-muted-foreground">
                All of our AI solutions can be trained on your specific data and business requirements.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <i className="fas fa-plug text-accent text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Seamless Integration</h3>
              <p className="text-muted-foreground">
                Our systems integrate with your existing tech stack via standard APIs and connectors.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <i className="fas fa-shield-alt text-secondary text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground">
                All solutions comply with industry standards including SOC 2, GDPR, and CCPA.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
