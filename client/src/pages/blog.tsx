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
import { NewsletterSignup } from '@/components/newsletter/NewsletterSignup';

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

// Function to format date with error handling
const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return 'Recent';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Recent';
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Function to clean corrupted blog data
const cleanBlogData = (post: any) => {
  return {
    ...post,
    title: post.title?.replace(/\*\*/g, '').replace(/\*/g, '').trim() || 'AI Technology Article',
    category: post.category?.replace(/\*\*/g, '').replace(/\*/g, '').trim() || 'ai_technology',
    description: post.description?.replace(/\*\*/g, '').replace(/\*/g, '').replace(/strong>\*\/stron/g, '').trim() || 'Discover the latest AI insights and innovations.',
    preview: post.preview?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
    readingTime: Math.min(Math.max(parseInt(post.readingTime) || 5, 1), 15), // Cap at 15 minutes
    date: '2025-08-16' // Use correct current date
  };
};

// Blog Post Card Component for File-Based Posts
const FileBlogPostCard = ({ post }: { post: any }) => {
  const [, navigate] = useLocation();
  const cleanPost = cleanBlogData(post);
  // Generate unique image URL for each blog post
  const getImageUrl = (category: string, title: string) => {
    // Create a simple hash from the title to ensure consistent but unique images
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Pool of high-quality AI/tech/business related images
    const imagePool = [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&auto=format&q=80', // AI brain
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&auto=format&q=80', // Business strategy
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop&auto=format&q=80', // Automation
      'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop&auto=format&q=80', // Marketing AI
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&auto=format&q=80', // Case studies
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&auto=format&q=80', // Tutorials
      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=400&fit=crop&auto=format&q=80', // Industry insights
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop&auto=format&q=80', // News
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop&auto=format&q=80', // Resources
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=400&fit=crop&auto=format&q=80', // Data analytics
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&auto=format&q=80', // Machine learning
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop&auto=format&q=80', // AI development
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&auto=format&q=80', // Technology
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&auto=format&q=80', // Team collaboration
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&auto=format&q=80', // Innovation
      'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop&auto=format&q=80', // Digital transformation
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&auto=format&q=80', // AI robot
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop&auto=format&q=80', // Future tech
      'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=800&h=400&fit=crop&auto=format&q=80', // AI interface
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop&auto=format&q=80', // Programming
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop&auto=format&q=80', // Work collaboration
      'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=800&h=400&fit=crop&auto=format&q=80', // Digital workflow
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop&auto=format&q=80', // Cloud computing
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&auto=format&q=80', // Business growth
      'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800&h=400&fit=crop&auto=format&q=80'  // AI brain network
    ];
    
    // Use hash to select a consistent image for each title
    const imageIndex = Math.abs(hash) % imagePool.length;
    return imagePool[imageIndex];
  };

  const imageUrl = getImageUrl(cleanPost.category, cleanPost.title);

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Featured Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl}
            alt={cleanPost.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/90 text-black font-medium">
              {cleanPost.category.replace(/_/g, ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-1" />
              {formatDate(cleanPost.date)}
            </div>
          </div>
          <CardTitle className="text-xl leading-tight hover:text-blue-600 transition-colors line-clamp-2">
            {cleanPost.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {cleanPost.description || cleanPost.preview?.substring(0, 180) || 'AI-powered insights and analysis for modern businesses looking to leverage artificial intelligence for competitive advantage.'}...
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {cleanPost.readingTime} min read
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                console.log('FileBlogPostCard post data:', cleanPost);
                const slug = cleanPost.slug || cleanPost.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                console.log('Using slug:', slug);
                if (slug && slug !== 'undefined') {
                  navigate(`/blog/${slug}`);
                } else {
                  console.error('No valid slug available for post:', cleanPost);
                  alert('Sorry, this blog post is not available yet.');
                }
              }}
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
  const cleanPost = cleanBlogData(post);
  
  // Generate unique image URL for each blog post
  const getImageUrl = (category: string, title: string) => {
    // Create a simple hash from the title to ensure consistent but unique images
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Pool of high-quality AI/tech/business related images
    const imagePool = [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&auto=format&q=80', // AI brain
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&auto=format&q=80', // Business strategy
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop&auto=format&q=80', // Automation
      'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop&auto=format&q=80', // Marketing AI
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&auto=format&q=80', // Case studies
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&auto=format&q=80', // Tutorials
      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=400&fit=crop&auto=format&q=80', // Industry insights
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop&auto=format&q=80', // News
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop&auto=format&q=80', // Resources
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=400&fit=crop&auto=format&q=80', // Data analytics
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&auto=format&q=80', // Machine learning
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop&auto=format&q=80', // AI development
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&auto=format&q=80', // Technology
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&auto=format&q=80', // Team collaboration
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&auto=format&q=80', // Innovation
      'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop&auto=format&q=80', // Digital transformation
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&auto=format&q=80', // AI robot
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop&auto=format&q=80', // Future tech
      'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=800&h=400&fit=crop&auto=format&q=80', // AI interface
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop&auto=format&q=80', // Programming
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop&auto=format&q=80', // Work collaboration
      'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=800&h=400&fit=crop&auto=format&q=80', // Digital workflow
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop&auto=format&q=80', // Cloud computing
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&auto=format&q=80', // Business growth
      'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800&h=400&fit=crop&auto=format&q=80'  // AI brain network
    ];
    
    // Use hash to select a consistent image for each title
    const imageIndex = Math.abs(hash) % imagePool.length;
    return imagePool[imageIndex];
  };

  const imageUrl = post.featuredImage || getImageUrl(post.category || 'ai_technology', post.title || '');
  
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:border-primary/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/blog/${post.slug}`)}>
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          loading="lazy"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className="text-xs text-primary">
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDate(post.createdAt)}
          </span>
        </div>
        <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
          {cleanPost.title}
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
            <span className="text-xs text-muted-foreground">{cleanPost.readingTime} min read</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <i className="fas fa-eye text-xs text-muted-foreground"></i>
            <span className="text-xs text-muted-foreground">{post.viewCount || 0}</span>
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
    staleTime: 0, // Always fresh - no caching for new blog posts
    refetchInterval: 5 * 1000, // Refresh every 5 seconds
    refetchOnWindowFocus: true, // Refresh when user comes back to tab
  });

  // Fetch blog system status
  const { data: blogStatus } = useQuery({
    queryKey: ['/api/blog/status'],
    refetchInterval: 60 * 1000, // Check every minute
  });

  // Legacy database posts (fallback)
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['/api/blog'],
    staleTime: 0, // Always fresh - no caching for new blog posts
    refetchInterval: 5 * 1000, // Refresh every 5 seconds
    refetchOnWindowFocus: true, // Refresh when user comes back to tab
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
    [...blogPosts].sort((a: BlogPost, b: BlogPost) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 3) : 
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
            className="relative overflow-hidden"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-green-950/20 rounded-3xl"></div>
            
            <div className="relative text-center py-20 px-8">
              {/* Book Icon */}
              <motion.div variants={fadeInUp} className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                <span className="text-blue-600 dark:text-blue-400">AI</span> Blog
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                Discover the latest trends, strategies, and innovations in AI technology and applications. We generates 3 high-quality blog posts daily at 8 AM, 1 PM, and 6 PM.
              </motion.p>
              
              {/* Search Bar */}
              <motion.div variants={fadeIn} className="max-w-lg mx-auto">
                <div className="relative">
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-4 h-14 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg focus:shadow-xl transition-all duration-300"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </motion.div>

              {/* Blog Status Indicator */}
              {blogStatus && (
                <motion.div variants={fadeIn} className="mt-8">
                  <div className="inline-flex items-center px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live AI System: {allPosts.length} automated insights generated</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
          
          {/* Featured Posts Section */}
          {featuredPosts.length > 0 && (
            <section className="mb-16 mt-20">
              <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredPosts.map((post: BlogPost) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
          
          {/* Categories and Blog Posts */}
          <section className="mt-20">
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
                          Daily Blog System: {blogStatus.scheduler?.isRunning ? '🟢 Active' : '🔴 Inactive'} | 
                          {allPosts.length} automated posts | 
                          {blogStatus.scheduler?.activeTasks || 0} active schedules
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post: any) => (
                      <div key={post.id || post.slug || post.filename}>
                        {post.filename ? (
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
            <NewsletterSignup variant="hero" />
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  );
}