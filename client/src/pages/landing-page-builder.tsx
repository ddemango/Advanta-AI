import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet';

interface LandingPageContent {
  headline: string;
  subhead: string;
  features: string[];
  ctaOptions: string[];
  valueProps: string[];
  heroSection: string;
}

export default function LandingPageBuilder() {
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyBenefit, setKeyBenefit] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<LandingPageContent | null>(null);

  const generateContent = async () => {
    if (!productName.trim() || !targetAudience.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Real OpenAI API integration for content generation
      const response = await fetch('/api/generate-landing-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          targetAudience,
          keyBenefit,
          industry: selectedIndustry
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content from AI service');
      }
      
      const generatedContent = await response.json();
      setContent(generatedContent);
      setIsGenerating(false);
    } catch (error) {
      console.error('Content generation failed:', error);
      setIsGenerating(false);
      // Clear error state instead of showing fake data
      setContent(null);
      alert('Unable to generate content. Please check your internet connection and try again.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportToHTML = () => {
    if (!content) return;
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.headline}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
        .hero { text-align: center; margin-bottom: 40px; }
        .headline { font-size: 2.5rem; font-weight: bold; margin-bottom: 20px; }
        .subhead { font-size: 1.25rem; color: #666; margin-bottom: 30px; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 40px 0; }
        .feature { padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .cta { background: #007bff; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1 class="headline">${content.headline}</h1>
            <p class="subhead">${content.subhead}</p>
            <button class="cta">${content.ctaOptions[0]}</button>
        </div>
        
        <div class="features">
            ${content.features.map(feature => `<div class="feature"><h3>${feature}</h3></div>`).join('')}
        </div>
        
        <div style="text-align: center; margin-top: 40px;">
            <p>${content.heroSection}</p>
            <button class="cta">${content.ctaOptions[1] || content.ctaOptions[0]}</button>
        </div>
    </div>
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName.toLowerCase().replace(/\s+/g, '-')}-landing-page.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>Landing Page Builder | Advanta AI</title>
        <meta name="description" content="Generate complete landing page copy with headlines, features, CTAs, and value propositions. Export to HTML or copy to your favorite page builder." />
      </Helmet>
      
      <NewHeader />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
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
                <GradientText>Landing Page</GradientText> Builder
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Generate complete landing page copy including headlines, features, CTAs, and value propositions. Export to HTML or copy to your page builder.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Builder Section */}
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
                  <h2 className="text-2xl font-bold mb-6">Product Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name</label>
                      <Input
                        placeholder="e.g., TaskFlow Pro, SmartCRM, AI Assistant"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Audience</label>
                      <Input
                        placeholder="e.g., Small business owners, Marketing teams, E-commerce stores"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Key Benefit (Optional)</label>
                      <Input
                        placeholder="e.g., increase sales, save time, reduce costs"
                        value={keyBenefit}
                        onChange={(e) => setKeyBenefit(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={generateContent}
                    disabled={isGenerating || !productName.trim() || !targetAudience.trim()}
                    className="w-full mt-6"
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Generating Landing Page Content...
                      </>
                    ) : 'Generate Landing Page'}
                  </Button>
                </motion.div>

                {content && (
                  <motion.div variants={fadeIn} className="space-y-6">
                    {/* Preview Section */}
                    <Card className="bg-background border border-white/10 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold">Generated Content</h3>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={exportToHTML}>
                            <i className="fas fa-download mr-2"></i>
                            Export HTML
                          </Button>
                        </div>
                      </div>
                      
                      {/* Headline & Subhead */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-primary">Headline</h4>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(content.headline)}>
                            <i className="fas fa-copy"></i>
                          </Button>
                        </div>
                        <p className="text-lg font-bold mb-4">{content.headline}</p>
                        
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-primary">Subheadline</h4>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(content.subhead)}>
                            <i className="fas fa-copy"></i>
                          </Button>
                        </div>
                        <p className="text-gray-300">{content.subhead}</p>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-primary mb-3">Key Features</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {content.features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                              <i className="fas fa-check text-green-400 mr-2"></i>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-primary mb-3">CTA Options</h4>
                        <div className="flex flex-wrap gap-2">
                          {content.ctaOptions.map((cta, index) => (
                            <Button 
                              key={index} 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyToClipboard(cta)}
                            >
                              {cta}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Value Props */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-primary mb-3">Value Propositions</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {content.valueProps.map((prop, index) => (
                            <div key={index} className="bg-primary/10 px-3 py-2 rounded text-sm">
                              {prop}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Hero Section Copy */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-primary">Hero Section Copy</h4>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(content.heroSection)}>
                            <i className="fas fa-copy"></i>
                          </Button>
                        </div>
                        <p className="text-gray-300 bg-gray-800/50 p-4 rounded">{content.heroSection}</p>
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