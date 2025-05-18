import { motion } from 'framer-motion';
import { ServiceCard } from '@/components/ui/service-card';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

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
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={fadeIn}>
              <ServiceCard
                name={product.name}
                description={product.description}
                icon={product.icon}
                color={product.color}
                industries={product.industries}
                timeline={product.timeline}
              />
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
                className="bg-muted p-8 rounded-xl border border-border"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{category.title}</h3>
                <ul className="space-y-3 mb-6">
                  {category.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <i className="fas fa-check text-secondary mt-1 mr-3"></i>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <a href="#" className="inline-block text-primary hover:text-primary/90 font-medium mt-2">Learn more →</a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
