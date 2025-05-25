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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import { 
  Presentation, 
  Download, 
  ExternalLink,
  Image,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  Copy,
  FileText
} from 'lucide-react';

interface Slide {
  slideNumber: number;
  title: string;
  content: string[];
  suggestedVisual: string;
  speakerNotes: string;
}

interface SlideDeck {
  title: string;
  slides: Slide[];
  totalSlides: number;
  estimatedDuration: string;
}

export default function SlideDeckMaker() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [businessIdea, setBusinessIdea] = useState('');
  const [presentationType, setPresentationType] = useState('');
  const [audience, setAudience] = useState('');
  const [duration, setDuration] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [slideDeck, setSlideDeck] = useState<SlideDeck | null>(null);

  const generateSlideDeck = async () => {
    if (!businessIdea.trim()) {
      toast({
        title: "Business Idea Required",
        description: "Please describe your business idea or topic to generate slides.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    const generatedDeck: SlideDeck = {
      title: `${businessIdea}: Business Presentation`,
      totalSlides: 10,
      estimatedDuration: duration || '10-15 minutes',
      slides: [
        {
          slideNumber: 1,
          title: 'Problem Statement',
          content: [
            `Current market challenges in ${businessIdea.toLowerCase()}`,
            'Pain points affecting target customers',
            'Market gap opportunity',
            'Why this matters now'
          ],
          suggestedVisual: 'Infographic showing market pain points',
          speakerNotes: 'Start with a compelling statistic about the problem. Make it relatable to your audience.'
        },
        {
          slideNumber: 2,
          title: 'Our Solution',
          content: [
            `Introducing ${businessIdea}`,
            'Key features and benefits',
            'Unique value proposition',
            'How we solve the problem differently'
          ],
          suggestedVisual: 'Product mockup or solution diagram',
          speakerNotes: 'Focus on benefits over features. Show how your solution directly addresses the problems mentioned.'
        },
        {
          slideNumber: 3,
          title: 'Market Opportunity',
          content: [
            'Total Addressable Market (TAM)',
            'Serviceable Available Market (SAM)',
            'Market growth trends',
            'Revenue potential'
          ],
          suggestedVisual: 'Market size charts and growth projections',
          speakerNotes: 'Use credible market research data. Highlight the growth potential and your market entry strategy.'
        },
        {
          slideNumber: 4,
          title: 'Target Audience',
          content: [
            `Primary customers: ${audience || 'Business professionals'}`,
            'Customer demographics and psychographics',
            'Buying behavior patterns',
            'Customer acquisition channels'
          ],
          suggestedVisual: 'Customer persona illustrations',
          speakerNotes: 'Be specific about your ideal customer. Use real data if available to support your customer profile.'
        },
        {
          slideNumber: 5,
          title: 'Business Model',
          content: [
            'Revenue streams',
            'Pricing strategy',
            'Customer lifetime value',
            'Path to profitability'
          ],
          suggestedVisual: 'Business model canvas or revenue chart',
          speakerNotes: 'Explain how you make money and why your pricing is competitive yet profitable.'
        },
        {
          slideNumber: 6,
          title: 'Competitive Analysis',
          content: [
            'Direct and indirect competitors',
            'Competitive advantages',
            'Market positioning',
            'Differentiation strategy'
          ],
          suggestedVisual: 'Competitive matrix or positioning map',
          speakerNotes: 'Acknowledge competitors but focus on your unique advantages and market positioning.'
        },
        {
          slideNumber: 7,
          title: 'Marketing Strategy',
          content: [
            'Go-to-market approach',
            'Marketing channels and tactics',
            'Customer acquisition cost',
            'Brand positioning'
          ],
          suggestedVisual: 'Marketing funnel or channel strategy diagram',
          speakerNotes: 'Show you understand how to reach and acquire customers efficiently.'
        },
        {
          slideNumber: 8,
          title: 'Financial Projections',
          content: [
            '3-year revenue forecast',
            'Key financial metrics',
            'Break-even analysis',
            'Investment requirements'
          ],
          suggestedVisual: 'Financial charts and projection graphs',
          speakerNotes: 'Be realistic with projections. Explain your assumptions and methodology.'
        },
        {
          slideNumber: 9,
          title: 'Implementation Timeline',
          content: [
            'Phase 1: Product development',
            'Phase 2: Market entry',
            'Phase 3: Scale and growth',
            'Key milestones and metrics'
          ],
          suggestedVisual: 'Timeline or roadmap visualization',
          speakerNotes: 'Show you have a clear plan for execution with realistic timelines.'
        },
        {
          slideNumber: 10,
          title: 'Call to Action',
          content: [
            'Next steps',
            'Investment opportunity',
            'Partnership possibilities',
            'Contact information'
          ],
          suggestedVisual: 'Contact details and next steps',
          speakerNotes: 'End with a clear, compelling call to action. Make it easy for audience to take the next step.'
        }
      ]
    };

    setSlideDeck(generatedDeck);
    setIsGenerating(false);
    
    toast({
      title: "Slide Deck Generated!",
      description: `Created ${generatedDeck.totalSlides} slides for your presentation.`,
    });
  };

  const copySlideContent = (slide: Slide) => {
    const content = `${slide.title}\n\n${slide.content.join('\n')}\n\nSuggested Visual: ${slide.suggestedVisual}\n\nSpeaker Notes: ${slide.speakerNotes}`;
    navigator.clipboard.writeText(content);
    toast({
      title: "Slide Copied!",
      description: `Slide ${slide.slideNumber} content copied to clipboard.`,
    });
  };

  const exportToGoogleSlides = () => {
    toast({
      title: "Export Feature",
      description: "Google Slides export will be available in the premium version.",
    });
  };

  const exportToNotion = () => {
    toast({
      title: "Export Feature", 
      description: "Notion export will be available in the premium version.",
    });
  };

  return (
    <>
      <Helmet>
        <title>AI-Powered Slide Deck Maker | Advanta AI</title>
        <meta name="description" content="Create professional presentation slides instantly with AI. Generate compelling business presentations with headlines, bullet points, and visual suggestions." />
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
                <Presentation className="w-12 h-12 text-primary mr-4" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  AI-Powered Slide Deck Maker
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Transform your business idea into a professional presentation. Get compelling headlines, structured content, and visual suggestions.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500">Free Tool</Badge>
                <Badge variant="outline">AI-Generated</Badge>
                <Badge variant="outline">Export Ready</Badge>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Section */}
              <motion.div variants={fadeInUp} className="lg:col-span-1">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Presentation Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Business Idea or Topic *
                      </label>
                      <Textarea
                        placeholder="Describe your business idea, product, or presentation topic..."
                        value={businessIdea}
                        onChange={(e) => setBusinessIdea(e.target.value)}
                        className="h-24"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Presentation Type
                      </label>
                      <Select value={presentationType} onValueChange={setPresentationType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pitch">Investor Pitch</SelectItem>
                          <SelectItem value="business-plan">Business Plan</SelectItem>
                          <SelectItem value="product-launch">Product Launch</SelectItem>
                          <SelectItem value="marketing">Marketing Proposal</SelectItem>
                          <SelectItem value="training">Training/Workshop</SelectItem>
                          <SelectItem value="report">Business Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Target Audience
                      </label>
                      <Input
                        placeholder="e.g., investors, executives, customers"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Presentation Duration
                      </label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5-10 minutes">5-10 minutes</SelectItem>
                          <SelectItem value="10-15 minutes">10-15 minutes</SelectItem>
                          <SelectItem value="15-20 minutes">15-20 minutes</SelectItem>
                          <SelectItem value="20-30 minutes">20-30 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={generateSlideDeck}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? 'Generating Slides...' : 'Create Slide Deck'}
                      <Presentation className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>

                {/* Export Options */}
                {slideDeck && (
                  <Card className="p-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={exportToGoogleSlides}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Export to Google Slides
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={exportToNotion}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Export to Notion
                      </Button>
                    </div>
                  </Card>
                )}
              </motion.div>

              {/* Results Section */}
              <motion.div variants={fadeInUp} className="lg:col-span-2">
                {!slideDeck ? (
                  <Card className="p-12">
                    <div className="text-center">
                      <Presentation className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Ready to Create</h3>
                      <p className="text-muted-foreground">
                        Enter your business idea and preferences to generate a professional slide deck with AI-powered content.
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Deck Overview */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{slideDeck.title}</h3>
                          <p className="text-muted-foreground">
                            {slideDeck.totalSlides} slides • {slideDeck.estimatedDuration}
                          </p>
                        </div>
                        <Badge className="bg-green-500">{slideDeck.totalSlides} Slides Generated</Badge>
                      </div>
                    </Card>

                    {/* Slides */}
                    <div className="space-y-4">
                      {slideDeck.slides.map((slide, index) => (
                        <motion.div
                          key={slide.slideNumber}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold">
                                Slide {slide.slideNumber}: {slide.title}
                              </h4>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => copySlideContent(slide)}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-medium text-sm mb-2">Content Points</h5>
                                <ul className="space-y-1">
                                  {slide.content.map((point, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex items-start">
                                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <h5 className="font-medium text-sm mb-2 flex items-center">
                                    <Image className="w-4 h-4 text-primary mr-1" />
                                    Suggested Visual
                                  </h5>
                                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                                    {slide.suggestedVisual}
                                  </p>
                                </div>
                                
                                <div>
                                  <h5 className="font-medium text-sm mb-2">Speaker Notes</h5>
                                  <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded border border-blue-200">
                                    {slide.speakerNotes}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Pro Tips */}
                    <Card className="p-6 bg-purple-50 border-purple-200">
                      <h4 className="text-lg font-semibold mb-4 text-purple-900">🎯 Presentation Pro Tips</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                            Keep slides simple with minimal text
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                            Use high-quality visuals to support your points
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                            Practice your timing for each slide
                          </li>
                        </ul>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                            Tell a story that connects all slides
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                            Prepare for questions after each section
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                            End with a strong, clear call to action
                          </li>
                        </ul>
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