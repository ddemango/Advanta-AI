import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { Resource } from '@shared/schema';
import { useLocation } from 'wouter';

// Featured AI Tools
const featuredTools = [
  {
    id: 'marketing-copy-generator',
    title: 'Marketing Copy Generator',
    description: 'Generate professional marketing copy, social media captions, and ad copy instantly with AI.',
    icon: '✍️',
    category: 'Content Creation',
    path: '/marketing-copy-generator',
    featured: true
  },
  {
    id: 'ai-tool-quiz',
    title: 'AI Tool Recommendation Quiz',
    description: 'Take our interactive quiz to discover the perfect AI tools for your role and budget.',
    icon: '🎯',
    category: 'Assessment',
    path: '/ai-tool-quiz',
    featured: true
  },
  {
    id: 'business-name-generator',
    title: 'Business Name & Domain Generator',
    description: 'Create unique business names, check domain availability, and get branding ideas.',
    icon: '💡',
    category: 'Business Tools',
    path: '/business-name-generator',
    featured: true
  },
  {
    id: 'resume-optimizer',
    title: 'Resume & LinkedIn Optimizer',
    description: 'Optimize your resume and LinkedIn profile for tech and AI jobs with our AI-powered tool.',
    icon: '📄',
    category: 'Career Tools',
    path: '/resume-optimizer',
    featured: true
  },
  {
    id: 'ai-tools-comparison',
    title: 'AI Tools Comparison Chart',
    description: 'Compare ChatGPT, Claude, Gemini and more AI tools side by side with detailed features.',
    icon: '⚖️',
    category: 'Research',
    path: '/ai-tools-comparison',
    featured: true
  }
];

// Resource types
const resourceTypes = [
  { id: 'all', name: 'All Resources' },
  { id: 'tool', name: 'Interactive Tools' },
  { id: 'whitepaper', name: 'Whitepapers' },
  { id: 'ebook', name: 'E-Books' },
  { id: 'template', name: 'Templates' },
  { id: 'guide', name: 'Guides' }
];

// Resource categories (same as blog categories for consistency)
const resourceCategories = [
  { id: 'all', name: 'All Categories' },
  { id: 'ai_technology', name: 'AI Technology' },
  { id: 'business_strategy', name: 'Business Strategy' },
  { id: 'case_studies', name: 'Case Studies' },
  { id: 'tutorials', name: 'Tutorials' },
  { id: 'industry_insights', name: 'Industry Insights' }
];

// Function to format date
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const [navigate] = useLocation();
  
  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-primary/10 hover:border-primary/30 bg-background/70 backdrop-blur-md">
      {resource.featured_image && (
        <div className="h-44 overflow-hidden">
          <img 
            src={resource.featured_image} 
            alt={resource.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {resource.resource_type}
          </Badge>
          {resource.publish_date && (
            <span className="text-xs text-muted-foreground">
              {formatDate(resource.publish_date)}
            </span>
          )}
        </div>
        <CardTitle className="text-xl leading-tight">
          {resource.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-muted-foreground line-clamp-3">
          {resource.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="flex flex-wrap gap-2">
          {resource.tags?.slice(0, 3).map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags?.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{resource.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => {
            // Track download before navigating
            fetch(`/api/resources/${resource.id}/download`, {
              method: 'POST'
            }).then(res => res.json())
              .then(data => {
                if (data.success && data.download_url) {
                  window.open(data.download_url, '_blank');
                }
              })
              .catch(error => {
                console.error('Error tracking download:', error);
              });
          }}
        >
          <i className="fas fa-download mr-2"></i>
          Download {resource.download_count ? `(${resource.download_count})` : ''}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function Resources() {
  const [navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentType, setCurrentType] = useState('all');
  const [currentCategory, setCurrentCategory] = useState('all');
  
  // Fetch resources with React Query
  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['/api/resources'],
  });
  
  // Filter resources based on current type, category, and search query
  const filteredResources = resources ? resources.filter((resource: Resource) => {
    const matchesType = currentType === 'all' || resource.resource_type === currentType;
    const matchesCategory = currentCategory === 'all' || resource.category === currentCategory;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesCategory && matchesSearch;
  }) : [];
  
  // Get featured resources (most downloaded)
  const featuredResources = resources ? 
    [...resources].sort((a: Resource, b: Resource) => (b.download_count || 0) - (a.download_count || 0)).slice(0, 3) : 
    [];
  
  return (
    <>
      <Helmet>
        <title>Resources Hub | Advanta AI - Tools, Templates & Guides</title>
        <meta name="description" content="Access our library of AI templates, whitepapers, and implementation guides to help you successfully deploy AI solutions in your business." />
        <meta name="keywords" content="AI resources, templates, whitepapers, guides, e-books, implementation toolkit, AI deployment" />
      </Helmet>
      
      <NewHeader />
      
      <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="text-center mb-12"
          >
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4">
              AI Resources Hub
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Download practical tools, templates, and guides to accelerate your AI implementation
            </motion.p>
            
            <motion.div variants={fadeInUp} className="mt-8 relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Search resources..."
                className="pl-10 bg-background/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            </motion.div>
          </motion.div>

          {/* Featured AI Tools Section */}
          <motion.section 
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">🚀 Free AI-Powered Tools</h2>
              <p className="text-lg text-muted-foreground">
                Powerful interactive tools to supercharge your business with AI
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.map((tool) => (
                <Card key={tool.id} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                  <CardHeader className="text-center pb-4">
                    <div className="text-4xl mb-3">{tool.icon}</div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                    <Badge variant="outline" className="w-fit mx-auto">{tool.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm text-center mb-4">
                      {tool.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 group-hover:scale-105 transition-transform"
                      onClick={() => navigate(tool.path)}
                    >
                      <i className="fas fa-rocket mr-2"></i>
                      Try Tool Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.section>
          
          {/* Featured Resources Section */}
          {featuredResources.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Featured Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredResources.map((resource: Resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </section>
          )}
          
          {/* Types and Resources */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Resources</h2>
              <Button
                onClick={() => navigate('/resources/admin')}
                variant="outline"
                className="hidden md:flex items-center"
              >
                <i className="fas fa-pen-to-square mr-2"></i>
                Manage Resources
              </Button>
            </div>
            
            {/* Resource Types Tabs */}
            <Tabs
              value={currentType}
              onValueChange={setCurrentType}
              className="mb-8"
            >
              <TabsList className="overflow-auto p-0 bg-transparent justify-start mb-2 w-full">
                {resourceTypes.map((type) => (
                  <TabsTrigger 
                    key={type.id} 
                    value={type.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    {type.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {/* Categories as second-level filtering */}
              <div className="flex items-center mb-6 overflow-x-auto py-2">
                <span className="mr-3 text-sm font-medium">Categories:</span>
                {resourceCategories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={currentCategory === category.id ? "default" : "outline"}
                    className="mr-2 cursor-pointer transition-colors duration-200"
                    onClick={() => setCurrentCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
              
              {/* Display resources with loading and error states */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden border-primary/10">
                      <Skeleton className="h-44 w-full" />
                      <CardHeader className="pb-2">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-6 w-full" />
                      </CardHeader>
                      <CardContent className="pb-2">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-4/5" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-10 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">Error loading resources</h3>
                  <p className="text-muted-foreground">Please try again later</p>
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No resources found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 
                      `No results for "${searchQuery}"` : 
                      "No resources available for this category yet"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource: Resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              )}
              
              {/* Pagination (to be implemented in the future) */}
              {filteredResources.length > 0 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" disabled>
                      <i className="fas fa-chevron-left text-xs"></i>
                    </Button>
                    <Button variant="outline" className="h-8 w-8 p-0 font-medium">
                      1
                    </Button>
                    <Button variant="outline" size="icon" disabled>
                      <i className="fas fa-chevron-right text-xs"></i>
                    </Button>
                  </div>
                </div>
              )}
              
            </Tabs>
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  );
}