import { useState, useEffect } from 'react';
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
import { CalendarDays, Clock, ArrowRight, Search } from 'lucide-react';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { BlogPost } from '@shared/schema';
import { useLocation } from 'wouter';

// Real blog categories - NO MOCK DATA
const blogCategories = [
  { id: 'all', name: 'All Posts' },
  { id: 'ai_technology', name: 'AI Technology' },
  { id: 'business_strategy', name: 'Business Strategy' },
  { id: 'case_studies', name: 'Case Studies' },
  { id: 'tutorials', name: 'Tutorials' },
  { id: 'industry_insights', name: 'Industry Insights' },
  { id: 'news', name: 'News' },
  { id: 'marketing_ai', name: 'Marketing AI' },
  { id: 'resources', name: 'Resources' }
];

// Real trending tags from actual blog posts
const featuredTags = [
  'AI-Enhanced CRM', 'Sales Funnel', 'Marketing Automation', 'Business Intelligence', 
  'ROI Optimization', 'Enterprise AI', 'Workflow Automation', 'Data Analytics'
];

// Function to format date
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Blog Post Card Component for File-Based Posts
const FileBlogPostCard = ({ post }: { post: any }) => {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs font-medium">
              {post.category?.replace(/[\*_]/g, '').replace('_', ' ').toUpperCase() || 'AI INSIGHTS'}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-1" />
              {formatDate(post.date)}
            </div>
          </div>
          <CardTitle className="text-xl leading-tight hover:text-blue-600 transition-colors">
            {post.title?.replace(/[\*]/g, '') || 'Automated AI Insights'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {post.preview?.replace(/[\*]/g, '').replace(/\n/g, ' ').substring(0, 200) || 'AI-powered insights and analysis for modern businesses looking to leverage artificial intelligence for competitive advantage.'}...
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              5 min read
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open(`/posts/${post.slug}.html`, '_blank')}
              className="hover:text-blue-600"
            >
              Read More <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Legacy Blog Post Card Component
const BlogPostCard = ({ post }: { post: BlogPost }) => {
  const [, navigate] = useLocation();
  const imageUrl = post.featured_image || '/images/blog-placeholder.jpg';
  
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:border-primary/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/blog/${post.slug}`)}>
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className="text-xs text-primary">
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDate(post.created_at)}
          </span>
        </div>
        <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
          {post.title?.replace(/[\*]/g, '') || 'Legacy Blog Post'}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {post.summary}
        </p>
      </CardContent>
      <CardFooter className="pt-2 border-t border-border flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <i className="fas fa-clock text-xs text-muted-foreground"></i>
            <span className="text-xs text-muted-foreground">{post.reading_time || 5} min read</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <i className="fas fa-eye text-xs text-muted-foreground"></i>
            <span className="text-xs text-muted-foreground">{post.view_count || 0}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};



// Loading Skeleton
const BlogPostSkeleton = () => (
  <Card className="overflow-hidden h-full flex flex-col">
    <div className="h-48 overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-full" />
    </CardHeader>
    <CardContent className="py-2 flex-grow">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </CardContent>
    <CardFooter className="pt-2 border-t border-border flex justify-between items-center">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-16" />
    </CardFooter>
  </Card>
);

export default function Blog() {
  const [, navigate] = useLocation();
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Fetch automated blog posts from file system (priority)
  const { data: filePosts = [], isLoading: filePostsLoading } = useQuery({
    queryKey: ['/api/blog/posts'],
    staleTime: 30 * 1000, // 30 seconds - refresh frequently to show new automated posts
  });

  // Fetch blog system status
  const { data: blogStatus } = useQuery({
    queryKey: ['/api/blog/status'],
    refetchInterval: 60 * 1000, // Check every minute
  });

  // Legacy database posts (fallback)
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['/api/blog'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Combine and filter posts (prioritize automated posts)
  const allPosts = [...(filePosts || []), ...(blogPosts || [])];
  
  const filteredPosts = allPosts.filter((post: any) => {
    const matchesCategory = currentCategory === 'all' || post.category === currentCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.preview && post.preview.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.summary && post.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });
  
  // Featured posts - get top 3 by view count
  const featuredPosts = blogPosts ? 
    [...blogPosts].sort((a: BlogPost, b: BlogPost) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 3) : 
    [];

  return (
    <>
      <Helmet>
        <title>Blog | Advanta AI</title>
        <meta 
          name="description" 
          content="Explore the latest insights, tutorials, and news about AI technology, business strategy, and industry applications."
        />
      </Helmet>
      
      <NewHeader />
      
      <main className="py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="text-center mb-16"
          >
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4">
              AI Insights <span className="gradient-text">Blog</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover the latest trends, strategies, and innovations in AI technology and applications. 
              Our fully automated AI system generates 3 high-quality blog posts daily at 8 AM, 1 PM, and 6 PM.
            </motion.p>
            
            {blogStatus && (
              <motion.div variants={fadeIn} className="mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live Blog System: {blogStatus.postsCount} automated posts generated</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Search Bar */}
            <motion.div variants={fadeIn} className="max-w-md mx-auto">
              <div className="relative">
                <Input
                  placeholder="Search articles, topics, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Featured Posts Section */}
          {featuredPosts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredPosts.map((post: BlogPost) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
          
          {/* Categories and Blog Posts */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Articles</h2>
              <Button
                onClick={() => navigate('/blog/admin')}
                variant="outline"
                className="hidden md:flex items-center"
              >
                <i className="fas fa-pen-to-square mr-2"></i>
                Manage Content
              </Button>
            </div>
            
            {/* Category Tabs */}
            <Tabs
              value={currentCategory}
              onValueChange={setCurrentCategory}
              className="mb-8"
            >
              <TabsList className="bg-background/60 border border-white/10 backdrop-blur-sm rounded-full p-1 overflow-x-auto max-w-full flex-wrap justify-start">
                {blogCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {/* Popular Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {featuredTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSearchQuery(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              {/* Blog Posts Grid */}
              <div className="mt-6">
                {(isLoading || filePostsLoading) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <BlogPostSkeleton key={i} />
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">Error loading blog posts</h3>
                    <p className="text-muted-foreground">Please try again later</p>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No posts found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 
                        `No results for "${searchQuery}"` : 
                        "No posts available for this category yet"}
                    </p>
                    {blogStatus && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Daily Blog System: {blogStatus.isRunning ? '🟢 Active' : '🔴 Inactive'} | 
                          {blogStatus.postsCount} automated posts | 
                          {blogStatus.schedulesCount} daily schedules
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post: any) => (
                      <div key={post.id || post.slug}>
                        {post.slug ? (
                          <FileBlogPostCard post={post} />
                        ) : (
                          <BlogPostCard post={post} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Pagination (to be implemented in the future) */}
                {filteredPosts.length > 0 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon" disabled>
                        <i className="fas fa-chevron-left text-xs"></i>
                      </Button>
                      <Button variant="outline" className="h-8 w-8 p-0 font-medium">
                        1
                      </Button>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        2
                      </Button>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        3
                      </Button>
                      <span>...</span>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        12
                      </Button>
                      <Button variant="outline" size="icon">
                        <i className="fas fa-chevron-right text-xs"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Tabs>
          </section>
          
          {/* Newsletter Signup */}
          <section className="mt-20">
            <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-xl p-8 md:p-12 border border-primary/30">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with AI Insights</h2>
                <p className="text-muted-foreground mb-6">
                  Join our newsletter to receive the latest articles, tutorials, and industry insights directly to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    placeholder="Enter your email"
                    className="flex-grow"
                  />
                  <Button className="bg-primary hover:bg-primary/90">
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates from us.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  );
}