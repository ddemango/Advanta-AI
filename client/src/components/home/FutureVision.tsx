import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { Rocket, BookOpen, Brain } from 'lucide-react';

export default function FutureVision() {
  const visionItems = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Pre-built AI Automation Templates",
      description: "A library of pre-built AI automation templates for instant deployment across industries."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Resources Marketplace",
      description: "A marketplace of AI resources, workflows, and industry-specific solutions."
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Advanced Learning AI Agents",
      description: "Advanced learning AI agents that continuously optimize your business processes."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
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
              Where <GradientText>Advanta AI</GradientText> is Going
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              Advanta AI is building the future of business automation:
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {visionItems.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-background border border-border rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="text-primary mb-6 flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}