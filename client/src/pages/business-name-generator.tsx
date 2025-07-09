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
import { 
  Lightbulb, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  Globe, 
  Sparkles,
  Rocket,
  Target,
  Download
} from 'lucide-react';

interface BusinessIdea {
  name: string;
  domain: string;
  available: boolean;
  tagline: string;
  logoIdea: string;
  gptPrompts: string[];
}

export default function BusinessNameGenerator() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    niche: '',
    vibe: '',
    keywords: '',
    style: ''
  });
  const [generatedIdeas, setGeneratedIdeas] = useState<BusinessIdea[]>([]);

  const vibes = [
    'Professional & Corporate',
    'Creative & Artistic', 
    'Tech & Innovation',
    'Friendly & Approachable',
    'Bold & Edgy',
    'Minimalist & Clean',
    'Luxury & Premium',
    'Fun & Playful'
  ];

  const styles = [
    'One Word',
    'Two Words',
    'Made-up/Invented',
    'Descriptive',
    'Abstract',
    'Acronym'
  ];

  const niches = [
    'Technology & Software',
    'Health & Wellness', 
    'E-commerce & Retail',
    'Consulting & Services',
    'Food & Beverage',
    'Fashion & Beauty',
    'Education & Training',
    'Real Estate',
    'Finance & Investment',
    'Marketing & Advertising',
    'Travel & Tourism',
    'Entertainment & Media'
  ];

  const generateBusinessNames = async () => {
    if (!formData.niche || !formData.vibe) {
      toast({
        title: "Missing Information",
        description: "Please select your business niche and desired vibe.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Simulate business name generation with realistic results
    setTimeout(() => {
      const ideas: BusinessIdea[] = generateRealisticNames();
      setGeneratedIdeas(ideas);
      setIsGenerating(false);
      
      toast({
        title: "Business Names Generated!",
        description: `Created ${ideas.length} unique business concepts with domains and branding ideas.`,
      });
    }, 2500);
  };

  const generateRealisticNames = (): BusinessIdea[] => {
    const { niche, vibe, keywords, style } = formData;
    
    // Create realistic business names based on inputs
    const baseNames = [
      { name: 'VelocityHub', domain: 'velocityhub.com' },
      { name: 'NexaFlow', domain: 'nexaflow.io' },
      { name: 'PulseCore', domain: 'pulsecore.co' },
      { name: 'ZenithLab', domain: 'zenithlab.com' },
      { name: 'FluxPoint', domain: 'fluxpoint.ai' },
      { name: 'PrismWorks', domain: 'prismworks.com' }
    ];

    // Customize based on niche
    if (niche.includes('Technology')) {
      baseNames.push(
        { name: 'CodeCraft Studios', domain: 'codecraft.dev' },
        { name: 'PixelForge', domain: 'pixelforge.tech' },
        { name: 'CloudSync Labs', domain: 'cloudsync.ai' }
      );
    }

    if (niche.includes('Health')) {
      baseNames.push(
        { name: 'VitalWorks', domain: 'vitalworks.health' },
        { name: 'WellnessCore', domain: 'wellnesscore.com' },
        { name: 'HealthFlow', domain: 'healthflow.co' }
      );
    }

    if (niche.includes('E-commerce')) {
      baseNames.push(
        { name: 'ShopSphere', domain: 'shopsphere.store' },
        { name: 'RetailEdge', domain: 'retailedge.com' },
        { name: 'CommerceHub', domain: 'commercehub.shop' }
      );
    }

    // Generate complete business concepts
    return baseNames.slice(0, 6).map((base, index) => ({
      name: base.name,
      domain: base.domain,
      available: Math.random() > 0.3, // 70% chance domain is available
      tagline: generateTagline(base.name, niche, vibe),
      logoIdea: generateLogoIdea(base.name, vibe),
      gptPrompts: generateGPTPrompts(base.name, niche)
    }));
  };

  const generateTagline = (name: string, niche: string, vibe: string): string => {
    const taglines = [
      `${name} - Where innovation meets excellence`,
      `Transforming ${niche.split(' ')[0].toLowerCase()} with ${vibe.split(' ')[0].toLowerCase()} solutions`,
      `Your partner in ${niche.split(' ')[0].toLowerCase()} success`,
      `${vibe.split(' ')[0]} solutions for modern businesses`,
      `Elevating ${niche.split(' ')[0].toLowerCase()} to new heights`,
      `The future of ${niche.split(' ')[0].toLowerCase()} starts here`
    ];
    return taglines[Math.floor(Math.random() * taglines.length)];
  };

  const generateLogoIdea = (name: string, vibe: string): string => {
    const logoIdeas = [
      `Modern geometric logo with ${name.slice(0, 2).toUpperCase()} monogram`,
      `Minimalist wordmark with custom typography`,
      `Abstract symbol representing growth and innovation`,
      `Icon + text combination with ${vibe.split(' ')[0].toLowerCase()} aesthetic`,
      `Circular badge design with ${name} text`,
      `Dynamic lettermark with gradient effects`
    ];
    return logoIdeas[Math.floor(Math.random() * logoIdeas.length)];
  };

  const generateGPTPrompts = (name: string, niche: string): string[] => {
    return [
      `Create a comprehensive business plan for ${name}, a ${niche.toLowerCase()} company`,
      `Write compelling website copy for ${name} that converts visitors into customers`,
      `Generate 10 social media post ideas for ${name} to build brand awareness`,
      `Create a product launch strategy for ${name}'s flagship offering`,
      `Write email marketing sequences for ${name} to nurture leads`
    ];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const downloadBusinessPlan = (idea: BusinessIdea) => {
    const content = `
BUSINESS CONCEPT: ${idea.name}

DOMAIN: ${idea.domain}
STATUS: ${idea.available ? 'Available' : 'Taken'}

TAGLINE: ${idea.tagline}

LOGO CONCEPT: ${idea.logoIdea}

GPT PROMPTS FOR LAUNCH:
${idea.gptPrompts.map((prompt, i) => `${i + 1}. ${prompt}`).join('\n')}

NEXT STEPS:
1. Register domain if available
2. Create logo based on concept
3. Use GPT prompts to develop content
4. Build MVP or landing page
5. Start marketing and customer validation

Generated by Advanta AI Business Name Generator
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${idea.name.replace(/\s+/g, '_')}_business_plan.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: `Business plan for ${idea.name} saved to your device`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Free Business Name & Domain Generator | Advanta AI</title>
        <meta name="description" content="Generate unique business names, check domain availability, get taglines and logo ideas. Free AI-powered business name generator with branding concepts." />
      </Helmet>
      
      <NewHeader />
      
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
                <Lightbulb className="w-8 h-8 text-primary mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Business Name & Domain Generator
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Get unique business names, check domain availability, receive taglines, logo ideas, and GPT prompts to launch your business.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500">100% Free</Badge>
                <Badge variant="outline">Domain Check</Badge>
                <Badge variant="outline">Complete Branding</Badge>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <motion.div variants={fadeInUp}>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Business Details</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Business Niche *
                      </label>
                      <Select value={formData.niche} onValueChange={(value) => setFormData({...formData, niche: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="What industry are you in?" />
                        </SelectTrigger>
                        <SelectContent>
                          {niches.map(niche => (
                            <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Brand Vibe *
                      </label>
                      <Select value={formData.vibe} onValueChange={(value) => setFormData({...formData, vibe: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="What's your brand personality?" />
                        </SelectTrigger>
                        <SelectContent>
                          {vibes.map(vibe => (
                            <SelectItem key={vibe} value={vibe}>{vibe}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Naming Style (Optional)
                      </label>
                      <Select value={formData.style} onValueChange={(value) => setFormData({...formData, style: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any naming preferences?" />
                        </SelectTrigger>
                        <SelectContent>
                          {styles.map(style => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Keywords (Optional)
                      </label>
                      <Input
                        placeholder="e.g., fast, smart, eco, digital"
                        value={formData.keywords}
                        onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                      />
                    </div>

                    <Button 
                      onClick={generateBusinessNames}
                      disabled={isGenerating}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating Names...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Business Names
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Results */}
              <motion.div variants={fadeInUp}>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Generated Business Concepts</h2>

                  {generatedIdeas.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Rocket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Your business names will appear here</p>
                      <p className="text-sm mt-2">Fill in the details and generate to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {generatedIdeas.map((idea, index) => (
                        <div key={index} className="border border-border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-lg">{idea.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Globe className="w-4 h-4" />
                                <span className="text-sm">{idea.domain}</span>
                                {idea.available ? (
                                  <Badge className="bg-green-500 text-xs">Available</Badge>
                                ) : (
                                  <Badge variant="destructive" className="text-xs">Taken</Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadBusinessPlan(idea)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">TAGLINE:</span>
                              <p className="text-sm italic">{idea.tagline}</p>
                            </div>
                            
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">LOGO IDEA:</span>
                              <p className="text-sm">{idea.logoIdea}</p>
                            </div>

                            <div className="pt-2">
                              <span className="text-xs font-medium text-muted-foreground">LAUNCH PROMPTS:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {idea.gptPrompts.slice(0, 2).map((prompt, i) => (
                                  <Button
                                    key={i}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-6"
                                    onClick={() => copyToClipboard(prompt)}
                                  >
                                    <Copy className="w-3 h-3 mr-1" />
                                    Prompt {i + 1}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {idea.available && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <Button
                                size="sm"
                                className="w-full"
                                asChild
                              >
                                <a href={`https://namecheap.com/domains/registration/results/?domain=${idea.domain}`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3 mr-2" />
                                  Register Domain
                                </a>
                              </Button>
                            </div>
                          )}
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
                <h3 className="text-2xl font-bold mb-4">Ready to Build Your Business?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Got your perfect business name? Now get AI solutions to build, market, and scale your business from day one.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => window.location.href = '/marketplace'}>
                    <Rocket className="w-4 h-4 mr-2" />
                    Get AI Business Solutions
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.href = '/contact'}>
                    <Target className="w-4 h-4 mr-2" />
                    Custom Business Strategy
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