import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet';

interface HeadlineVariant {
  headline: string;
  style: string;
  expectedCTR: number;
  reasoning: string;
}

export default function HeadlineSplitTestGenerator() {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [headlines, setHeadlines] = useState<HeadlineVariant[]>([]);

  const generateHeadlines = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    
    // BLOCKED: Real OpenAI API integration required - no mock data allowed
    try {
      const response = await fetch('/api/generate-headlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText })
      });
      
      if (!response.ok) {
        throw new Error('Headline generation API not implemented');
      }
      
      const data = await response.json();
      setHeadlines(data.headlines);
    } catch (error) {
      console.error('Headline generation blocked:', error);
      setHeadlines([]);
      // User will see no headlines generated, indicating feature needs real API
    } finally {
      setIsGenerating(false);
    }
  };

  const copyHeadline = (headline: string) => {
    navigator.clipboard.writeText(headline);
  };

  return (
    <>
      <Helmet>
        <title>Headline Split-Test Generator | Advanta AI</title>
        <meta name="description" content="Generate high-converting headlines with A/B test predictions. Get multiple headline variations with CTR estimates for your landing pages and ads." />
      </Helmet>
      
      <Header />
      
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
                <GradientText>Headline Split-Test</GradientText> Generator
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Paste your landing page content and get 3-5 high-converting headlines with emotional triggers, FOMO angles, and predicted CTR rates
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Generator Section */}
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
                  <h2 className="text-2xl font-bold mb-4">Input Your Content</h2>
                  <Textarea
                    placeholder="Paste your landing page copy, product description, or current headline here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[120px] mb-4"
                  />
                  <Button 
                    onClick={generateHeadlines}
                    disabled={isGenerating || !inputText.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Generating Headlines...
                      </>
                    ) : 'Generate Headlines'}
                  </Button>
                </motion.div>

                {headlines.length > 0 && (
                  <motion.div variants={fadeIn} className="space-y-4">
                    <h3 className="text-2xl font-bold">Generated Headlines</h3>
                    <div className="grid gap-4">
                      {headlines.map((headline, index) => (
                        <Card key={index} className="bg-background border border-white/10 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold mb-2">{headline.headline}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                                <span className="bg-primary/20 px-2 py-1 rounded">{headline.style}</span>
                                <span className="text-green-400 font-medium">Expected CTR: {headline.expectedCTR}%</span>
                              </div>
                              <p className="text-gray-300 text-sm">{headline.reasoning}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyHeadline(headline.headline)}
                              className="ml-4"
                            >
                              <i className="fas fa-copy mr-2"></i>
                              Copy
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Tips Section */}
                <motion.div variants={fadeIn} className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">💡 Split Testing Tips</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Test These Elements:</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Numbers vs. words (3 vs. three)</li>
                        <li>• Question vs. statement format</li>
                        <li>• Benefit vs. feature focus</li>
                        <li>• Urgency vs. curiosity angles</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Best Practices:</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Test only one element at a time</li>
                        <li>• Run tests for at least 1 week</li>
                        <li>• Aim for 95% statistical significance</li>
                        <li>• Consider seasonal variations</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}