import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/layout/Header';
import { Helmet } from 'react-helmet';
import { 
  TrendingUp, 
  Calendar, 
  Building2, 
  Search, 
  ArrowUp, 
  ArrowDown,
  BarChart3,
  Eye,
  Users,
  Globe,
  Clock,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

interface TrendingItem {
  keyword: string;
  searchVolume: number;
  growthPercentage: number;
  category: string;
  relatedTerms: string[];
  difficulty: 'Low' | 'Medium' | 'High';
  cpc: number;
}

interface TrendingData {
  timeFrame: string;
  industry: string;
  totalSearches: number;
  trends: TrendingItem[];
  lastUpdated: string;
}

export default function TrendingContentGenerator() {
  const { toast } = useToast();
  const [timeFrame, setTimeFrame] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [trendingData, setTrendingData] = useState<TrendingData | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    youtube: true,
    facebook: true,
    tiktok: true
  });

  const timeFrameOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const industryOptions = [
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'fitness', label: 'Fitness & Health' },
    { value: 'fashion', label: 'Fashion & Beauty' },
    { value: 'technology', label: 'Technology & Software' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'finance', label: 'Finance & Investing' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'food', label: 'Food & Cooking' },
    { value: 'travel', label: 'Travel & Tourism' },
    { value: 'education', label: 'Education & Learning' },
    { value: 'entertainment', label: 'Entertainment & Media' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'business', label: 'Business & Entrepreneurship' }
  ];

  const generateTrends = async () => {
    if (!timeFrame || !industry) {
      toast({
        title: "Missing Selection",
        description: "Please select both time frame and industry to generate trends.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await apiRequest('POST', '/api/generate-trending-content', {
        timeFrame,
        industry,
        keywords,
        platforms: selectedPlatforms
      });

      const data = await response.json();
      setTrendingData(data);

      toast({
        title: "Trends Generated!",
        description: `Found ${data.trends.length} trending topics for ${industry}.`,
      });

    } catch (error) {
      console.error('Trending content generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to fetch trending data. Please try again or check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 50) return "text-green-600";
    if (growth > 20) return "text-green-500";
    if (growth > 0) return "text-blue-500";
    return "text-red-500";
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Trending Content Generator - Real-Time Search Trends | Advanta AI</title>
        <meta name="description" content="Discover trending topics and search terms in any industry with real-time data. Get growth percentages, search volumes, and content opportunities." />
        <meta property="og:title" content="AI Trending Content Generator - Real-Time Search Trends" />
        <meta property="og:description" content="Access real-time trending search data across industries with growth metrics and content opportunities." />
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
              <motion.div variants={fadeInUp} className="mb-6">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Real-Time Trends
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  AI Trending Content Generator
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Discover what's trending in your industry right now. Get real-time search data, 
                  growth percentages, and content opportunities powered by live trend APIs.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Generator Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp}>
                <Card className="border-muted/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Search className="w-5 h-5 mr-2" />
                      Generate Trending Content Ideas
                    </CardTitle>
                    <CardDescription>
                      Select your time frame and industry to discover the hottest trending topics and search terms.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Time Frame</label>
                        <Select value={timeFrame} onValueChange={setTimeFrame}>
                          <SelectTrigger>
                            <Calendar className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Select time frame" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeFrameOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Industry</label>
                        <Select value={industry} onValueChange={setIndustry}>
                          <SelectTrigger>
                            <Building2 className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industryOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Keywords (Optional)</label>
                      <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Enter specific keywords to narrow search (e.g., AI, automation, trends)"
                        className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Add keywords to focus your trending search on specific topics within your industry
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Data Sources</label>
                      <div className="grid grid-cols-3 gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPlatforms.youtube}
                            onChange={(e) => setSelectedPlatforms(prev => ({ ...prev, youtube: e.target.checked }))}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <span className="text-sm">YouTube</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPlatforms.facebook}
                            onChange={(e) => setSelectedPlatforms(prev => ({ ...prev, facebook: e.target.checked }))}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <span className="text-sm">Facebook</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPlatforms.tiktok}
                            onChange={(e) => setSelectedPlatforms(prev => ({ ...prev, tiktok: e.target.checked }))}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <span className="text-sm">TikTok</span>
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select which platforms to pull trending data from
                      </p>
                    </div>

                    <Button 
                      onClick={generateTrends}
                      disabled={isGenerating || !timeFrame || !industry}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Fetching Real-Time Trends...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Generate Trending Content
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        {trendingData && (
          <section className="py-16 bg-muted/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="max-w-6xl mx-auto"
              >
                <motion.div variants={fadeInUp} className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Top 20 Trending Searches
                  </h2>
                  <div className="flex items-center justify-center space-x-6 text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {trendingData.timeFrame}
                    </div>
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      {industryOptions.find(opt => opt.value === trendingData.industry)?.label}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Last updated: {trendingData.lastUpdated}
                    </div>
                  </div>
                </motion.div>

                {/* Summary Stats */}
                <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{trendingData.totalSearches.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Searches</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{trendingData.trends.length}</div>
                      <div className="text-sm text-muted-foreground">Trending Topics</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {Math.max(...trendingData.trends.map(t => t.growthPercentage))}%
                      </div>
                      <div className="text-sm text-muted-foreground">Highest Growth</div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Trending Items List */}
                <div className="space-y-4">
                  {trendingData.trends.map((trend, index) => (
                    <motion.div key={index} variants={fadeInUp}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{trend.keyword}</h3>
                                <p className="text-sm text-muted-foreground">{trend.category}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className={`flex items-center space-x-1 ${getGrowthColor(trend.growthPercentage)}`}>
                                {getGrowthIcon(trend.growthPercentage)}
                                <span className="font-bold">{trend.growthPercentage}%</span>
                              </div>
                              <Badge className={getDifficultyColor(trend.difficulty)}>
                                {trend.difficulty}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <Eye className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">
                                <span className="font-medium">{trend.searchVolume.toLocaleString()}</span> searches
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">
                                <span className="font-medium">${trend.cpc}</span> CPC
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <BarChart3 className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">
                                <span className="font-medium">{trend.difficulty}</span> competition
                              </span>
                            </div>
                          </div>

                          {trend.relatedTerms.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Related Terms:</p>
                              <div className="flex flex-wrap gap-2">
                                {trend.relatedTerms.map((term, termIndex) => (
                                  <Badge key={termIndex} variant="secondary" className="text-xs">
                                    {term}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6">
                Powered by Real-Time Data
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our trending content generator uses live APIs and real search data to provide accurate insights.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Live Search Data",
                  description: "Real-time search volume and trend data from major search engines and social platforms.",
                  color: "text-blue-500"
                },
                {
                  icon: TrendingUp,
                  title: "Growth Analytics",
                  description: "Week-over-week and month-over-month growth percentages for trending topics.",
                  color: "text-green-500"
                },
                {
                  icon: Target,
                  title: "Industry-Specific",
                  description: "Filtered trends for 12+ industries including marketing, tech, fitness, and more.",
                  color: "text-purple-500"
                },
                {
                  icon: Zap,
                  title: "Instant Results",
                  description: "Get trending content ideas in seconds with our optimized data processing.",
                  color: "text-yellow-500"
                },
                {
                  icon: BarChart3,
                  title: "Competition Analysis",
                  description: "Difficulty scores and CPC data to help you choose the best opportunities.",
                  color: "text-red-500"
                },
                {
                  icon: Clock,
                  title: "Multiple Time Frames",
                  description: "View trends for today, this week, or this month to match your content calendar.",
                  color: "text-cyan-500"
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
      </div>
    </>
  );
}