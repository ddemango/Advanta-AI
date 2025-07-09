import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  day: number;
  postIdea: string;
  platform: string;
  cta: string;
  hashtags: string[];
  suggestedPrompt: string;
}

export default function ContentCalendarGenerator() {
  const { toast } = useToast();
  const [contentGoal, setContentGoal] = useState('');
  const [platform, setPlatform] = useState('');
  const [frequency, setFrequency] = useState('');
  const [industry, setIndustry] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [calendar, setCalendar] = useState<ContentItem[]>([]);

  const generateCalendar = async () => {
    if (!contentGoal || !platform || !frequency) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-content-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contentGoal, 
          platform, 
          frequency, 
          industry: industry || 'AI consultancy',
          audience: 'business professionals' 
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content calendar');
      }
      
      const data = await response.json();
      setCalendar(data.calendar);
    } catch (error) {
      console.error('Content calendar generation error:', error);
      setCalendar([]);
      toast({
        title: "Generation Failed",
        description: "Unable to generate content calendar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportCalendar = () => {
    const csvContent = [
      ['Day', 'Post Idea', 'Platform', 'CTA', 'Hashtags', 'AI Prompt'],
      ...calendar.map(item => [
        item.day,
        item.postIdea,
        item.platform,
        item.cta,
        item.hashtags.join(' '),
        item.suggestedPrompt
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-calendar-30-days.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>Content Calendar Generator | Advanta AI</title>
        <meta name="description" content="Generate a 30-day AI-powered content calendar with post ideas, CTAs, hashtags, and AI prompts for any platform." />
      </Helmet>
      
      <NewHeader />
      
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
                <GradientText>Content Calendar</GradientText> Generator
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Get a complete 30-day content plan with post ideas, CTAs, hashtags, and AI prompts tailored to your platform and goals
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
                  <h2 className="text-2xl font-bold mb-6">Content Strategy</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Content Goal</label>
                      <Input
                        placeholder="e.g., Increase brand awareness, Generate leads"
                        value={contentGoal}
                        onChange={(e) => setContentGoal(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Industry (Optional)</label>
                      <Input
                        placeholder="e.g., SaaS, E-commerce, Healthcare"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Platform</label>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Twitter">Twitter/X</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="TikTok">TikTok</SelectItem>
                          <SelectItem value="YouTube">YouTube</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Posting Frequency</label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="every-other-day">Every Other Day</SelectItem>
                          <SelectItem value="3x-week">3x Per Week</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={generateCalendar}
                    disabled={isGenerating || !contentGoal || !platform || !frequency}
                    className="w-full mt-6"
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Creating Your Content Calendar...
                      </>
                    ) : 'Generate 30-Day Calendar'}
                  </Button>
                </motion.div>

                {calendar.length > 0 && (
                  <motion.div variants={fadeIn} className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold">Your 30-Day Content Calendar</h3>
                      <Button onClick={exportCalendar} variant="outline">
                        <i className="fas fa-download mr-2"></i>
                        Export CSV
                      </Button>
                    </div>
                    
                    <div className="grid gap-4">
                      {calendar.slice(0, 10).map((item) => (
                        <Card key={item.day} className="bg-background border border-white/10 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                              {item.day}
                            </div>
                            <div className="text-xs text-gray-400">{item.platform}</div>
                          </div>
                          
                          <h4 className="font-semibold mb-2">{item.postIdea}</h4>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-primary font-medium">CTA: </span>
                              <span className="text-gray-300">{item.cta}</span>
                            </div>
                            <div>
                              <span className="text-primary font-medium">Hashtags: </span>
                              <span className="text-gray-300">{item.hashtags.join(' ')}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 p-3 bg-gray-800/50 rounded text-xs">
                            <span className="text-primary font-medium">AI Prompt: </span>
                            <span className="text-gray-300">{item.suggestedPrompt}</span>
                          </div>
                        </Card>
                      ))}
                      
                      {calendar.length > 10 && (
                        <Card className="bg-primary/10 border border-primary/30 p-4 text-center">
                          <p className="text-primary font-medium">
                            + {calendar.length - 10} more days in your complete calendar
                          </p>
                          <p className="text-sm text-gray-300 mt-1">
                            Export the full calendar to see all 30 days of content ideas
                          </p>
                        </Card>
                      )}
                    </div>
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