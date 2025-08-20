import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Clock, ArrowRight, Search, Eye, ChevronLeft, ChevronRight, PenSquare } from 'lucide-react';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { useLocation } from 'wouter';
import { NewsletterSignup } from '@/components/newsletter/NewsletterSignup';

// Real blog categories aligned with backend
const blogCategories = [
  { id: 'all', name: 'All Posts' },
  { id: 'ai_technology', name: 'AI Technology' },
  { id: 'business_strategy', name: 'Business Strategy' },
  { id: 'automation', name: 'Automation' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'engineering', name: 'Engineering' }
];

// Simple debounce hook
function useDebouncedValue<T>(value: T, delay: number) {
  const [v, setV] = useState(value);
  useEffect(() => { 
    const id = setTimeout(() => setV(value), delay); 
    return () => clearTimeout(id); 
  }, [value, delay]);
  return v;
}

// Helper functions
const fetchJson = <T,>(url: string) =>
  fetch(url).then(r => { if (!r.ok) throw new Error(`${r.status} ${url}`); return r.json() as Promise<T>; });

// Type for posts response
type PostsResp = { items: any[]; nextCursor?: string|null; total: number; categories: string[]; tags: string[]; meta?: any };

const canonicalSlug = (p: any) => {
  if (p.slug) return String(p.slug);
  if (p.filename) return String(p.filename).replace(/\.html$/,'').replace(/^\d{4}-\d{2}-\d{2}-/,'');
  return String(p.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g,'');
};

// Unified post type for handling both file and legacy posts
type PostCardItem = {
  id?: string;
  filename?: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  preview?: string;
  ogImage?: string;
  date?: string;
  reading_time: number;
  viewCount: number;
  source: 'file' | 'legacy';
};

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

// Normalize posts from different sources into unified format
const normalize = (p: any): PostCardItem => ({
  id: p.id,
  filename: p.filename,
  slug: canonicalSlug(p),
  title: (p.title || '').trim(),
  category: (p.category || 'ai_technology').trim(),
  description: (p.description || p.summary || p.preview || '').trim(),
  preview: p.preview,
  ogImage: p.ogImage || p.featuredImage,
  date: p.date || p.createdAt,
  reading_time: Number.isFinite(p.reading_time) ? p.reading_time :
                Number.isFinite(p.readingTime) ? p.readingTime : 5,
  viewCount: Number(p.viewCount || 0),
  source: p.filename ? 'file' : 'legacy',
});

// Unified Blog Post Card Component
const UnifiedBlogPostCard = ({ post }: { post: PostCardItem }) => {
  const [, navigate] = useLocation();
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

  const imageUrl = post.ogImage || getImageUrl(post.category, post.title);

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Featured Image */}
        <div className="relative w-full aspect-[1200/630] overflow-hidden">
          <img 
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/90 text-black font-medium">
              {post.category.replace(/_/g, ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-1" />
              {formatDate(post.date)}
            </div>
          </div>
          <CardTitle className="text-xl leading-tight hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {post.description || 'AI-powered insights and analysis for modern businesses looking to leverage artificial intelligence for competitive advantage.'}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground gap-4">
              <span className="inline-flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.reading_time} min read
              </span>
              <span className="inline-flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {post.viewCount ?? 0}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/blog/${post.slug}`)}
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
  const [rawQuery, setRawQuery] = useState<string>('');
  const searchQuery = useDebouncedValue(rawQuery, 300);
  
  // Fetch posts from unified API
  const { data: postsResp, isLoading, error } = useQuery({
    queryKey: ['/api/blog/posts'],
    queryFn: () => fetchJson<PostsResp>('/api/blog/posts'),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const filePosts = postsResp?.items ?? [];

  // Fetch blog system status
  const { data: blogStatus } = useQuery({
    queryKey: ['/api/blog/status'],
    queryFn: () => fetchJson<any>('/api/blog/status'),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
  
  // Memoized post processing
  const combined = useMemo(() => [...(filePosts || [])].map(normalize), [filePosts]);

  const allPosts = useMemo(() => {
    const seen = new Set<string>();
    return combined
      .filter(p => (seen.has(p.slug) ? false : (seen.add(p.slug), true)))
      .sort((a,b)=> String(b.date||'').localeCompare(String(a.date||'')));
  }, [combined]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPosts.filter(p => {
      const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
      const matchesSearch = !q || [p.title, p.description, p.preview].some(s => (s||'').toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, currentCategory, searchQuery]);

  const featuredPosts = useMemo(() => [...allPosts].sort((a,b)=> b.viewCount - a.viewCount).slice(0,3), [allPosts]);

  // Use tags from API response or compute fallback
  const tagsToShow = useMemo(() => {
    const apiTags = postsResp?.tags?.slice(0, 8);
    return apiTags?.length ? apiTags : [
      'AI-Enhanced CRM','Sales Funnel','Marketing Automation','Business Intelligence','ROI Optimization','Enterprise AI','Workflow Automation','Data Analytics'
    ];
  }, [postsResp?.tags]);

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
                Discover the latest trends, strategies, and innovations in AI technology and applications. We generate 3 high-quality blog posts daily at 8 AM, 1 PM, and 6 PM.
              </motion.p>
              
              {/* Search Bar */}
              <motion.div variants={fadeIn} className="max-w-lg mx-auto">
                <div className="relative">
                  <Input
                    placeholder="Search articles..."
                    value={rawQuery}
                    onChange={(e) => setRawQuery(e.target.value)}
                    className="pl-12 py-4 h-14 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg focus:shadow-xl transition-all duration-300"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="mb-12"
          >
            <Tabs value={currentCategory} onValueChange={setCurrentCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                {blogCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="py-3 px-4 text-sm font-medium rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Blog Status Indicator */}
          {blogStatus && (
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              className="mb-8"
            >
              <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Blog Automation Active
                    </span>
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    {blogStatus.activeTasks} scheduled tasks running
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div variants={fadeInUp} className="text-center py-12">
              <div className="text-red-500 mb-4">Error loading blog posts</div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Blog Posts Grid */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <BlogPostSkeleton />
                </motion.div>
              ))
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <UnifiedBlogPostCard key={`${post.slug}-${index}`} post={post} />
              ))
            ) : (
              <motion.div variants={fadeInUp} className="col-span-full text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  No posts found matching your criteria
                </div>
                <Button 
                  onClick={() => {
                    setCurrentCategory('all');
                    setRawQuery('');
                  }} 
                  variant="outline"
                >
                  Reset Filters
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Popular Tags */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Popular Topics</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {tagsToShow.map((tag) => (
                <Badge 
                  key={tag}
                  variant="secondary" 
                  className="px-4 py-2 text-sm hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  onClick={() => setRawQuery(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Admin Link for authorized users */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="text-center mb-16"
          >
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/blog/admin')}
              className="inline-flex items-center"
            >
              <PenSquare className="h-4 w-4 mr-2" />
              Admin Dashboard
            </Button>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="mb-16"
          >
            <NewsletterSignup />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}