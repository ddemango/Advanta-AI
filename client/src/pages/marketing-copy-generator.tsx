import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import { Download, Copy, Wand2, Target, MessageSquare, ShoppingCart } from 'lucide-react';

interface GeneratedCopy {
  type: string;
  content: string;
  platform?: string;
}

export default function MarketingCopyGenerator() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    tone: '',
    audience: '',
    platform: '',
    keyFeatures: ''
  });
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy[]>([]);

  const tones = [
    'Professional', 'Friendly', 'Energetic', 'Confident', 
    'Playful', 'Urgent', 'Trustworthy', 'Innovative'
  ];

  const audiences = [
    'Small Business Owners', 'Enterprise Decision Makers', 'Millennials', 
    'Gen Z', 'Tech Professionals', 'Marketing Managers', 'C-Suite Executives', 
    'Startups', 'E-commerce Brands', 'B2B Companies'
  ];

  const platforms = [
    'Social Media', 'Email Marketing', 'Website', 'Ads', 
    'Product Pages', 'Press Release', 'Blog Post', 'All Platforms'
  ];

  const generateCopy = async () => {
    if (!formData.product || !formData.tone || !formData.audience) {
      toast({
        title: "Missing Information",
        description: "Please fill in product, tone, and audience fields.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-marketing-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate marketing copy');
      }
      
      const data = await response.json();
      setGeneratedCopy(data.copies);
      
      toast({
        title: "Marketing Copy Generated!",
        description: `Created ${data.copies.length} pieces of marketing copy for ${formData.product}`,
      });
    } catch (error) {
      console.error('Marketing copy generation error:', error);
      setGeneratedCopy([]);
      toast({
        title: "Generation Failed",
        description: "Unable to generate marketing copy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Marketing copy copied to clipboard",
    });
  };

  const downloadCopy = () => {
    const content = generatedCopy.map(copy => 
      `${copy.type}:\n${copy.content}\n\n`
    ).join('');

    const blob = new Blob([`Marketing Copy for: ${formData.product}\n\n${content}`], 
      { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.product.replace(/\s+/g, '_')}_marketing_copy.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Marketing copy saved to your device",
    });
  };

  return (
    <>
      <Helmet>
        <title>Free Marketing Copy Generator | Advanta AI - Create Professional Copy Instantly</title>
        <meta name="description" content="Generate professional marketing copy, social media captions, ad copy, and product descriptions instantly. Free AI-powered tool for marketers and business owners." />
        <meta property="og:title" content="Free Marketing Copy Generator | Advanta AI" />
        <meta property="og:description" content="Create professional marketing content instantly with our AI-powered copy generator. Perfect for social media, ads, and product descriptions." />
      </Helmet>
      
      <NewHeader />
      
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Wand2 className="w-8 h-8 text-primary mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Marketing Copy Generator
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Create professional marketing copy, social media captions, ad copy, and product descriptions instantly. Perfect for any product or service.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500">100% Free</Badge>
                <Badge variant="outline">AI-Powered</Badge>
                <Badge variant="outline">Instant Results</Badge>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <motion.div variants={fadeInUp}>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Product Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Product/Service Name *
                      </label>
                      <Input
                        placeholder="e.g., AI Customer Service Bot, Social Media Tool"
                        value={formData.product}
                        onChange={(e) => setFormData({...formData, product: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Brand Tone *
                      </label>
                      <Select value={formData.tone} onValueChange={(value) => setFormData({...formData, tone: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your brand tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map(tone => (
                            <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Target Audience *
                      </label>
                      <Select value={formData.audience} onValueChange={(value) => setFormData({...formData, audience: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Who is your target audience?" />
                        </SelectTrigger>
                        <SelectContent>
                          {audiences.map(audience => (
                            <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Primary Platform (Optional)
                      </label>
                      <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Where will you use this copy?" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map(platform => (
                            <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Key Features/Benefits (Optional)
                      </label>
                      <Textarea
                        placeholder="e.g., 24/7 support, integrates with CRM, reduces costs by 50%"
                        value={formData.keyFeatures}
                        onChange={(e) => setFormData({...formData, keyFeatures: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <Button 
                      onClick={generateCopy}
                      disabled={isGenerating}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating Copy...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate Marketing Copy
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Generated Copy */}
              <motion.div variants={fadeInUp}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Generated Copy</h2>
                    {generatedCopy.length > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={downloadCopy}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download All
                      </Button>
                    )}
                  </div>

                  {generatedCopy.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Your generated marketing copy will appear here</p>
                      <p className="text-sm mt-2">Fill in the form and click generate to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {generatedCopy.map((copy, index) => (
                        <div key={index} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{copy.type}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(copy.content)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm leading-relaxed">{copy.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>

            {/* CTA Section */}
            <motion.div variants={fadeInUp} className="mt-12 text-center">
              <Card className="p-8 bg-gradient-to-r from-primary/10 to-purple-500/10">
                <h3 className="text-2xl font-bold mb-4">Need Custom AI Marketing Solutions?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  This free tool is just the beginning. Get a complete AI marketing system that generates unlimited copy, manages campaigns, and drives real results for your business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => window.location.href = '/marketplace'}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    View AI Marketing Solutions
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.href = '/contact'}>
                    <Target className="w-4 h-4 mr-2" />
                    Get Custom AI Strategy
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}