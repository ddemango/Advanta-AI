import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { Helmet } from 'react-helmet';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';

interface AiTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  isPopular: boolean;
  isFeatured: boolean;
  authorName: string;
  authorImage: string;
  coverImage: string;
  demoLink: string;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  model: string;
  features: string[];
  releaseDate: string;
  lastUpdate: string;
  compatiblePlatforms: string[];
  integrations: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  implementationTime: string;
  type: 'Agent' | 'Plugin' | 'Custom Model' | 'Connector' | 'Workflow';
}

export default function Marketplace() {
  const [templates, setTemplates] = useState<AiTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<AiTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [activeTab, setActiveTab] = useState('all');
  const [userRatings, setUserRatings] = useState<{[key: string]: number}>({});
  const { toast } = useToast();

  // Initialize demo templates
  useEffect(() => {
    const demoTemplates: AiTemplate[] = [
      {
        id: '1',
        name: 'Intelligent Customer Support Agent',
        description: 'An AI agent that can handle customer inquiries, process refunds, and escalate complex issues to human agents when necessary.',
        category: 'Customer Service',
        tags: ['Support', 'Sales', 'Ticketing'],
        price: 0,
        isPopular: true,
        isFeatured: true,
        authorName: 'AdvantaAI',
        authorImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        coverImage: 'https://images.unsplash.com/photo-1560264280-88b68371db39?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500',
        demoLink: '/demo',
        downloadCount: 3478,
        rating: 4.8,
        reviewCount: 342,
        model: 'Claude 3.5 Sonnet',
        features: [
          'Multi-language support (20+ languages)',
          'Knowledge base integration',
          'Automated response suggestions',
          'Sentiment analysis',
          'Escalation protocols'
        ],
        releaseDate: '2024-03-15',
        lastUpdate: '2024-05-01',
        compatiblePlatforms: ['Web', 'Mobile', 'Slack', 'Discord', 'MS Teams'],
        integrations: ['Zendesk', 'Intercom', 'Salesforce', 'HubSpot'],
        complexity: 'Intermediate',
        implementationTime: '2-3 days',
        type: 'Agent'
      },
      {
        id: '2',
        name: 'Data Analytics Dashboard Connector',
        description: 'Connect your AI models to data visualization tools with this connector that automatically generates insightful dashboards from your data.',
        category: 'Analytics',
        tags: ['BI', 'Dashboards', 'Reporting'],
        price: 49,
        isPopular: true,
        isFeatured: false,
        authorName: 'DataVizPro',
        authorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500',
        demoLink: '/demo',
        downloadCount: 1845,
        rating: 4.6,
        reviewCount: 156,
        model: 'Any',
        features: [
          'Automated chart generation',
          'Real-time data processing',
          'Customizable dashboard templates',
          'Anomaly detection',
          'Scheduled reporting'
        ],
        releaseDate: '2024-01-20',
        lastUpdate: '2024-04-15',
        compatiblePlatforms: ['Web', 'Desktop'],
        integrations: ['Tableau', 'Power BI', 'Google Data Studio', 'Looker'],
        complexity: 'Intermediate',
        implementationTime: '1-2 days',
        type: 'Connector'
      },
      {
        id: '3',
        name: 'Document Analyzer Pro',
        description: 'Specialized model fine-tuned for document analysis, contract review, and legal document processing with high accuracy.',
        category: 'Legal',
        tags: ['Documents', 'Contracts', 'Legal'],
        price: 199,
        isPopular: false,
        isFeatured: true,
        authorName: 'LegalTech AI',
        authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500',
        demoLink: '/demo',
        downloadCount: 976,
        rating: 4.9,
        reviewCount: 103,
        model: 'Custom GPT-4 Fine-tune',
        features: [
          'Contract risk analysis',
          'Legal compliance checking',
          'Clause extraction and categorization',
          'Document comparison',
          'Legal citation validation'
        ],
        releaseDate: '2024-02-10',
        lastUpdate: '2024-05-05',
        compatiblePlatforms: ['Web', 'Desktop', 'API'],
        integrations: ['DocuSign', 'Adobe Acrobat', 'Microsoft Word', 'Google Docs'],
        complexity: 'Advanced',
        implementationTime: '3-5 days',
        type: 'Custom Model'
      },
      {
        id: '4',
        name: 'E-commerce Product Recommender',
        description: 'AI-powered product recommendation engine that uses customer behavior, purchase history, and product attributes to boost sales.',
        category: 'E-commerce',
        tags: ['Recommendations', 'Sales', 'Products'],
        price: 79,
        isPopular: true,
        isFeatured: false,
        authorName: 'ShopSmart AI',
        authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        coverImage: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500',
        demoLink: '/demo',
        downloadCount: 2567,
        rating: 4.5,
        reviewCount: 218,
        model: 'Custom Transformer',
        features: [
          'Personalized recommendations',
          'Cross-selling suggestions',
          'Upselling opportunities',
          'Seasonal trend detection',
          'A/B testing capabilities'
        ],
        releaseDate: '2023-11-15',
        lastUpdate: '2024-04-10',
        compatiblePlatforms: ['Web', 'Mobile', 'API'],
        integrations: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce'],
        complexity: 'Intermediate',
        implementationTime: '2-4 days',
        type: 'Plugin'
      },
      {
        id: '5',
        name: 'Healthcare Patient Triage Workflow',
        description: 'Automated workflow for patient symptom assessment, risk evaluation, and appointment scheduling based on urgency.',
        category: 'Healthcare',
        tags: ['Medical', 'Triage', 'Scheduling'],
        price: 299,
        isPopular: false,
        isFeatured: true,
        authorName: 'MediTech AI',
        authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500',
        demoLink: '/demo',
        downloadCount: 834,
        rating: 4.7,
        reviewCount: 79,
        model: 'Claude 3 Opus',
        features: [
          'Symptom assessment and prioritization',
          'Medical history integration',
          'Risk factor analysis',
          'Scheduling optimization',
          'Follow-up protocols'
        ],
        releaseDate: '2024-01-05',
        lastUpdate: '2024-05-10',
        compatiblePlatforms: ['Web', 'Mobile', 'API'],
        integrations: ['Epic', 'Cerner', 'MEDITECH', 'Allscripts'],
        complexity: 'Advanced',
        implementationTime: '5-7 days',
        type: 'Workflow'
      },
      {
        id: '6',
        name: 'Content Creation Assistant',
        description: 'AI-powered assistant that helps content creators generate ideas, outlines, and full drafts for articles, social media, and marketing materials.',
        category: 'Marketing',
        tags: ['Content', 'Copywriting', 'Social Media'],
        price: 29,
        isPopular: true,
        isFeatured: false,
        authorName: 'CreativePulse',
        authorImage: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        coverImage: 'https://images.unsplash.com/photo-1571715696201-e793042286d5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500',
        demoLink: '/demo',
        downloadCount: 4129,
        rating: 4.4,
        reviewCount: 376,
        model: 'GPT-4o',
        features: [
          'SEO-optimized content generation',
          'Multi-platform format adaptation',
          'Brand voice customization',
          'Content calendar planning',
          'Performance analytics'
        ],
        releaseDate: '2023-12-10',
        lastUpdate: '2024-04-20',
        compatiblePlatforms: ['Web', 'Browser Extension'],
        integrations: ['WordPress', 'HubSpot', 'Buffer', 'Hootsuite'],
        complexity: 'Beginner',
        implementationTime: '1 day',
        type: 'Agent'
      },
      {
        id: '7',
        name: 'Financial Investment Advisor',
        description: 'AI agent that provides personalized investment recommendations, portfolio analysis, and market trend insights.',
        category: 'Finance',
        tags: ['Investments', 'Portfolio', 'Market Analysis'],
        price: 149,
        isPopular: false,
        isFeatured: true,
        authorName: 'FinTech Innovations',
        authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        coverImage: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500',
        demoLink: '/demo',
        downloadCount: 1243,
        rating: 4.6,
        reviewCount: 132,
        model: 'Custom GPT-4 & Quantitative Models',
        features: [
          'Personalized investment strategies',
          'Risk assessment and management',
          'Market trend analysis',
          'Portfolio diversification recommendations',
          'Tax-efficient investment planning'
        ],
        releaseDate: '2024-02-01',
        lastUpdate: '2024-05-15',
        compatiblePlatforms: ['Web', 'Mobile', 'API'],
        integrations: ['Bloomberg Terminal', 'Trading View', 'Yahoo Finance', 'Interactive Brokers'],
        complexity: 'Advanced',
        implementationTime: '3-4 days',
        type: 'Agent'
      },
      {
        id: '8',
        name: 'Smart Manufacturing Optimization',
        description: 'AI system that optimizes manufacturing processes, predicts maintenance needs, and improves production efficiency.',
        category: 'Manufacturing',
        tags: ['Production', 'Maintenance', 'Optimization'],
        price: 399,
        isPopular: false,
        isFeatured: false,
        authorName: 'IndustryAI',
        authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        coverImage: 'https://images.unsplash.com/photo-1621792073827-a4c9464304c0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500',
        demoLink: '/demo',
        downloadCount: 765,
        rating: 4.9,
        reviewCount: 65,
        model: 'Custom Neural Networks & ML Models',
        features: [
          'Predictive maintenance scheduling',
          'Production line optimization',
          'Quality control automation',
          'Supply chain integration',
          'Energy usage optimization'
        ],
        releaseDate: '2024-03-01',
        lastUpdate: '2024-05-05',
        compatiblePlatforms: ['Industrial IoT', 'API', 'On-premises'],
        integrations: ['SAP', 'Siemens MindSphere', 'PTC ThingWorx', 'GE Predix'],
        complexity: 'Advanced',
        implementationTime: '7-14 days',
        type: 'Workflow'
      },
      {
        id: '9',
        name: 'Autonomous Customer Segmentation',
        description: 'AI plugin that automatically segments customers based on behavior, demographics, and purchasing patterns for targeted marketing.',
        category: 'Marketing',
        tags: ['CRM', 'Segmentation', 'Analytics'],
        price: 89,
        isPopular: true,
        isFeatured: false,
        authorName: 'MarketMind',
        authorImage: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500',
        demoLink: '/demo',
        downloadCount: 1876,
        rating: 4.5,
        reviewCount: 208,
        model: 'Custom Clustering Algorithms',
        features: [
          'Behavioral segmentation',
          'Predictive customer lifecycle mapping',
          'Persona generation',
          'Campaign targeting optimization',
          'Cohort analysis'
        ],
        releaseDate: '2023-10-15',
        lastUpdate: '2024-04-10',
        compatiblePlatforms: ['Web', 'API'],
        integrations: ['Salesforce', 'HubSpot', 'Marketo', 'Mailchimp'],
        complexity: 'Intermediate',
        implementationTime: '2-3 days',
        type: 'Plugin'
      },
      {
        id: '10',
        name: 'Real Estate Valuation Model',
        description: 'Specialized AI model for accurate real estate valuation considering location, property features, market trends, and economic indicators.',
        category: 'Real Estate',
        tags: ['Valuation', 'Property', 'Pricing'],
        price: 199,
        isPopular: false,
        isFeatured: true,
        authorName: 'PropTech AI',
        authorImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        coverImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500',
        demoLink: '/demo',
        downloadCount: 892,
        rating: 4.8,
        reviewCount: 97,
        model: 'Custom ML Ensemble',
        features: [
          'Hyper-local market analysis',
          'Comparable property identification',
          'Feature-based value adjustments',
          'Future value prediction',
          'Investment potential scoring'
        ],
        releaseDate: '2024-02-15',
        lastUpdate: '2024-05-12',
        compatiblePlatforms: ['Web', 'Mobile', 'API'],
        integrations: ['MLS', 'Zillow', 'Redfin', 'PropertyBase'],
        complexity: 'Advanced',
        implementationTime: '3-5 days',
        type: 'Custom Model'
      },
      {
        id: '11',
        name: 'HR Recruiting Assistant',
        description: 'AI agent that streamlines recruitment by screening resumes, scheduling interviews, and providing candidate assessments.',
        category: 'Human Resources',
        tags: ['Recruiting', 'Hiring', 'HR'],
        price: 129,
        isPopular: true,
        isFeatured: false,
        authorName: 'TalentAI',
        authorImage: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        coverImage: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500',
        demoLink: '/demo',
        downloadCount: 1543,
        rating: 4.4,
        reviewCount: 165,
        model: 'Claude 3.5 Haiku',
        features: [
          'Resume parsing and screening',
          'Automated candidate communication',
          'Skills assessment',
          'Interview scheduling',
          'Diversity and inclusion monitoring'
        ],
        releaseDate: '2023-11-01',
        lastUpdate: '2024-04-05',
        compatiblePlatforms: ['Web', 'API'],
        integrations: ['Workday', 'ATS systems', 'LinkedIn', 'Calendly'],
        complexity: 'Intermediate',
        implementationTime: '2-3 days',
        type: 'Agent'
      },
      {
        id: '12',
        name: 'Supply Chain Optimization Connector',
        description: 'Connector that links inventory, logistics, and procurement systems to optimize supply chain operations with AI-powered predictions.',
        category: 'Logistics',
        tags: ['Supply Chain', 'Inventory', 'Logistics'],
        price: 249,
        isPopular: false,
        isFeatured: true,
        authorName: 'LogisticsPro AI',
        authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        coverImage: 'https://images.unsplash.com/photo-1566576612389-aae9b80e9c7d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500',
        demoLink: '/demo',
        downloadCount: 786,
        rating: 4.7,
        reviewCount: 82,
        model: 'Custom ML Predictions',
        features: [
          'Demand forecasting',
          'Inventory optimization',
          'Route planning',
          'Supplier performance analysis',
          'Risk mitigation recommendations'
        ],
        releaseDate: '2024-03-10',
        lastUpdate: '2024-05-08',
        compatiblePlatforms: ['Web', 'API', 'Cloud'],
        integrations: ['SAP', 'Oracle SCM', 'Manhattan Associates', 'JDA Software'],
        complexity: 'Advanced',
        implementationTime: '5-8 days',
        type: 'Connector'
      }
    ];

    setTemplates(demoTemplates);
    setFilteredTemplates(demoTemplates);
  }, []);

  // Filter and sort templates based on user selections
  useEffect(() => {
    let filtered = [...templates];

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(template => template.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(template => template.type.toLowerCase() === typeFilter.toLowerCase());
    }

    // Apply tab filter
    if (activeTab === 'popular') {
      filtered = filtered.filter(template => template.isPopular);
    } else if (activeTab === 'featured') {
      filtered = filtered.filter(template => template.isFeatured);
    } else if (activeTab === 'free') {
      filtered = filtered.filter(template => template.price === 0);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        template => template.name.toLowerCase().includes(query) || 
                    template.description.toLowerCase().includes(query) ||
                    template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
    }

    setFilteredTemplates(filtered);
  }, [templates, searchQuery, categoryFilter, typeFilter, sortBy, activeTab]);

  // Function to handle user ratings
  const handleRateTemplate = (templateId: string, rating: number) => {
    // Update local state
    setUserRatings(prev => ({
      ...prev,
      [templateId]: rating
    }));

    // Show confirmation toast
    toast({
      title: 'Rating submitted!',
      description: `You rated this template ${rating} stars. Thank you for your feedback!`,
      duration: 3000,
    });

    // In a real app, we would send this to the server
    console.log(`Template ${templateId} rated ${rating} stars`);
  };

  // Template categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'customer service', label: 'Customer Service' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'e-commerce', label: 'E-commerce' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'legal', label: 'Legal' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'real estate', label: 'Real Estate' },
    { value: 'human resources', label: 'Human Resources' },
    { value: 'logistics', label: 'Logistics' }
  ];

  // Template types for filtering
  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'agent', label: 'Agent' },
    { value: 'plugin', label: 'Plugin' },
    { value: 'custom model', label: 'Custom Model' },
    { value: 'connector', label: 'Connector' },
    { value: 'workflow', label: 'Workflow' }
  ];

  // Sorting options
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  return (
    <>
      <Helmet>
        <title>AI Template Marketplace | Advanta AI</title>
        <meta name="description" content="Browse our collection of AI templates, agents, and connectors with community ratings. Find the perfect AI solution for your business needs." />
        <meta property="og:title" content="AI Template Marketplace | Advanta AI" />
        <meta property="og:description" content="Browse our collection of AI templates, agents, and connectors with community ratings. Find the perfect AI solution for your business needs." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 bg-[length:40px_40px] opacity-10"></div>
          
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
              <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Discover and implement pre-built AI solutions with community-driven ratings
              </motion.p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              className="max-w-3xl mx-auto mt-8"
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search AI templates, plugins, and agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg shadow-lg bg-background/80 backdrop-blur-sm border-white/10"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <i className="fas fa-search text-lg"></i>
                </div>
                {searchQuery && (
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </motion.div>

            {/* Marketplace Stats */}
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-background/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">100+</div>
                <div className="text-gray-300 text-sm">AI Templates</div>
              </div>
              <div className="bg-background/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-gray-300 text-sm">Integrations</div>
              </div>
              <div className="bg-background/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">15K+</div>
                <div className="text-gray-300 text-sm">Downloads</div>
              </div>
              <div className="bg-background/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">4.7</div>
                <div className="text-gray-300 text-sm">Avg. Rating</div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Marketplace Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Controls */}
            <div className="bg-background/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Template Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset Filters */}
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                      setTypeFilter('all');
                      setSortBy('popular');
                      setActiveTab('all');
                    }}
                    className="w-full"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* Template Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid grid-cols-4 md:w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="free">Free</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {filteredTemplates.length} {filteredTemplates.length === 1 ? 'Template' : 'Templates'} Found
              </h2>
            </div>

            {/* Template Grid */}
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                  <motion.div 
                    key={template.id} 
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * Math.random() }}
                  >
                    <Card className="bg-background/50 backdrop-blur-sm border border-white/10 hover:border-primary/40 transition-colors overflow-hidden h-full flex flex-col">
                      <div className="relative">
                        <img 
                          src={template.coverImage} 
                          alt={template.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                        
                        {/* Price Tag */}
                        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 text-sm font-semibold">
                          {template.price === 0 ? (
                            <span className="text-green-400">Free</span>
                          ) : (
                            <span>${template.price}</span>
                          )}
                        </div>
                        
                        {/* Type Badge */}
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-white/20">
                            {template.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{template.name}</CardTitle>
                            <div className="text-sm text-gray-400 mt-1">
                              by <span className="text-primary">{template.authorName}</span>
                            </div>
                          </div>
                          <img 
                            src={template.authorImage} 
                            alt={template.authorName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-primary/30"
                          />
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pb-2 flex-grow">
                        <CardDescription className="text-gray-400 line-clamp-3 mb-4">
                          {template.description}
                        </CardDescription>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {template.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary border-none">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center">
                            <i className="fas fa-download mr-1 text-gray-400"></i>
                            <span>{template.downloadCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="flex mr-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button 
                                  key={star} 
                                  className={`text-lg focus:outline-none ${
                                    (userRatings[template.id] || template.rating) >= star 
                                      ? 'text-yellow-400' 
                                      : 'text-gray-600'
                                  }`}
                                  onClick={() => handleRateTemplate(template.id, star)}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                            <span>({template.reviewCount})</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 text-sm text-gray-400">
                          <div className="flex justify-between mb-1">
                            <span>Model:</span>
                            <span className="text-gray-300">{template.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Complexity:</span>
                            <span className={`
                              ${template.complexity === 'Beginner' ? 'text-green-400' : ''}
                              ${template.complexity === 'Intermediate' ? 'text-yellow-400' : ''}
                              ${template.complexity === 'Advanced' ? 'text-red-400' : ''}
                            `}>
                              {template.complexity}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-2 border-t border-white/5 flex justify-between">
                        <Button variant="outline" asChild>
                          <Link href={`/template/${template.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button asChild>
                          <Link href={template.demoLink}>
                            Try Demo
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl text-gray-500 mb-4">
                  <i className="fas fa-search"></i>
                </div>
                <h3 className="text-2xl font-semibold mb-2">No templates found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search query</p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setTypeFilter('all');
                    setSortBy('popular');
                    setActiveTab('all');
                  }}
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Submit Template CTA */}
        <section className="py-20 bg-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6">
                Create Your Own <GradientText>AI Template</GradientText>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8">
                Have an amazing AI solution? Join our marketplace and share it with the community.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Button size="lg" className="px-8">
                  Submit Your Template
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