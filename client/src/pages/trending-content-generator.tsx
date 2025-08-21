import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Zap, 
  Eye, 
  Target, 
  BarChart3, 
  FileText, 
  Video, 
  Calendar,
  Download,
  Sparkles,
  Globe,
  Clock,
  Users,
  Flame,
  ChevronRight,
  RefreshCw,
  Play,
  Copy,
  ExternalLink,
  Filter,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingDown,
  Hash,
  Share2,
  BookOpen,
  MessageSquare,
  Instagram,
  Youtube,
  Linkedin,
  Twitter
} from 'lucide-react';
import { NewHeader } from '@/components/redesign/NewHeader';

interface TrendComponents {
  velZ: number;
  accZ: number;
  consensus: number;
  audienceFit: number;
  freshness: number;
  saturation: number;
  risk: number;
}

interface TrendData {
  id: string;
  title: string;
  score: number;
  rank: number;
  window: '15m' | '60m' | '24h';
  components: TrendComponents;
  sparkline: { ts: string; value: number }[];
  category: string;
  entities: string[];
  sources: string[];
  estimatedReach: number;
  riskLevel: 'low' | 'medium' | 'high';
  updatedAt: string;
}

interface GeneratedAsset {
  id: string;
  kind: 'x_post' | 'instagram_caption' | 'tiktok_script' | 'youtube_short_outline' | 'linkedin_post' | 'facebook_post' | 'blog_outline';
  content: {
    title: string;
    body: string;
    hashtags: string[];
    cta: string;
    hooks?: string[];
    structure?: string[];
  };
  citations: {
    source: string;
    url: string;
    excerpt: string;
  }[];
  estimatedPerformance: {
    engagement: number;
    reach: number;
    viralPotential: number;
  };
  createdAt: string;
}

interface BrandVoice {
  tone: string;
  readingLevel: string;
  emoji: boolean;
  taboo: string[];
}

export default function TrendingContentGenerator() {
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);
  const [activeTab, setActiveTab] = useState<'trends' | 'assets' | 'calendar'>('trends');
  const [contentType, setContentType] = useState<string>('x_post');
  const [brandVoice, setBrandVoice] = useState<BrandVoice>({
    tone: 'professional',
    readingLevel: 'intermediate',
    emoji: true,
    taboo: []
  });
  const [targetAudience, setTargetAudience] = useState<string>('business');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [timeWindow, setTimeWindow] = useState<'15m' | '60m' | '24h'>('24h');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch trending topics with advanced scoring
  const { data: trends = [], isLoading: trendsLoading, refetch: refetchTrends } = useQuery({
    queryKey: ['/api/trends', timeWindow, filterCategory],
    refetchInterval: 15000, // Refresh every 15 seconds for real-time data
  });

  // Fetch generated assets
  const { data: assets = [], refetch: refetchAssets } = useQuery({
    queryKey: ['/api/assets'],
    enabled: activeTab === 'assets',
  });

  // Generate asset mutation with advanced features
  const generateAssetMutation = useMutation({
    mutationFn: async (params: {
      trendId: string;
      kind: string;
      brandVoice: BrandVoice;
      targetAudience: string;
      customPrompt?: string;
      includeAnalytics?: boolean;
    }) => {
      const response = await fetch('/api/generate-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Failed to generate asset');
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedAssets(prev => [data, ...prev]);
      refetchAssets();
      toast({
        title: "Asset Generated!",
        description: `${data.kind.replace('_', ' ')} created successfully with ${data.citations.length} citations`,
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Please try again with different parameters",
        variant: "destructive",
      });
    },
  });

  const handleGenerateAsset = () => {
    if (!selectedTrend) {
      toast({
        title: "No Trend Selected",
        description: "Please select a trending topic first",
        variant: "destructive",
      });
      return;
    }

    generateAssetMutation.mutate({
      trendId: selectedTrend.id,
      kind: contentType,
      brandVoice,
      targetAudience,
      customPrompt,
      includeAnalytics: true,
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const exportAsset = (asset: GeneratedAsset) => {
    const exportData = {
      content: asset.content,
      citations: asset.citations,
      performance: asset.estimatedPerformance,
      metadata: {
        kind: asset.kind,
        createdAt: asset.createdAt,
        trend: selectedTrend?.title
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asset.kind}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatScore = (score: number) => {
    return Math.round(score * 100) / 100;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 3.0) return 'text-green-600';
    if (score >= 1.5) return 'text-yellow-600';
    if (score >= 0.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getComponentColor = (value: number) => {
    if (value >= 2.0) return 'text-green-600';
    if (value >= 1.0) return 'text-yellow-600';
    if (value >= 0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPlatformIcon = (kind: string) => {
    switch (kind) {
      case 'x_post': return <Twitter className="w-4 h-4" />;
      case 'instagram_caption': return <Instagram className="w-4 h-4" />;
      case 'linkedin_post': return <Linkedin className="w-4 h-4" />;
      case 'youtube_short_outline': return <Youtube className="w-4 h-4" />;
      case 'tiktok_script': return <Video className="w-4 h-4" />;
      case 'facebook_post': return <Share2 className="w-4 h-4" />;
      case 'blog_outline': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const renderSparkline = (sparkline: { ts: string; value: number }[]) => {
    if (!sparkline || sparkline.length === 0) return null;
    
    const points = sparkline.map((point, i) => {
      const x = (i / (sparkline.length - 1)) * 80;
      const y = 32 - (point.value / 100) * 32;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-20 h-8" viewBox="0 0 80 32">
        <polyline
          fill="none"
          stroke="rgb(147, 51, 234)"
          strokeWidth="2"
          points={points}
        />
      </svg>
    );
  };

  // Enhanced mock data with advanced scoring components
  const mockTrends: TrendData[] = [
    {
      id: '1',
      title: 'AI-Powered Workflow Automation Revolution',
      score: 3.8,
      rank: 1,
      window: '24h',
      components: {
        velZ: 2.4,
        accZ: 1.8,
        consensus: 2.1,
        audienceFit: 2.7,
        freshness: 1.9,
        saturation: -0.3,
        risk: -0.1
      },
      sparkline: Array.from({ length: 48 }, (_, i) => ({
        ts: new Date(Date.now() - (47 - i) * 30 * 60 * 1000).toISOString(),
        value: Math.random() * 30 + Math.sin(i / 8) * 15 + 60
      })),
      category: 'Technology',
      entities: ['AI', 'automation', 'workflow', 'productivity', 'business', 'machine learning'],
      sources: ['TechCrunch', 'Wired', 'Reddit r/artificial', 'Hacker News'],
      estimatedReach: 2500000,
      riskLevel: 'low',
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Remote Work Mental Health Crisis',
      score: 3.2,
      rank: 2,
      window: '24h',
      components: {
        velZ: 3.1,
        accZ: 0.8,
        consensus: 1.9,
        audienceFit: 2.3,
        freshness: 1.4,
        saturation: -0.7,
        risk: -0.5
      },
      sparkline: Array.from({ length: 48 }, (_, i) => ({
        ts: new Date(Date.now() - (47 - i) * 30 * 60 * 1000).toISOString(),
        value: Math.random() * 25 + Math.cos(i / 6) * 18 + 55
      })),
      category: 'Business',
      entities: ['remote work', 'mental health', 'burnout', 'wellness', 'productivity', 'work-life balance'],
      sources: ['Harvard Business Review', 'LinkedIn', 'Twitter', 'Psychology Today'],
      estimatedReach: 1800000,
      riskLevel: 'medium',
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Sustainable Energy Storage Breakthrough',
      score: 2.9,
      rank: 3,
      window: '24h',
      components: {
        velZ: 1.6,
        accZ: 2.3,
        consensus: 1.7,
        audienceFit: 2.0,
        freshness: 2.1,
        saturation: -0.4,
        risk: -0.2
      },
      sparkline: Array.from({ length: 48 }, (_, i) => ({
        ts: new Date(Date.now() - (47 - i) * 30 * 60 * 1000).toISOString(),
        value: Math.random() * 20 + Math.sin(i / 10) * 12 + 45
      })),
      category: 'Science',
      entities: ['battery', 'renewable energy', 'storage', 'sustainability', 'innovation', 'clean tech'],
      sources: ['Nature', 'MIT Technology Review', 'CleanTechnica', 'Scientific American'],
      estimatedReach: 950000,
      riskLevel: 'low',
      updatedAt: new Date().toISOString()
    }
  ];

  const displayTrends = trends.length > 0 ? trends : mockTrends;
  const filteredTrends = filterCategory === 'all' 
    ? displayTrends 
    : displayTrends.filter(trend => trend.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <>
      <Helmet>
        <title>Trending Content Generator - AI-Powered Trend Analysis | Advanta AI</title>
        <meta name="description" content="Generate viral content based on real-time trend analysis. AI-powered content creation for social media, blogs, and marketing campaigns." />
        <meta property="og:title" content="Trending Content Generator - AI-Powered Trend Analysis" />
        <meta property="og:description" content="Generate viral content based on real-time trend analysis. AI-powered content creation for social media, blogs, and marketing campaigns." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <NewHeader />
        
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-6">
          <motion.header 
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Trending Content Generator
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced trend analysis with multi-component scoring. Generate viral content with citations, performance predictions, and platform optimization.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Real-time scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>AI-powered generation</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Multi-platform optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Source citations</span>
              </div>
            </div>
          </motion.header>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="assets" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Assets
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Calendar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trends">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trends Panel */}
                <motion.div 
                  className="lg:col-span-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Flame className="w-5 h-5 text-orange-500" />
                          Trending Now
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="entertainment">Entertainment</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select value={timeWindow} onValueChange={(value) => setTimeWindow(value as any)}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15m">15m</SelectItem>
                              <SelectItem value="60m">1h</SelectItem>
                              <SelectItem value="24h">24h</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => refetchTrends()}
                            disabled={trendsLoading}
                          >
                            <RefreshCw className={`w-4 h-4 ${trendsLoading ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredTrends.map((trend, index) => (
                          <motion.div
                            key={trend.id}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedTrend?.id === trend.id 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedTrend(trend)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary" className="text-xs">
                                    #{trend.rank}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {trend.category}
                                  </Badge>
                                  <Badge className={`text-xs ${getRiskColor(trend.riskLevel)}`}>
                                    {trend.riskLevel} risk
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{trend.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                  <span className="flex items-center gap-1">
                                    <BarChart3 className="w-4 h-4" />
                                    Score: <span className={`font-medium ${getScoreColor(trend.score)}`}>
                                      {formatScore(trend.score)}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {(trend.estimatedReach / 1000000).toFixed(1)}M reach
                                  </span>
                                </div>
                                
                                {/* Component Breakdown */}
                                {showAdvanced && (
                                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                    <div className="flex justify-between">
                                      <span>Velocity:</span>
                                      <span className={getComponentColor(trend.components.velZ)}>
                                        {formatScore(trend.components.velZ)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Acceleration:</span>
                                      <span className={getComponentColor(trend.components.accZ)}>
                                        {formatScore(trend.components.accZ)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Consensus:</span>
                                      <span className={getComponentColor(trend.components.consensus)}>
                                        {formatScore(trend.components.consensus)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Audience Fit:</span>
                                      <span className={getComponentColor(trend.components.audienceFit)}>
                                        {formatScore(trend.components.audienceFit)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Freshness:</span>
                                      <span className={getComponentColor(trend.components.freshness)}>
                                        {formatScore(trend.components.freshness)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Saturation:</span>
                                      <span className={getComponentColor(-trend.components.saturation)}>
                                        {formatScore(trend.components.saturation)}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="mb-2">
                                  {renderSparkline(trend.sparkline)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {trend.window} window
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {trend.entities.slice(0, 4).map((entity) => (
                                  <Badge key={entity} variant="secondary" className="text-xs">
                                    <Hash className="w-3 h-3 mr-1" />
                                    {entity}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {trend.sources.length} sources
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                          {showAdvanced ? 'Hide' : 'Show'} Component Breakdown
                        </Button>
                        <div className="text-xs text-gray-500">
                          Last updated: {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Content Generation Panel */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        Generate Asset
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!selectedTrend ? (
                        <div className="text-center py-8 text-gray-500">
                          <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>Select a trending topic to start generating content</p>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <h4 className="font-medium text-purple-900 mb-1">Selected Trend</h4>
                            <p className="text-sm text-purple-700">{selectedTrend.title}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={`text-xs ${getScoreColor(selectedTrend.score)}`}>
                                Score: {formatScore(selectedTrend.score)}
                              </Badge>
                              <Badge className={`text-xs ${getRiskColor(selectedTrend.riskLevel)}`}>
                                {selectedTrend.riskLevel} risk
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Content Type</label>
                            <Select value={contentType} onValueChange={setContentType}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="x_post">
                                  <div className="flex items-center gap-2">
                                    <Twitter className="w-4 h-4" />
                                    X/Twitter Post
                                  </div>
                                </SelectItem>
                                <SelectItem value="linkedin_post">
                                  <div className="flex items-center gap-2">
                                    <Linkedin className="w-4 h-4" />
                                    LinkedIn Post
                                  </div>
                                </SelectItem>
                                <SelectItem value="instagram_caption">
                                  <div className="flex items-center gap-2">
                                    <Instagram className="w-4 h-4" />
                                    Instagram Caption
                                  </div>
                                </SelectItem>
                                <SelectItem value="youtube_short_outline">
                                  <div className="flex items-center gap-2">
                                    <Youtube className="w-4 h-4" />
                                    YouTube Short
                                  </div>
                                </SelectItem>
                                <SelectItem value="tiktok_script">
                                  <div className="flex items-center gap-2">
                                    <Video className="w-4 h-4" />
                                    TikTok Script
                                  </div>
                                </SelectItem>
                                <SelectItem value="facebook_post">
                                  <div className="flex items-center gap-2">
                                    <Share2 className="w-4 h-4" />
                                    Facebook Post
                                  </div>
                                </SelectItem>
                                <SelectItem value="blog_outline">
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Blog Outline
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Brand Voice</label>
                            <Select value={brandVoice.tone} onValueChange={(tone) => setBrandVoice(prev => ({ ...prev, tone }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="casual">Casual</SelectItem>
                                <SelectItem value="humorous">Humorous</SelectItem>
                                <SelectItem value="authoritative">Authoritative</SelectItem>
                                <SelectItem value="inspirational">Inspirational</SelectItem>
                                <SelectItem value="conversational">Conversational</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Target Audience</label>
                            <Select value={targetAudience} onValueChange={setTargetAudience}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="business">Business Professionals</SelectItem>
                                <SelectItem value="tech">Tech Enthusiasts</SelectItem>
                                <SelectItem value="general">General Public</SelectItem>
                                <SelectItem value="students">Students</SelectItem>
                                <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
                                <SelectItem value="creators">Content Creators</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Additional Instructions (Optional)</label>
                            <Textarea
                              placeholder="Add specific requirements, key points to include, or style preferences..."
                              value={customPrompt}
                              onChange={(e) => setCustomPrompt(e.target.value)}
                              rows={3}
                            />
                          </div>

                          <Button 
                            onClick={handleGenerateAsset}
                            disabled={generateAssetMutation.isPending}
                            className="w-full"
                          >
                            {generateAssetMutation.isPending ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                                Generating Asset...
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Generate Asset
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="assets">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      Generated Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedAssets.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No assets generated yet</p>
                        <p>Switch to the Trends tab and generate your first asset</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {generatedAssets.map((asset, index) => (
                          <div key={asset.id} className="border rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                {getPlatformIcon(asset.kind)}
                                <div>
                                  <h3 className="font-semibold capitalize">
                                    {asset.kind.replace('_', ' ')}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {new Date(asset.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(asset.content.body)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => exportAsset(asset)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <h4 className="font-medium mb-2">{asset.content.title}</h4>
                              <div className="whitespace-pre-wrap text-sm text-gray-800 mb-3">
                                {asset.content.body}
                              </div>
                              {asset.content.hashtags?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {asset.content.hashtags.map((hashtag, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      #{hashtag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {asset.content.cta && (
                                <div className="text-sm font-medium text-blue-600">
                                  CTA: {asset.content.cta}
                                </div>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h5 className="font-medium text-sm mb-2">Performance Estimates</h5>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Engagement:</span>
                                    <span className="font-medium">
                                      {asset.estimatedPerformance.engagement.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Reach:</span>
                                    <span className="font-medium">
                                      {asset.estimatedPerformance.reach.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Viral Potential:</span>
                                    <div className="flex items-center gap-2">
                                      <Progress 
                                        value={asset.estimatedPerformance.viralPotential} 
                                        className="w-16 h-2" 
                                      />
                                      <span className="text-xs">
                                        {asset.estimatedPerformance.viralPotential}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-sm mb-2">
                                  Citations ({asset.citations.length})
                                </h5>
                                <div className="space-y-1 text-xs">
                                  {asset.citations.slice(0, 3).map((citation, i) => (
                                    <div key={i} className="truncate">
                                      <a 
                                        href={citation.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        {citation.source}
                                      </a>
                                    </div>
                                  ))}
                                  {asset.citations.length > 3 && (
                                    <div className="text-gray-500">
                                      +{asset.citations.length - 3} more sources
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="calendar">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-500" />
                      Content Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Content Calendar</p>
                      <p>Schedule and manage your generated assets across platforms</p>
                      <Button className="mt-4" variant="outline">
                        Coming Soon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}