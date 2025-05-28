import { motion } from 'framer-motion';
import { ServiceCard } from '@/components/ui/service-card';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { GradientMesh } from '@/components/ui/gradient-mesh';
import { NeuralNetwork } from '@/components/ui/neural-network';
import { GlassCard } from '@/components/ui/glass-card';

const products = [
  {
    id: 1,
    name: 'NeuroAds™',
    description: 'AI-powered marketing automation and campaign optimization that adapts in real-time.',
    icon: 'bullhorn',
    color: 'primary',
    industries: ['eCommerce', 'SaaS', 'Retail'],
    timeline: '3-4 weeks'
  },
  {
    id: 2,
    name: 'PromptCore™',
    description: 'Custom GPT and conversational AI development with domain-specific training.',
    icon: 'robot',
    color: 'accent',
    industries: ['Finance', 'Healthcare', 'Support'],
    timeline: '2-6 weeks'
  },
  {
    id: 3,
    name: 'SignalFlow™',
    description: 'Predictive analytics and data intelligence pipelines for strategic decision making.',
    icon: 'chart-line',
    color: 'secondary',
    industries: ['Manufacturing', 'Logistics', 'Finance'],
    timeline: '4-8 weeks'
  },
  {
    id: 4,
    name: 'VisionBoard™',
    description: 'AI-powered dashboards and visual analytics with actionable intelligence.',
    icon: 'eye',
    color: 'primary',
    industries: ['Executive', 'Operations', 'Marketing'],
    timeline: '2-5 weeks'
  }
];

const serviceCategories = [
  {
    id: 1,
    title: 'AI Strategy & Consulting',
    items: [
      'Opportunity assessment & roadmapping',
      'Technology stack evaluation',
      'AI implementation planning'
    ]
  },
  {
    id: 2,
    title: 'Custom AI Model Development',
    items: [
      'Domain-specific AI training',
      'Supervised & reinforcement learning',
      'Continuous model improvement'
    ]
  },
  {
    id: 3,
    title: 'AI-Driven Automation',
    items: [
      'Workflow & process automation',
      'Intelligent document processing',
      'Decision support systems'
    ]
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-background relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 opacity-20">
        <GradientMesh colorSet={['#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#db2777']} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">Our AI Suite of Solutions</motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Modular, enterprise-grade AI tools designed to solve specific business challenges while integrating seamlessly with your existing systems.
          </motion.p>
        </motion.div>
        
        {/* Interactive neural network visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative h-48 md:h-64 mb-16 rounded-lg overflow-hidden"
        >
          <NeuralNetwork className="absolute inset-0" nodeCount={50} activeNodes={15} />
          <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm border border-muted/20">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Advanced AI Technology</h3>
              <p className="text-white/70 max-w-md mx-auto">Interactive neural networks that adapt to your business needs</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={fadeIn}>
              <GlassCard>
                <ServiceCard
                  name={product.name}
                  description={product.description}
                  icon={product.icon}
                  color={product.color}
                  industries={product.industries}
                  timeline={product.timeline}
                />
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Service Categories */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category) => (
              <motion.div 
                key={category.id}
                variants={fadeIn}
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              >
                <GlassCard>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">{category.title}</h3>
                    <ul className="space-y-3 mb-6">
                      {category.items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <motion.span 
                            initial={{ scale: 0 }} 
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary mr-3 mt-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.span>
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="/calculator" className="inline-flex items-center text-primary hover:text-primary/90 font-medium mt-2">
                      Build my AI stack 
                      <motion.span 
                        animate={{ x: [0, 5, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="ml-1"
                      >
                        →
                      </motion.span>
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
