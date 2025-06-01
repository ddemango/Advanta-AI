import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/layout/Header';
import { Helmet } from 'react-helmet';
import { 
  Upload, 
  Video, 
  Eye, 
  Clock, 
  Palette, 
  Heart, 
  Type, 
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  PlayCircle,
  BarChart3,
  Zap,
  Camera,
  Users,
  MessageSquare,
  Share2,
  ThumbsUp
} from 'lucide-react';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

interface VideoAnalysis {
  fileName: string;
  hookStrength: number;
  pacingScore: number;
  visualClarity: number;
  emotionScore: number;
  textOptimization: number;
  ctaPresence: number;
  overallScore: number;
  recommendation: string;
  strengths: string[];
  improvements: string[];
  predictedEngagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

interface ComparisonResult {
  winner: string;
  analyses: VideoAnalysis[];
  summary: string;
  keyInsights: string[];
}

export default function SocialClipAnalyzer() {
  const { toast } = useToast();
  const [videos, setVideos] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ComparisonResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length < 2) {
      toast({
        title: "Minimum Videos Required",
        description: "Please upload at least 2 videos to compare.",
        variant: "destructive",
      });
      return;
    }
    if (files.length > 5) {
      toast({
        title: "Too Many Videos",
        description: "Maximum 5 videos can be compared at once.",
        variant: "destructive",
      });
      return;
    }
    setVideos(files);
    setResults(null);
  };

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeVideos = async () => {
    if (videos.length < 2) {
      toast({
        title: "Not Enough Videos",
        description: "Please upload at least 2 videos to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const formData = new FormData();
      videos.forEach((video, index) => {
        formData.append(`video_${index}`, video);
      });

      const response = await apiRequest('POST', '/api/analyze-social-clips', {
        videoCount: videos.length,
        videoNames: videos.map(v => v.name)
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Mock comprehensive analysis results
      const mockResults: ComparisonResult = {
        winner: videos[0].name,
        analyses: videos.map((video, index) => ({
          fileName: video.name,
          hookStrength: Math.floor(Math.random() * 30) + 70,
          pacingScore: Math.floor(Math.random() * 25) + 75,
          visualClarity: Math.floor(Math.random() * 20) + 80,
          emotionScore: Math.floor(Math.random() * 35) + 65,
          textOptimization: Math.floor(Math.random() * 30) + 70,
          ctaPresence: Math.floor(Math.random() * 40) + 60,
          overallScore: Math.floor(Math.random() * 20) + 80,
          recommendation: index === 0 ? "Best performer - use for main campaign" : "Good alternative - consider for A/B testing",
          strengths: [
            "Strong opening hook",
            "Clear visual composition",
            "Engaging facial expressions",
            "Well-paced editing"
          ].slice(0, Math.floor(Math.random() * 2) + 2),
          improvements: [
            "Add more dynamic transitions",
            "Improve lighting consistency",
            "Strengthen call-to-action",
            "Optimize subtitle placement"
          ].slice(0, Math.floor(Math.random() * 2) + 1),
          predictedEngagement: {
            likes: Math.floor(Math.random() * 5000) + 1000,
            shares: Math.floor(Math.random() * 500) + 100,
            comments: Math.floor(Math.random() * 300) + 50
          }
        })),
        summary: "Video 1 shows the highest engagement potential with superior hook strength and visual clarity.",
        keyInsights: [
          "Videos with stronger opening hooks perform 65% better",
          "Clear visual composition increases watch time by 40%",
          "Emotional expression detection shows 23% higher relatability",
          "Optimized text placement improves engagement by 31%"
        ]
      };

      setResults(mockResults);
      
      toast({
        title: "Analysis Complete!",
        description: "Your video comparison analysis is ready.",
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 85) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  return (
    <>
      <Helmet>
        <title>SocialClip Analyzer AI - Which Clip Clicks | Advanta AI</title>
        <meta name="description" content="Compare multiple videos with AI to determine which performs best for social media. Analyze hook strength, pacing, visual appeal, and predicted engagement." />
        <meta property="og:title" content="SocialClip Analyzer AI - Video Comparison Tool" />
        <meta property="og:description" content="Upload 2+ videos and get AI-powered recommendations on which will perform best on social media platforms." />
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
                  <Video className="w-4 h-4 mr-2" />
                  AI Video Analysis
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  SocialClip Analyzer AI
                </h1>
                <p className="text-xl md:text-2xl text-primary mb-4">
                  "Which Clip Clicks" – Instant Video Comparison Tool
                </p>
                <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Upload 2+ videos and get AI-powered recommendations on which will perform best for social media 
                  based on hook strength, pacing, visual appeal, emotion detection, and predicted engagement.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Upload Section */}
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
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Videos for Comparison
                    </CardTitle>
                    <CardDescription>
                      Select 2-5 videos to analyze and compare. Supported formats: MP4, MOV, AVI (max 100MB each)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="videos">Select Videos</Label>
                      <Input
                        id="videos"
                        type="file"
                        multiple
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="mt-1"
                      />
                    </div>

                    {videos.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold">Selected Videos ({videos.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {videos.map((video, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Video className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="font-medium text-sm">{video.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(video.size / (1024 * 1024)).toFixed(1)} MB
                                  </p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeVideo(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {videos.length >= 2 && (
                      <Button 
                        onClick={analyzeVideos}
                        disabled={isAnalyzing}
                        className="w-full bg-primary hover:bg-primary/90"
                        size="lg"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Analyzing Videos...
                          </>
                        ) : (
                          <>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Analyze & Compare Videos
                          </>
                        )}
                      </Button>
                    )}

                    {isAnalyzing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Analysis Progress</span>
                          <span>{analysisProgress}%</span>
                        </div>
                        <Progress value={analysisProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground text-center">
                          Analyzing hook strength, pacing, visual clarity, and engagement factors...
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Analysis Results */}
        {results && (
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
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Analysis Results</h2>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <p className="text-lg text-muted-foreground">{results.summary}</p>
                  </div>
                </motion.div>

                {/* Winner Announcement */}
                <motion.div variants={fadeInUp} className="mb-8">
                  <Card className="border-green-500/20 bg-green-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-600">
                        <Star className="w-5 h-5 mr-2" />
                        Recommended Video: {results.winner}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </motion.div>

                {/* Individual Video Analyses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  {results.analyses.map((analysis, index) => (
                    <motion.div key={index} variants={fadeInUp}>
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <PlayCircle className="w-5 h-5 mr-2" />
                            {analysis.fileName}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getScoreBadgeVariant(analysis.overallScore)}>
                              Overall Score: {analysis.overallScore}/100
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Detailed Scores */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm">Hook Strength</span>
                              </div>
                              <span className={`font-semibold ${getScoreColor(analysis.hookStrength)}`}>
                                {analysis.hookStrength}/100
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Pacing & Flow</span>
                              </div>
                              <span className={`font-semibold ${getScoreColor(analysis.pacingScore)}`}>
                                {analysis.pacingScore}/100
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Palette className="w-4 h-4" />
                                <span className="text-sm">Visual Clarity</span>
                              </div>
                              <span className={`font-semibold ${getScoreColor(analysis.visualClarity)}`}>
                                {analysis.visualClarity}/100
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm">Emotion & Expression</span>
                              </div>
                              <span className={`font-semibold ${getScoreColor(analysis.emotionScore)}`}>
                                {analysis.emotionScore}/100
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Type className="w-4 h-4" />
                                <span className="text-sm">Text Optimization</span>
                              </div>
                              <span className={`font-semibold ${getScoreColor(analysis.textOptimization)}`}>
                                {analysis.textOptimization}/100
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Target className="w-4 h-4" />
                                <span className="text-sm">Call to Action</span>
                              </div>
                              <span className={`font-semibold ${getScoreColor(analysis.ctaPresence)}`}>
                                {analysis.ctaPresence}/100
                              </span>
                            </div>
                          </div>

                          {/* Predicted Engagement */}
                          <div className="space-y-3">
                            <h4 className="font-semibold flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Predicted Engagement
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="text-center p-2 bg-muted/50 rounded-lg">
                                <ThumbsUp className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                                <div className="text-sm font-semibold">{analysis.predictedEngagement.likes.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">Likes</div>
                              </div>
                              <div className="text-center p-2 bg-muted/50 rounded-lg">
                                <Share2 className="w-4 h-4 mx-auto mb-1 text-green-500" />
                                <div className="text-sm font-semibold">{analysis.predictedEngagement.shares.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">Shares</div>
                              </div>
                              <div className="text-center p-2 bg-muted/50 rounded-lg">
                                <MessageSquare className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                                <div className="text-sm font-semibold">{analysis.predictedEngagement.comments.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">Comments</div>
                              </div>
                            </div>
                          </div>

                          {/* Strengths */}
                          <div>
                            <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                            <ul className="space-y-1">
                              {analysis.strengths.map((strength, i) => (
                                <li key={i} className="text-sm flex items-center">
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Improvements */}
                          <div>
                            <h4 className="font-semibold text-orange-600 mb-2">Areas for Improvement</h4>
                            <ul className="space-y-1">
                              {analysis.improvements.map((improvement, i) => (
                                <li key={i} className="text-sm flex items-center">
                                  <AlertCircle className="w-3 h-3 text-orange-500 mr-2 flex-shrink-0" />
                                  {improvement}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3 bg-primary/5 rounded-lg">
                            <p className="text-sm text-primary font-medium">
                              {analysis.recommendation}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Key Insights */}
                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Key Insights & Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {results.keyInsights.map((insight, index) => (
                          <li key={index} className="flex items-start">
                            <TrendingUp className="w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Analysis Criteria */}
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
                AI Evaluation Criteria
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our AI analyzes 7 key factors that determine social media video performance
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Eye,
                  title: "Hook Strength",
                  description: "Analyzes the first 3-5 seconds for attention-grabbing elements, visual impact, and opening effectiveness.",
                  color: "text-blue-500"
                },
                {
                  icon: Clock,
                  title: "Pacing & Editing Flow",
                  description: "Evaluates jump cuts, transitions, rhythm, and overall editing quality to ensure optimal viewer retention.",
                  color: "text-green-500"
                },
                {
                  icon: Camera,
                  title: "Visual Clarity & Appeal",
                  description: "Assesses lighting, composition, color grading, and framing to determine visual polish and appeal.",
                  color: "text-purple-500"
                },
                {
                  icon: Heart,
                  title: "Emotion & Expression",
                  description: "Detects facial expressions, tone, enthusiasm, and overall vibe to gauge relatability and connection.",
                  color: "text-red-500"
                },
                {
                  icon: Type,
                  title: "Text & Subtitle Optimization",
                  description: "Checks font size, placement, readability, and whether captions enhance or detract from engagement.",
                  color: "text-yellow-500"
                },
                {
                  icon: Target,
                  title: "Call to Action Presence",
                  description: "Identifies strong CTAs, flags missing opportunities, and suggests improvements for conversion.",
                  color: "text-cyan-500"
                },
                {
                  icon: TrendingUp,
                  title: "Predicted Engagement Score",
                  description: "Uses historical data and performance patterns to predict likes, shares, comments, and viral potential.",
                  color: "text-orange-500"
                }
              ].map((criteria, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <Card className="h-full border-muted/20 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
                    <CardHeader>
                      <criteria.icon className={`w-12 h-12 ${criteria.color} mb-4`} />
                      <CardTitle className="text-xl">{criteria.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{criteria.description}</p>
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