import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { GradientText } from '@/components/ui/gradient-text';
import { Helmet } from 'react-helmet';

export default function AIWorkflowAutomation() {
  const workflows = [
    {
      title: "Customer Support Automation",
      description: "AI assistants handle 80% of support tickets with contextual responses from your knowledge base.",
      features: ["24/7 multilingual support", "CRM integration", "Escalation protocols", "Performance analytics"],
      roi: "75% reduction in support costs"
    },
    {
      title: "Lead Generation & Qualification",
      description: "Intelligent lead scoring and nurturing workflows that identify high-value prospects automatically.",
      features: ["Lead scoring algorithms", "Automated follow-ups", "CRM synchronization", "Conversion tracking"],
      roi: "3x increase in qualified leads"
    },
    {
      title: "Content Creation Pipeline",
      description: "Generate blog posts, social media content, and marketing copy that matches your brand voice.",
      features: ["Brand voice training", "SEO optimization", "Multi-platform publishing", "Content calendar automation"],
      roi: "90% reduction in content creation time"
    }
  ];

  return (
    <>
      <Helmet>
        <title>AI Workflow Automation - Advanta AI</title>
        <meta name="description" content="Deploy custom AI workflows that automate customer support, lead generation, and content creation in under 7 days. No coding required." />
        <meta name="keywords" content="AI workflow automation, business process automation, AI customer support, lead generation automation" />
        <meta property="og:title" content="AI Workflow Automation - Advanta AI" />
        <meta property="og:description" content="Deploy custom AI workflows that automate customer support, lead generation, and content creation in under 7 days." />
        <meta property="og:type" content="website" />
      </Helmet>

      <NewHeader />

      <main className="pt-28">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-6 text-primary border-primary/50">
                  AI Workflow Automation
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Automate Your Business with <GradientText>Intelligent Workflows</GradientText>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Stop doing repetitive tasks manually. Our AI workflows handle customer support, lead qualification, content creation, and data processing while you focus on strategic growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <a href="#contact">Book a Demo</a>
                  </Button>
                  <Button size="lg" variant="outline">
                    <a href="#workflows">View Workflow Examples</a>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Workflows Section */}
        <section id="workflows" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Popular <GradientText>AI Workflows</GradientText>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Pre-built templates that can be customized to your specific business needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workflows.map((workflow, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold mb-4">{workflow.title}</h3>
                  <p className="text-muted-foreground mb-6">{workflow.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {workflow.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-primary/10 rounded-lg p-4 mb-6">
                    <div className="font-semibold text-primary">{workflow.roi}</div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    <a href="#contact">Get This Workflow</a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It <GradientText>Works</GradientText>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From consultation to deployment in just 7 days
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Discovery Call", description: "We analyze your current processes and identify automation opportunities" },
                { step: "2", title: "Workflow Design", description: "Custom AI workflows tailored to your specific business requirements" },
                { step: "3", title: "Integration Setup", description: "Connect with your existing tools and systems seamlessly" },
                { step: "4", title: "Go Live", description: "Deploy and monitor your AI workflows with full training included" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to <GradientText>Automate Your Workflows?</GradientText>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Book a free consultation to discuss your automation needs and see how we can deploy custom AI workflows for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Book a Demo
                </Button>
                <Button size="lg" variant="outline">
                  View Case Studies
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}