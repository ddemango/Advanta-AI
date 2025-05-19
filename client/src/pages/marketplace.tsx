import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';

// Plugin data
const plugins = [
  {
    id: 1,
    name: 'Sentiment Analysis',
    description: 'Analyze customer feedback and social media mentions to understand sentiment trends.',
    icon: 'face-smile',
    category: 'analytics',
    rating: 4.8,
    reviewCount: 124,
    price: 'From $29/mo',
    popular: true,
    new: false,
    tags: ['Customer Feedback', 'Social Media']
  },
  {
    id: 2,
    name: 'Document AI',
    description: 'Extract key information from contracts, invoices, and documents automatically.',
    icon: 'file-contract',
    category: 'document',
    rating: 4.7,
    reviewCount: 98,
    price: 'From $39/mo',
    popular: true,
    new: false,
    tags: ['Contract Analysis', 'Data Extraction']
  },
  {
    id: 3,
    name: 'AI Content Generator',
    description: 'Create marketing content, product descriptions, and social posts with AI assistance.',
    icon: 'pen-nib',
    category: 'content',
    rating: 4.9,
    reviewCount: 156,
    price: 'From $49/mo',
    popular: true,
    new: false,
    tags: ['Marketing', 'Copywriting']
  },
  {
    id: 4,
    name: 'Sales Forecaster',
    description: 'Predict future sales trends using ML algorithms trained on your historical data.',
    icon: 'chart-line',
    category: 'analytics',
    rating: 4.6,
    reviewCount: 87,
    price: 'From $59/mo',
    popular: false,
    new: false,
    tags: ['Sales', 'Forecasting']
  },
  {
    id: 5,
    name: 'Customer Segmentation',
    description: 'Automatically group customers based on behavior, preferences, and purchase history.',
    icon: 'users-gear',
    category: 'analytics',
    rating: 4.7,
    reviewCount: 112,
    price: 'From $45/mo',
    popular: false,
    new: true,
    tags: ['Marketing', 'Customer Analysis']
  },
  {
    id: 6,
    name: 'Meeting Assistant',
    description: 'Transcribe, summarize, and extract action items from video or audio meetings.',
    icon: 'microphone',
    category: 'productivity',
    rating: 4.8,
    reviewCount: 134,
    price: 'From $35/mo',
    popular: false,
    new: true,
    tags: ['Meetings', 'Transcription']
  },
  {
    id: 7,
    name: 'Code Assistant',
    description: 'Generate and optimize code snippets, debug issues, and suggest improvements.',
    icon: 'code',
    category: 'development',
    rating: 4.9,
    reviewCount: 201,
    price: 'From $59/mo',
    popular: true,
    new: false,
    tags: ['Development', 'Programming']
  },
  {
    id: 8,
    name: 'Visual Recognition',
    description: 'Identify objects, scenes, text, and attributes in images for various applications.',
    icon: 'camera',
    category: 'vision',
    rating: 4.7,
    reviewCount: 89,
    price: 'From $49/mo',
    popular: false,
    new: true,
    tags: ['Computer Vision', 'Image Analysis']
  },
  {
    id: 9,
    name: 'Data Cleansing',
    description: 'Automatically identify and fix data quality issues in your datasets.',
    icon: 'broom',
    category: 'data',
    rating: 4.6,
    reviewCount: 76,
    price: 'From $39/mo',
    popular: false,
    new: false,
    tags: ['Data Quality', 'Data Management']
  },
  {
    id: 10,
    name: 'AI Chatbot Builder',
    description: 'Create custom AI chatbots for customer support, sales, and internal operations.',
    icon: 'robot',
    category: 'chatbot',
    rating: 4.8,
    reviewCount: 142,
    price: 'From $79/mo',
    popular: true,
    new: false,
    tags: ['Customer Service', 'Automation']
  },
  {
    id: 11,
    name: 'Anomaly Detector',
    description: 'Detect unusual patterns and outliers in time-series data for early problem detection.',
    icon: 'triangle-exclamation',
    category: 'analytics',
    rating: 4.7,
    reviewCount: 97,
    price: 'From $55/mo',
    popular: false,
    new: false,
    tags: ['Monitoring', 'Security']
  },
  {
    id: 12,
    name: 'Translation Engine',
    description: 'Translate content across 50+ languages while preserving context and meaning.',
    icon: 'language',
    category: 'language',
    rating: 4.9,
    reviewCount: 128,
    price: 'From $29/mo',
    popular: false,
    new: false,
    tags: ['Globalization', 'Localization']
  }
];

// Category filters
const categories = [
  { id: 'all', name: 'All Plugins' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'document', name: 'Document Processing' },
  { id: 'content', name: 'Content Generation' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'development', name: 'Development' },
  { id: 'vision', name: 'Computer Vision' },
  { id: 'chatbot', name: 'Chatbots' },
  { id: 'language', name: 'Language Processing' },
  { id: 'data', name: 'Data Management' }
];

export default function Marketplace() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Filter plugins based on category, search query, and filter
  const filteredPlugins = plugins.filter(plugin => {
    // Filter by category
    const categoryMatch = selectedCategory === 'all' || plugin.category === selectedCategory;
    
    // Filter by search query (name, description, or tags)
    const searchMatch = 
      searchQuery === '' || 
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by special filters (new, popular)
    const filterMatch = 
      selectedFilter === 'all' || 
      (selectedFilter === 'popular' && plugin.popular) || 
      (selectedFilter === 'new' && plugin.new);
    
    return categoryMatch && searchMatch && filterMatch;
  });
  
  const handleDownload = (pluginName: string) => {
    toast({
      title: "Plugin Installation Started",
      description: `${pluginName} will be installed and ready to use shortly.`,
    });
  };
  
  return (
    <>
      <Helmet>
        <title>AI Plugin Marketplace | Advanta AI</title>
        <meta name="description" content="Browse and install AI plugins to extend your Advanta AI capabilities. From analytics to content generation, find the perfect tools for your business." />
        <meta name="keywords" content="AI plugins, AI marketplace, machine learning plugins, AI tools" />
      </Helmet>
      
      <Header />
      
      <main className="py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="text-center mb-16"
          >
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
              AI Plugin <span className="gradient-text">Marketplace</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto">
              Extend your AI capabilities with our curated collection of plugins. 
              From data analysis to content generation, find the perfect tools to supercharge your business.
            </motion.p>
          </motion.div>
          
          {/* Search and Filters */}
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center bg-muted p-4 rounded-xl border border-border">
              <div className="flex-1 w-full">
                <Input 
                  type="text" 
                  placeholder="Search plugins..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                <Button 
                  variant={selectedFilter === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={selectedFilter === 'popular' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter('popular')}
                >
                  Popular
                </Button>
                <Button 
                  variant={selectedFilter === 'new' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter('new')}
                >
                  New
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Categories and Plugin Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="show"
              className="lg:col-span-1"
            >
              <div className="bg-muted rounded-xl p-6 border border-border sticky top-24">
                <h2 className="text-xl font-bold mb-4">Categories</h2>
                <ul className="space-y-2">
                  {categories.map(category => (
                    <li key={category.id}>
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start ${selectedCategory === category.id ? 'bg-background' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            
            {/* Plugin Grid */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="lg:col-span-3"
            >
              {filteredPlugins.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPlugins.map((plugin, index) => (
                    <motion.div 
                      key={plugin.id}
                      variants={fadeIn}
                      className="h-full"
                      custom={index * 0.1}
                    >
                      <Card className="p-6 h-full flex flex-col bg-muted border-border hover:border-primary/50 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <i className={`fas fa-${plugin.icon} text-primary text-xl`}></i>
                          </div>
                          <div className="flex gap-2">
                            {plugin.new && <Badge variant="secondary">New</Badge>}
                            {plugin.popular && <Badge>Popular</Badge>}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">{plugin.name}</h3>
                        <p className="text-muted-foreground mb-4 flex-grow">{plugin.description}</p>
                        
                        <div className="mb-4 flex flex-wrap gap-2">
                          {plugin.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="font-normal">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <i 
                                  key={i} 
                                  className={`fas fa-star ${i < Math.floor(plugin.rating) ? 'text-yellow-400' : 'text-muted-foreground'} text-sm`}
                                ></i>
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">
                              {plugin.rating} ({plugin.reviewCount})
                            </span>
                          </div>
                          <span className="text-sm font-medium">{plugin.price}</span>
                        </div>
                        
                        <Button 
                          onClick={() => handleDownload(plugin.name)}
                          className="w-full"
                        >
                          Install Plugin
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-muted p-8 rounded-xl border border-border text-center">
                  <h3 className="text-xl font-bold mb-2">No plugins found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter settings to find what you're looking for.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* CTA Section */}
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="mt-24 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-2xl p-8 md:p-12 border border-primary/30"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Can't find what you need?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                We develop custom AI plugins tailored to your unique business requirements. 
                Our team of AI engineers can build the perfect solution for your specific use case.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Request Custom Plugin
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Contact Sales Team
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}