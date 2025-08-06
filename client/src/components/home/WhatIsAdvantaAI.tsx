import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

export default function WhatIsAdvantaAI() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <GradientText>Advanta AI</GradientText>?
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                <strong>Advanta AI is an AI-driven automation and workflow integration agency</strong> designed to help businesses streamline operations, eliminate repetitive tasks, and provide seamless ways for customers to interact with companies using AI.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                We specialize in combining APIs, ChatGPT, and intelligent automation tools to build smarter, more connected websites and workflows that scale with your business.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}