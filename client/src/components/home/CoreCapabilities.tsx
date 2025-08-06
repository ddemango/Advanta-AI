import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { Button } from '@/components/ui/button';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

export default function CoreCapabilities() {
  const capabilities = [
    {
      title: "AI Workflow Automation",
      description: "Automate daily tasks across departments using AI-powered workflows.",
      icon: "⚡",
      link: "/services/ai-workflow-automation"
    },
    {
      title: "Custom API & ChatGPT Integrations",
      description: "Embed AI assistants, chatbots, and automation tools directly into your website or business systems.",
      icon: "🔗",
      link: "/services/api-integrations"
    },
    {
      title: "Industry-Specific AI Learning",
      description: "Our AI adapts to your industry, learning from your unique processes for better results.",
      icon: "🧠",
      link: "/services/industry-specific-ai"
    },
    {
      title: "AI-Powered Customer Interactions",
      description: "Transform your website into an interactive experience where customers can chat, book, and get answers instantly.",
      icon: "💬",
      link: "/services/website-ai-assistants"
    },
    {
      title: "Data-Driven Optimization",
      description: "Continuously improve workflows with analytics and machine learning feedback loops.",
      icon: "📊",
      link: "/services"
    },
    {
      title: "Free AI Resources & Tools",
      description: "Access templates, playbooks, and resources to start automating today.",
      icon: "🎯",
      link: "/free-tools"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText>Core Capabilities</GradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive AI solutions designed to transform how your business operates
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="text-4xl mb-4">{capability.icon}</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {capability.title}
              </h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                {capability.description}
              </p>
              <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all" asChild>
                <a href={capability.link}>Learn More</a>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 max-w-4xl mx-auto border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Where Advanta AI is Going</h3>
            <p className="text-muted-foreground mb-6">
              We're building the future of business automation with a library of pre-built AI automation templates, 
              a marketplace of AI resources and workflows, plus advanced learning AI agents that continuously optimize your business.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <a href="/contact">Join the Future</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}