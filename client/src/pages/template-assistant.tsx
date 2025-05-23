import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { 
  Bot, 
  Sparkles, 
  Settings, 
  Download, 
  Code, 
  Zap,
  Target,
  Brain,
  Wrench,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  Lightbulb
} from "lucide-react";

interface CustomizationRequest {
  projectName: string;
  industry: string;
  useCase: string;
  requirements: string;
  technicalLevel: string;
  timeline: string;
  budget: string;
}

interface AIRecommendation {
  template: string;
  confidence: number;
  customizations: string[];
  estimatedTime: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  features: string[];
}

export default function TemplateAssistant() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CustomizationRequest>({
    projectName: '',
    industry: '',
    useCase: '',
    requirements: '',
    technicalLevel: '',
    timeline: '',
    budget: ''
  });

  const [chatMessages, setChatMessages] = useState([
    {
      type: 'ai',
      content: "Hi! I'm your AI Template Customization Assistant. I'll help you find and customize the perfect AI template for your project. Let's start by understanding your needs!"
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const industries = [
    'E-commerce', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Real Estate', 'Marketing', 'Legal', 'Retail', 'Technology', 'Other'
  ];

  const useCases = [
    'Customer Support Chatbot', 'Sales Assistant', 'Content Generation',
    'Data Analysis', 'Process Automation', 'Recommendation Engine',
    'Document Processing', 'Sentiment Analysis', 'Predictive Analytics',
    'Image Recognition', 'Voice Assistant', 'Custom AI Solution'
  ];

  const handleInputChange = (field: keyof CustomizationRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const analyzeRequirements = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockRecommendations: AIRecommendation[] = [
      {
        template: 'Advanced Customer Support Bot',
        confidence: 94,
        customizations: [
          'Industry-specific knowledge base integration',
          'Multi-language support for global customers',
          'CRM system integration',
          'Advanced sentiment analysis',
          'Escalation workflow customization'
        ],
        estimatedTime: '2-3 weeks',
        complexity: 'Intermediate',
        features: ['Natural Language Processing', 'Intent Recognition', 'Context Awareness', 'Analytics Dashboard']
      },
      {
        template: 'E-commerce Sales Assistant',
        confidence: 87,
        customizations: [
          'Product catalog integration',
          'Personalized recommendations',
          'Order tracking capabilities',
          'Payment processing integration',
          'Customer behavior analytics'
        ],
        estimatedTime: '3-4 weeks',
        complexity: 'Advanced',
        features: ['Product Search', 'Recommendation Engine', 'Cart Management', 'User Profiling']
      },
      {
        template: 'Basic Customer Service Bot',
        confidence: 76,
        customizations: [
          'FAQ database setup',
          'Basic response templates',
          'Contact form integration',
          'Simple analytics dashboard'
        ],
        estimatedTime: '1-2 weeks',
        complexity: 'Beginner',
        features: ['FAQ Responses', 'Contact Routing', 'Basic Analytics']
      }
    ];
    
    setRecommendations(mockRecommendations);
    setIsAnalyzing(false);
    setStep(2);
    
    toast({
      title: "Analysis Complete!",
      description: "I've found 3 templates that match your requirements.",
    });
  };

  const selectTemplate = (template: string) => {
    setSelectedTemplate(template);
    setStep(3);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, 
      { type: 'user', content: chatInput },
      { 
        type: 'ai', 
        content: "That's a great question! Based on your requirements, I recommend focusing on the advanced features like multi-language support and CRM integration. Would you like me to provide more details about implementing these features?"
      }
    ]);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-center mb-4">
            <Bot className="h-12 w-12 text-primary mr-3" />
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4">
            AI Template <span className="text-primary">Customization Assistant</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Let our AI help you find and customize the perfect template for your project. 
            Get personalized recommendations and implementation guidance.
          </motion.p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div 
          className="flex justify-center mb-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <div className={`h-1 w-12 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
            <div className={`h-1 w-12 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              3
            </div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Step 1: Requirements Gathering */}
          {step === 1 && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center">
                    <Target className="h-6 w-6 mr-2 text-primary" />
                    Tell Us About Your Project
                  </CardTitle>
                  <CardDescription>
                    The more details you provide, the better our AI can customize your template
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        placeholder="e.g., Customer Support Enhancement"
                        value={formData.projectName}
                        onChange={(e) => handleInputChange('projectName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="useCase">Primary Use Case</Label>
                      <Select onValueChange={(value) => handleInputChange('useCase', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="What do you want to build?" />
                        </SelectTrigger>
                        <SelectContent>
                          {useCases.map((useCase) => (
                            <SelectItem key={useCase} value={useCase}>
                              {useCase}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="technicalLevel">Technical Expertise</Label>
                      <Select onValueChange={(value) => handleInputChange('technicalLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Your technical level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner - I need guidance</SelectItem>
                          <SelectItem value="intermediate">Intermediate - I have some experience</SelectItem>
                          <SelectItem value="advanced">Advanced - I can handle complex setups</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Project Timeline</Label>
                      <Select onValueChange={(value) => handleInputChange('timeline', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="When do you need this?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">ASAP - Within 1 week</SelectItem>
                          <SelectItem value="month">Within 1 month</SelectItem>
                          <SelectItem value="quarter">Within 3 months</SelectItem>
                          <SelectItem value="flexible">Flexible timeline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select onValueChange={(value) => handleInputChange('budget', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-5k">Under $5,000</SelectItem>
                          <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                          <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                          <SelectItem value="over-50k">Over $50,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Detailed Requirements</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Describe your specific requirements, features needed, integration requirements, etc."
                      rows={4}
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={analyzeRequirements}
                      disabled={!formData.projectName || !formData.industry || !formData.useCase}
                      className="bg-primary hover:bg-primary/90 px-8 py-3"
                    >
                      <Brain className="h-5 w-5 mr-2" />
                      Analyze Requirements with AI
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: AI Recommendations */}
          {step === 2 && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              {isAnalyzing ? (
                <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                  <CardContent className="py-12">
                    <div className="text-center space-y-4">
                      <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <h3 className="text-xl font-semibold">AI is analyzing your requirements...</h3>
                      <p className="text-muted-foreground">
                        Our AI is finding the perfect templates and customizations for your project
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lightbulb className="h-6 w-6 mr-2 text-primary" />
                        AI Recommendations for "{formData.projectName}"
                      </CardTitle>
                      <CardDescription>
                        Based on your requirements, here are the best template matches
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <div className="grid gap-6">
                    {recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{rec.template}</h3>
                                <div className="flex items-center space-x-4 mb-3">
                                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    {rec.confidence}% Match
                                  </Badge>
                                  <Badge variant={rec.complexity === 'Beginner' ? 'secondary' : rec.complexity === 'Intermediate' ? 'default' : 'destructive'}>
                                    {rec.complexity}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">{rec.estimatedTime}</span>
                                </div>
                              </div>
                              <Button onClick={() => selectTemplate(rec.template)}>
                                Select Template
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center">
                                  <Settings className="h-4 w-4 mr-2" />
                                  Recommended Customizations
                                </h4>
                                <ul className="space-y-1">
                                  {rec.customizations.map((custom, i) => (
                                    <li key={i} className="flex items-start">
                                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm">{custom}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center">
                                  <Zap className="h-4 w-4 mr-2" />
                                  Key Features
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {rec.features.map((feature, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Customization & Chat */}
          {step === 3 && selectedTemplate && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wrench className="h-6 w-6 mr-2 text-primary" />
                    Customizing: {selectedTemplate}
                  </CardTitle>
                  <CardDescription>
                    Let's fine-tune your template. Ask our AI assistant any questions about implementation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="chat" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="chat">AI Assistant</TabsTrigger>
                      <TabsTrigger value="code">Code Preview</TabsTrigger>
                      <TabsTrigger value="deployment">Deployment</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="chat" className="space-y-4">
                      <div className="bg-muted/20 rounded-lg p-4 h-96 overflow-y-auto space-y-4">
                        {chatMessages.map((message, index) => (
                          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-sm p-3 rounded-lg ${
                              message.type === 'user' 
                                ? 'bg-primary text-white' 
                                : 'bg-background border border-border'
                            }`}>
                              {message.content}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Ask about customizations, implementation, or technical details..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                        />
                        <Button onClick={sendChatMessage}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="code" className="space-y-4">
                      <div className="bg-black rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm">
{`// AI-Generated Template Customization
import { ChatBot } from '@advanta-ai/templates';

const config = {
  industry: "${formData.industry}",
  useCase: "${formData.useCase}",
  features: [
    "natural-language-processing",
    "sentiment-analysis", 
    "multi-language-support"
  ],
  integrations: {
    crm: "salesforce",
    analytics: "google-analytics",
    database: "postgresql"
  }
};

export default function CustomizedBot() {
  return (
    <ChatBot 
      config={config}
      theme="dark"
      branding={{
        name: "${formData.projectName}",
        primaryColor: "#3b82f6"
      }}
    />
  );
}`}
                        </pre>
                      </div>
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Complete Template
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="deployment" className="space-y-4">
                      <div className="grid gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">Deployment Options</h4>
                            <div className="space-y-2">
                              <Button variant="outline" className="w-full justify-start">
                                <Code className="h-4 w-4 mr-2" />
                                Deploy to Vercel
                              </Button>
                              <Button variant="outline" className="w-full justify-start">
                                <Code className="h-4 w-4 mr-2" />
                                Deploy to AWS
                              </Button>
                              <Button variant="outline" className="w-full justify-start">
                                <Code className="h-4 w-4 mr-2" />
                                Self-hosted Option
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}