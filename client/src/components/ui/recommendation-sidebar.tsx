import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { useUserTracking } from '@/hooks/useUserTracking';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  category: string;
  tags: string[];
  useCase: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface RecommendationProps {
  isVisible?: boolean;
}

export function RecommendationSidebar({ isVisible = true }: RecommendationProps) {
  const [location, setLocation] = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dismissedTools, setDismissedTools] = useState<string[]>([]);
  const [recommendedTools, setRecommendedTools] = useState<AITool[]>([]);
  const { trackToolUsage, getUserBehavior, getPersonalizedPreferences } = useUserTracking();

  const allTools: AITool[] = [
    {
      id: 'headline-split-test',
      name: 'Headline Split-Test Generator',
      description: 'Generate high-converting headlines with CTR predictions',
      icon: 'fa-chart-line',
      route: '/headline-split-test-generator',
      category: 'marketing',
      tags: ['headlines', 'conversion', 'testing', 'copywriting'],
      useCase: 'Perfect for landing pages',
      difficulty: 'beginner'
    },
    {
      id: 'business-idea-validator',
      name: 'Business Idea Validator',
      description: 'Validate startup ideas with comprehensive analysis',
      icon: 'fa-lightbulb',
      route: '/business-idea-validator',
      category: 'strategy',
      tags: ['startup', 'validation', 'analysis', 'planning'],
      useCase: 'Essential for entrepreneurs',
      difficulty: 'intermediate'
    },
    {
      id: 'landing-page-builder',
      name: 'Landing Page Builder',
      description: 'Create complete landing page copy with export',
      icon: 'fa-file-alt',
      route: '/landing-page-builder',
      category: 'marketing',
      tags: ['landing pages', 'copywriting', 'conversion'],
      useCase: 'Great for product launches',
      difficulty: 'beginner'
    },
    {
      id: 'content-calendar',
      name: 'Content Calendar Generator',
      description: '30-day content plan with post ideas and hashtags',
      icon: 'fa-calendar',
      route: '/content-calendar-generator',
      category: 'content',
      tags: ['content', 'social media', 'planning', 'calendar'],
      useCase: 'Perfect for social media',
      difficulty: 'beginner'
    },
    {
      id: 'pricing-strategy',
      name: 'Pricing Strategy Assistant',
      description: 'Data-driven pricing recommendations and tactics',
      icon: 'fa-tags',
      route: '/pricing-strategy-assistant',
      category: 'strategy',
      tags: ['pricing', 'strategy', 'psychology', 'revenue'],
      useCase: 'Critical for pricing decisions',
      difficulty: 'intermediate'
    },
    {
      id: 'brand-kit',
      name: 'Brand Kit Generator',
      description: 'Complete brand identity with colors and fonts',
      icon: 'fa-palette',
      route: '/brand-kit-generator',
      category: 'branding',
      tags: ['branding', 'design', 'identity', 'colors'],
      useCase: 'Essential for new businesses',
      difficulty: 'beginner'
    },
    {
      id: 'prompt-library',
      name: 'Time-Saving Prompt Library',
      description: 'Curated AI prompts for business tasks',
      icon: 'fa-book',
      route: '/prompt-library',
      category: 'productivity',
      tags: ['prompts', 'ai', 'productivity', 'templates'],
      useCase: 'Useful for AI power users',
      difficulty: 'beginner'
    },
    {
      id: 'custom-gpt',
      name: 'Custom GPT Bot Generator',
      description: 'Create specialized AI assistants for your needs',
      icon: 'fa-robot',
      route: '/custom-gpt-generator',
      category: 'ai',
      tags: ['ai', 'customization', 'automation', 'bots'],
      useCase: 'Advanced AI implementation',
      difficulty: 'advanced'
    },
    {
      id: 'competitor-intelligence',
      name: 'Competitor Intelligence',
      description: 'Analyze competitor websites and strategies',
      icon: 'fa-search',
      route: '/competitor-intelligence',
      category: 'research',
      tags: ['competition', 'analysis', 'research', 'strategy'],
      useCase: 'Essential for market research',
      difficulty: 'intermediate'
    },
    {
      id: 'cold-email-generator',
      name: 'Cold Email Generator',
      description: 'Create personalized outreach email templates',
      icon: 'fa-envelope',
      route: '/cold-email-generator',
      category: 'sales',
      tags: ['email', 'outreach', 'sales', 'templates'],
      useCase: 'Perfect for sales teams',
      difficulty: 'beginner'
    }
  ];

  // Intelligent personalized recommendation algorithm
  useEffect(() => {
    const getRecommendations = () => {
      const currentPath = location;
      const userBehavior = getUserBehavior();
      const preferences = getPersonalizedPreferences();
      let recommendations: AITool[] = [];

      // Personalized recommendations based on user behavior
      if (userBehavior.isNewUser) {
        // New users get beginner-friendly tools
        recommendations = allTools.filter(tool => tool.difficulty === 'beginner');
      } else {
        // Experienced users get tools based on their favorite categories
        if (userBehavior.favoriteCategories.length > 0) {
          recommendations = allTools.filter(tool => 
            userBehavior.favoriteCategories.includes(tool.category)
          );
        }
        
        // If user is advanced, include advanced tools
        if (userBehavior.experienceLevel === 'advanced') {
          recommendations.push(...allTools.filter(tool => tool.difficulty === 'advanced'));
        }
      }

      // Context-based recommendations (current page)
      let contextRecommendations: AITool[] = [];
      if (currentPath.includes('marketing') || currentPath.includes('content') || currentPath.includes('headline') || currentPath.includes('landing')) {
        contextRecommendations = allTools.filter(tool => 
          ['marketing', 'content', 'branding'].includes(tool.category)
        );
      } else if (currentPath.includes('business') || currentPath.includes('strategy') || currentPath.includes('pricing')) {
        contextRecommendations = allTools.filter(tool => 
          ['strategy', 'research', 'ai'].includes(tool.category)
        );
      } else if (currentPath.includes('sales') || currentPath.includes('email') || currentPath.includes('cold')) {
        contextRecommendations = allTools.filter(tool => 
          ['sales', 'marketing', 'content'].includes(tool.category)
        );
      } else if (currentPath.includes('brand') || currentPath.includes('design')) {
        contextRecommendations = allTools.filter(tool => 
          ['branding', 'marketing', 'content'].includes(tool.category)
        );
      }

      // Combine personalized and context recommendations
      const combinedRecommendations = [...recommendations, ...contextRecommendations];
      
      // If no personalized recommendations, fall back to popular tools
      if (combinedRecommendations.length === 0) {
        combinedRecommendations.push(
          allTools.find(t => t.id === 'headline-split-test')!,
          allTools.find(t => t.id === 'business-idea-validator')!,
          allTools.find(t => t.id === 'content-calendar')!,
          allTools.find(t => t.id === 'brand-kit')!
        );
      }

      // Remove duplicates and filter
      const uniqueTools = combinedRecommendations.filter((tool, index, self) => 
        tool && self.findIndex(t => t && t.id === tool.id) === index
      );

      // Filter out dismissed tools, used tools, and current page
      const filtered = uniqueTools
        .filter(tool => tool && !dismissedTools.includes(tool.id))
        .filter(tool => !currentPath.includes(tool.route.slice(1)))
        .sort((a, b) => {
          // Prioritize based on user experience level
          if (userBehavior.experienceLevel === 'beginner') {
            if (a.difficulty === 'beginner' && b.difficulty !== 'beginner') return -1;
            if (b.difficulty === 'beginner' && a.difficulty !== 'beginner') return 1;
          }
          return 0;
        })
        .slice(0, 3);

      setRecommendedTools(filtered);
    };

    getRecommendations();
  }, [location, dismissedTools]);

  const handleDismiss = (toolId: string) => {
    setDismissedTools(prev => [...prev, toolId]);
  };

  const handleToolClick = (route: string, toolId: string) => {
    trackToolUsage(toolId);
    setLocation(route);
    setIsExpanded(false);
  };

  if (!isVisible || recommendedTools.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40"
    >
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="relative"
          >
            <Button
              onClick={() => setIsExpanded(true)}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <i className="fas fa-magic text-lg"></i>
            </Button>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {recommendedTools.length}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 50 }}
            className="w-80"
          >
            <Card className="bg-background/95 backdrop-blur-md border border-primary/30 p-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-magic text-primary"></i>
                  <h3 className="font-bold text-lg">Recommended Tools</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="h-8 w-8 p-0"
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>

              <div className="space-y-3">
                {recommendedTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors cursor-pointer">
                      <div className="bg-primary/20 p-2 rounded-lg flex-shrink-0">
                        <i className={`fas ${tool.icon} text-primary`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                          {tool.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-primary bg-primary/20 px-2 py-1 rounded">
                            {tool.useCase}
                          </span>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              onClick={() => handleToolClick(tool.route, tool.id)}
                              className="h-7 px-3 text-xs"
                            >
                              Try It
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDismiss(tool.id)}
                              className="h-7 w-7 p-0 text-gray-400 hover:text-white"
                            >
                              <i className="fas fa-times text-xs"></i>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-700/50">
                <p className="text-xs text-gray-400 text-center">
                  Based on your current page and activity
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}