import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ExternalLink
} from 'lucide-react';
import { NewHeader } from '@/components/redesign/NewHeader';

interface TrendData {
  id: string;
  title: string;
  score: number;
  velocity: number;
  acceleration: number;
  consensus: number;
  freshness: number;
  saturation: number;
  sources: string[];
  keywords: string[];
  sparkline: { timestamp: string; value: number }[];
  category: string;
  estimatedReach: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface GeneratedContent {
  type: 'twitter_thread' | 'linkedin_post' | 'youtube_script' | 'blog_outline' | 'instagram_reel';
  title: string;
  content: string;
  hashtags: string[];
  cta: string;
  estimatedEngagement: number;
}

export default function TrendingContentGenerator() {
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);
  const [contentType, setContentType] = useState<string>('twitter_thread');
  const [brandVoice, setBrandVoice] = useState<string>('professional');
  const [targetAudience, setTargetAudience] = useState<string>('business');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [timeWindow, setTimeWindow] = useState<string>('24h');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch trending topics
  const { data: trends = [], isLoading: trendsLoading, refetch: refetchTrends } = useQuery({
    queryKey: ['/api/trends', timeWindow],
    refetchInterval: 60000, // Refresh every minute
  });

  // Generate content mutation
  const generateContentMutation = useMutation({
    mutationFn: async (params: {
      trendId: string;
      contentType: string;
      brandVoice: string;
      targetAudience: string;
      customPrompt?: string;
    }) => {
      const response = await fetch('/api/generate-trending-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Failed to generate content');
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(prev => [...prev, data]);
      toast({
        title: "Content Generated!",
        description: `${data.type.replace('_', ' ')} successfully created`,
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Please try again with different parameters",
        variant: "destructive",
      });
    },
  });

  const handleGenerateContent = () => {
    if (!selectedTrend) {
      toast({
        title: "No Trend Selected",
        description: "Please select a trending topic first",
        variant: "destructive",
      });
      return;
    }

    generateContentMutation.mutate({
      trendId: selectedTrend.id,
      contentType,
      brandVoice,
      targetAudience,
      customPrompt,
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const exportContent = (content: GeneratedContent) => {
    const blob = new Blob([content.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.type}_${content.title.slice(0, 20)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatScore = (score: number) => {
    return Math.round(score * 100) / 100;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Mock data for development
  const mockTrends: TrendData[] = [
    {
      id: '1',
      title: 'AI-Powered Workflow Automation Revolution',
      score: 92.5,
      velocity: 85,
      acceleration: 78,
      consensus: 89,
      freshness: 95,
      saturation: 15,
      sources: ['TechCrunch', 'Wired', 'Reddit r/artificial'],
      keywords: ['AI', 'automation', 'workflow', 'productivity', 'business'],
      sparkline: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
        value: Math.random() * 100 + Math.sin(i / 4) * 20 + 50
      })),
      category: 'Technology',
      estimatedReach: 2500000,
      riskLevel: 'low'
    },
    {
      id: '2',
      title: 'Remote Work Mental Health Crisis',
      score: 87.3,
      velocity: 92,
      acceleration: 65,
      consensus: 82,
      freshness: 88,
      saturation: 35,
      sources: ['Harvard Business Review', 'LinkedIn', 'Twitter'],
      keywords: ['remote work', 'mental health', 'burnout', 'wellness', 'productivity'],
      sparkline: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
        value: Math.random() * 100 + Math.cos(i / 3) * 25 + 60
      })),
      category: 'Business',
      estimatedReach: 1800000,
      riskLevel: 'medium'
    },
    {
      id: '3',
      title: 'Sustainable Energy Storage Breakthrough',
      score: 84.1,
      velocity: 76,
      acceleration: 88,
      consensus: 79,
      freshness: 92,
      saturation: 25,
      sources: ['Nature', 'MIT Technology Review', 'CleanTechnica'],
      keywords: ['battery', 'renewable energy', 'storage', 'sustainability', 'innovation'],
      sparkline: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
        value: Math.random() * 100 + Math.sin(i / 5) * 30 + 45
      })),
      category: 'Science',
      estimatedReach: 950000,
      riskLevel: 'low'
    }
  ];

  const displayTrends = trends.length > 0 ? trends : mockTrends;

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
              Generate viral content based on real-time trend analysis. Turn trending topics into engaging posts across all platforms.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Real-time data</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>AI-powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Multi-platform</span>
              </div>
            </div>
          </motion.header>

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
                      <Select value={timeWindow} onValueChange={setTimeWindow}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">Last Hour</SelectItem>
                          <SelectItem value="24h">Last 24h</SelectItem>
                          <SelectItem value="7d">Last Week</SelectItem>
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
                    {displayTrends.map((trend, index) => (
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
                            <h3 className="font-semibold text-gray-900 mb-2">{trend.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
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
                              <Badge className={getRiskColor(trend.riskLevel)}>
                                {trend.riskLevel} risk
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-2">
                              {trend.category}
                            </Badge>
                            <div className="w-20 h-8">
                              {/* Simple sparkline visualization */}
                              <svg className="w-full h-full" viewBox="0 0 80 32">
                                <polyline
                                  fill="none"
                                  stroke="rgb(147, 51, 234)"
                                  strokeWidth="2"
                                  points={trend.sparkline.map((point, i) => 
                                    `${(i / (trend.sparkline.length - 1)) * 80},${32 - (point.value / 100) * 32}`
                                  ).join(' ')}
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {trend.keywords.slice(0, 3).map((keyword) => (
                              <Badge key={keyword} variant="secondary" className="text-xs">
                                {keyword}
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
                    Generate Content
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
                      <div>
                        <label className="block text-sm font-medium mb-2">Content Type</label>
                        <Select value={contentType} onValueChange={setContentType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="twitter_thread">Twitter Thread</SelectItem>
                            <SelectItem value="linkedin_post">LinkedIn Post</SelectItem>
                            <SelectItem value="youtube_script">YouTube Script</SelectItem>
                            <SelectItem value="blog_outline">Blog Outline</SelectItem>
                            <SelectItem value="instagram_reel">Instagram Reel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Brand Voice</label>
                        <Select value={brandVoice} onValueChange={setBrandVoice}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="humorous">Humorous</SelectItem>
                            <SelectItem value="authoritative">Authoritative</SelectItem>
                            <SelectItem value="inspirational">Inspirational</SelectItem>
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
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Custom Instructions (Optional)</label>
                        <Textarea
                          placeholder="Add specific requirements, tone adjustments, or key points to include..."
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <Button 
                        onClick={handleGenerateContent}
                        disabled={generateContentMutation.isPending}
                        className="w-full"
                      >
                        {generateContentMutation.isPending ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Generate Content
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Generated Content Display */}
          {generatedContent.length > 0 && (
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Generated Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {generatedContent.map((content, index) => (
                      <div key={index} className="border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="capitalize">
                              {content.type.replace('_', ' ')}
                            </Badge>
                            <h3 className="font-semibold">{content.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(content.content)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportContent(content)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <pre className="whitespace-pre-wrap text-sm text-gray-800">
                            {content.content}
                          </pre>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            <span>Hashtags: {content.hashtags.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>Est. {content.estimatedEngagement.toLocaleString()} engagement</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}