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
import { Progress } from '@/components/ui/progress';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Copy, 
  ThermometerSun,
  Target,
  Users,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Zap,
  Heart
} from 'lucide-react';

interface EmailTemplate {
  type: 'icebreaker' | 'follow-up' | 'cta-focused';
  subject: string;
  body: string;
  warmthScore: number;
  personalityTrait: string;
  bestUseCase: string;
}

export default function ColdEmailGenerator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [productService, setProductService] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [industry, setIndustry] = useState('');
  const [tone, setTone] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);

  const generateEmails = async () => {
    if (!productService.trim() || !targetAudience.trim() || !painPoint.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in product/service, target audience, and pain point to generate emails.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2500));

    const generatedTemplates: EmailTemplate[] = [
      {
        type: 'icebreaker',
        subject: `Quick question about ${targetAudience.toLowerCase()} challenges`,
        body: `Hi {{First Name}},

I noticed you're in the ${industry || targetAudience.toLowerCase()} space and wondered if you've been dealing with ${painPoint.toLowerCase()}.

Most ${targetAudience.toLowerCase()} I talk to mention this as one of their biggest frustrations, especially when it impacts their daily operations.

I've been working with ${productService.toLowerCase()} solutions that have helped similar companies reduce this challenge by up to 70%.

Would you be open to a quick 5-minute conversation to share what's worked for others in your situation?

Best regards,
{{Your Name}}

P.S. Even if it's not a fit, I'd be happy to share a few quick tips that might help.`,
        warmthScore: 85,
        personalityTrait: 'Consultative and helpful',
        bestUseCase: 'First contact with prospects who don\'t know you'
      },
      {
        type: 'follow-up',
        subject: `Following up on ${productService.toLowerCase()} discussion`,
        body: `Hi {{First Name}},

Hope you're having a great week!

I sent you a note last week about helping ${targetAudience.toLowerCase()} with ${painPoint.toLowerCase()}, but I know how busy things can get.

Since then, I've helped two more companies in similar situations:
• Company A reduced their ${painPoint.toLowerCase()} by 60% in just 30 days
• Company B saw immediate improvement in their workflow efficiency

I have a feeling ${productService.toLowerCase()} could deliver similar results for {{Company Name}}.

Would Thursday or Friday work for a brief 10-minute call to explore this?

Looking forward to connecting,
{{Your Name}}

P.S. If this isn't the right time, just let me know when might work better.`,
        warmthScore: 75,
        personalityTrait: 'Persistent but respectful',
        bestUseCase: 'Second or third touchpoint with warm prospects'
      },
      {
        type: 'cta-focused',
        subject: `[Last chance] ${productService} demo for ${targetAudience.toLowerCase()}`,
        body: `Hi {{First Name}},

This is my final email about the ${productService.toLowerCase()} solution for ${targetAudience.toLowerCase()}.

I understand you're busy, so I'll make this simple:

✓ We solve ${painPoint.toLowerCase()} in 30 days or less
✓ Average client sees 3x ROI within first quarter
✓ Zero setup fees for companies like {{Company Name}}

I'm offering one final spot in our pilot program this month.

If you're ready to eliminate ${painPoint.toLowerCase()} once and for all, reply with "INTERESTED" and I'll send over the demo link immediately.

If not, I'll remove you from this sequence and respect your decision.

Best,
{{Your Name}}

[Book Demo Now - Limited Spots Available]`,
        warmthScore: 65,
        personalityTrait: 'Direct and action-oriented',
        bestUseCase: 'Final follow-up or urgent decision sequences'
      }
    ];

    setEmailTemplates(generatedTemplates);
    setIsGenerating(false);
    
    toast({
      title: "Emails Generated!",
      description: "Created 3 personalized email templates with warmth scores.",
    });
  };

  const copyEmail = (template: EmailTemplate) => {
    const emailContent = `Subject: ${template.subject}\n\n${template.body}`;
    navigator.clipboard.writeText(emailContent);
    toast({
      title: "Email Copied!",
      description: `${template.type} email template copied to clipboard.`,
    });
  };

  const getWarmthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getWarmthIcon = (score: number) => {
    if (score >= 80) return <Heart className="w-4 h-4" />;
    if (score >= 70) return <ThermometerSun className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  return (
    <>
      <Helmet>
        <title>Cold Email Generator | Advanta AI</title>
        <meta name="description" content="Generate personalized cold email templates with AI. Create icebreaker, follow-up, and CTA-focused emails with warmth scores for better responses." />
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
                <Mail className="w-12 h-12 text-primary mr-4" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Cold Email Generator
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Create personalized cold email sequences that get responses. Generate icebreaker, follow-up, and CTA-focused templates with warmth scores.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500">Free Tool</Badge>
                <Badge variant="outline">AI-Personalized</Badge>
                <Badge variant="outline">Warmth Scoring</Badge>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Section */}
              <motion.div variants={fadeInUp} className="lg:col-span-1">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Email Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Product/Service *
                      </label>
                      <Textarea
                        placeholder="Describe what you're selling or offering..."
                        value={productService}
                        onChange={(e) => setProductService(e.target.value)}
                        className="h-20"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Target Audience *
                      </label>
                      <Input
                        placeholder="e.g., marketing managers, CEOs, HR directors"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Main Pain Point *
                      </label>
                      <Input
                        placeholder="e.g., low conversion rates, manual processes"
                        value={painPoint}
                        onChange={(e) => setPainPoint(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Industry
                      </label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="real-estate">Real Estate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Tone
                      </label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="direct">Direct</SelectItem>
                          <SelectItem value="consultative">Consultative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={generateEmails}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? 'Generating Emails...' : 'Generate Email Templates'}
                      <Mail className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>

                {/* Email Best Practices */}
                <Card className="p-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">📧 Email Best Practices</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Personalize the subject line
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Keep emails under 150 words
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Include one clear call-to-action
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Follow up 3-5 times
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Test different subject lines
                    </li>
                  </ul>
                </Card>
              </motion.div>

              {/* Results Section */}
              <motion.div variants={fadeInUp} className="lg:col-span-2">
                {emailTemplates.length === 0 ? (
                  <Card className="p-12">
                    <div className="text-center">
                      <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
                      <p className="text-muted-foreground">
                        Fill in your product details and target audience to create personalized cold email templates with warmth scoring.
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {emailTemplates.map((template, index) => (
                      <motion.div
                        key={template.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <Card className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="capitalize text-lg font-semibold">
                                {template.type.replace('-', ' ')} Email
                              </div>
                              <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium flex items-center ${getWarmthColor(template.warmthScore)}`}>
                                {getWarmthIcon(template.warmthScore)}
                                <span className="ml-1">Warmth: {template.warmthScore}%</span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyEmail(template)}
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy Email
                            </Button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium text-sm mb-2 text-primary">Subject Line:</h5>
                              <p className="text-sm bg-muted p-3 rounded border-l-4 border-primary">
                                {template.subject}
                              </p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-sm mb-2">Email Body:</h5>
                              <div className="bg-white border rounded p-4 text-sm leading-relaxed whitespace-pre-wrap">
                                {template.body}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                              <div>
                                <h6 className="font-medium text-xs text-muted-foreground mb-1">PERSONALITY</h6>
                                <p className="text-sm">{template.personalityTrait}</p>
                              </div>
                              <div>
                                <h6 className="font-medium text-xs text-muted-foreground mb-1">BEST USE CASE</h6>
                                <p className="text-sm">{template.bestUseCase}</p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}

                    {/* Email Sequence Strategy */}
                    <Card className="p-6 bg-blue-50 border-blue-200">
                      <h4 className="text-lg font-semibold mb-4 text-blue-900">🎯 Email Sequence Strategy</h4>
                      <div className="space-y-4 text-sm text-blue-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded border">
                            <div className="font-semibold text-blue-900 mb-2">Week 1: Icebreaker</div>
                            <p>Send the icebreaker email on Tuesday or Wednesday for best open rates. Focus on the pain point and offer value.</p>
                          </div>
                          <div className="bg-white p-4 rounded border">
                            <div className="font-semibold text-blue-900 mb-2">Week 2: Follow-up</div>
                            <p>Follow up with social proof and case studies. Show how you've helped similar companies succeed.</p>
                          </div>
                          <div className="bg-white p-4 rounded border">
                            <div className="font-semibold text-blue-900 mb-2">Week 3: CTA-Focused</div>
                            <p>Create urgency with limited-time offers or final follow-up. Make it easy to say yes or no.</p>
                          </div>
                        </div>
                        <p className="text-center font-medium">Expected response rate: 15-25% with proper personalization and timing</p>
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