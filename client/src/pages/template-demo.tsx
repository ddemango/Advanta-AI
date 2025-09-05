import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Play, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Stethoscope, 
  Factory, 
  FileText, 
  Store, 
  GraduationCap, 
  Zap,
  CheckCircle,
  TrendingUp,
  Users,
  Brain
} from 'lucide-react';

interface TemplateDemo {
  id: string;
  name: string;
  description: string;
  price: number;
  monthlyPrice?: number;
  category: string;
  icon: React.ReactNode;
  demoType: 'chat' | 'analytics' | 'form' | 'dashboard' | 'video';
  features: string[];
  roiIncrease: string;
}

// Template definitions with interactive demos
const templateDemos: { [key: string]: TemplateDemo } = {
  'enterprise-customer-ai': {
    id: 'enterprise-customer-ai',
    name: 'Enterprise Customer AI Assistant',
    description: 'Fortune 500-grade AI that handles 85% of customer inquiries automatically.',
    price: 12999,
    monthlyPrice: 1299,
    category: 'Customer Support',
    icon: <MessageSquare className="w-6 h-6" />,
    demoType: 'chat',
    features: ['24/7 Intelligent Support', '15+ Languages', 'Live CRM Sync', 'Performance Dashboard'],
    roiIncrease: '340% ROI in 6 months'
  },
  'sales-intelligence-pro': {
    id: 'sales-intelligence-pro',
    name: 'AI Sales Intelligence Engine',
    description: 'Predictive sales AI that identifies high-value prospects and automates outreach.',
    price: 8999,
    monthlyPrice: 899,
    category: 'Sales & Marketing',
    icon: <TrendingUp className="w-6 h-6" />,
    demoType: 'dashboard',
    features: ['Lead Scoring AI', 'Automated Outreach', 'Deal Forecasting', 'Pipeline Management'],
    roiIncrease: '260% increase in qualified leads'
  },
  'financial-risk-analyzer': {
    id: 'financial-risk-analyzer',
    name: 'AI Financial Risk Analyzer',
    description: 'Enterprise-grade AI that monitors financial risks in real-time.',
    price: 24999,
    monthlyPrice: 2499,
    category: 'Finance & Risk',
    icon: <BarChart3 className="w-6 h-6" />,
    demoType: 'analytics',
    features: ['Real-time Risk Monitoring', 'Compliance Automation', 'Market Prediction'],
    roiIncrease: '450% reduction in compliance costs'
  },
  'cybersecurity-ai': {
    id: 'cybersecurity-ai',
    name: 'AI Cybersecurity Defense System',
    description: 'Advanced AI-powered security platform that detects threats in real-time.',
    price: 18999,
    monthlyPrice: 1899,
    category: 'Cybersecurity',
    icon: <Shield className="w-6 h-6" />,
    demoType: 'dashboard',
    features: ['Real-time Threat Detection', 'Automated Response', 'Compliance Monitoring'],
    roiIncrease: '400% reduction in security incidents'
  },
  'healthcare-diagnostic-ai': {
    id: 'healthcare-diagnostic-ai',
    name: 'AI Medical Diagnostic Assistant',
    description: 'FDA-compliant AI system that assists healthcare professionals with diagnosis.',
    price: 29999,
    monthlyPrice: 2999,
    category: 'Healthcare',
    icon: <Stethoscope className="w-6 h-6" />,
    demoType: 'form',
    features: ['Diagnostic Support', 'Treatment Recommendations', 'Patient Monitoring'],
    roiIncrease: '320% improvement in patient outcomes'
  },
  'manufacturing-optimization-ai': {
    id: 'manufacturing-optimization-ai',
    name: 'Smart Manufacturing AI Optimizer',
    description: 'Industrial AI system that optimizes production lines and predicts failures.',
    price: 22999,
    monthlyPrice: 2299,
    category: 'Manufacturing',
    icon: <Factory className="w-6 h-6" />,
    demoType: 'dashboard',
    features: ['Production Analytics', 'Predictive Maintenance', 'Quality Assurance AI'],
    roiIncrease: '350% increase in production efficiency'
  },
  'legal-contract-ai': {
    id: 'legal-contract-ai',
    name: 'AI Legal Contract Analyzer',
    description: 'Intelligent legal AI that reviews contracts and identifies risks.',
    price: 16999,
    monthlyPrice: 1699,
    category: 'Legal & Compliance',
    icon: <FileText className="w-6 h-6" />,
    demoType: 'form',
    features: ['Contract Review', 'Risk Identification', 'Compliance Checking'],
    roiIncrease: '250% faster legal processes'
  },
  'retail-personalization-ai': {
    id: 'retail-personalization-ai',
    name: 'AI Retail Personalization Engine',
    description: 'Advanced e-commerce AI that personalizes shopping experiences.',
    price: 9999,
    monthlyPrice: 999,
    category: 'Retail & E-commerce',
    icon: <Store className="w-6 h-6" />,
    demoType: 'video',
    features: ['Real-time Product Recommendations', 'Dynamic Pricing AI', 'Customer Journey Mapping', 'Behavioral Analytics', 'Inventory Optimization'],
    roiIncrease: '380% increase in customer lifetime value'
  },
  'education-learning-ai': {
    id: 'education-learning-ai',
    name: 'AI-Powered Learning Platform',
    description: 'Intelligent education AI that personalizes learning paths.',
    price: 7999,
    monthlyPrice: 799,
    category: 'Education & Training',
    icon: <GraduationCap className="w-6 h-6" />,
    demoType: 'chat',
    features: ['Adaptive Learning', 'Automated Tutoring', 'Progress Tracking'],
    roiIncrease: '240% improvement in learning outcomes'
  },
  'energy-optimization-ai': {
    id: 'energy-optimization-ai',
    name: 'Smart Energy Management AI',
    description: 'AI system that optimizes energy consumption and manages renewable sources.',
    price: 19999,
    monthlyPrice: 1999,
    category: 'Energy & Utilities',
    icon: <Zap className="w-6 h-6" />,
    demoType: 'analytics',
    features: ['Demand Forecasting', 'Grid Optimization', 'Renewable Integration'],
    roiIncrease: '300% improvement in energy efficiency'
  }
};

export default function TemplateDemo() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [templateId, setTemplateId] = useState<string>('');
  const [currentTemplate, setCurrentTemplate] = useState<TemplateDemo | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{id: number, type: 'user' | 'ai', content: string, timestamp: Date}>>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [formData, setFormData] = useState<{[key: string]: string}>({});
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [walkthrough, setWalkthrough] = useState({
    currentScene: 0,
    customerData: {
      name: 'Sarah Johnson',
      membership: 'Premium',
      intentScore: 15,
      confidence: 45,
      originalPrice: 1899,
      optimizedPrice: 1899,
      discount: 0,
      currentAction: 'Landing on site...'
    }
  });

  const walkthroughScenes = [
    {
      title: 'Customer Visits Store',
      description: 'Sarah Johnson, a premium member, visits TechMart looking for a gaming laptop',
      action: 'Landing on site...',
      intentScore: 15,
      confidence: 45,
      price: 1899,
      discount: 0,
      duration: 3000
    },
    {
      title: 'AI Analyzes Behavior',
      description: 'Our AI engine analyzes her browsing patterns, purchase history, and real-time behavior',
      action: 'AI analyzing browsing patterns...',
      intentScore: 67,
      confidence: 72,
      price: 1899,
      discount: 0,
      duration: 4000
    },
    {
      title: 'Intent Recognition',
      description: 'AI detects high purchase intent based on time spent on product pages and comparison behavior',
      action: 'High purchase intent detected',
      intentScore: 89,
      confidence: 84,
      price: 1899,
      discount: 0,
      duration: 3500
    },
    {
      title: 'Personalized Recommendations',
      description: 'Engine generates tailored product suggestions based on her gaming preferences and past purchases',
      action: 'Generating personalized recommendations...',
      intentScore: 92,
      confidence: 91,
      price: 1899,
      discount: 0,
      duration: 4500
    },
    {
      title: 'Dynamic Pricing Optimization',
      description: 'AI calculates optimal price point to maximize conversion while maintaining profitability',
      action: 'Optimizing price for conversion...',
      intentScore: 94,
      confidence: 96,
      price: 1649,
      discount: 13,
      duration: 4000
    },
    {
      title: 'Conversion Success',
      description: 'Personalized experience leads to successful purchase with 23.7% higher conversion rate',
      action: 'Purchase completed successfully!',
      intentScore: 98,
      confidence: 98,
      price: 1649,
      discount: 13,
      duration: 3000
    }
  ];

  useEffect(() => {
    // Get template ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template');
    if (template && templateDemos[template]) {
      setTemplateId(template);
      setCurrentTemplate(templateDemos[template]);
      initializeDemo(template);
    } else {
      // Default to customer service demo
      setTemplateId('enterprise-customer-ai');
      setCurrentTemplate(templateDemos['enterprise-customer-ai']);
      initializeDemo('enterprise-customer-ai');
    }
  }, []);

  // AI Retail Personalization Walkthrough
  useEffect(() => {
    if (templateId === 'retail-personalization-ai' && isPlaying) {
      const currentScene = walkthroughScenes[walkthrough.currentScene];
      
      const timer = setTimeout(() => {
        if (walkthrough.currentScene < walkthroughScenes.length - 1) {
          const nextScene = walkthroughScenes[walkthrough.currentScene + 1];
          setWalkthrough(prev => ({
            currentScene: prev.currentScene + 1,
            customerData: {
              ...prev.customerData,
              currentAction: nextScene.action,
              intentScore: nextScene.intentScore,
              confidence: nextScene.confidence,
              optimizedPrice: nextScene.price,
              discount: nextScene.discount
            }
          }));
        } else {
          // Restart the demo
          setWalkthrough(prev => ({
            currentScene: 0,
            customerData: {
              ...prev.customerData,
              currentAction: walkthroughScenes[0].action,
              intentScore: walkthroughScenes[0].intentScore,
              confidence: walkthroughScenes[0].confidence,
              optimizedPrice: walkthroughScenes[0].price,
              discount: walkthroughScenes[0].discount
            }
          }));
        }
      }, currentScene.duration);

      return () => clearTimeout(timer);
    }
  }, [templateId, isPlaying, walkthrough.currentScene]);

  const startWalkthrough = () => {
    setIsPlaying(true);
    setWalkthrough(prev => ({
      currentScene: 0,
      customerData: {
        ...prev.customerData,
        currentAction: walkthroughScenes[0].action,
        intentScore: walkthroughScenes[0].intentScore,
        confidence: walkthroughScenes[0].confidence,
        optimizedPrice: walkthroughScenes[0].price,
        discount: walkthroughScenes[0].discount
      }
    }));
  };

  const initializeDemo = (template: string) => {
    const demo = templateDemos[template];
    if (demo.demoType === 'chat') {
      setChatMessages([{
        id: 1,
        type: 'ai',
        content: `Hello! I'm the ${demo.name}. I'm here to demonstrate how I can help your business. Try asking me about customer support, product information, or any business-related questions!`,
        timestamp: new Date()
      }]);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: userInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userInput, currentTemplate?.category || '');
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string, category: string): string => {
    const responses = {
      'Customer Support': [
        "I understand you're looking for help with customer support. Based on our analysis, I can help automate 85% of your customer inquiries, reducing response time from hours to seconds.",
        "That's a great question! Our AI system can handle complex customer issues including billing, technical support, and product recommendations. Would you like to see how I integrate with your existing CRM?",
        "I can process customer requests in 15+ languages and escalate complex issues to human agents seamlessly. This typically reduces support costs by 60% while improving customer satisfaction."
      ],
      'Sales & Marketing': [
        "Based on the sales data patterns I analyze, I can identify your highest-value prospects and automate personalized outreach. This typically increases qualified leads by 260%.",
        "I use predictive analytics to score leads and forecast deal outcomes. Companies using our system see 40% faster sales cycles and 35% higher close rates.",
        "Let me show you how I analyze customer behavior to optimize your sales funnel. I can predict which prospects are most likely to convert and when to follow up."
      ],
      'Finance & Risk': [
        "I monitor financial risks in real-time using advanced algorithms. I can detect anomalies, predict market trends, and ensure regulatory compliance automatically.",
        "Based on current market conditions, I'm analyzing potential risk factors and can provide automated compliance reporting. This reduces manual review time by 80%.",
        "I integrate with your existing financial systems to provide real-time risk assessment and regulatory monitoring, ensuring you stay compliant across all jurisdictions."
      ],
      'Healthcare': [
        "I assist healthcare professionals with diagnostic support while maintaining HIPAA compliance. I can analyze patient symptoms and suggest potential diagnoses for review.",
        "My medical AI analyzes patient data to identify patterns and provide treatment recommendations. This improves diagnostic accuracy by 40% when used as a decision support tool.",
        "I integrate with Electronic Health Records to provide real-time patient monitoring and alert healthcare providers to potential complications or medication interactions."
      ]
    };

    const categoryResponses = responses[category as keyof typeof responses] || responses['Customer Support'];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTyping(true);
    
    setTimeout(() => {
      setAnalysisResults({
        riskScore: Math.floor(Math.random() * 30) + 20,
        recommendations: [
          'Low risk profile detected',
          'Compliance status: Excellent',
          'Recommended action: Continue monitoring'
        ],
        confidence: Math.floor(Math.random() * 20) + 80
      });
      setIsTyping(false);
    }, 2000);
  };

  const handlePurchase = () => {
    if (!currentTemplate) return;
    
    toast({
      title: "Purchase Initiated",
      description: `Starting purchase process for ${currentTemplate.name}. Our sales team will contact you within 24 hours.`,
    });
    
    // In the future, this will redirect to Stripe checkout
    console.log('Purchase initiated for:', currentTemplate.name);
  };

  const renderDemoContent = () => {
    if (!currentTemplate) return null;

    switch (currentTemplate.demoType) {
      case 'chat':
        return (
          <div className="h-96 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background rounded-lg border">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-muted text-foreground'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleChatSubmit} className="flex gap-2 mt-4">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" disabled={isTyping}>
                Send
              </Button>
            </form>
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-2xl font-bold text-primary">94.7%</div>
                <div className="text-sm text-muted-foreground">System Efficiency</div>
                <Progress value={95} className="mt-2" />
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-green-500">+340%</div>
                <div className="text-sm text-muted-foreground">ROI Increase</div>
                <Progress value={85} className="mt-2" />
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-blue-500">2.3s</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
                <Progress value={92} className="mt-2" />
              </Card>
            </div>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Real-time Analytics Dashboard</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Active Processes</span>
                  <Badge className="bg-green-500">127 Running</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Success Rate</span>
                  <Badge className="bg-blue-500">98.3%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cost Savings</span>
                  <Badge className="bg-purple-500">$47,200/month</Badge>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'form':
        return (
          <div className="space-y-6">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {currentTemplate.category === 'Healthcare' ? 'Patient Symptoms' : 'Document Text'}
                </label>
                <Textarea
                  placeholder={
                    currentTemplate.category === 'Healthcare' 
                      ? 'Enter patient symptoms for AI analysis...'
                      : 'Paste contract text or legal document for analysis...'
                  }
                  value={formData.input || ''}
                  onChange={(e) => setFormData({...formData, input: e.target.value})}
                  className="h-32"
                />
              </div>
              
              <Button type="submit" disabled={isTyping} className="w-full">
                {isTyping ? 'Analyzing...' : 'Analyze with AI'}
              </Button>
            </form>

            {analysisResults && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">AI Analysis Results</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Confidence Score</span>
                    <Badge className="bg-green-500">{analysisResults.confidence}%</Badge>
                  </div>
                  <div>
                    <span className="font-medium">Recommendations:</span>
                    <ul className="mt-2 space-y-1">
                      {analysisResults.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="text-xl font-bold text-red-500">Low Risk</div>
                <div className="text-sm text-muted-foreground">Current Status</div>
                <Progress value={25} className="mt-2" />
              </Card>
              <Card className="p-4">
                <div className="text-xl font-bold text-green-500">Compliant</div>
                <div className="text-sm text-muted-foreground">Regulatory Status</div>
                <Progress value={98} className="mt-2" />
              </Card>
            </div>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Live Monitoring Feed</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Market volatility detected</span>
                  <Badge variant="outline">2 min ago</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Compliance check passed</span>
                  <Badge className="bg-green-500">5 min ago</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Risk threshold updated</span>
                  <Badge variant="outline">8 min ago</Badge>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-6">
            {/* AI Retail Personalization Walkthrough Video */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden h-80">
              {/* Video Controls */}
              <div className="absolute top-4 right-4 z-10">
                {!isPlaying ? (
                  <button
                    onClick={startWalkthrough}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm"
                  >
                    <Play className="w-4 h-4" />
                    Start Demo
                  </button>
                ) : (
                  <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    Recording
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-700">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: `${((walkthrough.currentScene + 1) / walkthroughScenes.length) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Main Demo Interface */}
              <div className="h-full p-6 text-white pt-12">
                {/* Scene Title */}
                <motion.div
                  key={walkthrough.currentScene}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  <h3 className="text-lg font-semibold text-blue-400">
                    Step {walkthrough.currentScene + 1}: {walkthroughScenes[walkthrough.currentScene]?.title}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {walkthroughScenes[walkthrough.currentScene]?.description}
                  </p>
                </motion.div>

                {/* Live AI Engine Interface */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <motion.div 
                    key={`profile-${walkthrough.currentScene}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-800/50 rounded-lg p-4"
                  >
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Customer Profile</h4>
                    <div className="space-y-1 text-xs">
                      <div>{walkthrough.customerData.name} • {walkthrough.customerData.membership} Member</div>
                      <div>Previous: 3 laptops, 5 accessories</div>
                      <div className="text-orange-400">{walkthrough.customerData.currentAction}</div>
                      <motion.div 
                        key={walkthrough.customerData.intentScore}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-green-400"
                      >
                        Intent Score: {walkthrough.customerData.intentScore}%
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    key={`analysis-${walkthrough.currentScene}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-800/50 rounded-lg p-4"
                  >
                    <h4 className="text-sm font-semibold text-purple-400 mb-2">AI Analysis</h4>
                    <div className="space-y-1 text-xs">
                      <div>• Gaming Laptop RTX 4080</div>
                      <div>• Wireless Gaming Mouse</div>
                      <div>• Extended Warranty (+$199)</div>
                      <motion.div 
                        key={walkthrough.customerData.confidence}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-purple-400"
                      >
                        Confidence: {walkthrough.customerData.confidence}%
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Dynamic Pricing */}
                <motion.div 
                  key={`pricing-${walkthrough.customerData.optimizedPrice}`}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-orange-400">Dynamic Pricing Engine</div>
                      <div className="text-xs text-gray-300">Real-time optimization</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white line-through opacity-50">
                        ${walkthrough.customerData.originalPrice}
                      </div>
                      <motion.div 
                        key={walkthrough.customerData.optimizedPrice}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-xl font-bold text-green-400"
                      >
                        ${walkthrough.customerData.optimizedPrice}
                      </motion.div>
                      {walkthrough.customerData.discount > 0 && (
                        <div className="text-xs text-green-400">
                          {walkthrough.customerData.discount}% AI discount
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Video Overlay with Demo Controls */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center space-x-2 text-white text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Live AI Engine Demo</span>
                </div>
              </div>
              
              {/* Live Metrics Overlay */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Recommendations Generated:</span>
                    <span className="text-green-400 font-mono">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate:</span>
                    <span className="text-blue-400 font-mono">+23.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Impact:</span>
                    <span className="text-purple-400 font-mono">$47,892</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Features Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-center mb-2">
                  <Brain className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="font-semibold text-sm">Smart Recommendations</span>
                </div>
                <p className="text-xs text-muted-foreground">AI analyzes customer behavior to suggest personalized products in real-time</p>
                <div className="mt-2 text-xs">
                  <span className="text-green-600">+380% engagement</span>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-purple-500">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                  <span className="font-semibold text-sm">Dynamic Pricing</span>
                </div>
                <p className="text-xs text-muted-foreground">Automatically adjusts prices based on demand, inventory, and customer segments</p>
                <div className="mt-2 text-xs">
                  <span className="text-green-600">+42% profit margin</span>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-green-500">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-green-500 mr-2" />
                  <span className="font-semibold text-sm">Journey Mapping</span>
                </div>
                <p className="text-xs text-muted-foreground">Tracks customer paths and optimizes touchpoints for maximum conversion</p>
                <div className="mt-2 text-xs">
                  <span className="text-green-600">+67% retention</span>
                </div>
              </Card>
            </div>

            {/* Interactive Demo Scenarios */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Watch AI in Action</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <span className="text-sm">Customer browses electronics</span>
                  </div>
                  <Badge className="bg-blue-500">AI Analyzing</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <span className="text-sm">AI generates personalized recommendations</span>
                  </div>
                  <Badge className="bg-purple-500">Processing</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <span className="text-sm">Dynamic pricing optimizes offer</span>
                  </div>
                  <Badge className="bg-green-500">Optimized</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <span className="text-sm">Conversion rate increases by 23.7%</span>
                  </div>
                  <Badge className="bg-orange-500">Success!</Badge>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentTemplate) {
    return (
      <>
        <NewHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Template Not Found</h1>
            <Button onClick={() => setLocation('/marketplace')}>
              Back to Marketplace
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{currentTemplate.name} - Live Demo | Advanta AI</title>
        <meta name="description" content={`Interactive demo of ${currentTemplate.name}. Try before you buy!`} />
      </Helmet>
      
      <NewHeader />
      
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                {currentTemplate.icon}
                <h1 className="text-3xl md:text-4xl font-bold ml-3">
                  {currentTemplate.name}
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                {currentTemplate.description}
              </p>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    ${currentTemplate.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">One-time</div>
                </div>
                {currentTemplate.monthlyPrice && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      ${currentTemplate.monthlyPrice}/mo
                    </div>
                    <div className="text-sm text-muted-foreground">Monthly</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-lg font-bold text-green-500">
                    {currentTemplate.roiIncrease}
                  </div>
                  <div className="text-sm text-muted-foreground">Expected ROI</div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Demo Area */}
              <motion.div variants={fadeInUp} className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Interactive Demo</h2>
                    <Badge className="bg-green-500">
                      <Play className="w-3 h-3 mr-1" />
                      Live Demo
                    </Badge>
                  </div>
                  {renderDemoContent()}
                </Card>
              </motion.div>

              {/* Sidebar */}
              <motion.div variants={fadeInUp} className="space-y-6">
                {/* Features */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {currentTemplate.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Purchase Options */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Get Started Today</h3>
                  <div className="space-y-4">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handlePurchase}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Purchase Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setLocation('/contact')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Schedule Demo Call
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setLocation('/marketplace')}
                    >
                      Back to Marketplace
                    </Button>
                  </div>
                </Card>

                {/* Demo Instructions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Demo Instructions</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    {currentTemplate.demoType === 'chat' && (
                      <>
                        <p>• Try asking about customer support scenarios</p>
                        <p>• Test different types of inquiries</p>
                        <p>• See how the AI handles complex requests</p>
                      </>
                    )}
                    {currentTemplate.demoType === 'dashboard' && (
                      <>
                        <p>• View real-time analytics and metrics</p>
                        <p>• Explore performance indicators</p>
                        <p>• See live data processing capabilities</p>
                      </>
                    )}
                    {currentTemplate.demoType === 'form' && (
                      <>
                        <p>• Enter sample data for analysis</p>
                        <p>• See AI processing in real-time</p>
                        <p>• Review detailed recommendations</p>
                      </>
                    )}
                    {currentTemplate.demoType === 'analytics' && (
                      <>
                        <p>• Monitor live risk assessments</p>
                        <p>• View compliance status updates</p>
                        <p>• Track real-time notifications</p>
                      </>
                    )}
                    {currentTemplate.demoType === 'video' && (
                      <>
                        <p>• Click "Start Demo" to begin walkthrough</p>
                        <p>• Watch AI engine analyze customer behavior</p>
                        <p>• See real-time pricing optimization</p>
                        <p>• View complete customer journey</p>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}