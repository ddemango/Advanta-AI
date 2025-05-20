import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { GradientText } from '@/components/ui/gradient-text';
import { SectionDivider } from '@/components/ui/section-divider';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Strategic AI Discovery Session',
      description: 'Our AI architects analyze your business processes to identify high-ROI automation opportunities and competitive advantages.',
      icon: 'fa-solid fa-lightbulb'
    },
    {
      number: '2',
      title: 'Proprietary Algorithm Implementation',
      description: 'We deploy our enterprise-grade algorithms trained on your specific industry data for maximum accuracy and performance.',
      icon: 'fa-solid fa-code'
    },
    {
      number: '3',
      title: 'Accelerated Market Deployment',
      description: 'Launch within 14 days with real-time analytics dashboard monitoring performance, ROI metrics, and competitive intelligence.',
      icon: 'fa-solid fa-rocket'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-black/60 relative overflow-hidden">
      {/* Top section divider */}
      <SectionDivider 
        variant="angle" 
        color="#0f172a" 
        height={60} 
        className="opacity-70" 
      />
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background/80 z-0"></div>
      
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
              Enterprise-Grade <GradientText>AI Implementation</GradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our proprietary deployment methodology delivers results in just 14 days
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="relative"
            >
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-8 h-full">
                {/* Step number */}
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xl font-bold">{step.number}</span>
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-primary/40 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                )}
                
                <div className="mb-4 text-3xl text-primary mt-4">
                  <i className={step.icon}></i>
                </div>
                
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Additional info */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Our elite team of AI specialists has delivered transformative solutions for industry leaders across finance, healthcare, manufacturing, and retail sectors.
          </p>
        </motion.div>
      </div>
      
      {/* Bottom section divider */}
      <SectionDivider 
        variant="triangle" 
        color="#0f172a" 
        height={70} 
        className="opacity-70"
        flip={true}
      />
    </section>
  );
}