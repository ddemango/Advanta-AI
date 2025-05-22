import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { TabsContent } from '@/components/ui/tabs';
import { useLocation } from 'wouter';

// Consolidated service categories
const SERVICE_CATEGORIES = [
  {
    id: 'ai-agents',
    icon: 'fas fa-robot',
    title: 'AI Agents & Assistants',
    description: 'Intelligent virtual assistants that handle complex tasks autonomously',
  },
  {
    id: 'data-insights',
    icon: 'fas fa-chart-network',
    title: 'Data Analytics & Insights',
    description: 'Transform your business data into actionable intelligence',
  },
  {
    id: 'automation',
    icon: 'fas fa-cogs',
    title: 'Workflow Automation',
    description: 'Streamline processes and eliminate repetitive tasks',
  },
  {
    id: 'integration',
    icon: 'fas fa-plug',
    title: 'Enterprise Integration',
    description: 'Seamlessly connect AI with your existing systems',
  }
];

// Service items for each category
const SERVICE_ITEMS = {
  'ai-agents': [
    {
      id: 'customer-service',
      title: 'Customer Service AI',
      description: 'Intelligent virtual assistants that handle inquiries 24/7, reducing response time by 85% while maintaining high satisfaction scores.',
      image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=500&q=80',
      metrics: ['85% faster response time', '24/7 availability', '73% cost reduction'],
      primaryColor: 'from-purple-500',
      secondaryColor: 'to-indigo-600',
    },
    {
      id: 'sales-agent',
      title: 'Sales Outreach Assistant',
      description: 'AI-powered sales agents that qualify leads, follow up with prospects, and schedule meetings autonomously.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&q=80',
      metrics: ['342% increase in qualified leads', '67% reduction in sales cycle', '41% higher conversion rate'],
      primaryColor: 'from-blue-500',
      secondaryColor: 'to-purple-600',
    },
    {
      id: 'research-ai',
      title: 'Research & Analysis AI',
      description: 'Comprehensive market and competitive research assistants that provide actionable insights to inform strategic decisions.',
      image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=500&q=80',
      metrics: ['8x faster research cycle', '93% accuracy in predictions', '385% ROI'],
      primaryColor: 'from-teal-500',
      secondaryColor: 'to-blue-600',
    }
  ],
  'data-insights': [
    {
      id: 'predictive-analytics',
      title: 'Predictive Analytics',
      description: 'Advanced AI algorithms that analyze historical data to forecast future trends and outcomes with remarkable precision.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80',
      metrics: ['94% forecast accuracy', '35% reduced inventory costs', '27% revenue growth'],
      primaryColor: 'from-amber-500',
      secondaryColor: 'to-red-600',
    },
    {
      id: 'customer-insights',
      title: 'Customer Behavior Insights',
      description: 'Deep analysis of customer interactions to uncover patterns and preferences that drive more effective engagement strategies.',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80',
      metrics: ['41% increase in customer lifetime value', '54% better targeting accuracy', '32% higher retention'],
      primaryColor: 'from-emerald-500',
      secondaryColor: 'to-teal-600',
    },
    {
      id: 'anomaly-detection',
      title: 'Anomaly Detection',
      description: 'Intelligent monitoring systems that identify unusual patterns and potential issues before they impact your business.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80',
      metrics: ['78% faster threat detection', '92% reduction in false alarms', '68% cost savings from prevention'],
      primaryColor: 'from-blue-500',
      secondaryColor: 'to-indigo-600',
    }
  ],
  'automation': [
    {
      id: 'document-processing',
      title: 'Intelligent Document Processing',
      description: 'Extract, classify, and validate information from documents with 99.3% accuracy, including complex unstructured data.',
      image: 'https://images.unsplash.com/photo-1581094283808-22e9b869daf6?w=500&q=80',
      metrics: ['89% faster processing', '99.3% accuracy', '76% cost reduction'],
      primaryColor: 'from-green-500',
      secondaryColor: 'to-emerald-600',
    },
    {
      id: 'content-generation',
      title: 'Content Generation Engine',
      description: 'Create SEO-optimized content at scale with our AI that understands your brand voice and audience needs.',
      image: 'https://images.unsplash.com/photo-1603791239531-1dda55e194a6?w=500&q=80',
      metrics: ['15x faster content creation', '3.2x higher engagement', '47% higher SEO rankings'],
      primaryColor: 'from-purple-500',
      secondaryColor: 'to-pink-600',
    },
    {
      id: 'workflow-automation',
      title: 'Business Process Automation',
      description: 'End-to-end automation of complex business processes with intelligent decision-making capabilities.',
      image: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=500&q=80',
      metrics: ['74% operational cost reduction', '91% fewer errors', '4.3x faster execution'],
      primaryColor: 'from-blue-500',
      secondaryColor: 'to-cyan-600',
    }
  ],
  'integration': [
    {
      id: 'api-integration',
      title: 'AI API Integration',
      description: 'Connect our powerful AI capabilities directly with your existing systems through secure, scalable APIs.',
      image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500&q=80',
      metrics: ['8 day average implementation', '99.9% uptime', 'Enterprise-grade security'],
      primaryColor: 'from-indigo-500',
      secondaryColor: 'to-purple-600',
    },
    {
      id: 'crm-integration',
      title: 'CRM & Marketing Automation',
      description: 'Enhance your CRM with AI-powered insights and automated workflows that maximize customer engagement.',
      image: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=500&q=80',
      metrics: ['53% increase in marketing ROI', '67% higher lead qualification', '37% improved conversion rates'],
      primaryColor: 'from-red-500',
      secondaryColor: 'to-orange-600',
    },
    {
      id: 'data-platform',
      title: 'Enterprise Data Platform',
      description: 'Unified data platform that connects all your information sources and applies AI to deliver actionable insights.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&q=80',
      metrics: ['360° business view', '83% faster insights delivery', '42% better decision accuracy'],
      primaryColor: 'from-emerald-500',
      secondaryColor: 'to-blue-600',
    }
  ]
};

export default function ConsolidatedServices() {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const toggleService = (serviceId: string) => {
    if (expandedService === serviceId) {
      setExpandedService(null);
    } else {
      setExpandedService(serviceId);
    }
  };

  const handleLearnMore = (categoryId: string, serviceId: string) => {
    setLocation(`/services/${categoryId}/${serviceId}`);
  };

  // Render service items for a specific category
  const renderServiceItems = (categoryId: string) => {
    const items = SERVICE_ITEMS[categoryId as keyof typeof SERVICE_ITEMS] || [];
    
    return (
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
      >
        {items.map((service) => (
          <motion.div
            key={service.id}
            variants={fadeIn}
            className="h-full"
          >
            <Card className={`h-full overflow-hidden group hover:shadow-lg transition-all duration-300 bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 ${
              expandedService === service.id ? 'ring-2 ring-primary/50' : ''
            }`}>
              <div className="h-48 overflow-hidden relative">
                {/* Optimized image loading with low-quality placeholder */}
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onLoad={(e) => e.currentTarget.previousElementSibling?.classList.add('hidden')}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${service.primaryColor} ${service.secondaryColor} opacity-70`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">{service.title}</h3>
                </div>
              </div>
              
              <CardContent className="p-6">
                <p className="text-gray-300 mb-4">{service.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-primary mb-2">Key Results</h4>
                  <ul className="space-y-1">
                    {service.metrics.map((metric, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span className="text-sm">{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleLearnMore(categoryId, service.id)}
                    className="text-primary hover:text-primary/80"
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <>
      {SERVICE_CATEGORIES.map((category) => (
        <TabsContent key={category.id} value={category.id} className="mt-0">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mr-4">
              <i className={`${category.icon} text-2xl text-primary`}></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold">{category.title}</h3>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </div>
          
          {renderServiceItems(category.id)}
        </TabsContent>
      ))}
    </>
  );
}