import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fadeIn, fadeInUp } from '@/lib/animations';
import { toast } from '@/hooks/use-toast';

// Template types
const TEMPLATE_TYPES = [
  'Customer Service Bot',
  'Content Generator',
  'Data Analysis Assistant',
  'Product Recommendation Engine',
  'Lead Qualification Bot',
  'Knowledge Base Assistant',
  'Meeting Summarizer',
  'Sales Outreach Assistant'
];

// Template categories
const TEMPLATE_CATEGORIES = [
  'eCommerce',
  'SaaS',
  'Healthcare',
  'Finance',
  'Real Estate',
  'Education',
  'Marketing',
  'Legal'
];

// Example personalities
const AI_PERSONALITIES = [
  'Professional',
  'Friendly',
  'Technical',
  'Empathetic',
  'Educational',
  'Direct',
  'Creative',
  'Analytical'
];

// Example template modifiers
const TEMPLATE_MODIFIERS = [
  { name: 'Conversation History', description: 'Allow the AI to remember previous interactions' },
  { name: 'Document Analysis', description: 'Enable processing of uploaded documents and images' },
  { name: 'Response Format Control', description: 'Customize output format (bullet points, paragraphs, etc.)' },
  { name: 'Custom Language Constraints', description: 'Add specific vocabulary or style guidelines' },
  { name: 'Data Visualization', description: 'Generate charts and visual elements from data' },
  { name: 'Multilingual Support', description: 'Communicate in multiple languages' }
];

interface Template {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  personality: string;
  tone: string;
  customPrompt?: string;
  knowledgeBase?: string[];
  modifiers: string[];
}

export default function TemplateCustomizer() {
  const [currentTab, setCurrentTab] = useState('customize');
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState(TEMPLATE_TYPES[0]);
  const [templateCategory, setTemplateCategory] = useState(TEMPLATE_CATEGORIES[0]);
  const [templateDescription, setTemplateDescription] = useState('');
  const [templatePersonality, setTemplatePersonality] = useState(AI_PERSONALITIES[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [generatedTemplate, setGeneratedTemplate] = useState<Template | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  
  // Example knowledge base sources
  const [knowledgeBase, setKnowledgeBase] = useState<{ url: string; name: string; selected: boolean }[]>([
    { url: 'https://docs.company.com/api', name: 'API Documentation', selected: false },
    { url: 'https://support.company.com/faq', name: 'Product FAQ', selected: false },
    { url: 'https://www.company.com/blog', name: 'Company Blog', selected: false }
  ]);
  
  const handleModifierToggle = (modifier: string) => {
    if (selectedModifiers.includes(modifier)) {
      setSelectedModifiers(selectedModifiers.filter(m => m !== modifier));
    } else {
      setSelectedModifiers([...selectedModifiers, modifier]);
    }
  };
  
  const handleKnowledgeBaseToggle = (index: number) => {
    const updated = [...knowledgeBase];
    updated[index].selected = !updated[index].selected;
    setKnowledgeBase(updated);
  };
  
  const generateTemplate = async () => {
    if (!templateName || !templateType || !templateDescription) {
      toast({
        title: "Missing information",
        description: "Please provide a name, type, and description for your template.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call to AI service for template generation
    setTimeout(() => {
      const template: Template = {
        id: `template-${Date.now()}`,
        name: templateName,
        type: templateType,
        category: templateCategory,
        description: templateDescription,
        personality: templatePersonality,
        tone: 'Balanced', // Default tone
        customPrompt: customPrompt || undefined,
        knowledgeBase: knowledgeBase.filter(kb => kb.selected).map(kb => kb.name),
        modifiers: selectedModifiers
      };
      
      setGeneratedTemplate(template);
      setCurrentTab('preview');
      setIsGenerating(false);
      
      toast({
        title: "Template Created!",
        description: "Your AI template has been successfully customized.",
      });
    }, 2000);
  };
  
  // Generate example conversation based on template
  const generateExampleConversation = () => {
    if (!generatedTemplate) return [];
    
    const personalityTraits: Record<string, string[]> = {
      'Professional': ['formal language', 'industry terminology', 'structured responses'],
      'Friendly': ['conversational tone', 'approachable language', 'occasional light humor'],
      'Technical': ['detailed technical explanations', 'precise terminology', 'data-driven responses'],
      'Empathetic': ['understanding tone', 'reflective responses', 'emotionally aware language'],
      'Educational': ['explanatory style', 'examples and analogies', 'step-by-step guidance'],
      'Direct': ['concise answers', 'straightforward language', 'minimal preamble'],
      'Creative': ['metaphorical language', 'innovative suggestions', 'out-of-box thinking'],
      'Analytical': ['logical structure', 'evidence-based reasoning', 'comparative analysis']
    };
    
    const traits = personalityTraits[generatedTemplate.personality] || personalityTraits['Professional'];
    
    const typeSpecificResponses: Record<string, string> = {
      'Customer Service Bot': `I understand your concern about the delayed shipment. I can see that your order #38291 was shipped yesterday and is currently in transit. The latest tracking information shows it will arrive by ${new Date(Date.now() + 2*24*60*60*1000).toLocaleDateString()}. Would you like me to set up delivery notifications for you?`,
      
      'Content Generator': `Here's a draft blog post about "5 Ways AI Enhances Customer Experience":
      
1. **Personalized Recommendations** - Using behavioral data to suggest relevant products
2. **24/7 Intelligent Support** - Providing immediate assistance regardless of time zone
3. **Sentiment Analysis** - Understanding and adapting to customer emotions
4. **Automated Follow-ups** - Maintaining engagement with timely, relevant communication
5. **Predictive Service** - Anticipating needs before customers express them

Would you like me to expand on any specific section?`,
      
      'Data Analysis Assistant': `Based on your sales data from the last quarter, I've identified the following trends:

- Revenue increased by 23% compared to the previous quarter
- Customer acquisition cost decreased by 12%
- The highest performing product category was "Enterprise Solutions"
- There's a strong correlation (r=0.78) between email campaign frequency and conversion rates

Would you like me to generate a visualization of these trends?`,
      
      'Product Recommendation Engine': `Based on your browsing history and previous purchases, here are products you might be interested in:

1. **Premium Wireless Headphones** - Similar to your recently viewed audio equipment
2. **Productivity Software Suite** - Complements your purchase of the business laptop
3. **Ergonomic Desk Setup** - Many customers who bought your item also invested in these

Would you like more specific recommendations for any of these categories?`,
      
      'Lead Qualification Bot': `I've analyzed the lead information for TechCorp and have determined they're a high-quality lead (87% match score). 

Company size: 250-500 employees
Industry: Financial Technology
Current tech stack: Includes our complementary services
Budget: Within our enterprise tier range
Timeline: Looking to implement within 3 months

Recommended action: Schedule a demo with our financial services specialist team.`,
      
      'Knowledge Base Assistant': `I found 3 relevant articles in our knowledge base about troubleshooting printer connectivity issues:

1. "How to reset your printer's WiFi connection" (viewed 1,232 times)
2. "Resolving driver conflicts with the latest OS update" (updated last week)
3. "Network printing troubleshooting guide" (rated 4.8/5 by users)

The most likely solution based on your description is in article #2. Would you like me to walk you through the steps?`,
      
      'Meeting Summarizer': `Meeting Summary - Product Launch Strategy (32 min)
      
Key Points:
- Launch date confirmed for October 15th
- Marketing campaign to begin in phases starting August 30th
- Beta testing results show 94% positive feedback
- Initial pricing strategy approved at three tiers

Action Items:
@Marketing: Finalize social media calendar by Aug 20
@Product: Address final UI feedback from beta testers by Sept 5
@Sales: Complete training materials for the new feature set by Sept 15

Next meeting scheduled for August 25th at 10am.`,
      
      'Sales Outreach Assistant': `Subject Line: Streamline Your Workflow with Our Solution

Hello [Contact Name],

I noticed that [Company] has been expanding its operations in the [specific industry] sector. During this growth phase, many of our clients face challenges with [specific pain point].

Our [Product/Service] has helped similar companies achieve:
• 35% reduction in processing time
• 28% decrease in operational costs
• 47% improvement in team collaboration

I'd appreciate 15 minutes to discuss how we might address your specific needs. Would Tuesday at 10am or Thursday at 2pm work for you?

Regards,
[Sales Representative]`
    };
    
    return [
      { role: 'user', message: 'Can you help me with my request?' },
      { 
        role: 'ai', 
        message: typeSpecificResponses[generatedTemplate.type] || 
                 "I'd be happy to help with your request. As your specialized assistant, I'm designed to provide information and support with a focus on delivering valuable insights tailored to your needs." 
      }
    ];
  };
  
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="max-w-3xl mx-auto text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            AI Template Customization Assistant
          </h1>
          <p className="text-xl text-muted-foreground">
            Create personalized AI solutions tailored to your specific business needs
          </p>
        </motion.div>
        
        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="max-w-4xl mx-auto"
        >
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="customize" className="text-lg py-3">
              Customize Template
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-lg py-3">
              Preview & Deploy
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="customize" className="space-y-6">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <Card className="bg-background/50 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Template Basics</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Template Name</label>
                        <Input
                          placeholder="E.g., Sales Outreach Assistant"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          className="bg-background/30"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Template Type</label>
                        <Select value={templateType} onValueChange={setTemplateType}>
                          <SelectTrigger className="bg-background/30">
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                          <SelectContent>
                            {TEMPLATE_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Industry Category</label>
                        <Select value={templateCategory} onValueChange={setTemplateCategory}>
                          <SelectTrigger className="bg-background/30">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {TEMPLATE_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Template Description</label>
                        <Textarea
                          placeholder="Describe what your AI template should do..."
                          value={templateDescription}
                          onChange={(e) => setTemplateDescription(e.target.value)}
                          className="bg-background/30 min-h-[100px]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/50 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Template Personality</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">AI Personality</label>
                        <Select value={templatePersonality} onValueChange={setTemplatePersonality}>
                          <SelectTrigger className="bg-background/30">
                            <SelectValue placeholder="Select a personality" />
                          </SelectTrigger>
                          <SelectContent>
                            {AI_PERSONALITIES.map((personality) => (
                              <SelectItem key={personality} value={personality}>{personality}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          This defines how your AI will communicate and interact with users
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Custom Instructions (Optional)</label>
                        <Textarea
                          placeholder="Add any specific instructions for your AI..."
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          className="bg-background/30 min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Add specific guidance on how your AI should respond or what knowledge it should reference
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - Advanced Options */}
              <div className="space-y-6">
                <Card className="bg-background/50 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Knowledge Sources</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select knowledge sources your AI should use for better context and information
                    </p>
                    
                    <div className="space-y-3">
                      {knowledgeBase.map((source, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-md bg-background/30">
                          <div>
                            <p className="font-medium">{source.name}</p>
                            <p className="text-xs text-muted-foreground">{source.url}</p>
                          </div>
                          <Button
                            variant={source.selected ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleKnowledgeBaseToggle(index)}
                          >
                            {source.selected ? "Selected" : "Add"}
                          </Button>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full">
                        + Add Custom Knowledge Source
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/50 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Template Capabilities</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enable additional functionalities for your AI template
                    </p>
                    
                    <div className="space-y-3">
                      {TEMPLATE_MODIFIERS.map((modifier) => (
                        <div key={modifier.name} className="flex items-center justify-between p-3 rounded-md bg-background/30">
                          <div>
                            <p className="font-medium">{modifier.name}</p>
                            <p className="text-xs text-muted-foreground">{modifier.description}</p>
                          </div>
                          <Button
                            variant={selectedModifiers.includes(modifier.name) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleModifierToggle(modifier.name)}
                          >
                            {selectedModifiers.includes(modifier.name) ? "Enabled" : "Enable"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    size="lg"
                    onClick={generateTemplate}
                    disabled={isGenerating}
                    className="w-full md:w-auto"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Template...
                      </>
                    ) : "Generate AI Template"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-8">
            {generatedTemplate ? (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="show"
              >
                <Card className="bg-background/50 border-primary/20 mb-8">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">{generatedTemplate.name}</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        {generatedTemplate.type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                        <p>{generatedTemplate.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Personality</h4>
                        <p>{generatedTemplate.personality}</p>
                        
                        <h4 className="text-sm font-medium text-muted-foreground mt-4 mb-1">Category</h4>
                        <p>{generatedTemplate.category}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Capabilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedTemplate.modifiers.map((modifier) => (
                          <span key={modifier} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary-foreground">
                            {modifier}
                          </span>
                        ))}
                        {generatedTemplate.modifiers.length === 0 && (
                          <span className="text-muted-foreground">No additional capabilities selected</span>
                        )}
                      </div>
                    </div>
                    
                    {generatedTemplate.knowledgeBase && generatedTemplate.knowledgeBase.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Knowledge Sources</h4>
                        <div className="flex flex-wrap gap-2">
                          {generatedTemplate.knowledgeBase.map((source) => (
                            <span key={source} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-200">
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Template Preview</h3>
                    <div className="flex border border-border rounded-md overflow-hidden">
                      <button
                        className={`px-3 py-1 text-sm ${previewMode === 'desktop' ? 'bg-primary text-white' : 'bg-background'}`}
                        onClick={() => setPreviewMode('desktop')}
                      >
                        Desktop
                      </button>
                      <button
                        className={`px-3 py-1 text-sm ${previewMode === 'mobile' ? 'bg-primary text-white' : 'bg-background'}`}
                        onClick={() => setPreviewMode('mobile')}
                      >
                        Mobile
                      </button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div className="bg-black/50 p-2 border-b border-border flex items-center">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="mx-auto text-sm text-muted-foreground">
                        AI Assistant Preview
                      </div>
                    </div>
                    
                    <div className={`bg-black/30 p-4 ${previewMode === 'mobile' ? 'max-w-[320px] mx-auto min-h-[500px]' : 'min-h-[400px]'}`}>
                      <div className="space-y-4">
                        {generateExampleConversation().map((message, index) => (
                          <div 
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.role === 'user' 
                                  ? 'bg-primary/80 text-white' 
                                  : 'bg-gray-800 text-white'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-line">{message.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <div className="relative">
                          <Input
                            placeholder="Type your message..."
                            className="bg-gray-900 border-gray-700 pr-12"
                          />
                          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button variant="outline" onClick={() => setCurrentTab('customize')}>
                    Back to Editing
                  </Button>
                  <Button>
                    Deploy AI Template
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Generate a template to see the preview
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setCurrentTab('customize')}
                >
                  Back to Customization
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}