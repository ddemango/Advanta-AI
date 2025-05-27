import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet';

interface BrandKit {
  personality: {
    primary: string;
    secondary: string[];
    tone: string;
  };
  colorPalette: {
    primary: string;
    secondary: string[];
    accent: string;
    neutral: string[];
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  taglines: string[];
  brandIntro: string;
}

export default function BrandKitGenerator() {
  const [businessName, setBusinessName] = useState('');
  const [niche, setNiche] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [values, setValues] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);

  const generateBrandKit = async () => {
    if (!businessName || !niche) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockBrandKit: BrandKit = {
        personality: {
          primary: 'Innovative',
          secondary: ['Trustworthy', 'Professional', 'Forward-thinking', 'Accessible'],
          tone: 'Confident yet approachable, with a focus on empowerment and growth'
        },
        colorPalette: {
          primary: '#3B82F6',
          secondary: ['#8B5CF6', '#06B6D4'],
          accent: '#F59E0B',
          neutral: ['#1F2937', '#6B7280', '#F3F4F6']
        },
        fonts: {
          heading: 'Inter Bold',
          body: 'Inter Regular',
          accent: 'Space Grotesk'
        },
        taglines: [
          `${businessName}: Where Innovation Meets Results`,
          `Transforming ${niche} Through Smart Solutions`,
          `Your Partner in ${niche} Excellence`,
          `Elevating ${niche} to New Heights`,
          `The Future of ${niche} Starts Here`
        ],
        brandIntro: `${businessName} is a cutting-edge ${niche} company dedicated to empowering ${targetMarket || 'businesses'} through innovative solutions. We combine industry expertise with forward-thinking technology to deliver results that matter. Our mission is to simplify complex challenges while maintaining the highest standards of quality and service.`
      };
      
      setBrandKit(mockBrandKit);
      setIsGenerating(false);
    }, 2500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Helmet>
        <title>Brand Kit Generator | Advanta AI</title>
        <meta name="description" content="Generate a complete brand kit with personality, colors, fonts, and taglines for your business in minutes." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background">
        <section className="py-20 bg-gradient-to-b from-background to-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 bg-[length:40px_40px] opacity-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-6">
                <GradientText>Brand Kit</GradientText> Generator
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Create a complete brand identity with personality traits, color palettes, fonts, and taglines perfect for startups and solopreneurs
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-8"
              >
                <motion.div variants={fadeIn} className="bg-background border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Business Information</h2>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Business Name</label>
                        <Input
                          placeholder="e.g., TechFlow Solutions"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Niche/Industry</label>
                        <Input
                          placeholder="e.g., Digital Marketing, AI Consulting"
                          value={niche}
                          onChange={(e) => setNiche(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Market</label>
                      <Input
                        placeholder="e.g., Small businesses, E-commerce stores, SaaS companies"
                        value={targetMarket}
                        onChange={(e) => setTargetMarket(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Core Values (Optional)</label>
                      <Textarea
                        placeholder="What values are important to your business? e.g., Innovation, trust, customer-first..."
                        value={values}
                        onChange={(e) => setValues(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={generateBrandKit}
                    disabled={isGenerating || !businessName || !niche}
                    className="w-full mt-6"
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Creating Your Brand Kit...
                      </>
                    ) : 'Generate Brand Kit'}
                  </Button>
                </motion.div>

                {brandKit && (
                  <motion.div variants={fadeIn} className="space-y-6">
                    {/* Brand Personality */}
                    <Card className="bg-background border border-white/10 p-6">
                      <h3 className="text-2xl font-bold mb-4">🎭 Brand Personality</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Primary Trait</h4>
                          <div className="bg-primary/20 text-primary px-4 py-2 rounded-lg inline-block text-lg font-bold">
                            {brandKit.personality.primary}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Supporting Traits</h4>
                          <div className="flex flex-wrap gap-2">
                            {brandKit.personality.secondary.map((trait, index) => (
                              <span key={index} className="bg-gray-800/50 px-3 py-1 rounded-full text-sm">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Brand Tone</h4>
                          <p className="text-gray-300">{brandKit.personality.tone}</p>
                        </div>
                      </div>
                    </Card>

                    {/* Color Palette */}
                    <Card className="bg-background border border-white/10 p-6">
                      <h3 className="text-2xl font-bold mb-4">🎨 Color Palette</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Primary Color</h4>
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-12 h-12 rounded-lg border border-white/20"
                              style={{ backgroundColor: brandKit.colorPalette.primary }}
                            ></div>
                            <span className="font-mono">{brandKit.colorPalette.primary}</span>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(brandKit.colorPalette.primary)}>
                              <i className="fas fa-copy"></i>
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Secondary Colors</h4>
                          <div className="flex flex-wrap gap-3">
                            {brandKit.colorPalette.secondary.map((color, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div 
                                  className="w-8 h-8 rounded border border-white/20"
                                  style={{ backgroundColor: color }}
                                ></div>
                                <span className="font-mono text-sm">{color}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Accent Color</h4>
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 rounded border border-white/20"
                              style={{ backgroundColor: brandKit.colorPalette.accent }}
                            ></div>
                            <span className="font-mono text-sm">{brandKit.colorPalette.accent}</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Typography */}
                    <Card className="bg-background border border-white/10 p-6">
                      <h3 className="text-2xl font-bold mb-4">✍️ Typography</h3>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-gray-800/50 rounded">
                            <h4 className="font-semibold text-primary mb-2">Headings</h4>
                            <div className="text-lg font-bold">{brandKit.fonts.heading}</div>
                          </div>
                          <div className="text-center p-4 bg-gray-800/50 rounded">
                            <h4 className="font-semibold text-primary mb-2">Body Text</h4>
                            <div>{brandKit.fonts.body}</div>
                          </div>
                          <div className="text-center p-4 bg-gray-800/50 rounded">
                            <h4 className="font-semibold text-primary mb-2">Accent</h4>
                            <div className="italic">{brandKit.fonts.accent}</div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Taglines */}
                    <Card className="bg-background border border-white/10 p-6">
                      <h3 className="text-2xl font-bold mb-4">💬 Tagline Options</h3>
                      <div className="space-y-3">
                        {brandKit.taglines.map((tagline, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                            <span className="text-lg">{tagline}</span>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(tagline)}>
                              <i className="fas fa-copy"></i>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Brand Intro */}
                    <Card className="bg-background border border-white/10 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold">📝 Brand Introduction</h3>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(brandKit.brandIntro)}>
                          <i className="fas fa-copy"></i>
                        </Button>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{brandKit.brandIntro}</p>
                    </Card>

                    <Card className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 p-6">
                      <h3 className="text-xl font-bold mb-3">🚀 Next Steps</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold mb-2">Design Assets:</h4>
                          <ul className="space-y-1 text-gray-300">
                            <li>• Create logo using these colors and fonts</li>
                            <li>• Design business cards and letterhead</li>
                            <li>• Build website using brand guidelines</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Brand Application:</h4>
                          <ul className="space-y-1 text-gray-300">
                            <li>• Update social media profiles</li>
                            <li>• Create branded templates</li>
                            <li>• Develop brand voice guidelines</li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}