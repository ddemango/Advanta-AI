import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/layout/Header';
import { Helmet } from 'react-helmet';
import { 
  Search, 
  TrendingUp, 
  Eye, 
  Globe, 
  Target, 
  Zap, 
  BarChart3,
  LinkIcon,
  Smartphone,
  Brain,
  Clock,
  Users,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

interface CompetitorData {
  url: string;
  domain: string;
  traffic: {
    monthlyVisits?: number;
    organicTraffic?: number;
    paidTraffic?: number;
    totalKeywords?: number;
    topSources?: { source: string; percentage: number }[];
    error?: string;
  };
  seo: {
    topKeywords?: { keyword: string; position: number; volume: number; cpc: number }[];
    totalKeywords?: number;
    metaTags: { title: string; description: string };
    error?: string;
  };
  backlinks: {
    totalBacklinks?: number;
    referringDomains?: number;
    anchorTexts?: string[];
    domainRank?: number;
    error?: string;
  };
  domainMetrics: {
    domainRank?: number;
    organicKeywords?: number;
    organicTraffic?: number;
    paidKeywords?: number;
    error?: string;
  };
  websiteData: {
    title: string;
    description: string;
    mainHeading: string;
    textContent: string;
  };
  insights: {
    strengths: string[];
    opportunities: string[];
    recommendations: string[];
  };
}

export default function CompetitorIntelScanner() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [competitorData, setCompetitorData] = useState<CompetitorData | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a competitor's website URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await apiRequest('POST', '/api/analyze-competitor', {
        url: url.startsWith('http') ? url : `https://${url}`
      });

      if (response.ok) {
        const data = await response.json();
        setCompetitorData(data);
        toast({
          title: "Analysis Complete!",
          description: "Successfully analyzed competitor intelligence data.",
        });
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Competitor analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the competitor. Please try again or check the URL.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatNumber = (num: number | undefined) => {
    if (!num || num === 0) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <>
      <Helmet>
        <title>Competitor Intel Scanner - Drop in a URL. Steal the playbook. | Advanta AI</title>
        <meta name="description" content="Analyze any competitor's website instantly. Get traffic data, SEO insights, ad intelligence, content analysis, and actionable recommendations." />
        <meta property="og:title" content="Free Competitor Intelligence Scanner | Advanta AI" />
        <meta property="og:description" content="Enter any competitor URL and get detailed marketing intelligence report including traffic, SEO, ads, and tech stack analysis." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="mb-8">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  <Search className="w-4 h-4 mr-2" />
                  Free Competitor Analysis Tool
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Competitor Intel Scanner
                </h1>
                <p className="text-2xl text-primary font-semibold mb-4">
                  "Drop in a URL. Steal the playbook."
                </p>
                <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Enter any competitor's website URL and instantly get a detailed marketing intelligence report 
                  including traffic data, SEO insights, ad intelligence, and actionable recommendations.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Analysis Form */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-muted/20">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center">
                    <Target className="w-5 h-5 mr-2" />
                    Enter Competitor URL
                  </CardTitle>
                  <CardDescription>
                    We'll analyze their marketing strategy, traffic sources, content, and tech stack
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAnalyze} className="space-y-6">
                    <div>
                      <Label htmlFor="url">Website URL</Label>
                      <Input
                        id="url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://competitor-website.com"
                        className="mt-1"
                        disabled={isAnalyzing}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing Competitor...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Analyze Competitor
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        {competitorData && (
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="max-w-6xl mx-auto"
              >
                <motion.div variants={fadeInUp} className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Competitor Intelligence Report
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Analysis for: <span className="text-primary font-semibold">{competitorData.url}</span>
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Traffic Analysis */}
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                          Traffic Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                              {formatNumber(competitorData.traffic.monthlyVisits)}
                            </div>
                            <div className="text-sm text-muted-foreground">Monthly Visits</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                              {formatNumber(competitorData.traffic.organicTraffic)}
                            </div>
                            <div className="text-sm text-muted-foreground">Organic Traffic</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Top Traffic Sources</h4>
                          <div className="space-y-2">
                            {competitorData.traffic.topSources?.map((source, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="capitalize">{source.source}</span>
                                <Badge variant="outline">{source.percentage}%</Badge>
                              </div>
                            )) || <p className="text-muted-foreground">No traffic source data available</p>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* SEO Snapshot */}
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Search className="w-5 h-5 mr-2 text-green-500" />
                          SEO Snapshot
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                              {competitorData.seo.totalKeywords ? formatNumber(competitorData.seo.totalKeywords) : 'N/A'}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Keywords</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                              {competitorData.backlinks.totalBacklinks ? formatNumber(competitorData.backlinks.totalBacklinks) : 'N/A'}
                            </div>
                            <div className="text-sm text-muted-foreground">Backlinks</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Top Keywords</h4>
                          <div className="space-y-2">
                            {competitorData.seo.topKeywords?.slice(0, 3).map((keyword, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-sm">{keyword.keyword}</span>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">#{keyword.position}</Badge>
                                  <Badge variant="secondary">{formatNumber(keyword.volume)}</Badge>
                                </div>
                              </div>
                            )) || <p className="text-muted-foreground">No keyword data available</p>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Ad Intelligence */}
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Target className="w-5 h-5 mr-2 text-purple-500" />
                          Ad Intelligence
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Backlinks Analysis</h4>
                          <div className="space-y-3">
                            {competitorData.backlinks?.totalBacklinks ? (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-muted/50 rounded-lg">
                                  <div className="text-2xl font-bold text-primary">
                                    {formatNumber(competitorData.backlinks.totalBacklinks)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">Total Backlinks</div>
                                </div>
                                <div className="text-center p-4 bg-muted/50 rounded-lg">
                                  <div className="text-2xl font-bold text-primary">
                                    {formatNumber(competitorData.backlinks.referringDomains)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">Referring Domains</div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-muted-foreground">DataForSEO backlinks data requires API access</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Domain Metrics</h4>
                          <div className="flex flex-wrap gap-2">
                            {competitorData.domainMetrics?.organicKeywords ? (
                              <>
                                <Badge variant="secondary">Keywords: {formatNumber(competitorData.domainMetrics.organicKeywords)}</Badge>
                                <Badge variant="secondary">Traffic: {formatNumber(competitorData.domainMetrics.organicTraffic)}</Badge>
                                <Badge variant="secondary">Rank: {competitorData.domainMetrics.domainRank}</Badge>
                              </>
                            ) : (
                              <p className="text-muted-foreground">DataForSEO domain metrics require API access</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Tech Stack */}
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Globe className="w-5 h-5 mr-2 text-orange-500" />
                          Website Data
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Site Title</h4>
                          <p className="text-sm text-muted-foreground">{competitorData.websiteData.title}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Meta Description</h4>
                          <p className="text-sm text-muted-foreground">{competitorData.websiteData.description}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Main Heading</h4>
                          <p className="text-sm text-muted-foreground">{competitorData.websiteData.mainHeading}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* AI Insights */}
                  <motion.div variants={fadeInUp} className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Brain className="w-5 h-5 mr-2 text-primary" />
                          AI-Powered Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                              What's Working
                            </h4>
                            <ul className="space-y-2">
                              {competitorData.insights.strengths.map((strength, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start">
                                  <ArrowRight className="w-3 h-3 mr-2 mt-1 text-green-500 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                              Opportunities
                            </h4>
                            <ul className="space-y-2">
                              {competitorData.insights.opportunities.map((opportunity, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start">
                                  <ArrowRight className="w-3 h-3 mr-2 mt-1 text-yellow-500 flex-shrink-0" />
                                  {opportunity}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <Target className="w-4 h-4 mr-2 text-primary" />
                              Our Recommendations
                            </h4>
                            <ul className="space-y-2">
                              {competitorData.insights.recommendations.map((recommendation, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start">
                                  <ArrowRight className="w-3 h-3 mr-2 mt-1 text-primary flex-shrink-0" />
                                  {recommendation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Features Section */}
        {!competitorData && (
          <section className="py-20 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6">
                  What You'll Discover
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Get comprehensive insights into your competitors' digital marketing strategy
                </motion.p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: TrendingUp,
                    title: "Traffic Analysis",
                    description: "Monthly visitors, bounce rate, session duration, and traffic sources",
                    color: "text-blue-500"
                  },
                  {
                    icon: Search,
                    title: "SEO Intelligence",
                    description: "Top keywords, domain authority, backlinks, and meta tag analysis",
                    color: "text-green-500"
                  },
                  {
                    icon: Target,
                    title: "Ad Intelligence",
                    description: "Active Facebook/Google ads, targeting keywords, and ad copy analysis",
                    color: "text-purple-500"
                  },
                  {
                    icon: BarChart3,
                    title: "Content Breakdown",
                    description: "Top performing pages, content types, and CTA analysis",
                    color: "text-orange-500"
                  },
                  {
                    icon: Zap,
                    title: "Tech Stack Detection",
                    description: "CMS, analytics tools, marketing platforms, and integrations",
                    color: "text-red-500"
                  },
                  {
                    icon: Brain,
                    title: "AI Insights",
                    description: "What's working, missed opportunities, and actionable recommendations",
                    color: "text-primary"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="group"
                  >
                    <Card className="h-full border-muted/20 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
                      <CardHeader>
                        <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Outperform Your Competition?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get detailed insights into any competitor's digital strategy and discover opportunities to dominate your market.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <a href="#analyze">Start Your Analysis</a>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}