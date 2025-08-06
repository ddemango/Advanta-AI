import React from 'react';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { NeuralNetwork } from '@/components/ui/neural-network';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { SectionDivider } from '@/components/ui/section-divider';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      variants={fadeIn}
      transition={{ delay }}
      className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6"
    >
      <div className="text-3xl text-primary mb-4">
        <i className={icon}></i>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

export default function WhyAdvantaAI() {
  const features = [
    {
      icon: 'fas fa-rocket',
      title: '7-Day Deployment Guarantee',
      description: 'While others take 6+ months, we deploy fully functional AI workflows in just 7 days with zero downtime.',
    },
    {
      icon: 'fas fa-plug',
      title: 'Universal Integration Engine',
      description: 'Our proprietary framework connects with 500+ business tools instantly - no API knowledge required.',
    },
    {
      icon: 'fas fa-paint-brush',
      title: 'Full Brand Customization',
      description: 'Complete white-label solution with custom UI, tone matching, and branded user portals.',
    },
    {
      icon: 'fas fa-headset',
      title: 'Dedicated AI Implementation Team',
      description: 'Unlike DIY platforms, you get a dedicated team handling strategy, deployment, and optimization.',
    },
  ];

  return (
    <section id="why-advanta" className="py-20 relative overflow-hidden">
      {/* Section divider at the top */}
      <SectionDivider 
        variant="wave" 
        color="#0f172a" 
        height={60} 
        className="opacity-80" 
      />
      
      {/* Dynamic background with neural network */}
      <div className="absolute inset-0 opacity-30">
        <NeuralNetwork nodeCount={40} />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent"></div>
      
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
              What Makes <GradientText>Advanta AI</GradientText> Different
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Unlike generic AI tools or 6-month consulting projects, we deliver production-ready AI workflows in days, not months
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
        
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 p-8 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl">
                <i className="fas fa-lightbulb"></i>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Proprietary Integration Framework</h3>
              <p className="text-gray-300">
                Our custom-built integration framework allows your AI solutions to connect seamlessly with your existing business tools and workflows, ensuring minimal disruption and maximum efficiency.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Section divider at the bottom */}
      <SectionDivider 
        variant="curve" 
        color="#0f172a" 
        height={60} 
        className="opacity-80"
        flip={true}
      />
    </section>
  );
}