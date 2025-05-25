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
  Mic, 
  Clock, 
  Copy, 
  ExternalLink,
  Volume2,
  Target,
  Users,
  MessageSquare,
  Zap,
  CheckCircle
} from 'lucide-react';

interface VoiceoverScript {
  duration: '15' | '30' | '60';
  script: string;
  wordCount: number;
  tone: string;
  callToAction: string;
}

export default function VoiceoverScriptGenerator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [productIdea, setProductIdea] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scripts, setScripts] = useState<VoiceoverScript[]>([]);

  const generateScripts = async () => {
    if (!productIdea.trim()) {
      toast({
        title: "Product Idea Required",
        description: "Please describe your product or ad idea to generate scripts.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const generatedScripts: VoiceoverScript[] = [
      {
        duration: '15',
        script: `Tired of ${productIdea.toLowerCase()}? Our revolutionary solution changes everything. Transform your ${targetAudience || 'business'} in minutes, not months. Get started today - your future self will thank you.`,
        wordCount: 28,
        tone: tone || 'energetic',
        callToAction: 'Get started today'
      },
      {
        duration: '30',
        script: `Picture this: What if ${productIdea.toLowerCase()} was no longer a problem? Our game-changing platform delivers results that ${targetAudience || 'businesses'} have been dreaming of. Join thousands who've already transformed their operations. Simple setup, instant results, guaranteed satisfaction. Ready to revolutionize your approach? Click below and discover what you've been missing.`,
        wordCount: 52,
        tone: tone || 'conversational',
        callToAction: 'Click below and discover'
      },
      {
        duration: '60',
        script: `Every day, ${targetAudience || 'business owners'} struggle with ${productIdea.toLowerCase()}. The frustration, the wasted time, the missed opportunities - it doesn't have to be this way. Our innovative solution has helped over 10,000 companies eliminate these challenges completely. From streamlined workflows to dramatic cost savings, we deliver measurable results from day one. But don't just take our word for it - our clients report 300% improvement in efficiency within the first month. Whether you're a startup or enterprise, our scalable platform grows with you. Ready to join the success stories? Start your free trial today and experience the difference for yourself.`,
        wordCount: 104,
        tone: tone || 'professional',
        callToAction: 'Start your free trial today'
      }
    ];

    setScripts(generatedScripts);
    setIsGenerating(false);
    
    toast({
      title: "Scripts Generated!",
      description: "Your voiceover scripts are ready for all three durations.",
    });
  };

  const copyScript = (script: string) => {
    navigator.clipboard.writeText(script);
    toast({
      title: "Copied!",
      description: "Script copied to clipboard.",
    });
  };

  const getOptimalWPM = (duration: string) => {
    const wpmRates = { '15': 150, '30': 140, '60': 130 };
    return wpmRates[duration as keyof typeof wpmRates];
  };

  const aiVoiceTools = [
    { name: 'ElevenLabs', url: 'https://elevenlabs.io', description: 'Premium AI voice cloning' },
    { name: 'Play.ht', url: 'https://play.ht', description: 'Professional voice synthesis' },
    { name: 'Murf AI', url: 'https://murf.ai', description: 'Studio-quality voiceovers' },
    { name: 'Speechify', url: 'https://speechify.com', description: 'Natural voice generation' }
  ];

  return (
    <>
      <Helmet>
        <title>AI Voiceover Script Generator | Advanta AI</title>
        <meta name="description" content="Generate professional voiceover scripts for 15, 30, and 60-second ads. Perfect for video marketing, commercials, and product demos." />
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
                <Mic className="w-12 h-12 text-primary mr-4" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  AI Voiceover Script Generator
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Create professional voiceover scripts for 15, 30, and 60-second formats. Perfect for ads, explainer videos, and product demos.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500">Free Tool</Badge>
                <Badge variant="outline">AI-Powered</Badge>
                <Badge variant="outline">Multiple Formats</Badge>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Section */}
              <motion.div variants={fadeInUp} className="lg:col-span-1">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Script Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Product or Ad Idea *
                      </label>
                      <Textarea
                        placeholder="Describe your product, service, or advertising concept..."
                        value={productIdea}
                        onChange={(e) => setProductIdea(e.target.value)}
                        className="h-24"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Target Audience
                      </label>
                      <Input
                        placeholder="e.g., small business owners, fitness enthusiasts"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tone & Style
                      </label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="conversational">Conversational</SelectItem>
                          <SelectItem value="energetic">Energetic</SelectItem>
                          <SelectItem value="inspiring">Inspiring</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={generateScripts}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? 'Generating Scripts...' : 'Generate Scripts'}
                      <Mic className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>

                {/* AI Voice Tools */}
                <Card className="p-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Volume2 className="w-5 h-5 text-primary mr-2" />
                    Recommended AI Voice Tools
                  </h3>
                  <div className="space-y-3">
                    {aiVoiceTools.map((tool, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{tool.name}</div>
                          <div className="text-xs text-muted-foreground">{tool.description}</div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(tool.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Results Section */}
              <motion.div variants={fadeInUp} className="lg:col-span-2">
                {scripts.length === 0 ? (
                  <Card className="p-12">
                    <div className="text-center">
                      <Mic className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
                      <p className="text-muted-foreground">
                        Enter your product idea and preferences to create professional voiceover scripts for all three durations.
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {scripts.map((script, index) => (
                      <motion.div
                        key={script.duration}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <Clock className="w-5 h-5 text-primary mr-2" />
                              <h3 className="text-lg font-semibold">{script.duration}-Second Script</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {script.wordCount} words
                              </Badge>
                              <Badge variant="outline">
                                {getOptimalWPM(script.duration)} WPM
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => copyScript(script.script)}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                          </div>
                          
                          <div className="bg-muted rounded-lg p-4 mb-4">
                            <p className="text-sm leading-relaxed">{script.script}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">Tone:</span>
                              <span className="ml-2 capitalize">{script.tone}</span>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Call to Action:</span>
                              <span className="ml-2">{script.callToAction}</span>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Optimal for:</span>
                              <span className="ml-2">
                                {script.duration === '15' ? 'Social media ads' :
                                 script.duration === '30' ? 'TV commercials' :
                                 'Explainer videos'}
                              </span>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}

                    {/* Usage Tips */}
                    <Card className="p-6 bg-blue-50 border-blue-200">
                      <h4 className="text-lg font-semibold mb-4 text-blue-900">💡 Pro Tips for Voice Recording</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                            Practice reading the script 3-5 times before recording
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                            Emphasize key benefits and call-to-action phrases
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                            Maintain consistent pacing throughout
                          </li>
                        </ul>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                            Use natural pauses for better comprehension
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                            Record in a quiet environment with good acoustics
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                            Test different emotional tones for best impact
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