import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLocation, Link } from 'wouter';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Clock, Twitter, Linkedin, Facebook, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'isomorphic-dompurify';
import he from 'he';

// Types
interface BlogPost {
  slug: string;
  title: string;
  content?: string;
  contentHtml?: string;
  markdown?: string;
  category: string;
  tags: string[];
  created_at: string;
  reading_time?: number;
  author?: {
    firstName: string;
    lastName: string;
  };
  featured_image?: string;
  filename?: string;
}

interface PostsResponse {
  items: BlogPost[];
  meta?: any;
}

// Function to format date with error handling
const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return 'Recent';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Recent';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Related post card component
const RelatedPostCard = ({ post }: { post: BlogPost }) => {
  const getImageUrl = (category: string) => {
    const categoryImages: { [key: string]: string } = {
      'ai_technology': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop&auto=format&q=80',
      'business_strategy': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop&auto=format&q=80',
      'automation': 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=300&fit=crop&auto=format&q=80',
      'marketing_ai': 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=600&h=300&fit=crop&auto=format&q=80',
      'case_studies': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&auto=format&q=80',
      'tutorials': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop&auto=format&q=80',
      'industry_insights': 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=300&fit=crop&auto=format&q=80',
      'news': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=300&fit=crop&auto=format&q=80',
      'resources': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=300&fit=crop&auto=format&q=80'
    };
    return categoryImages[category] || categoryImages['ai_technology'];
  };

  const imageUrl = getImageUrl(post.category || 'ai_technology');
  const postSlug = post.filename ? post.filename.replace('.html', '').replace(/^\d{4}-\d{2}-\d{2}-/, '') : post.slug;
  
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
      onClick={() => window.open(`/blog/${postSlug}`, '_blank')}>
      <div className="h-40 overflow-hidden">
        <img 
          src={imageUrl}
          alt={post.title?.replace(/[\*]/g, '') || 'AI Technology'} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          loading="lazy"
        />
      </div>
      <CardHeader className="py-3">
        <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">
          {post.title?.replace(/[\*]/g, '') || 'AI Insights'}
        </CardTitle>
      </CardHeader>
      <CardFooter className="pt-0 pb-3 flex justify-between items-center text-sm text-muted-foreground">
        <span>{formatDate(post.created_at)}</span>
        <span>{post.reading_time || 5} min read</span>
      </CardFooter>
    </Card>
  );
};

// Helper: normalize content and fix common issues
function normalizeContent(post: BlogPost): BlogPost {
  const normalized = { ...post };

  // 1) If markdown is accidentally code-fenced, unwrap it
  if (normalized.markdown && /^```/m.test(normalized.markdown.trim())) {
    const match = normalized.markdown.trim().match(/^```(?:md|markdown|html|)\n([\s\S]*?)\n```$/m);
    if (match?.[1]) {
      normalized.markdown = match[1];
    }
  }

  // 2) If HTML content is entity-escaped (shows <p> as text), decode and sanitize
  if (normalized.contentHtml && /&lt;\/?([a-z][a-z0-9]*)\b[^&]*&gt;/i.test(normalized.contentHtml)) {
    const decoded = he.decode(normalized.contentHtml);
    normalized.contentHtml = DOMPurify.sanitize(decoded, { 
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'blockquote', 'code', 'pre', 'img'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class']
    });
  }

  // 3) Same for generic content field
  if (normalized.content && /&lt;\/?([a-z][a-z0-9]*)\b[^&]*&gt;/i.test(normalized.content)) {
    const decoded = he.decode(normalized.content);
    normalized.content = DOMPurify.sanitize(decoded, { 
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'blockquote', 'code', 'pre', 'img'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class']
    });
  }

  return normalized;
}

// Article Content Component with robust rendering
const ArticleContent = ({ post }: { post: BlogPost }) => {
  const [renderError, setRenderError] = useState<string | null>(null);
  
  useEffect(() => {
    setRenderError(null);
  }, [post]);

  // Normalize the post to fix common issues
  const normalizedPost = normalizeContent(post);

  const hasMarkdown = !!normalizedPost.markdown && normalizedPost.markdown.trim().length > 0;
  const hasHtml = !!(normalizedPost.contentHtml || normalizedPost.content) && 
    (normalizedPost.contentHtml || normalizedPost.content || '').trim().length > 0;

  if (!hasMarkdown && !hasHtml) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 my-8">
        <div className="flex items-center space-x-3 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">No Content Available</h3>
            <p className="text-sm mt-1">
              This article appears to have no content. Please contact support if this persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Prefer Markdown rendering if available
  if (hasMarkdown && !renderError) {
    try {
      return (
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-a:text-primary hover:prose-a:underline">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Enhance code blocks
              code({ className, children, ...props }: any) {
                const isInline = !className?.includes('language-');
                return (
                  <code 
                    className={`${className || ''} ${isInline ? 'bg-muted px-1 py-0.5 rounded text-sm' : 'block bg-muted p-4 rounded-lg overflow-x-auto'}`} 
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              // Enhance links
              a({ href, children, ...props }) {
                return (
                  <a 
                    href={href} 
                    className="text-primary hover:underline" 
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    {...props}
                  >
                    {children}
                  </a>
                );
              }
            }}
          >
            {normalizedPost.markdown}
          </ReactMarkdown>
        </div>
      );
    } catch (error) {
      console.error('Markdown rendering failed:', error);
      setRenderError('Markdown rendering failed');
      // Fall through to HTML rendering
    }
  }

  // Fallback to HTML content (already sanitized)
  if (hasHtml) {
    const htmlContent = normalizedPost.contentHtml || normalizedPost.content || '';
    return (
      <div 
        className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-a:text-primary hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  // Final graceful error fallback
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 my-8">
      <div className="flex items-center space-x-3 text-orange-800">
        <AlertTriangle className="h-5 w-5" />
        <div>
          <h3 className="font-semibold">Content Rendering Issue</h3>
          <p className="text-sm mt-1">
            We're fixing a rendering issue for this article. Please check back soon or contact support if this persists.
          </p>
          {renderError && (
            <p className="text-xs mt-2 opacity-75">
              Technical details: {renderError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Blog Post Page
export default function BlogPostPage() {
  const [location] = useLocation();
  const slug = location.split('/').pop() || '';
  
  // Fetch the blog post with strict error handling
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/blog', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) {
        throw new Error(`Failed to load post: ${response.status}`);
      }
      const data = await response.json();
      
      // Strict validation - ensure we have content
      if (!data?.title || !(data.markdown || data.content || data.contentHtml)) {
        throw new Error('MISSING_BODY: Post has no content');
      }
      
      return data;
    },
    enabled: !!slug,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry on 404 or missing content
      if (error?.message?.includes('404') || error?.message?.includes('MISSING_BODY')) {
        return false;
      }
      return failureCount < 2;
    }
  });

  // Fetch other blog posts for related content
  const { data: postsResponse } = useQuery<PostsResponse>({
    queryKey: ['/api/blog/posts'],
    queryFn: () => fetch('/api/blog/posts').then(r => r.json()),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const allPosts = postsResponse?.items || [];

  // Select related posts by category (limit to 3)
  const relatedPosts = useMemo(() => {
    if (!allPosts || allPosts.length === 0 || !post?.category) return [];
    
    return allPosts.filter((p: BlogPost) => 
      p.category === post.category && 
      p.slug !== post.slug
    ).slice(0, 3);
  }, [allPosts, post?.category, post?.slug]);

  // Social sharing functionality
  const shareOnTwitter = () => {
    const title = post?.title || 'AI Insights';
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
    alert('Link copied to clipboard!');
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <NewHeader />
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
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <>
        <NewHeader />
        <main className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-8">
                The blog post you're looking for could not be found.
              </p>
              <Link href="/blog">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title?.replace(/[\*]/g, '') || 'AI Insights'} | Advanta AI</title>
        <meta name="description" content={post.content?.substring(0, 160).replace(/<[^>]*>/g, '') + '...' || 'Latest AI insights and technology updates'} />
        <meta property="og:title" content={post.title?.replace(/[\*]/g, '') || 'AI Insights'} />
        <meta property="og:description" content={post.content?.substring(0, 160).replace(/<[^>]*>/g, '') + '...' || 'Latest AI insights and technology updates'} />
        <meta property="og:image" content={post.featured_image || `https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&auto=format&q=80`} />
        <meta property="og:url" content={`https://advanta-ai.com/blog/${slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title?.replace(/[\*]/g, '') || 'AI Insights'} />
        <meta name="twitter:description" content={post.content?.substring(0, 160).replace(/<[^>]*>/g, '') + '...' || 'Latest AI insights and technology updates'} />
        <meta name="twitter:image" content={post.featured_image || `https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&auto=format&q=80`} />
      </Helmet>

      <NewHeader />
      
      <main className="py-28 bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Back to Blog button */}
          <div className="max-w-3xl mx-auto mb-8">
            <Link href="/blog">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl mx-auto"
          >
            <header className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title?.replace(/[\*]/g, '') || 'AI Insights'}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {post.author ? `${post.author.firstName[0]}${post.author.lastName[0]}` : 'AA'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Advanta AI'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time || 5} min read</span>
                </div>
              </div>

              {/* Category badge */}
              <div className="mb-6">
                <Badge variant="secondary">
                  {post.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'AI Technology'}
                </Badge>
              </div>

              {/* Featured image */}
              {post.featured_image && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title?.replace(/[\*]/g, '') || 'AI Technology'}
                    className="w-full h-64 lg:h-80 object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </header>

            {/* Article content with MDX support and fallbacks */}
            <ArticleContent post={post} />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Social sharing */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Share this article</h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" onClick={shareOnTwitter}>
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm" onClick={shareOnLinkedIn}>
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm" onClick={shareOnFacebook}>
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button variant="outline" size="sm" onClick={copyLinkToClipboard}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>

            {/* Author bio */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-medium text-primary">
                    {post.author ? `${post.author.firstName[0]}${post.author.lastName[0]}` : 'AA'}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Advanta AI Team'}
                  </h4>
                  <p className="text-muted-foreground">
                    Expert in AI automation and business process optimization. 
                    Helping businesses implement AI solutions that deliver measurable results.
                  </p>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-6xl mx-auto mt-20"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <RelatedPostCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </motion.section>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </>
  );
}