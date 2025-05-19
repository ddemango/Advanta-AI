import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { ClickRipple } from '@/components/ui/click-ripple';
import { FloatingElement } from '@/components/ui/floating-element';
import { HoverCardEffect } from '@/components/ui/hover-card-effect';

// AI Product Types
const aiProductTypes = [
  {
    id: 'text-generation',
    name: 'Text Generation',
    description: 'Generate creative and informative content using advanced language models.',
    icon: 'pen-fancy',
    features: [
      'Blog Post Creation',
      'Product Descriptions',
      'Marketing Copy',
      'Creative Writing',
      'Custom Templates'
    ]
  },
  {
    id: 'image-generation',
    name: 'Image Generation',
    description: 'Create custom images from text descriptions using AI generative models.',
    icon: 'image',
    features: [
      'Product Visualization',
      'Marketing Materials',
      'Custom Illustrations',
      'Style Transfers',
      'Visual Concepts'
    ]
  },
  {
    id: 'chatbot',
    name: 'Conversational AI',
    description: 'Build interactive chatbots and conversational agents for various use cases.',
    icon: 'robot',
    features: [
      'Customer Support',
      'Lead Qualification',
      'FAQ Automation',
      'Personalized Recommendations',
      'Multi-channel Deployment'
    ]
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Analyze and visualize complex data to extract meaningful insights.',
    icon: 'chart-pie',
    features: [
      'Trend Identification',
      'Predictive Analytics',
      'Anomaly Detection',
      'Reporting Automation',
      'Data Visualization'
    ]
  }
];

// Placeholder for generated content
const placeholderImage = `
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#111827" />
  <circle cx="200" cy="200" r="120" fill="#1e293b" />
  
  <!-- AI-generated image placeholder elements -->
  <circle cx="200" cy="200" r="70" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="10 5" />
  <rect x="150" y="150" width="100" height="100" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="10 5" />
  
  <!-- Random shapes to simulate a generated image -->
  <circle cx="160" cy="170" r="15" fill="#7c3aed" opacity="0.7" />
  <circle cx="240" cy="170" r="15" fill="#7c3aed" opacity="0.7" />
  <path d="M 180 220 Q 200 250 220 220" stroke="#7c3aed" stroke-width="5" fill="none" />
  
  <!-- Grid pattern -->
  <g stroke="#3f3f46" stroke-width="0.5" opacity="0.3">
    ${Array.from({ length: 20 }, (_, i) => 
      `<line x1="0" y1="${i * 20}" x2="400" y2="${i * 20}" />
       <line x1="${i * 20}" y1="0" x2="${i * 20}" y2="400" />`
    ).join('')}
  </g>
  
  <text x="200" y="300" font-family="sans-serif" font-size="14" fill="#d1d5db" text-anchor="middle">AI Generated Image</text>
  <text x="200" y="320" font-family="sans-serif" font-size="10" fill="#9ca3af" text-anchor="middle">Hover to regenerate</text>
</svg>
`;

export default function Sandbox() {
  const [selectedProduct, setSelectedProduct] = useState('text-generation');
  const [promptText, setPromptText] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImage, setGeneratedImage] = useState(placeholderImage);
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState({
    creativity: 50,
    length: 50,
    tone: 'professional'
  });
  
  // Handle product selection
  const handleProductSelect = (product: string) => {
    setSelectedProduct(product);
    setGeneratedContent('');
    setGeneratedImage(placeholderImage);
  };
  
  // Handle prompt submission
  const handleGenerateContent = () => {
    if (!promptText.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      if (selectedProduct === 'text-generation') {
        const demoResponses = [
          "# Revolutionizing Business with AI\n\nIn today's rapidly evolving technological landscape, artificial intelligence stands at the forefront of innovation. Companies that harness the power of AI gain significant competitive advantages through enhanced efficiency, data-driven insights, and automated processes.\n\n## Key Benefits\n\n- **Increased Productivity**: Automate routine tasks to free up human resources\n- **Enhanced Decision Making**: Leverage predictive analytics for better outcomes\n- **Improved Customer Experiences**: Deliver personalized interactions at scale\n\nBy implementing strategic AI solutions, businesses can transform challenges into opportunities and position themselves for sustainable growth in the digital economy.",
          
          "# 5 Ways AI is Transforming Marketing\n\n1. **Predictive Analytics**: Anticipate customer needs and behaviors before they happen\n2. **Content Optimization**: Generate and refine marketing copy for maximum engagement\n3. **Personalization at Scale**: Deliver individualized experiences to thousands simultaneously\n4. **Intelligent Segmentation**: Group audiences based on subtle patterns humans might miss\n5. **Automated Campaign Management**: Optimize ad spend and targeting in real-time\n\nMarketers who embrace these AI capabilities are seeing dramatic improvements in ROI, customer acquisition costs, and lifetime value metrics.",
          
          "# The Future of Customer Service: AI-Powered Support\n\nCustomer expectations have never been higher. Today's consumers demand immediate, personalized service across multiple channels. AI technologies are making this possible at scale.\n\n## Transformative Applications\n\n- **24/7 Intelligent Support**: Chatbots that can handle complex inquiries without human intervention\n- **Sentiment Analysis**: Systems that detect customer emotions and adapt responses accordingly\n- **Predictive Problem Solving**: Identifying and resolving issues before customers even experience them\n\nLeading companies are already seeing 40-60% reductions in support costs while simultaneously improving satisfaction scores and resolution times."
        ];
        
        setGeneratedContent(demoResponses[Math.floor(Math.random() * demoResponses.length)]);
      } else if (selectedProduct === 'image-generation') {
        // Just using our placeholder for demo purposes
        setGeneratedImage(placeholderImage);
      } else if (selectedProduct === 'chatbot') {
        setGeneratedContent("*The system would now generate a conversational flow based on your prompt. This would include intents, entities, and response templates.*\n\n**Sample Conversation Flow:**\n\n- User: \"What services do you offer?\"\n- Bot: \"We offer a range of AI solutions including custom chatbots, data analysis, and automation tools. What specific challenge are you looking to solve?\"\n\n- User: \"I need help with customer support automation.\"\n- Bot: \"Great! Our customer support solutions can help reduce response times by up to 80% while maintaining high satisfaction rates. Would you like to learn about our tiered support packages or see a quick demo?\"");
      } else if (selectedProduct === 'data-analysis') {
        setGeneratedContent("**Data Analysis Report**\n\n```python\n# Sample predictive model code\nimport pandas as pd\nfrom sklearn.ensemble import RandomForestRegressor\n\n# Load and prepare data\ndf = pd.read_csv('customer_data.csv')\nX = df.drop('purchase_value', axis=1)\ny = df['purchase_value']\n\n# Train model\nmodel = RandomForestRegressor(n_estimators=100)\nmodel.fit(X, y)\n\n# Feature importance\nimportance = model.feature_importances_\nfeatures = X.columns\n```\n\n**Key Insights:**\n- Customer age and previous purchase history are the strongest predictors of future spending\n- Seasonal trends show 27% higher engagement during Q4\n- Recommended segmentation identifies 3 distinct customer groups with unique needs");
      }
      
      setIsGenerating(false);
    }, 2000);
  };
  
  return (
    <>
      <Helmet>
        <title>AI Product Sandbox | Advanta AI</title>
        <meta name="description" content="Experiment with various AI capabilities including text generation, image creation, chatbots, and data analysis in our interactive sandbox." />
      </Helmet>
      
      <Header />
      
      <main className="py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mb-12 text-center"
          >
            <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              AI Product <span className="gradient-text">Sandbox</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experiment with our AI capabilities in this interactive playground. Try different product types and see the results instantly.
            </motion.p>
          </motion.div>
          
          {/* Product Selection and Playground */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Product Selection Sidebar */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              className="lg:col-span-1"
            >
              <div className="bg-muted rounded-xl p-6 border border-border sticky top-24">
                <h2 className="text-xl font-bold mb-4">AI Products</h2>
                <div className="space-y-3">
                  {aiProductTypes.map((product) => (
                    <ClickRipple key={product.id} className="w-full">
                      <div
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          selectedProduct === product.id 
                            ? 'bg-primary/10 border border-primary/50' 
                            : 'bg-background border border-border hover:border-primary/30'
                        }`}
                        onClick={() => handleProductSelect(product.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-md flex items-center justify-center bg-primary/20 ${
                            selectedProduct === product.id ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                            <i className={`fas fa-${product.icon} text-lg`}></i>
                          </div>
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-xs text-muted-foreground">{product.description}</p>
                          </div>
                        </div>
                      </div>
                    </ClickRipple>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-medium mb-2">Features</h3>
                  <ul className="space-y-1 text-sm">
                    {aiProductTypes.find(p => p.id === selectedProduct)?.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <i className="fas fa-check text-primary text-xs"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* Playground Area */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              className="lg:col-span-3"
            >
              <Tabs defaultValue="playground" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="playground">Playground</TabsTrigger>
                  <TabsTrigger value="settings">Advanced Settings</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>
                
                {/* Playground Tab */}
                <TabsContent value="playground" className="space-y-6">
                  <Card className="bg-muted border-border overflow-hidden">
                    <CardHeader>
                      <CardTitle>
                        {aiProductTypes.find(p => p.id === selectedProduct)?.name} Playground
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Your Prompt</label>
                          <Textarea
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            placeholder={
                              selectedProduct === 'text-generation' 
                                ? "Write a blog post about the benefits of AI in business..." 
                                : selectedProduct === 'image-generation'
                                ? "A futuristic cityscape with flying cars and neon lights..."
                                : selectedProduct === 'chatbot'
                                ? "Create a customer service chatbot for an e-commerce website..."
                                : "Analyze customer purchase data to predict future buying patterns..."
                            }
                            className="min-h-[120px]"
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={handleGenerateContent}
                            disabled={!promptText.trim() || isGenerating}
                            className="flex-1"
                          >
                            {isGenerating ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-bolt mr-2"></i>
                                Generate
                              </>
                            )}
                          </Button>
                          <Button variant="outline" disabled={isGenerating}>
                            <i className="fas fa-save mr-2"></i>
                            Save
                          </Button>
                          <Button variant="outline" disabled={isGenerating}>
                            <i className="fas fa-share-alt mr-2"></i>
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Generated Content Display */}
                  {(generatedContent || selectedProduct === 'image-generation') && !isGenerating && (
                    <FloatingElement yOffset={10} duration={3}>
                      <HoverCardEffect className="rounded-lg">
                        <Card className="bg-muted border-border overflow-hidden">
                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <CardTitle>Generated Result</CardTitle>
                              <Badge>
                                {selectedProduct === 'text-generation' ? 'Text' :
                                selectedProduct === 'image-generation' ? 'Image' :
                                selectedProduct === 'chatbot' ? 'Conversation' : 'Analysis'}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {selectedProduct === 'image-generation' ? (
                              <div className="flex justify-center">
                                <div 
                                  className="relative rounded-lg overflow-hidden cursor-pointer"
                                  onClick={() => {
                                    setIsGenerating(true);
                                    setTimeout(() => setIsGenerating(false), 1000);
                                  }}
                                  dangerouslySetInnerHTML={{ __html: generatedImage }}
                                />
                              </div>
                            ) : (
                              <div className="prose prose-invert max-w-none">
                                {generatedContent.split('\n').map((line, index) => {
                                  if (line.startsWith('#')) {
                                    const level = (line.match(/^#+/) || ['#'])[0].length;
                                    const text = line.replace(/^#+\s*/, '');
                                    const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;
                                    return <HeadingTag key={index} className="font-bold">{text}</HeadingTag>;
                                  } else if (line.startsWith('- ')) {
                                    return <li key={index} className="ml-4">{line.replace(/^- /, '')}</li>;
                                  } else if (line.startsWith('```')) {
                                    return null; // Skip code block markers
                                  } else if (line.startsWith('**') && line.endsWith('**')) {
                                    return <p key={index} className="font-bold">{line.replace(/^\*\*|\*\*$/g, '')}</p>;
                                  } else if (line.startsWith('*') && line.endsWith('*')) {
                                    return <p key={index} className="italic">{line.replace(/^\*|\*$/g, '')}</p>;
                                  } else if (line.match(/^\d+\.\s/)) {
                                    return <li key={index} className="ml-4 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
                                  } else if (line === '') {
                                    return <br key={index} />;
                                  } else {
                                    return <p key={index}>{line}</p>;
                                  }
                                })}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="bg-background/30 border-t border-border px-6 py-3">
                            <div className="flex justify-between w-full text-sm">
                              <div className="text-muted-foreground">Generated in 2.3s</div>
                              <div className="flex gap-3">
                                <button className="text-muted-foreground hover:text-foreground transition-colors">
                                  <i className="fas fa-copy"></i>
                                </button>
                                <button className="text-muted-foreground hover:text-foreground transition-colors">
                                  <i className="fas fa-download"></i>
                                </button>
                                <button className="text-muted-foreground hover:text-foreground transition-colors">
                                  <i className="fas fa-redo-alt"></i>
                                </button>
                              </div>
                            </div>
                          </CardFooter>
                        </Card>
                      </HoverCardEffect>
                    </FloatingElement>
                  )}
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                  <Card className="bg-muted border-border">
                    <CardHeader>
                      <CardTitle>Advanced Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Creativity Level</label>
                          <div className="space-y-2">
                            <Slider
                              value={[settings.creativity]}
                              min={0}
                              max={100}
                              step={1}
                              onValueChange={(value) => setSettings({...settings, creativity: value[0]})}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Conservative</span>
                              <span>Balanced</span>
                              <span>Creative</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Output Length</label>
                          <div className="space-y-2">
                            <Slider
                              value={[settings.length]}
                              min={0}
                              max={100}
                              step={1}
                              onValueChange={(value) => setSettings({...settings, length: value[0]})}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Concise</span>
                              <span>Standard</span>
                              <span>Detailed</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Communication Tone</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['professional', 'friendly', 'technical', 'casual'].map((tone) => (
                              <div 
                                key={tone} 
                                className={`px-4 py-3 rounded-lg border ${
                                  settings.tone === tone 
                                    ? 'border-primary bg-primary/10' 
                                    : 'border-border bg-background'
                                } cursor-pointer`}
                                onClick={() => setSettings({...settings, tone})}
                              >
                                <div className="text-center capitalize">{tone}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted border-border">
                    <CardHeader>
                      <CardTitle>Technical Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Model Version</label>
                          <select className="w-full bg-background border border-border rounded-md p-2">
                            <option value="latest">Latest (v4.0)</option>
                            <option value="stable">Stable (v3.5)</option>
                            <option value="custom">Custom Fine-tuned</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">API Call Type</label>
                          <select className="w-full bg-background border border-border rounded-md p-2">
                            <option value="completion">Completion</option>
                            <option value="chat">Chat Interface</option>
                            <option value="stream">Streaming Response</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Temperature</label>
                          <Input type="number" min="0" max="1" step="0.1" value="0.7" className="bg-background" />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Max Tokens</label>
                          <Input type="number" min="10" max="4096" step="10" value="1024" className="bg-background" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Examples Tab */}
                <TabsContent value="examples" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-muted border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Business Report Generation</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-muted-foreground mb-4">Generate a quarterly sales analysis based on the attached spreadsheet data, focusing on regional trends and outlier detection.</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="secondary">Data Analysis</Badge>
                          <span className="text-muted-foreground">1024 tokens</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setSelectedProduct('data-analysis');
                            setPromptText('Generate a quarterly sales analysis based on our data, focusing on regional trends and outlier detection.');
                          }}
                        >
                          Use Example
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-muted border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Product Landing Page Copy</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-muted-foreground mb-4">Write compelling headlines, feature descriptions, and CTAs for our new AI-powered project management tool aimed at remote tech teams.</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="secondary">Text Generation</Badge>
                          <span className="text-muted-foreground">756 tokens</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setSelectedProduct('text-generation');
                            setPromptText('Write compelling headlines, feature descriptions, and CTAs for our new AI-powered project management tool aimed at remote tech teams.');
                          }}
                        >
                          Use Example
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-muted border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Customer Support Bot</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-muted-foreground mb-4">Create a conversational flow for handling common e-commerce inquiries about shipping, returns, and order status updates.</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="secondary">Chatbot</Badge>
                          <span className="text-muted-foreground">932 tokens</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setSelectedProduct('chatbot');
                            setPromptText('Create a conversational flow for handling common e-commerce inquiries about shipping, returns, and order status updates.');
                          }}
                        >
                          Use Example
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-muted border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Brand Mascot Design</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-muted-foreground mb-4">Generate a friendly, approachable robot character to serve as a mascot for our tech education platform aimed at children ages 8-14.</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="secondary">Image Generation</Badge>
                          <span className="text-muted-foreground">512×512 px</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setSelectedProduct('image-generation');
                            setPromptText('Create a friendly, approachable robot character to serve as a mascot for our tech education platform aimed at children ages 8-14.');
                          }}
                        >
                          Use Example
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-muted border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Marketing Email Sequence</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-muted-foreground mb-4">Draft a 5-email nurture sequence for new SaaS free trial users, focusing on feature education and conversion to paid plans.</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="secondary">Text Generation</Badge>
                          <span className="text-muted-foreground">1230 tokens</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setSelectedProduct('text-generation');
                            setPromptText('Draft a 5-email nurture sequence for new SaaS free trial users, focusing on feature education and conversion to paid plans.');
                          }}
                        >
                          Use Example
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-muted border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Financial Data Visualization</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-muted-foreground mb-4">Analyze 3 years of quarterly financial data to identify trends, seasonal patterns, and anomalies in revenue and expense categories.</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="secondary">Data Analysis</Badge>
                          <span className="text-muted-foreground">768 tokens</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setSelectedProduct('data-analysis');
                            setPromptText('Analyze 3 years of quarterly financial data to identify trends, seasonal patterns, and anomalies in revenue and expense categories.');
                          }}
                        >
                          Use Example
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
          
          {/* CTA Section */}
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="mt-20 text-center"
          >
            <Card className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 border-primary/30 py-10 px-6">
              <CardContent>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to implement these AI capabilities in your business?</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Move beyond the sandbox and integrate powerful AI solutions directly into your workflows and products.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                    Request Custom Solution
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto">
                    <a href="/calculator">Calculate ROI</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}