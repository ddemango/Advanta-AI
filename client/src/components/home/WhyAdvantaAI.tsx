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
      icon: 'fas fa-paint-brush',
      title: 'Built for Your Brand',
      description: 'Full customization of tone, avatar, and UI to match your brand identity and voice.',
    },
    {
      icon: 'fas fa-bolt',
      title: 'Speed to Deployment',
      description: 'Get your custom AI solution up and running in under 7 days, not months.',
    },
    {
      icon: 'fas fa-building',
      title: 'Platform + Agency Support',
      description: 'Combines cutting-edge technology with expert strategic guidance and implementation.',
    },
    {
      icon: 'fas fa-copyright',
      title: 'Fully White-Label Ready',
      description: 'Offer AI solutions under your own brand with custom portals and dashboards.',
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
              Why <GradientText>Advanta AI</GradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Enterprise-grade AI solutions tailored to your specific needs
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