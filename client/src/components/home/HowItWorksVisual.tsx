import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

export default function HowItWorksVisual() {
  const steps = [
    {
      step: "1",
      title: "Discovery & Analysis",
      description: "We analyze your current workflows and identify AI automation opportunities",
      icon: "🔍",
      details: ["Business process audit", "Pain point identification", "ROI opportunity assessment", "Technical requirements review"]
    },
    {
      step: "2", 
      title: "Custom AI Design",
      description: "Design and build AI workflows tailored to your specific business needs",
      icon: "🎨",
      details: ["Custom workflow design", "AI model configuration", "Brand integration", "User experience optimization"]
    },
    {
      step: "3",
      title: "Integration & Testing",
      description: "Seamlessly connect with your existing tools and thoroughly test all workflows",
      icon: "🔗",
      details: ["System integration", "API connections", "Security implementation", "Performance testing"]
    },
    {
      step: "4",
      title: "Launch & Optimization",
      description: "Go live with full training and continuous optimization for maximum results",
      icon: "🚀",
      details: ["Team training", "Gradual rollout", "Performance monitoring", "Continuous optimization"]
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
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
              How <GradientText>AI Transformation</GradientText> Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From discovery to deployment in just 7 days - here's our proven process
            </p>
          </motion.div>
        </motion.div>

        {/* Visual Flow Diagram */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connection Lines - Desktop Only */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary transform -translate-y-1/2 opacity-30"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="bg-background border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative z-10">
                  {/* Step Number Circle */}
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 relative z-20">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="text-4xl text-center mb-4">{step.icon}</div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-center mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-center mb-4 text-sm">
                    {step.description}
                  </p>
                  
                  {/* Details List */}
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow for desktop - positioned between cards */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-30">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Arrow for mobile - positioned below cards */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-6 mb-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                      <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline Summary */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 max-w-4xl mx-auto border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">7 Days</div>
                <div className="text-muted-foreground">Total Timeline</div>
              </div>
              <div className="hidden md:block w-px h-16 bg-border"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">24/7</div>
                <div className="text-muted-foreground">Support Included</div>
              </div>
              <div className="hidden md:block w-px h-16 bg-border"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">0</div>
                <div className="text-muted-foreground">Downtime</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}