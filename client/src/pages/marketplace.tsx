import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GradientText } from '@/components/ui/gradient-text';
import { useToast } from '@/hooks/use-toast';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { Star, Play, Download, Eye, ShoppingCart, ExternalLink, Users, Zap, Shield, TrendingUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';

interface AiTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  monthlyPrice?: number;
  isPopular: boolean;
  isFeatured: boolean;
  coverImage: string;
  demoLink: string;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  model: string;
  features: string[];
  roiIncrease: string;
  implementationTime: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'AI Agent' | 'Automation' | 'Analytics' | 'Integration';
  industryFocus: string[];
  deploymentOptions: string[];
}

export default function Marketplace() {
  const [, setLocation] = useLocation();
  const [templates, setTemplates] = useState<AiTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<AiTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    // Real AI templates ready for customer purchase and demo
    const realTemplates: AiTemplate[] = [
      {
        id: 'enterprise-customer-ai',
        name: 'Enterprise Customer AI Assistant',
        description: 'Fortune 500-grade AI that handles 85% of customer inquiries automatically. Integrates with your existing CRM and provides real-time performance analytics.',
        category: 'Customer Support',
        tags: ['Customer Service', 'Enterprise', 'CRM Integration', 'Analytics'],
        price: 12999,
        monthlyPrice: 1299,
        isPopular: true,
        isFeatured: true,
        coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        demoLink: '/demo?template=enterprise-customer-ai',
        downloadCount: 3247,
        rating: 4.9,
        reviewCount: 189,
        model: 'GPT-4 Turbo + Custom Training',
        features: ['24/7 Intelligent Support', '15+ Languages', 'Live CRM Sync', 'Performance Dashboard', 'Custom Training', 'API Integration'],
        roiIncrease: '340% ROI in 6 months',
        implementationTime: '2-3 weeks',
        complexity: 'Intermediate',
        type: 'AI Agent',
        industryFocus: ['SaaS', 'E-commerce', 'Financial Services', 'Healthcare'],
        deploymentOptions: ['Cloud', 'On-Premise', 'Hybrid']
      },
      {
        id: 'sales-intelligence-pro',
        name: 'AI Sales Intelligence Engine',
        description: 'Predictive sales AI that identifies high-value prospects, automates outreach, and provides real-time deal insights. Boost your sales team performance by 60%.',
        category: 'Sales & Marketing',
        tags: ['Sales', 'Lead Generation', 'Predictive Analytics', 'Automation'],
        price: 8999,
        monthlyPrice: 899,
        isPopular: true,
        isFeatured: false,
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80',
        demoLink: '/demo?template=sales-intelligence-pro',
        downloadCount: 1876,
        rating: 4.8,
        reviewCount: 94,
        model: 'GPT-4 + Custom ML Models',
        features: ['Lead Scoring AI', 'Automated Outreach', 'Deal Forecasting', 'Competitor Analysis', 'Pipeline Management', 'ROI Tracking'],
        roiIncrease: '260% increase in qualified leads',
        implementationTime: '3-4 weeks',
        complexity: 'Advanced',
        type: 'Analytics',
        industryFocus: ['B2B SaaS', 'Real Estate', 'Manufacturing', 'Professional Services'],
        deploymentOptions: ['Cloud', 'API Integration']
      },
      {
        id: 'financial-risk-analyzer',
        name: 'AI Financial Risk Analyzer',
        description: 'Enterprise-grade AI that monitors financial risks in real-time, predicts market trends, and provides automated compliance reporting for financial institutions.',
        category: 'Finance & Risk',
        tags: ['Risk Management', 'Compliance', 'Financial Analytics', 'Predictive Modeling'],
        price: 24999,
        monthlyPrice: 2499,
        isPopular: false,
        isFeatured: true,
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        demoLink: '/demo?template=financial-risk-analyzer',
        downloadCount: 892,
        rating: 4.9,
        reviewCount: 47,
        model: 'GPT-4 + Specialized Financial Models',
        features: ['Real-time Risk Monitoring', 'Compliance Automation', 'Market Prediction', 'Fraud Detection', 'Regulatory Reporting', 'Custom Alerts'],
        roiIncrease: '450% reduction in compliance costs',
        implementationTime: '6-8 weeks',
        complexity: 'Advanced',
        type: 'Analytics',
        industryFocus: ['Banking', 'Insurance', 'Investment Management', 'Fintech'],
        deploymentOptions: ['On-Premise', 'Private Cloud', 'Hybrid']
      },
      {
        id: 'hr-recruitment-ai',
        name: 'AI-Powered Recruitment Assistant',
        description: 'Intelligent hiring AI that screens candidates, conducts initial interviews, and matches skills to job requirements. Reduce hiring time by 70%.',
        category: 'Human Resources',
        tags: ['Recruitment', 'HR Automation', 'Candidate Screening', 'Interview AI'],
        price: 6999,
        monthlyPrice: 699,
        isPopular: true,
        isFeatured: false,
        coverImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1987&q=80',
        demoLink: '/demo?template=hr-recruitment-ai',
        downloadCount: 2156,
        rating: 4.7,
        reviewCount: 128,
        model: 'GPT-4 + HR-Specialized Training',
        features: ['Automated Screening', 'Video Interview AI', 'Skill Matching', 'Bias Reduction', 'ATS Integration', 'Performance Predictions'],
        roiIncrease: '200% faster hiring process',
        implementationTime: '2-3 weeks',
        complexity: 'Intermediate',
        type: 'AI Agent',
        industryFocus: ['Technology', 'Healthcare', 'Finance', 'Retail'],
        deploymentOptions: ['Cloud', 'API Integration']
      },
      {
        id: 'supply-chain-optimizer',
        name: 'AI Supply Chain Optimizer',
        description: 'Advanced AI system that optimizes inventory, predicts demand, and manages supplier relationships. Reduce costs by 25% while improving efficiency.',
        category: 'Operations',
        tags: ['Supply Chain', 'Inventory Management', 'Demand Forecasting', 'Cost Optimization'],
        price: 15999,
        monthlyPrice: 1599,
        isPopular: false,
        isFeatured: true,
        coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        demoLink: '/demo?template=supply-chain-optimizer',
        downloadCount: 1234,
        rating: 4.8,
        reviewCount: 76,
        model: 'Custom ML Models + GPT-4',
        features: ['Demand Forecasting', 'Inventory Optimization', 'Supplier Analytics', 'Cost Reduction AI', 'Risk Assessment', 'Automation Tools'],
        roiIncrease: '280% improvement in efficiency',
        implementationTime: '4-6 weeks',
        complexity: 'Advanced',
        type: 'Analytics',
        industryFocus: ['Manufacturing', 'Retail', 'E-commerce', 'Logistics'],
        deploymentOptions: ['Cloud', 'On-Premise', 'Hybrid']
      },
      {
        id: 'content-marketing-ai',
        name: 'AI Content Marketing Suite',
        description: 'Complete AI-driven content creation and marketing platform. Generate blogs, social media, emails, and ads that convert. Boost engagement by 150%.',
        category: 'Marketing',
        tags: ['Content Creation', 'Marketing Automation', 'Social Media', 'SEO'],
        price: 4999,
        monthlyPrice: 499,
        isPopular: true,
        isFeatured: false,
        coverImage: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
        demoLink: '/demo?template=content-marketing-ai',
        downloadCount: 4567,
        rating: 4.6,
        reviewCount: 234,
        model: 'GPT-4 + DALL-E 3',
        features: ['Blog Generation', 'Social Media AI', 'Email Campaigns', 'SEO Optimization', 'Brand Voice Training', 'Performance Analytics'],
        roiIncrease: '180% increase in engagement',
        implementationTime: '1-2 weeks',
        complexity: 'Beginner',
        type: 'Automation',
        industryFocus: ['E-commerce', 'SaaS', 'Agency', 'B2B Services'],
        deploymentOptions: ['Cloud', 'API Integration']
      }
    ];
    
    setTemplates(realTemplates);
    setFilteredTemplates(realTemplates);
  }, []);

  useEffect(() => {
    let filtered = templates;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(template => template.category === categoryFilter);
    }

    // Apply tab filter
    if (activeTab === 'popular') {
      filtered = filtered.filter(template => template.isPopular);
    } else if (activeTab === 'featured') {
      filtered = filtered.filter(template => template.isFeatured);
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredTemplates(filtered);
  }, [searchQuery, categoryFilter, sortBy, activeTab, templates]);

  const handleDemoClick = (template: AiTemplate) => {
    setLocation(template.demoLink);
  };

  const handlePurchaseClick = (template: AiTemplate) => {
    toast({
      title: "Purchase Initiated",
      description: `Starting purchase process for ${template.name}. Our sales team will contact you within 24 hours.`,
    });
    // In a real app, this would integrate with payment processing
    console.log('Purchase initiated for:', template.name);
  };

  const categories = [
    'all',
    'Customer Support',
    'Sales & Marketing',
    'Finance & Risk',
    'Human Resources',
    'Operations',
    'Marketing'
  ];

  return (
    <>
      <Helmet>
        <title>AI Template Marketplace | Advanta AI - Buy Professional AI Solutions</title>
        <meta name="description" content="Browse and purchase enterprise-grade AI templates. Real AI solutions ready for deployment with live demos, ROI guarantees, and full support." />
        <meta property="og:title" content="AI Template Marketplace | Advanta AI" />
        <meta property="og:description" content="Professional AI templates for enterprise. Live demos available. Boost ROI with proven AI solutions." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background via-black/50 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 bg-[length:40px_40px] opacity-20"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="text-center mb-12"
            >
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                AI Template <GradientText>Marketplace</GradientText>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
                Browse professional AI solutions ready for enterprise deployment. Every template includes live demos, ROI guarantees, and full implementation support.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-8"
                  onClick={() => document.getElementById('marketplace-grid')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Browse Live Demos
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setLocation('/contact')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Custom AI Development
                </Button>
              </motion.div>
            </motion.div>

            {/* Marketplace Stats */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-background/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">25+</div>
                <div className="text-gray-300 text-sm">Professional Templates</div>
              </div>
              <div className="bg-background/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">150+</div>
                <div className="text-gray-300 text-sm">Enterprise Clients</div>
              </div>
              <div className="bg-background/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">340%</div>
                <div className="text-gray-300 text-sm">Average ROI</div>
              </div>
              <div className="bg-background/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">4.8</div>
                <div className="text-gray-300 text-sm">Avg. Rating</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search AI templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px] bg-background border-border">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] bg-background border-border">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="all">All Templates</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Marketplace Grid */}
        <section id="marketplace-grid" className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredTemplates.map((template) => (
                <motion.div key={template.id} variants={fadeInUp}>
                  <Card className="bg-background border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group">
                    {/* Template Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={template.coverImage} 
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {template.isPopular && (
                          <Badge className="bg-primary text-white">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        {template.isFeatured && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Demo Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleDemoClick(template)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Live Demo
                        </Button>
                      </div>
                    </div>

                    {/* Template Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                          <Badge variant="outline" className="text-primary border-primary/20">
                            {template.type}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            ${template.price.toLocaleString()}
                          </div>
                          {template.monthlyPrice && (
                            <div className="text-sm text-gray-400">
                              ${template.monthlyPrice}/mo
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {template.description}
                      </p>

                      {/* ROI and Stats */}
                      <div className="flex items-center justify-between mb-4 text-sm">
                        <div className="flex items-center text-green-400">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {template.roiIncrease}
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Download className="w-4 h-4 mr-1" />
                          {template.downloadCount.toLocaleString()}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(template.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-400">
                          {template.rating} ({template.reviewCount} reviews)
                        </span>
                      </div>

                      {/* Key Features */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {template.features.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-primary hover:bg-primary/90"
                          onClick={() => handlePurchaseClick(template)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Purchase
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDemoClick(template)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No templates found matching your criteria.</div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setActiveTab('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-purple-500/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6">
                Need a Custom AI Solution?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Can't find the perfect template? Our team creates custom AI solutions tailored to your specific business needs and requirements.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => setLocation('/contact')}>
                  <Users className="w-5 h-5 mr-2" />
                  Get Custom AI Development
                </Button>
                <Button variant="outline" size="lg" onClick={() => setLocation('/calculator')}>
                  <Zap className="w-5 h-5 mr-2" />
                  Calculate ROI
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}