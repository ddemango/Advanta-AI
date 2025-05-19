import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GradientText } from '@/components/ui/gradient-text';
import { GlassCard } from '@/components/ui/glass-card';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

const industryTemplates = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: 'fa-solid fa-house',
    features: [
      'Property listing chatbot',
      'Automated lead qualification',
      'Personalized property recommendations',
      'Market analysis reports'
    ],
    description: 'AI assistants that help real estate professionals qualify leads, answer property questions, and schedule viewings 24/7.'
  },
  {
    id: 'med-spas',
    name: 'Med Spas',
    icon: 'fa-solid fa-spa',
    features: [
      'Treatment recommendation bot',
      'Appointment scheduling',
      'Post-treatment follow-ups',
      'Personalized skincare plans'
    ],
    description: 'Intelligent virtual assistants that help med spas automate consultations, follow-ups, and create personalized treatment plans.'
  },
  {
    id: 'agencies',
    name: 'Agencies',
    icon: 'fa-solid fa-people-group',
    features: [
      'Client onboarding automation',
      'Project status updates',
      'Resource allocation assistant',
      'Content idea generation'
    ],
    description: 'AI solutions that help agencies streamline project management, generate creative content, and automate client communications.'
  },
  {
    id: 'law-firms',
    name: 'Law Firms',
    icon: 'fa-solid fa-scale-balanced',
    features: [
      'Legal FAQ assistant',
      'Case intake automation',
      'Document analysis',
      'Precedent research'
    ],
    description: 'AI assistants that help law firms automate routine client inquiries, document review, and preliminary case analysis.'
  },
  {
    id: 'ecommerce',
    name: 'eCommerce',
    icon: 'fa-solid fa-cart-shopping',
    features: [
      'Product recommendation engine',
      'Shopping assistant',
      'Inventory prediction',
      'Customer support automation'
    ],
    description: 'AI-powered shopping assistants and recommendation engines that boost conversions and provide 24/7 customer support.'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: 'fa-solid fa-stethoscope',
    features: [
      'Patient screening bot',
      'Appointment scheduling',
      'Medication reminders',
      'Care plan explanations'
    ],
    description: 'HIPAA-compliant AI assistants that streamline patient intake, answer common questions, and provide care information.'
  }
];

export default function IndustryTemplates() {
  const [activeTab, setActiveTab] = useState('real-estate');
  const activeTemplate = industryTemplates.find(template => template.id === activeTab);

  return (
    <section id="industry-templates" className="py-20 bg-background relative overflow-hidden">
      {/* Background with digital patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0">
          <svg width="100%" height="100%">
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Industry-Specific <GradientText>Templates</GradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Pre-built AI solutions optimized for your business type—deploy in days, not months
            </p>
          </motion.div>
        </motion.div>

        <Tabs 
          defaultValue="real-estate" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="bg-background/60 border border-white/10 backdrop-blur-sm rounded-full p-1 overflow-x-auto max-w-full flex-wrap justify-center">
              {industryTemplates.map(template => (
                <TabsTrigger 
                  key={template.id} 
                  value={template.id}
                  className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <i className={`${template.icon} mr-2`}></i>
                  {template.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {industryTemplates.map(template => (
            <TabsContent 
              key={template.id} 
              value={template.id}
              className="mt-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <GlassCard>
                  <div className="p-8">
                    <div className="mb-6 flex items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl mr-4">
                        <i className={template.icon}></i>
                      </div>
                      <h3 className="text-2xl font-bold">{template.name} AI Template</h3>
                    </div>
                    
                    <p className="text-gray-300 mb-6">{template.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-medium mb-3">Includes:</h4>
                      <ul className="space-y-2">
                        {template.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button asChild className="w-full">
                      <a href="/calculator">Build My AI Stack</a>
                    </Button>
                  </div>
                </GlassCard>
                
                <div className="rounded-lg overflow-hidden bg-black/40 backdrop-blur-md border border-white/10 h-[300px] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="text-5xl text-primary mb-4">
                        <i className={template.icon}></i>
                      </div>
                      <h4 className="text-xl font-bold mb-2">{template.name} Assistant</h4>
                      <p className="text-gray-400 mb-4">Interactive AI customized for your business</p>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <a href="/calculator"><i className="fas fa-cogs mr-2"></i> Build My AI Stack</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
        
        <motion.div 
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-white/70 mb-6 max-w-3xl mx-auto">
            Don't see your industry? We build custom AI solutions for any business type.
          </p>
          <Button asChild variant="outline" size="lg" className="mx-auto">
            <a href="#contact">Request Custom Template</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}