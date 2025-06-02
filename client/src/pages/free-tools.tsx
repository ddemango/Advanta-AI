import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
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
  Palette,
  Settings,
  Calendar,
  DollarSign,
  Target,
  Magnet,
  Building2,
  Eye,
  Lightbulb,
  Video,
  Workflow
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
    }
  ];

  const categories = Array.from(new Set(tools.map(tool => tool.category)));
  const featuredTools = tools.filter(tool => tool.featured);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free AI Tools - Advanta AI | 24+ Professional AI Tools</title>
        <meta name="description" content="Access 24+ free AI tools for business growth, content creation, marketing, and automation. Build your AI stack with professional-grade tools from Advanta AI." />
        <meta property="og:title" content="Free AI Tools - Advanta AI" />
        <meta property="og:description" content="24+ free professional AI tools for business growth, content creation, and automation." />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-background via-background/95 to-primary/5">
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
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Professional AI Tools
                <span className="block text-primary">Completely Free</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Access our complete suite of AI-powered tools designed to accelerate your business growth, 
                streamline workflows, and unlock new opportunities. No credit card required.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center mb-4">
              Featured Tools
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Our most popular AI tools that deliver immediate value for businesses of all sizes.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredTools.map((tool, index) => (
                <motion.div key={tool.id} variants={fadeIn} custom={index}>
                  <Card className="h-full border-muted/20 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group cursor-pointer"
                        onClick={() => setLocation(tool.route)}>
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
                        Try Tool Free
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Tools by Category */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center mb-12">
              All AI Tools
            </motion.h2>

            {categories.map((category, categoryIndex) => {
              const categoryTools = tools.filter(tool => tool.category === category);
              
              return (
                <motion.div 
                  key={category} 
                  variants={fadeInUp}
                  custom={categoryIndex}
                  className="mb-12"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-primary">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryTools.map((tool, index) => (
                      <Card key={tool.id} 
                            className="border-muted/20 hover:border-primary/20 transition-all duration-300 hover:shadow-md group cursor-pointer"
                            onClick={() => setLocation(tool.route)}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <tool.icon className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {tool.name}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="text-sm text-muted-foreground mb-3">
                            {tool.description}
                          </CardDescription>
                          <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary/10 transition-colors">
                            Launch Tool →
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              );
            })}
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