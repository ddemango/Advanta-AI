import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { 
  Search, 
  Filter, 
  Star, 
  ExternalLink, 
  CheckCircle, 
  X, 
  DollarSign,
  Zap,
  Users,
  Target
} from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: {
    free: boolean;
    paid: string;
    enterprise: boolean;
  };
  rating: number;
  reviews: number;
  features: string[];
  bestFor: string[];
  integrations: string[];
  strengths: string[];
  limitations: string[];
  website: string;
  lastUpdated: string;
}

const aiTools: AITool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'Advanced conversational AI that can assist with writing, analysis, coding, and creative tasks.',
    category: 'General AI',
    pricing: { free: true, paid: '$20/month', enterprise: true },
    rating: 4.3,
    reviews: 15420,
    features: ['Conversational AI', 'Code Generation', 'Writing Assistant', 'Data Analysis', 'Custom GPTs'],
    bestFor: ['General Purpose', 'Writing', 'Coding', 'Research', 'Brainstorming'],
    integrations: ['API Access', 'Zapier', 'Microsoft', 'Slack'],
    strengths: ['Versatile capabilities', 'Large knowledge base', 'Natural conversations', 'Strong reasoning'],
    limitations: ['Knowledge cutoff date', 'Can generate incorrect info', 'Limited real-time data'],
    website: 'https://chat.openai.com',
    lastUpdated: '2024-12-01'
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'AI assistant focused on helpful, harmless, and honest interactions with strong analytical capabilities.',
    category: 'General AI',
    pricing: { free: true, paid: '$20/month', enterprise: true },
    rating: 4.4,
    reviews: 8750,
    features: ['Advanced Reasoning', 'Document Analysis', 'Code Review', 'Writing Help', 'Research Assistant'],
    bestFor: ['Analysis', 'Research', 'Writing', 'Code Review', 'Complex Reasoning'],
    integrations: ['API Access', 'Slack', 'Custom Integrations'],
    strengths: ['Strong analytical skills', 'Honest responses', 'Good at complex tasks', 'Safety focused'],
    limitations: ['Smaller user base', 'Fewer integrations', 'Conservative responses'],
    website: 'https://claude.ai',
    lastUpdated: '2024-11-15'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Google\'s multimodal AI model that can understand and generate text, images, and code.',
    category: 'General AI',
    pricing: { free: true, paid: '$20/month', enterprise: true },
    rating: 4.1,
    reviews: 12300,
    features: ['Multimodal AI', 'Google Integration', 'Real-time Info', 'Code Generation', 'Image Analysis'],
    bestFor: ['Google Workspace', 'Real-time Info', 'Multimodal Tasks', 'Research'],
    integrations: ['Google Workspace', 'Google Cloud', 'Gmail', 'Google Docs'],
    strengths: ['Google integration', 'Real-time data', 'Multimodal', 'Free tier generous'],
    limitations: ['Privacy concerns', 'Less creative', 'Beta features unstable'],
    website: 'https://gemini.google.com',
    lastUpdated: '2024-11-20'
  },
  {
    id: 'jasper',
    name: 'Jasper AI',
    description: 'AI writing assistant specifically designed for marketing and business content creation.',
    category: 'Content Creation',
    pricing: { free: false, paid: '$39/month', enterprise: true },
    rating: 4.2,
    reviews: 5640,
    features: ['Marketing Copy', 'Brand Voice', 'Templates', 'SEO Optimization', 'Team Collaboration'],
    bestFor: ['Marketing', 'Content Creation', 'SEO', 'Brand Consistency', 'Business Writing'],
    integrations: ['Surfer SEO', 'Grammarly', 'Copyscape', 'WordPress', 'Shopify'],
    strengths: ['Marketing focused', 'Brand voice training', 'SEO integration', 'Team features'],
    limitations: ['Expensive', 'No free tier', 'Limited general use', 'Learning curve'],
    website: 'https://jasper.ai',
    lastUpdated: '2024-10-30'
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'AI image generation tool that creates high-quality artwork and illustrations from text prompts.',
    category: 'Image Generation',
    pricing: { free: false, paid: '$10/month', enterprise: true },
    rating: 4.6,
    reviews: 9830,
    features: ['Image Generation', 'Art Styles', 'High Resolution', 'Discord Bot', 'Commercial License'],
    bestFor: ['Art Creation', 'Marketing Visuals', 'Concept Art', 'Social Media', 'Design'],
    integrations: ['Discord', 'Web Interface', 'API (Limited)'],
    strengths: ['Highest quality images', 'Artistic styles', 'Active community', 'Regular updates'],
    limitations: ['Discord-based', 'No free tier', 'Learning curve', 'Queue times'],
    website: 'https://midjourney.com',
    lastUpdated: '2024-11-10'
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps write code with intelligent suggestions and completions.',
    category: 'Code Generation',
    pricing: { free: false, paid: '$10/month', enterprise: true },
    rating: 4.3,
    reviews: 7240,
    features: ['Code Completion', 'Multi-language', 'IDE Integration', 'Code Explanation', 'Security Scanning'],
    bestFor: ['Software Development', 'Code Learning', 'Productivity', 'Code Review'],
    integrations: ['VS Code', 'Visual Studio', 'JetBrains', 'Neovim', 'GitHub'],
    strengths: ['Excellent code suggestions', 'IDE integration', 'Multi-language', 'GitHub integration'],
    limitations: ['Subscription required', 'Code quality varies', 'Privacy concerns', 'Dependency risk'],
    website: 'https://github.com/features/copilot',
    lastUpdated: '2024-11-25'
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    description: 'AI writing assistant integrated into Notion workspace for notes, docs, and project management.',
    category: 'Productivity',
    pricing: { free: false, paid: '$8/month', enterprise: true },
    rating: 4.0,
    reviews: 4120,
    features: ['Writing Assistant', 'Summarization', 'Translation', 'Brainstorming', 'Notion Integration'],
    bestFor: ['Note Taking', 'Documentation', 'Project Management', 'Team Collaboration'],
    integrations: ['Notion Workspace', 'Slack', 'Google Drive', 'Figma'],
    strengths: ['Seamless Notion integration', 'Affordable', 'Team features', 'Multiple languages'],
    limitations: ['Requires Notion', 'Limited outside Notion', 'Basic AI capabilities', 'Newer product'],
    website: 'https://notion.so/ai',
    lastUpdated: '2024-10-15'
  },
  {
    id: 'advanta-ai',
    name: 'Advanta AI Enterprise',
    description: 'Complete AI transformation platform for Fortune 500 companies with custom solutions and enterprise support.',
    category: 'Enterprise AI',
    pricing: { free: false, paid: 'Custom', enterprise: true },
    rating: 4.9,
    reviews: 340,
    features: ['Custom AI Development', 'Enterprise Integration', 'AI Governance', 'Security', '24/7 Support'],
    bestFor: ['Enterprise', 'Custom Solutions', 'AI Strategy', 'Digital Transformation'],
    integrations: ['Salesforce', 'SAP', 'Microsoft', 'AWS', 'Google Cloud', 'Custom APIs'],
    strengths: ['Enterprise focus', 'Custom development', 'High security', 'Expert support'],
    limitations: ['Enterprise only', 'High cost', 'Complex implementation', 'Custom pricing'],
    website: '/marketplace',
    lastUpdated: '2024-12-01'
  }
];

const categories = ['All', 'General AI', 'Content Creation', 'Image Generation', 'Code Generation', 'Productivity', 'Enterprise AI'];
const useCases = ['Writing', 'Coding', 'Design', 'Marketing', 'Research', 'Analysis', 'Productivity', 'Enterprise'];
const pricingFilters = ['Free Tier', 'Under $25/month', 'Enterprise'];

export default function AIToolsComparison() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUseCase, setSelectedUseCase] = useState('All');
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('rating');

  const filteredTools = useMemo(() => {
    let filtered = aiTools;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tool.bestFor.some(use => use.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Use case filter
    if (selectedUseCase !== 'All') {
      filtered = filtered.filter(tool => 
        tool.bestFor.some(use => use.toLowerCase().includes(selectedUseCase.toLowerCase()))
      );
    }

    // Pricing filter
    if (selectedPricing.length > 0) {
      filtered = filtered.filter(tool => {
        return selectedPricing.some(filter => {
          if (filter === 'Free Tier') return tool.pricing.free;
          if (filter === 'Under $25/month') {
            const price = tool.pricing.paid;
            if (price === 'Custom') return false;
            const amount = parseInt(price.replace(/[^0-9]/g, ''));
            return amount <= 25;
          }
          if (filter === 'Enterprise') return tool.pricing.enterprise;
          return false;
        });
      });
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          const getPriceValue = (tool: AITool) => {
            if (tool.pricing.free) return 0;
            if (tool.pricing.paid === 'Custom') return 1000;
            return parseInt(tool.pricing.paid.replace(/[^0-9]/g, '')) || 0;
          };
          return getPriceValue(a) - getPriceValue(b);
        default:
          return 0;
      }
    });
  }, [searchQuery, selectedCategory, selectedUseCase, selectedPricing, sortBy]);

  const handlePricingFilterChange = (filter: string, checked: boolean) => {
    if (checked) {
      setSelectedPricing([...selectedPricing, filter]);
    } else {
      setSelectedPricing(selectedPricing.filter(f => f !== filter));
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Tools Comparison Chart | Compare ChatGPT, Claude, Gemini & More</title>
        <meta name="description" content="Compare the best AI tools side by side. Filter by cost, use case, and features. Find the perfect AI solution for your needs." />
      </Helmet>
      
      <NewHeader />
      
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-primary mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  AI Tools Comparison Chart
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Compare the best AI tools side by side. Filter by cost, use case, and features to find the perfect AI solution for your specific needs.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500">Live Data</Badge>
                <Badge variant="outline">Unbiased Reviews</Badge>
                <Badge variant="outline">Updated Weekly</Badge>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div variants={fadeInUp} className="mb-8">
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Search Tools</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search AI tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Use Case */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Best For</label>
                    <Select value={selectedUseCase} onValueChange={setSelectedUseCase}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Use Cases</SelectItem>
                        {useCases.map(useCase => (
                          <SelectItem key={useCase} value={useCase}>{useCase}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="reviews">Most Reviews</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                        <SelectItem value="price">Price: Low to High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pricing Filters */}
                <div className="mt-6 pt-6 border-t border-border">
                  <label className="block text-sm font-medium mb-3">Pricing Options</label>
                  <div className="flex flex-wrap gap-4">
                    {pricingFilters.map(filter => (
                      <div key={filter} className="flex items-center space-x-2">
                        <Checkbox
                          id={filter}
                          checked={selectedPricing.includes(filter)}
                          onCheckedChange={(checked) => handlePricingFilterChange(filter, checked as boolean)}
                        />
                        <label htmlFor={filter} className="text-sm">{filter}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Results */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {filteredTools.length} AI Tools Found
                </h2>
                <Badge variant="outline">
                  <Filter className="w-3 h-3 mr-1" />
                  {selectedPricing.length > 0 || selectedCategory !== 'All' || selectedUseCase !== 'All' || searchQuery ? 'Filtered' : 'All Tools'}
                </Badge>
              </div>

              <div className="grid gap-6">
                {filteredTools.map((tool) => (
                  <Card key={tool.id} className={`p-6 ${tool.name === 'Advanta AI Enterprise' ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Tool Info */}
                      <div className="lg:col-span-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold">{tool.name}</h3>
                            <Badge variant="outline" className="mt-1">{tool.category}</Badge>
                            {tool.name === 'Advanta AI Enterprise' && (
                              <Badge className="ml-2 bg-primary">Our Solution</Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={tool.website} target={tool.website.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>

                        <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Rating</span>
                            <div className="flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < Math.floor(tool.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm">{tool.rating} ({tool.reviews.toLocaleString()})</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Pricing</span>
                            <div className="text-right">
                              {tool.pricing.free && <Badge className="bg-green-500 text-xs mr-1">Free</Badge>}
                              <span className="text-sm font-medium">{tool.pricing.paid}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Features & Best For */}
                      <div className="lg:col-span-1">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Key Features</h4>
                            <div className="flex flex-wrap gap-1">
                              {tool.features.slice(0, 4).map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">{feature}</Badge>
                              ))}
                              {tool.features.length > 4 && (
                                <Badge variant="secondary" className="text-xs">+{tool.features.length - 4} more</Badge>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Best For</h4>
                            <div className="flex flex-wrap gap-1">
                              {tool.bestFor.map((use, index) => (
                                <Badge key={index} variant="outline" className="text-xs">{use}</Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Top Integrations</h4>
                            <div className="flex flex-wrap gap-1">
                              {tool.integrations.slice(0, 3).map((integration, index) => (
                                <Badge key={index} variant="outline" className="text-xs">{integration}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pros & Cons */}
                      <div className="lg:col-span-1">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2 text-green-600">Strengths</h4>
                            <ul className="space-y-1">
                              {tool.strengths.slice(0, 3).map((strength, index) => (
                                <li key={index} className="flex items-start text-xs">
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2 text-red-600">Limitations</h4>
                            <ul className="space-y-1">
                              {tool.limitations.slice(0, 3).map((limitation, index) => (
                                <li key={index} className="flex items-start text-xs">
                                  <X className="w-3 h-3 text-red-500 mr-1 mt-0.5 flex-shrink-0" />
                                  {limitation}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-4">
                            <Button 
                              className="w-full" 
                              variant={tool.name === 'Advanta AI Enterprise' ? 'default' : 'outline'}
                              asChild
                            >
                              <a href={tool.website} target={tool.website.startsWith('http') ? '_blank' : '_self'}>
                                {tool.name === 'Advanta AI Enterprise' ? 'View Our Solutions' : 'Learn More'}
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredTools.length === 0 && (
                <Card className="p-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">No tools found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedUseCase('All');
                      setSelectedPricing([]);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </Card>
              )}
            </motion.div>

            {/* CTA Section */}
            <motion.div variants={fadeInUp} className="mt-12 text-center">
              <Card className="p-8 bg-gradient-to-r from-primary/10 to-purple-500/10">
                <h3 className="text-2xl font-bold mb-4">Need Help Choosing the Right AI Tool?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Get expert guidance on selecting and implementing the perfect AI solution for your business needs and budget.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => window.location.href = '/ai-tool-quiz'}>
                    <Target className="w-4 h-4 mr-2" />
                    Take AI Tool Quiz
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.href = '/contact'}>
                    <Users className="w-4 h-4 mr-2" />
                    Get Expert Consultation
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}