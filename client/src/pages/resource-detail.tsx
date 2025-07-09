import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLocation, Link } from 'wouter';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Resource } from '@shared/schema';

// Function to format date
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Related resource card component
const RelatedResourceCard = ({ resource }: { resource: Resource }) => {
  const [, navigate] = useLocation();
  
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer h-full flex flex-col"
      onClick={() => navigate(`/resources/${resource.slug}`)}>
      {resource.featured_image && (
        <div className="h-40 overflow-hidden">
          <img 
            src={resource.featured_image} 
            alt={resource.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
      )}
      <CardHeader className="py-3 flex-grow">
        <Badge variant="outline" className="mb-2 inline-block">{resource.resource_type}</Badge>
        <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">{resource.title}</CardTitle>
      </CardHeader>
      <CardFooter className="pt-0 pb-3">
        <Button variant="ghost" size="sm" className="ml-auto" onClick={(e) => {
          e.stopPropagation();
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
        }}>
          <i className="fas fa-download mr-1"></i>
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

// Resource Detail Page
export default function ResourceDetail() {
  const [location] = useLocation();
  const slug = location.split('/').pop() || '';
  
  // Fetch current resource by slug
  const { data: resource, isLoading: isLoadingResource, error: resourceError } = useQuery({
    queryKey: [`/api/resources/${slug}`],
    enabled: !!slug,
  });
  
  // Fetch all resources for related content
  const { data: allResources, isLoading: isLoadingAll } = useQuery({
    queryKey: ['/api/resources'],
    enabled: !!resource,
  });
  
  // Track resource download
  const handleDownload = async () => {
    if (!resource) return;
    
    try {
      const response = await fetch(`/api/resources/${resource.id}/download`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success && data.download_url) {
        window.open(data.download_url, '_blank');
      }
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };
  
  // Get related resources based on category or resource type
  const relatedResources = allResources && resource ? 
    allResources
      .filter((r: Resource) => r.id !== resource.id)
      .filter((r: Resource) => r.category === resource.category || 
        r.resource_type === resource.resource_type ||
        (r.tags && resource.tags && r.tags.some(tag => resource.tags.includes(tag))))
      .slice(0, 3) : 
    [];
  
  // Social sharing functionality
  const shareOnTwitter = () => {
    const title = resource?.title;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  };
  
  const shareOnLinkedIn = () => {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };
  
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
    alert('Link copied to clipboard!');
  };
  
  // If resource is loading, show skeleton
  if (isLoadingResource) {
    return (
      <>
        <NewHeader />
        <main className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-40 mb-6" />
              <Skeleton className="h-64 w-full mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-12 w-40 mt-8" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // If there's an error or no resource found
  if (resourceError || !resource) {
    return (
      <>
        <NewHeader />
        <main className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Resource Not Found</h1>
            <p className="text-muted-foreground mb-8">The resource you're looking for doesn't exist or may have been moved.</p>
            <Button asChild>
              <Link href="/resources">Back to Resources</Link>
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
        <title>{resource.title} | Advanta AI Resources</title>
        <meta name="description" content={resource.description} />
        <meta property="og:title" content={resource.title} />
        <meta property="og:description" content={resource.description} />
        {resource.featured_image && <meta property="og:image" content={resource.featured_image} />}
        <meta property="og:type" content="article" />
        {resource.publish_date && <meta property="article:published_time" content={new Date(resource.publish_date).toISOString()} />}
        <meta property="article:section" content={resource.category} />
        {resource.tags?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>
      
      <NewHeader />
      
      <main className="py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="mb-12"
            >
              {/* Back to Resources */}
              <motion.div variants={fadeInUp} className="mb-6">
                <Button variant="ghost" asChild className="flex items-center text-muted-foreground hover:text-foreground">
                  <Link href="/resources">
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back to Resources
                  </Link>
                </Button>
              </motion.div>
              
              {/* Resource Header */}
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="bg-primary/10 text-primary px-3 py-1 text-sm">
                  {resource.resource_type}
                </Badge>
                {resource.publish_date && (
                  <span className="text-sm text-muted-foreground">
                    Published on {formatDate(resource.publish_date)}
                  </span>
                )}
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {resource.title}
              </motion.h1>
              
              {/* Featured Image */}
              {resource.featured_image && (
                <motion.div variants={fadeInUp} className="mb-10 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={resource.featured_image} 
                    alt={resource.title}
                    className="w-full object-cover max-h-96"
                  />
                </motion.div>
              )}
              
              {/* Description */}
              <motion.div variants={fadeInUp} className="prose prose-lg dark:prose-invert max-w-none mb-10">
                <p className="text-xl leading-relaxed">{resource.description}</p>
              </motion.div>
              
              {/* Details & Download */}
              <motion.div variants={fadeInUp} className="bg-card rounded-lg p-6 border border-border mb-8">
                <h2 className="text-xl font-bold mb-4">Resource Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Overview</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-sm">Category: {resource.category}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-sm">Type: {resource.resource_type}</span>
                      </li>
                      {resource.page_count && (
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span className="text-sm">{resource.page_count} pages</span>
                        </li>
                      )}
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-sm">{resource.download_count || 0} downloads</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Button 
                      size="lg" 
                      className="w-full mb-3" 
                      onClick={handleDownload}
                    >
                      <i className="fas fa-download mr-2"></i>
                      Download Now
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      No sign-up required. Free download.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <motion.div variants={fadeInUp} className="mt-8 mb-10">
                  <h3 className="text-lg font-medium mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Social Sharing */}
              <motion.div variants={fadeInUp} className="mt-12 border-t border-b border-border py-6">
                <h3 className="text-lg font-medium mb-4">Share this resource</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" onClick={shareOnTwitter}>
                    <i className="fab fa-twitter mr-2"></i>
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareOnLinkedIn}>
                    <i className="fab fa-linkedin mr-2"></i>
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyLinkToClipboard}>
                    <i className="fas fa-link mr-2"></i>
                    Copy Link
                  </Button>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Related Resources */}
            {relatedResources.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedResources.map((relatedResource: Resource) => (
                    <RelatedResourceCard key={relatedResource.id} resource={relatedResource} />
                  ))}
                </div>
              </section>
            )}
            
            {/* Newsletter CTA */}
            <section className="mt-20">
              <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-xl p-8 border border-primary/30">
                <div className="max-w-xl mx-auto text-center">
                  <h2 className="text-2xl font-bold mb-3">Get More AI Resources</h2>
                  <p className="text-muted-foreground mb-6">
                    Subscribe to our newsletter for early access to new guides, templates, and AI tools.
                  </p>
                  <div className="flex justify-center">
                    <Button className="bg-primary hover:bg-primary/90">
                      Subscribe
                    </Button>
                  </div>
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