import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { GradientText } from '@/components/ui/gradient-text';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Choose your industry + use case',
      description: 'Select from industry-specific templates or customize a solution for your unique needs.',
      icon: 'fa-regular fa-building'
    },
    {
      number: '2',
      title: 'Upload your data + personalize your AI',
      description: 'Train your AI on your business data, customize the tone, appearance, and knowledge base.',
      icon: 'fa-solid fa-cloud-arrow-up'
    },
    {
      number: '3',
      title: 'Launch your assistant + monitor performance',
      description: 'Deploy your AI solution in days and track metrics through your personalized dashboard.',
      icon: 'fa-solid fa-rocket'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-black/60 relative overflow-hidden">
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
              How It <GradientText>Works</GradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From concept to deployment in three simple steps
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
            Our platform + agency model ensures you get both cutting-edge technology and expert support throughout your AI journey.
          </p>
        </motion.div>
      </div>
    </section>
  );
}