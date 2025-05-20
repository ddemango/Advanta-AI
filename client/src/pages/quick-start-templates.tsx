import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import QuickStartTemplates from '@/components/home/QuickStartTemplates';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientText } from '@/components/ui/gradient-text';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, ArrowRight, ChevronRight, Check, Clock, Code, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function QuickStartTemplatesPage() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'automation', name: 'Automation' },
    { id: 'analytics', name: 'Analytics & Insights' },
    { id: 'customer', name: 'Customer Experience' },
    { id: 'marketing', name: 'Marketing & Sales' },
    { id: 'operations', name: 'Operations' }
  ];
  
  // Featured templates for highlighting at the top
  const featuredTemplates = [
    {
      id: 'customer-service-ai',
      title: 'Customer Service AI Assistant',
      description: 'Automate customer support with an AI assistant that handles common inquiries, routes complex issues, and learns from interactions.',
      category: 'customer',
      difficulty: 'Intermediate',
      timeToImplement: '2-3 weeks',
      icon: 'fa-solid fa-headset',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'predictive-analytics',
      title: 'Predictive Analytics Dashboard',
      description: 'Forecast business trends and customer behavior with a customizable dashboard powered by machine learning models.',
      category: 'analytics',
      difficulty: 'Advanced',
      timeToImplement: '3-5 weeks',
      icon: 'fa-solid fa-chart-line',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'content-generator',
      title: 'AI Content Generator',
      description: 'Create engaging marketing copy, blog posts, and social media content tailored to your brand voice and audience.',
      category: 'marketing',
      difficulty: 'Beginner',
      timeToImplement: '1-2 weeks',
      icon: 'fa-solid fa-pen-fancy',
      color: 'from-green-500 to-emerald-600'
    }
  ];
  
  return (
    <>
      <Helmet>
        <title>AI Quick Start Templates | Advanta AI</title>
        <meta name="description" content="Jump-start your AI implementation with our ready-to-deploy Quick Start Templates. Find solutions for automation, analytics, customer service, and more." />
        <meta property="og:title" content="AI Quick Start Templates | Advanta AI" />
        <meta property="og:description" content="Jump-start your AI implementation with our ready-to-deploy Quick Start Templates. Find solutions for automation, analytics, customer service, and more." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <main>
        {/* Hero Banner */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-background/80">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Quick Start <GradientText>AI Templates</GradientText>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                Accelerate your AI implementation with our pre-built templates designed for rapid deployment and measurable results.
              </p>
              
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search templates..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Quick start CTA */}
              <Button size="lg" className="mb-8 bg-primary hover:bg-primary/90">
                View Implementation Guide
              </Button>
            </motion.div>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -top-[250px] -left-[100px] opacity-50"></div>
            <div className="absolute w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl -bottom-[200px] -right-[100px] opacity-40"></div>
          </div>
        </section>
        
        {/* Featured Templates */}
        <section className="py-16 bg-background/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Featured Templates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTemplates.map((template) => (
                <GlassCard key={template.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center text-white mr-4`}>
                        <i className={template.icon}></i>
                      </div>
                      <h3 className="text-xl font-bold">{template.title}</h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{template.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="text-xs">
                        <i className="fas fa-layer-group mr-1"></i> {template.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" /> {template.timeToImplement}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Code className="h-3 w-3 mr-1" /> {template.difficulty}
                      </Badge>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary-700">
                      View details <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
        
        {/* Main Templates Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-center">Browse All Templates</h2>
            <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
              Choose from our library of pre-built AI templates designed to deliver quick wins and long-term value
            </p>
            
            <Tabs defaultValue="automation" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-background/50 backdrop-blur-sm border border-border/50">
                  {categories.slice(1).map(category => (
                    <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {categories.slice(1).map(category => (
                <TabsContent key={category.id} value={category.id}>
                  <QuickStartTemplates categoryFilter={category.id} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        
        {/* Implementation Process */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Implementation Works</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Our streamlined process ensures quick deployment and optimal results from your chosen AI template
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-background/50 backdrop-blur-sm rounded-lg border border-border/50 p-6 text-center relative">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Select Template</h3>
                <p className="text-muted-foreground">
                  Choose from our library of industry-specific or function-specific AI templates
                </p>
                
                <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              <div className="bg-background/50 backdrop-blur-sm rounded-lg border border-border/50 p-6 text-center relative">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Customize</h3>
                <p className="text-muted-foreground">
                  Work with our team to adapt the template to your specific business requirements
                </p>
                
                <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              <div className="bg-background/50 backdrop-blur-sm rounded-lg border border-border/50 p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Deploy & Optimize</h3>
                <p className="text-muted-foreground">
                  Quickly implement the solution and iterate based on real-world performance
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/20 to-indigo-600/20 backdrop-blur-sm border border-primary/20 p-8 md:p-12 rounded-2xl max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">Ready to Fast-Track Your AI Implementation?</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Schedule a consultation with our AI experts to identify the best templates for your business needs.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Book a Consultation
                </Button>
                <Button size="lg" variant="outline">
                  View Case Studies
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}