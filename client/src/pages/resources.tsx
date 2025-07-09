import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NewHeader } from '@/components/redesign/NewHeader';
import { NewFooter } from '@/components/redesign/NewFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download,
  ArrowRight,
  Star,
  Brain,
  Wrench,
  BarChart3,
  Play,
  Calendar,
  Mail,
  ExternalLink,
  Filter,
  Search,
  Sparkles
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'template' | 'case-study';
  category: 'ai-strategy' | 'tools-templates' | 'guides' | 'videos' | 'case-studies';
  thumbnail: string;
  link: string;
  featured?: boolean;
  readTime?: string;
  downloadCount?: string;
}

export default function ResourcesPage() {
  const [, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const categories = [
    { id: 'all', label: 'All Resources', icon: Filter },
    { id: 'ai-strategy', label: 'AI Strategy', icon: Brain },
    { id: 'tools-templates', label: 'Tools & Templates', icon: Wrench },
    { id: 'guides', label: 'Guides', icon: FileText },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'case-studies', label: 'Case Studies', icon: BarChart3 }
  ];

  const resources: Resource[] = [
    {
      id: 'ai-integration-playbook',
      title: 'AI Integration Playbook for Business Leaders',
      description: 'Complete guide to implementing AI solutions in your organization with step-by-step frameworks and real-world examples.',
      type: 'guide',
      category: 'ai-strategy',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&w=400&h=250&fit=crop',
      link: '/resources/ai-integration-playbook',
      featured: true,
      readTime: '15 min read',
      downloadCount: '2,847'
    },
    {
      id: 'chatbot-template',
      title: 'Customer Service Chatbot Template',
      description: 'Ready-to-deploy chatbot template with conversation flows, FAQ integration, and escalation protocols.',
      type: 'template',
      category: 'tools-templates',
      thumbnail: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&w=400&h=250&fit=crop',
      link: '/resources/chatbot-template',
      downloadCount: '1,523'
    },
    {
      id: 'automation-roi-calculator',
      title: 'Business Automation ROI Calculator',
      description: 'Calculate potential savings and productivity gains from AI automation implementations across different business functions.',
      type: 'template',
      category: 'tools-templates',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&w=400&h=250&fit=crop',
      link: '/roi-calculator',
      downloadCount: '956'
    },
    {
      id: 'ai-strategy-webinar',
      title: 'Building Your AI Strategy from Scratch',
      description: 'Watch our 45-minute deep-dive webinar on creating a comprehensive AI strategy that aligns with business goals.',
      type: 'video',
      category: 'videos',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&w=400&h=250&fit=crop',
      link: '/resources/ai-strategy-webinar',
      readTime: '45 min'
    },
    {
      id: 'llm-comparison-guide',
      title: 'LLM Model Comparison Guide 2025',
      description: 'Comprehensive analysis of GPT-4, Claude, Gemini, and other leading language models for business applications.',
      type: 'article',
      category: 'ai-strategy',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&w=400&h=250&fit=crop',
      link: '/resources/llm-comparison-guide',
      readTime: '12 min read'
    },
    {
      id: 'workflow-automation-templates',
      title: 'Top 10 Workflow Automation Templates',
      description: 'Pre-built automation templates for common business processes including lead generation, customer onboarding, and more.',
      type: 'template',
      category: 'tools-templates',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&w=400&h=250&fit=crop',
      link: '/resources/workflow-templates',
      downloadCount: '3,421'
    },
    {
      id: 'ai-implementation-case-study',
      title: 'How TechCorp Reduced Costs by 40% with AI',
      description: 'Detailed case study showing how a mid-size company implemented AI across operations to achieve significant cost savings.',
      type: 'case-study',
      category: 'case-studies',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&w=400&h=250&fit=crop',
      link: '/case-studies/techcorp-ai-implementation',
      readTime: '8 min read'
    },
    {
      id: 'prompt-engineering-masterclass',
      title: 'Prompt Engineering Masterclass',
      description: 'Learn advanced prompt engineering techniques to get better results from AI models in your business workflows.',
      type: 'video',
      category: 'videos',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&w=400&h=250&fit=crop',
      link: '/resources/prompt-engineering-masterclass',
      readTime: '35 min'
    },
    {
      id: 'ai-ethics-framework',
      title: 'AI Ethics & Governance Framework',
      description: 'Establish responsible AI practices with our comprehensive ethics framework and implementation guidelines.',
      type: 'guide',
      category: 'ai-strategy',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=400&h=250&fit=crop',
      link: '/resources/ai-ethics-framework',
      readTime: '20 min read'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesFilter = activeFilter === 'all' || resource.category === activeFilter;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const featuredResource = resources.find(r => r.featured);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    // Simulate subscription
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubscribing(false);
      setEmail('');
    }, 1000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen;
      case 'video': return Video;
      case 'guide': return FileText;
      case 'template': return Download;
      case 'case-study': return BarChart3;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-700';
      case 'video': return 'bg-red-100 text-red-700';
      case 'guide': return 'bg-green-100 text-green-700';
      case 'template': return 'bg-purple-100 text-purple-700';
      case 'case-study': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Resources Hub - Unlock the Power of AI | Advanta AI</title>
        <meta name="description" content="Explore expert insights, practical guides, AI templates, and real-world examples to help your business scale smarter with AI." />
        <meta name="keywords" content="AI resources, business automation guides, AI templates, AI strategy, machine learning tutorials" />
        
        <meta property="og:title" content="AI Resources Hub - Unlock the Power of AI | Advanta AI" />
        <meta property="og:description" content="Explore expert insights, practical guides, AI templates, and real-world examples to help your business scale smarter with AI." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <NewHeader />
        
        <main>
          {/* Hero Section */}
          <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl"></div>
              <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl"></div>
              <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-xl"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Unlock the Power of{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI
                  </span>{' '}
                  — One Resource at a Time
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  Explore expert insights, practical guides, AI templates, and real-world examples to help your business scale smarter.
                </p>

                {/* Search Bar */}
                <div className="max-w-md mx-auto relative">
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-12 pr-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Filter Categories */}
          <section className="py-8 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeFilter === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Resource */}
          {featuredResource && (
            <section className="py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-semibold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                      Editor's Pick
                    </span>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredResource.title}</h2>
                      <p className="text-lg text-gray-600 mb-6">{featuredResource.description}</p>
                      
                      <div className="flex items-center space-x-4 mb-6">
                        <span className="text-sm text-gray-500">{featuredResource.readTime}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{featuredResource.downloadCount} downloads</span>
                      </div>
                      
                      <Button
                        onClick={() => setLocation(featuredResource.link)}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Now
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <img
                        src={featuredResource.thumbnail}
                        alt={featuredResource.title}
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-blue-600 bg-opacity-20 rounded-xl"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {/* Resource Grid */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.map((resource, index) => {
                  if (resource.featured) return null; // Skip featured resource in grid
                  
                  const TypeIcon = getTypeIcon(resource.type);
                  
                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                      whileHover={{ y: -5 }}
                    >
                      <div className="relative">
                        <img
                          src={resource.thumbnail}
                          alt={resource.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                          <TypeIcon className="w-3 h-3 inline mr-1" />
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                          {resource.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {resource.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          {resource.readTime && (
                            <span className="text-sm text-gray-500">{resource.readTime}</span>
                          )}
                          {resource.downloadCount && (
                            <span className="text-sm text-gray-500">{resource.downloadCount} downloads</span>
                          )}
                        </div>
                        
                        <Button
                          onClick={() => setLocation(resource.link)}
                          variant="outline"
                          className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                        >
                          View Resource
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 md:p-12 shadow-lg text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Stay Ahead of the AI Curve
                </h2>
                
                <p className="text-xl text-gray-600 mb-8">
                  Join 2,000+ business leaders getting our best AI tips, updates & resources.
                </p>
                
                {isSubscribed ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to the community!</h3>
                    <p className="text-gray-600">Check your email for a confirmation and your first AI insights.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 flex-1"
                        required
                      />
                      <Button
                        type="submit"
                        disabled={isSubscribing}
                        className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubscribing ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          'Subscribe'
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-white"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Need a Custom AI Strategy?</h2>
                
                <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                  Schedule a 15-min strategy call with our team to explore custom GPTs, automations, or integrations.
                </p>
                
                <Button
                  onClick={() => setLocation('/demo')}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book a Demo
                </Button>
              </motion.div>
            </div>
          </section>
        </main>

        <NewFooter />
      </div>
    </>
  );
}