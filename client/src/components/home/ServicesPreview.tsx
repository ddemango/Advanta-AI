import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/ui/gradient-text';
import { GlassCard } from '@/components/ui/glass-card';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

interface ServiceTileProps {
  icon: string;
  title: string;
  description: string;
  color: string;
  delay?: number;
}

const ServiceTile = ({ icon, title, description, color, delay = 0 }: ServiceTileProps) => {
  return (
    <motion.div
      variants={fadeIn}
      transition={{ delay }}
      whileHover={{ scale: 1.03 }}
      className="h-full"
    >
      <GlassCard className="h-full">
        <div className="p-6 flex flex-col h-full">
          <div className={`w-12 h-12 rounded-lg bg-${color}/20 flex items-center justify-center text-${color} text-xl mb-4`}>
            <i className={icon}></i>
          </div>
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm text-gray-300 flex-grow">{description}</p>
          <div className="mt-4">
            <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/90">
              Learn more <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default function ServicesPreview() {
  const services = [
    {
      icon: 'fas fa-robot',
      title: 'Custom GPT Agents',
      description: 'AI assistants tailored to your brand voice, trained on your business data, and optimized for your specific use cases.',
      color: 'primary'
    },
    {
      icon: 'fas fa-cogs',
      title: 'AI Workflow Automation',
      description: 'Automate repetitive tasks, data processing, and customer journeys with intelligent AI workflows.',
      color: 'secondary'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Predictive Dashboards',
      description: 'Real-time analytics and forecasting dashboards powered by AI to help you make data-driven decisions.',
      color: 'accent'
    },
    {
      icon: 'fas fa-language',
      title: 'Multilingual Support Bots',
      description: 'AI assistants that communicate fluently in multiple languages to serve your global customer base.',
      color: 'primary'
    },
    {
      icon: 'fas fa-plug',
      title: 'CRM/App Integrations',
      description: 'Seamlessly connect your AI solutions with your existing CRM, marketing, and business tools.',
      color: 'secondary'
    },
    {
      icon: 'fas fa-database',
      title: 'AI Trained on Client Data',
      description: 'Custom AI models trained on your proprietary data for maximum relevance and effectiveness.',
      color: 'accent'
    },
    {
      icon: 'fas fa-copyright',
      title: 'White-Label Portals',
      description: 'Offer clients their own branded portal with analytics, bot controls, and CRM integrations.',
      color: 'primary'
    },
    {
      icon: 'fas fa-brain',
      title: 'AutoBlog + FAQ Generator',
      description: 'AI-powered content generation for blogs, FAQs, and help documentation based on your business data.',
      color: 'secondary'
    }
  ];

  return (
    <section id="services-preview" className="py-20 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <GradientText>AI Suite</GradientText> of Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Modular, enterprise-grade AI tools designed to solve specific business challenges while integrating seamlessly with your existing systems.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <ServiceTile
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              color={service.color}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <a href="#contact">Explore All Solutions</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}