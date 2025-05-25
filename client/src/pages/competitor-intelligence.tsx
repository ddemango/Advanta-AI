import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Target, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Globe, 
  BarChart3,
  Download,
  Eye,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface CompetitorAnalysis {
  brandPositioning: {
    mainMessage: string;
    valueProposition: string;
    tone: string;
  };
  targetAudience: {
    persona: string;
    demographics: string;
    painPoints: string[];
  };
  products: {
    topServices: string[];
    pricing: string;
    features: string[];
  };
  marketing: {
    adCopyTone: string;
    socialStrategy: string;
    contentFrequency: string;
  };
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  seoMetrics: {
    contentScore: number;
    keywordFocus: string[];
    updateFrequency: string;
  };
}

export default function CompetitorIntelligence() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [progress, setProgress] = useState(0);

  const analyzeCompetitor = async () => {
    if (!competitorUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a competitor website URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    
    try {
      // Update progress as we work
      setProgress(20);
      toast({
        title: "Analysis Started",
        description: "Fetching competitor website content...",
      });

      // Call backend API to analyze competitor
      const response = await fetch('/api/analyze-competitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: competitorUrl }),
      });

      setProgress(60);
      toast({
        title: "AI Analysis",
        description: "Analyzing competitor data with AI...",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze competitor');
      }

      setProgress(100);
      
      // Use the real analysis data from the API
      setAnalysis(data.analysis);
      
      toast({
        title: "Analysis Complete!",
        description: `Successfully analyzed ${data.websiteData.domain}`,
      });

    } catch (error: any) {
      console.error('Competitor analysis error:', error);
      
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze competitor website. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!analysis) return;
    
    const reportData = {
      url: competitorUrl,
      analyzedAt: new Date().toISOString(),
      ...analysis
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'competitor-analysis-report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Your competitor analysis report has been saved.",
    });
  };

  return (
    <>
      <Helmet>
        <title>AI Competitor Intelligence Analyzer | Advanta AI</title>
        <meta name="description" content="Analyze your competitors instantly with AI-powered intelligence. Get brand positioning, target audience insights, and complete SWOT analysis." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Search className="w-12 h-12 text-primary mr-4" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  AI Competitor Intelligence Analyzer
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Uncover how your competitors position themselves—instantly. Get AI-powered insights into brand messaging, target audience, and marketing strategies.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500">Free Tool</Badge>
                <Badge variant="outline">Powered by AI</Badge>
                <Badge variant="outline">Export PDF Report</Badge>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Section */}
              <motion.div variants={fadeInUp} className="lg:col-span-1">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Analyze Competitor</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Competitor Website URL
                      </label>
                      <Input
                        placeholder="https://competitor.com"
                        value={competitorUrl}
                        onChange={(e) => setCompetitorUrl(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <Button 
                      onClick={analyzeCompetitor}
                      disabled={isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Competitor'}
                      <Search className="w-4 h-4 ml-2" />
                    </Button>

                    {isAnalyzing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Analysis Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                      </div>
                    )}
                  </div>
                </Card>

                {/* Features */}
                <Card className="p-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">What You'll Get</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm">
                      <Target className="w-4 h-4 text-green-500 mr-2" />
                      Brand positioning & messaging
                    </li>
                    <li className="flex items-center text-sm">
                      <Users className="w-4 h-4 text-green-500 mr-2" />
                      Target audience persona
                    </li>
                    <li className="flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                      Top-performing services
                    </li>
                    <li className="flex items-center text-sm">
                      <MessageSquare className="w-4 h-4 text-green-500 mr-2" />
                      Ad copy tone & examples
                    </li>
                    <li className="flex items-center text-sm">
                      <Globe className="w-4 h-4 text-green-500 mr-2" />
                      Social media strategy
                    </li>
                    <li className="flex items-center text-sm">
                      <BarChart3 className="w-4 h-4 text-green-500 mr-2" />
                      Complete SWOT analysis
                    </li>
                  </ul>
                </Card>
              </motion.div>

              {/* Results Section */}
              <motion.div variants={fadeInUp} className="lg:col-span-2">
                {!analysis ? (
                  <Card className="p-12">
                    <div className="text-center">
                      <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                      <p className="text-muted-foreground">
                        Enter a competitor's website URL to get started with AI-powered competitive intelligence.
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Header with Download */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">Analysis Complete</h3>
                          <p className="text-muted-foreground">Competitor: {competitorUrl}</p>
                        </div>
                        <Button onClick={downloadReport} variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download Report
                        </Button>
                      </div>
                    </Card>

                    {/* Brand Positioning */}
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <Target className="w-5 h-5 text-primary mr-2" />
                        Brand Positioning
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Main Message</h5>
                          <p className="text-sm text-muted-foreground">{analysis.brandPositioning.mainMessage}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Value Proposition</h5>
                          <p className="text-sm text-muted-foreground">{analysis.brandPositioning.valueProposition}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Tone</h5>
                          <p className="text-sm text-muted-foreground">{analysis.brandPositioning.tone}</p>
                        </div>
                      </div>
                    </Card>

                    {/* Target Audience */}
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <Users className="w-5 h-5 text-primary mr-2" />
                        Target Audience
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Persona</h5>
                          <p className="text-sm text-muted-foreground">{analysis.targetAudience.persona}</p>
                          <h5 className="font-medium text-sm mb-2 mt-4">Demographics</h5>
                          <p className="text-sm text-muted-foreground">{analysis.targetAudience.demographics}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Pain Points</h5>
                          <ul className="space-y-1">
                            {analysis.targetAudience.painPoints.map((point, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-center">
                                <AlertTriangle className="w-3 h-3 text-orange-500 mr-2" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>

                    {/* SWOT Analysis */}
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 text-primary mr-2" />
                        SWOT Analysis
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-sm mb-2 text-green-600">Strengths</h5>
                            <ul className="space-y-1">
                              {analysis.swotAnalysis.strengths.map((strength, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-center">
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm mb-2 text-blue-600">Opportunities</h5>
                            <ul className="space-y-1">
                              {analysis.swotAnalysis.opportunities.map((opportunity, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-center">
                                  <Zap className="w-3 h-3 text-blue-500 mr-2" />
                                  {opportunity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-sm mb-2 text-orange-600">Weaknesses</h5>
                            <ul className="space-y-1">
                              {analysis.swotAnalysis.weaknesses.map((weakness, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-center">
                                  <AlertTriangle className="w-3 h-3 text-orange-500 mr-2" />
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm mb-2 text-red-600">Threats</h5>
                            <ul className="space-y-1">
                              {analysis.swotAnalysis.threats.map((threat, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-center">
                                  <Shield className="w-3 h-3 text-red-500 mr-2" />
                                  {threat}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* SEO & Content */}
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <Globe className="w-5 h-5 text-primary mr-2" />
                        SEO & Content Strategy
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Content Score</h5>
                          <div className="flex items-center">
                            <Progress value={analysis.seoMetrics.contentScore} className="flex-1 mr-2" />
                            <span className="text-sm font-medium">{analysis.seoMetrics.contentScore}%</span>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Keyword Focus</h5>
                          <div className="space-y-1">
                            {analysis.seoMetrics.keywordFocus.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="mr-1">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Update Frequency</h5>
                          <p className="text-sm text-muted-foreground">{analysis.seoMetrics.updateFrequency}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}