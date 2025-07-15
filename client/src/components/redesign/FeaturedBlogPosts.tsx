import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Clock, TrendingUp, Zap, Check } from 'lucide-react';
import { Link } from 'wouter';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  category: string;
  publishedAt: string;
  slug: string;
}

export function FeaturedBlogPosts() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const featuredPosts = blogPosts?.slice(0, 3) || [];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubscribed(true);
        setEmail('');
        toast({
          title: "Welcome to the AI Revolution!",
          description: "Check your email for a welcome message with exclusive content.",
        });
      } else {
        toast({
          title: "Subscription Failed",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Unable to subscribe. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'ai_technology': 'bg-blue-100 text-blue-800',
      'business_strategy': 'bg-green-100 text-green-800',
      'automation': 'bg-purple-100 text-purple-800',
      'marketing_ai': 'bg-orange-100 text-orange-800',
      'case_studies': 'bg-indigo-100 text-indigo-800',
      'tutorials': 'bg-pink-100 text-pink-800',
      'industry_insights': 'bg-teal-100 text-teal-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-16 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Latest AI Insights
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Stay Ahead with AI Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Daily insights, expert analysis, and cutting-edge strategies from our AI team
          </p>
        </div>

        {/* Featured Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {featuredPosts.map((post, index) => (
            <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={`${getCategoryColor(post.category)} border-0`}>
                    {formatCategory(post.category)}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    5 min read
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-gray-600 line-clamp-3">
                  {post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700 group-hover:underline">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
            
            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Zap className="w-4 h-4" />
                  Never Miss an Update
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Get AI Insights Delivered Daily
                </h3>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join 10,000+ business leaders who rely on our daily AI newsletter for the latest trends, 
                  actionable strategies, and exclusive insights that drive real results.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Daily Market Intelligence</h4>
                      <p className="text-sm text-blue-100">Latest AI trends and market movements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Exclusive Strategies</h4>
                      <p className="text-sm text-blue-100">Proven tactics from successful AI implementations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Actionable Insights</h4>
                      <p className="text-sm text-blue-100">Ready-to-implement solutions for your business</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="max-w-md mx-auto">
                {isSubscribed ? (
                  <div className="flex items-center justify-center gap-3 text-white bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <Check className="h-5 w-5 text-green-300" />
                    <span className="font-medium">Thanks for subscribing! Check your email.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-white/30 text-base disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap disabled:opacity-50"
                    >
                      {isSubmitting ? "Subscribing..." : "Sign Up"}
                    </button>
                  </form>
                )}
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm text-blue-100">
                  No spam, unsubscribe at any time. Join the AI revolution today.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View All Posts CTA */}
        <div className="text-center mt-12">
          <Link href="/blog">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              View All Blog Posts
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}