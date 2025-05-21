import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLocation, Link } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { BlogPost } from '@shared/schema';

// Function to format date
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Related post card component
const RelatedPostCard = ({ post }: { post: BlogPost }) => {
  const [, navigate] = useLocation();
  
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/blog/${post.slug}`)}>
      <div className="h-40 overflow-hidden">
        <img 
          src={post.featured_image || '/images/blog-placeholder.jpg'} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      </div>
      <CardHeader className="py-3">
        <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">{post.title}</CardTitle>
      </CardHeader>
      <CardFooter className="pt-0 pb-3 flex justify-between items-center text-sm text-muted-foreground">
        <span>{formatDate(post.publish_date || post.created_at)}</span>
        <span>{post.reading_time || 5} min read</span>
      </CardFooter>
    </Card>
  );
};

// Blog Post Page
export default function BlogPost() {
  const [location] = useLocation();
  const slug = location.split('/').pop() || '';
  
  // Fetch current blog post by slug
  const { data: post, isLoading: isLoadingPost, error: postError } = useQuery({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
  });
  
  // Fetch all blog posts for related content
  const { data: allPosts, isLoading: isLoadingAll } = useQuery({
    queryKey: ['/api/blog'],
    enabled: !!post,
  });
  
  // Get related posts based on category or tags (if available)
  const relatedPosts = allPosts && post ? 
    allPosts
      .filter((p: BlogPost) => p.id !== post.id)
      .filter((p: BlogPost) => p.category === post.category || 
        (p.tags && post.tags && p.tags.some(tag => post.tags.includes(tag))))
      .slice(0, 3) : 
    [];
  
  // Social sharing functionality
  const shareOnTwitter = () => {
    const title = post?.title;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  };
  
  const shareOnLinkedIn = () => {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };
  
  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };
  
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
    alert('Link copied to clipboard!');
  };
  
  // If post is loading, show skeleton
  if (isLoadingPost) {
    return (
      <>
        <Header />
        <main className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <div className="flex items-center space-x-4 mb-6">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-64 w-full mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // If there's an error or no post found
  if (postError || !post) {
    return (
      <>
        <Header />
        <main className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist or may have been moved.</p>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{post.title} | Advanta AI Blog</title>
        <meta name="description" content={post.summary} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={new Date(post.publish_date || post.created_at).toISOString()} />
        <meta property="article:section" content={post.category} />
        {post.tags?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>
      
      <Header />
      
      <main className="py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="mb-12"
            >
              {/* Back to Blog */}
              <motion.div variants={fadeInUp} className="mb-6">
                <Button variant="ghost" asChild className="flex items-center text-muted-foreground hover:text-foreground">
                  <Link href="/blog">
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back to Blog
                  </Link>
                </Button>
              </motion.div>
              
              {/* Post Header */}
              <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {post.title}
              </motion.h1>
              
              {/* Author and Meta */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-5 mb-8">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={post.author?.profileImageUrl || ''} />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author?.firstName || 'Advanta'} {post.author?.lastName || 'AI'}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(post.publish_date || post.created_at)}
                    </p>
                  </div>
                </div>
                
                <Separator orientation="vertical" className="h-8 hidden md:block" />
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <i className="fas fa-clock mr-2"></i>
                  <span>{post.reading_time || 5} min read</span>
                </div>
                
                <Separator orientation="vertical" className="h-8 hidden md:block" />
                
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {post.category}
                </Badge>
              </motion.div>
              
              {/* Featured Image */}
              {post.featured_image && (
                <motion.div variants={fadeInUp} className="mb-10 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className="w-full object-cover max-h-96"
                  />
                </motion.div>
              )}
              
              {/* Content */}
              <motion.div 
                variants={fadeInUp} 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <motion.div variants={fadeInUp} className="mt-12">
                  <h3 className="text-lg font-medium mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Social Sharing */}
              <motion.div variants={fadeInUp} className="mt-12 border-t border-b border-border py-6">
                <h3 className="text-lg font-medium mb-4">Share this article</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" onClick={shareOnTwitter}>
                    <i className="fab fa-twitter mr-2"></i>
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareOnLinkedIn}>
                    <i className="fab fa-linkedin mr-2"></i>
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareOnFacebook}>
                    <i className="fab fa-facebook mr-2"></i>
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyLinkToClipboard}>
                    <i className="fas fa-link mr-2"></i>
                    Copy Link
                  </Button>
                </div>
              </motion.div>
              
              {/* Author Bio */}
              <motion.div variants={fadeInUp} className="mt-12 bg-card rounded-lg p-6 border border-border">
                <div className="flex items-start gap-5">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={post.author?.profileImageUrl || ''} />
                    <AvatarFallback className="text-xl">AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">
                      {post.author?.firstName || 'Advanta'} {post.author?.lastName || 'AI'}
                    </h3>
                    <p className="text-muted-foreground mt-1 mb-3">
                      AI Solutions Expert
                    </p>
                    <p className="text-sm">
                      Our team of AI specialists is dedicated to helping businesses leverage the power of artificial intelligence to drive growth, increase efficiency, and create new opportunities.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost: BlogPost) => (
                    <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                  ))}
                </div>
              </section>
            )}
            
            {/* Newsletter CTA */}
            <section className="mt-20">
              <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-xl p-8 border border-primary/30">
                <div className="max-w-xl mx-auto text-center">
                  <h2 className="text-2xl font-bold mb-3">Subscribe to Our Newsletter</h2>
                  <p className="text-muted-foreground mb-6">
                    Get the latest AI insights and updates delivered to your inbox.
                  </p>
                  <Button className="bg-primary hover:bg-primary/90">
                    Sign Up
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}