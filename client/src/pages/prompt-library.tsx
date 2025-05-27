import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet';

interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  useCase: string;
  tags: string[];
}

export default function PromptLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const prompts: PromptTemplate[] = [
    {
      id: '1',
      title: 'Sales Email Generator',
      category: 'sales',
      description: 'Create compelling cold outreach emails',
      prompt: 'Write a professional cold email to [TARGET_ROLE] at [COMPANY_TYPE] companies. The email should introduce [YOUR_PRODUCT/SERVICE] and highlight how it solves [SPECIFIC_PAIN_POINT]. Keep it under 150 words, include a clear call-to-action, and maintain a conversational tone.',
      useCase: 'Perfect for sales teams reaching out to new prospects',
      tags: ['cold email', 'outreach', 'sales', 'B2B']
    },
    {
      id: '2',
      title: 'Content Marketing Ideas',
      category: 'marketing',
      description: 'Generate content ideas for social media',
      prompt: 'Generate 10 content ideas for [PLATFORM] that would appeal to [TARGET_AUDIENCE]. Each idea should include: 1) A compelling headline, 2) Key points to cover, 3) Suggested visual elements, 4) Relevant hashtags. Focus on [INDUSTRY/NICHE] and aim for content that drives engagement.',
      useCase: 'Ideal for content creators and marketing teams',
      tags: ['content', 'social media', 'ideas', 'engagement']
    },
    {
      id: '3',
      title: 'Product Feature Prioritizer',
      category: 'product',
      description: 'Prioritize product features based on impact',
      prompt: 'Help me prioritize these product features: [LIST_FEATURES]. For each feature, analyze: 1) User impact (1-10), 2) Development effort (1-10), 3) Revenue potential, 4) Strategic alignment with [COMPANY_GOALS]. Provide a ranked list with reasoning for the top 3 priorities.',
      useCase: 'Essential for product managers and development teams',
      tags: ['product management', 'prioritization', 'strategy']
    },
    {
      id: '4',
      title: 'Customer Support Response',
      category: 'ops',
      description: 'Professional customer service responses',
      prompt: 'Write a professional customer service response to this inquiry: [CUSTOMER_MESSAGE]. The response should: 1) Acknowledge their concern, 2) Provide a clear solution or next steps, 3) Maintain a helpful and empathetic tone, 4) Include relevant resources if applicable. Keep it concise but thorough.',
      useCase: 'Great for support teams and customer success',
      tags: ['customer service', 'support', 'communication']
    },
    {
      id: '5',
      title: 'Meeting Summary Generator',
      category: 'ops',
      description: 'Convert meeting notes into actionable summaries',
      prompt: 'Transform these meeting notes into a structured summary: [MEETING_NOTES]. Include: 1) Key decisions made, 2) Action items with owners and deadlines, 3) Important discussion points, 4) Next meeting agenda items. Format it professionally for easy sharing with stakeholders.',
      useCase: 'Perfect for team leads and project managers',
      tags: ['meetings', 'productivity', 'documentation']
    },
    {
      id: '6',
      title: 'Ad Copy Creator',
      category: 'marketing',
      description: 'High-converting advertisement copy',
      prompt: 'Create compelling ad copy for [PLATFORM] promoting [PRODUCT/SERVICE] to [TARGET_AUDIENCE]. Include: 1) Attention-grabbing headline, 2) Benefit-focused body text, 3) Strong call-to-action, 4) Address the main pain point of [PAIN_POINT]. Keep within [CHARACTER_LIMIT] characters.',
      useCase: 'Essential for digital marketing campaigns',
      tags: ['advertising', 'copywriting', 'conversion']
    },
    {
      id: '7',
      title: 'Code Review Assistant',
      category: 'development',
      description: 'Thorough code review and suggestions',
      prompt: 'Review this code for [PROGRAMMING_LANGUAGE]: [CODE_SNIPPET]. Analyze: 1) Code quality and best practices, 2) Potential bugs or security issues, 3) Performance optimization opportunities, 4) Readability improvements. Provide specific suggestions with examples.',
      useCase: 'Valuable for development teams and code quality',
      tags: ['code review', 'development', 'quality assurance']
    },
    {
      id: '8',
      title: 'Business Strategy Analyzer',
      category: 'strategy',
      description: 'Analyze business strategies and opportunities',
      prompt: 'Analyze this business strategy: [STRATEGY_DESCRIPTION]. Evaluate: 1) Market opportunities and threats, 2) Competitive advantages, 3) Resource requirements, 4) Potential risks and mitigation strategies, 5) Success metrics to track. Provide actionable recommendations.',
      useCase: 'Critical for executives and business strategists',
      tags: ['strategy', 'analysis', 'business planning']
    }
  ];

  const categories = ['all', 'marketing', 'sales', 'product', 'ops', 'development', 'strategy'];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (promptId: string) => {
    setFavorites(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    );
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <>
      <Helmet>
        <title>Time-Saving Prompt Library | Advanta AI</title>
        <meta name="description" content="Curated collection of AI prompts for marketing, sales, product development, and operations. Copy, favorite, and search through proven templates." />
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
                <GradientText>Time-Saving Prompt</GradientText> Library
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Curated collection of proven AI prompts for marketing, sales, product development, and operations. Search, favorite, and copy with one click.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Search and Filters */}
                <motion.div variants={fadeIn} className="bg-background border border-white/10 rounded-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search prompts by title, description, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className="capitalize"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Prompt Grid */}
                <motion.div variants={fadeIn} className="grid gap-6">
                  {filteredPrompts.map((prompt) => (
                    <Card key={prompt.id} className="bg-background border border-white/10 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold">{prompt.title}</h3>
                            <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs uppercase font-medium">
                              {prompt.category}
                            </span>
                          </div>
                          <p className="text-gray-300 mb-3">{prompt.description}</p>
                          <p className="text-sm text-gray-400 mb-3">{prompt.useCase}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(prompt.id)}
                            className={favorites.includes(prompt.id) ? 'text-yellow-400' : ''}
                          >
                            <i className={`fas ${favorites.includes(prompt.id) ? 'fa-star' : 'fa-star'}`}></i>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyPrompt(prompt.prompt)}
                          >
                            <i className="fas fa-copy mr-2"></i>
                            Copy
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/50 p-4 rounded mb-4">
                        <p className="text-sm text-gray-300 font-mono leading-relaxed">
                          {prompt.prompt}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {prompt.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </Card>
                  ))}
                </motion.div>

                {filteredPrompts.length === 0 && (
                  <motion.div variants={fadeIn} className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-4">
                      <i className="fas fa-search text-4xl mb-4"></i>
                      <p>No prompts found matching your search.</p>
                    </div>
                    <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                      Clear Filters
                    </Button>
                  </motion.div>
                )}

                {/* Usage Tips */}
                <motion.div variants={fadeIn} className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">💡 How to Use These Prompts</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Customization Tips:</h4>
                      <ul className="space-y-1 text-gray-300">
                        <li>• Replace [BRACKETS] with your specific information</li>
                        <li>• Adjust tone and length based on your needs</li>
                        <li>• Combine multiple prompts for complex tasks</li>
                        <li>• Test variations to find what works best</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Best Practices:</h4>
                      <ul className="space-y-1 text-gray-300">
                        <li>• Be specific with your context and requirements</li>
                        <li>• Provide examples when possible</li>
                        <li>• Iterate on outputs for better results</li>
                        <li>• Save your favorite variations for reuse</li>
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