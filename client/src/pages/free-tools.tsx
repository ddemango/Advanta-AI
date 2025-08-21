import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { NewHeader } from '@/components/redesign/NewHeader';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { 
  Zap, 
  Brain, 
  BarChart3, 
  Search, 
  Mail, 
  FileText, 
  Users, 
  TrendingUp,
  Mic,
  Presentation,
  Bot,
  BookOpen,
  Film,
  Palette,
  Settings,
  Calendar,
  DollarSign,
  Target,
  Magnet,
  Building2,
  Eye,
  Lightbulb,
  Plane,
  Video,
  Workflow,
  Search as SearchIcon,
  Grid3X3,
  List,
  Star,
  Clock
} from 'lucide-react';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  route: string;
  featured?: boolean;
}

export default function FreeTools() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const tools: Tool[] = [
    {
      id: 'build-ai-stack',
      name: 'Build My AI Stack',
      description: 'Get personalized AI tool recommendations based on your business needs and industry.',
      icon: Zap,
      category: 'Business Strategy',
      route: '/build-my-ai-stack',
      featured: true
    },
    {
      id: 'ai-tool-quiz',
      name: 'AI Tool Quiz',
      description: 'Discover which AI tools are perfect for your specific use case and workflow.',
      icon: Brain,
      category: 'Assessment',
      route: '/ai-tool-quiz',
      featured: true
    },
    {
      id: 'trending-content-generator',
      name: 'Trending Content Generator',
      description: 'Generate trending content ideas with real-time data from multiple industries.',
      icon: TrendingUp,
      category: 'Content Creation',
      route: '/trending-content-generator',
      featured: true
    },
    {
      id: 'competitor-intel-scanner',
      name: 'Competitor Intel Scanner',
      description: 'Drop in a URL. Steal the playbook. Get traffic, SEO, ads, and tech stack insights.',
      icon: Target,
      category: 'Market Research',
      route: '/competitor-intel-scanner',
      featured: true
    },

    {
      id: 'socialclip-analyzer',
      name: 'SocialClip Analyzer AI',
      description: 'Analyze and compare social media videos with 7-criteria scoring system.',
      icon: Video,
      category: 'Social Media',
      route: '/socialclip-analyzer'
    },
    {
      id: 'ai-tools-comparison',
      name: 'AI Tools Comparison Chart',
      description: 'Compare features, pricing, and capabilities of different AI tools side by side.',
      icon: BarChart3,
      category: 'Analysis',
      route: '/ai-tools-comparison'
    },
    {
      id: 'competitor-intelligence',
      name: 'AI Competitor Intelligence Analyzer',
      description: 'Analyze competitors\' strategies, content, and market positioning with AI.',
      icon: Search,
      category: 'Market Research',
      route: '/competitor-intelligence'
    },
    {
      id: 'cold-email-generator',
      name: 'Cold Email Generator',
      description: 'Create personalized cold email campaigns that convert prospects into customers.',
      icon: Mail,
      category: 'Sales & Marketing',
      route: '/cold-email-generator'
    },
    {
      id: 'resume-generator',
      name: 'Resume Generator',
      description: 'Build professional resumes optimized for ATS systems and specific job roles.',
      icon: FileText,
      category: 'Career Tools',
      route: '/resume-generator'
    },
    {
      id: 'ats-resume-tailor',
      name: 'ATS Resume Tailor',
      description: 'Upload job description screenshots and resumes for AI-powered ATS optimization and tailoring.',
      icon: Target,
      category: 'Career Tools',
      route: '/ats-resume-tailor',
      featured: true
    },
    {
      id: 'linkedin-generator',
      name: 'LinkedIn Generator',
      description: 'Optimize your LinkedIn profile with AI-generated content and professional copy.',
      icon: Users,
      category: 'Career Tools',
      route: '/linkedin-generator'
    },
    {
      id: 'voiceover-script-generator',
      name: 'AI Voiceover Script Generator',
      description: 'Generate engaging voiceover scripts for videos, podcasts, and presentations.',
      icon: Mic,
      category: 'Content Creation',
      route: '/voiceover-script-generator'
    },
    {
      id: 'slide-deck-maker',
      name: 'AI-Powered Slide Deck Maker',
      description: 'Create professional presentation slides with AI-generated content and layouts.',
      icon: Presentation,
      category: 'Presentations',
      route: '/slide-deck-maker'
    },
    {
      id: 'automation-builder',
      name: 'Automation Builder Wizard',
      description: 'Build custom automation workflows with Make.com integration and templates.',
      icon: Workflow,
      category: 'Automation',
      route: '/automation-builder'
    },
    {
      id: 'custom-gpt-generator',
      name: 'Custom GPT Bot Generator',
      description: 'Create custom AI chatbots tailored to your specific business requirements.',
      icon: Bot,
      category: 'AI Development',
      route: '/custom-gpt-generator'
    },
    {
      id: 'prompt-library',
      name: 'Time-Saving Prompt Library',
      description: 'Access a curated collection of proven prompts for various AI tools and use cases.',
      icon: BookOpen,
      category: 'Resources',
      route: '/prompt-library'
    },
    {
      id: 'landing-page-builder',
      name: 'Landing Page Builder',
      description: 'Design high-converting landing pages with AI-powered copy and layout suggestions.',
      icon: Palette,
      category: 'Web Design',
      route: '/landing-page-builder'
    },
    {
      id: 'workflow-explainer',
      name: 'AI Workflow Explainer',
      description: 'Understand and optimize complex AI workflows with detailed explanations.',
      icon: Settings,
      category: 'Education',
      route: '/workflow-explainer'
    },
    {
      id: 'content-calendar-generator',
      name: 'Content Calendar Generator',
      description: 'Plan and schedule your content strategy with AI-generated calendar templates.',
      icon: Calendar,
      category: 'Content Planning',
      route: '/content-calendar-generator'
    },
    {
      id: 'movie-matchmaker',
      name: 'Movie and TV Show Matchmaker',
      description: 'AI-powered watchlist generator that matches your mood, preferences and content type to find perfect movies and TV shows.',
      icon: Film,
      category: 'Entertainment',
      route: '/movie-matchmaker'
    },
    {
      id: 'pricing-strategy-assistant',
      name: 'Pricing Strategy Assistant',
      description: 'Optimize your pricing strategy with AI-driven market analysis and recommendations.',
      icon: DollarSign,
      category: 'Business Strategy',
      route: '/pricing-strategy-assistant'
    },
    {
      id: 'brand-kit-generator',
      name: 'Brand Kit Generator',
      description: 'Create complete brand identity packages with logos, colors, and style guides.',
      icon: Target,
      category: 'Branding',
      route: '/brand-kit-generator'
    },
    {
      id: 'lead-magnet-builder',
      name: 'Lead Magnet Builder',
      description: 'Design compelling lead magnets that capture and convert your target audience.',
      icon: Magnet,
      category: 'Lead Generation',
      route: '/lead-magnet-builder'
    },
    {
      id: 'business-name-generator',
      name: 'Marketing Copy Generator',
      description: 'Generate compelling marketing copy for ads, emails, and website content.',
      icon: Building2,
      category: 'Copywriting',
      route: '/business-name-generator'
    },
    {
      id: 'headline-split-test-generator',
      name: 'Headline Split-Test Generator',
      description: 'Create multiple headline variations for A/B testing and optimization.',
      icon: Eye,
      category: 'Testing & Optimization',
      route: '/headline-split-test-generator'
    },
    {
      id: 'business-idea-validator',
      name: 'Business Idea Validator',
      description: 'Validate your business ideas with market research and feasibility analysis.',
      icon: Lightbulb,
      category: 'Business Strategy',
      route: '/business-idea-validator'
    },
    {
      id: 'crm-use-case-finder',
      name: 'CRM Use Case Finder',
      description: 'Discover optimal CRM implementations and use cases for your business type.',
      icon: Users,
      category: 'Business Tools',
      route: '/crm-use-case-finder'
    },
    {
      id: 'travel-hacker-pro',
      name: 'Travel Hacker AI Pro',
      description: 'Advanced AI-powered travel planning with TrueTotal™ pricing, DealRank™ scoring, and Mistake Fare Radar.',
      icon: Plane,
      category: 'Travel & Lifestyle',
      route: '/travel-hacker-pro',
      featured: true
    }
  ];

  const categories = Array.from(new Set(tools.map(tool => tool.category)));
  const featuredTools = tools.filter(tool => tool.featured);

  // Filter tools based on search and category
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Quick access tools (most popular/useful)
  const quickAccessTools = [
    tools.find(t => t.id === 'build-ai-stack'),
    tools.find(t => t.id === 'trending-content-generator'),
    tools.find(t => t.id === 'competitor-intel-scanner'),
    tools.find(t => t.id === 'movie-matchmaker'),
    tools.find(t => t.id === 'travel-hacker-pro'),
    tools.find(t => t.id === 'ai-tool-quiz')
  ].filter(Boolean);

  const ToolCard = ({ tool, compact = false }: { tool: Tool; compact?: boolean }) => {
    if (compact) {
      return (
        <Card 
          className="border-muted/20 hover:border-primary/20 transition-all duration-200 hover:shadow-md group cursor-pointer p-4"
          onClick={() => setLocation(tool.route)}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <tool.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                {tool.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {tool.description}
              </p>
            </div>
            <Badge variant="outline" className="text-xs shrink-0">
              {tool.category}
            </Badge>
          </div>
        </Card>
      );
    }

    return (
      <Card 
        className="h-full border-muted/20 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group cursor-pointer"
        onClick={() => setLocation(tool.route)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <tool.icon className="w-6 h-6 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              {tool.category}
            </Badge>
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {tool.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-muted-foreground mb-4">
            {tool.description}
          </CardDescription>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
            Launch Tool
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free AI Tools - Advanta AI | 24+ Professional AI Tools</title>
        <meta name="description" content="Access 24+ free AI tools for business growth, content creation, marketing, and automation. Build your AI stack with professional-grade tools from Advanta AI." />
        <meta property="og:title" content="Free AI Tools - Advanta AI" />
        <meta property="og:description" content="24+ free professional AI tools for business growth, content creation, and automation." />
      </Helmet>

      <NewHeader />

      {/* Hero Section */}
      <section className="pt-16 pb-6 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                <Zap className="w-4 h-4 mr-2" />
                24+ Free AI Tools
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Professional AI Tools
                <span className="block text-primary">Completely Free</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Access our complete suite of AI-powered tools. No credit card required. <a href="/about" className="text-primary hover:underline">Who built these tools?</a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-6 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Quick Access</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                View All →
              </Button>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickAccessTools.slice(0, 6).map((tool, index) => (
                <motion.div key={tool?.id} variants={fadeIn} custom={index}>
                  <ToolCard tool={tool!} compact={true} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tools by name, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div className="mb-4">
                <div className="flex flex-wrap gap-1.5 mb-4 justify-center md:justify-start">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    className="text-xs px-3 py-1.5 h-auto"
                  >
                    All
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-xs px-3 py-1.5 h-auto"
                    >
                      {category.length > 12 ? category.split(' ')[0] : category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-0">
                {filteredTools.length === 0 ? (
                  <div className="text-center py-12">
                    <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tools found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
                  </div>
                ) : (
                  <div className={
                    viewMode === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-3"
                  }>
                    {filteredTools.map((tool, index) => (
                      <motion.div 
                        key={tool.id} 
                        variants={fadeIn} 
                        custom={index}
                        initial="hidden"
                        animate="show"
                      >
                        <ToolCard tool={tool} compact={viewMode === 'list'} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start with our free tools and see the impact AI can have on your operations. 
                No limits, no restrictions, just powerful AI at your fingertips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => setLocation('/build-my-ai-stack')}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Building Your AI Stack
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setLocation('/contact')}
                >
                  Get Custom AI Solutions
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}