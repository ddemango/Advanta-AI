import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { GradientText } from '@/components/ui/gradient-text';
import { Helmet } from 'react-helmet';

export default function WebsiteAIAssistants() {
  const assistantTypes = [
    {
      title: "Customer Support Chatbot",
      description: "24/7 intelligent customer service that handles inquiries, processes returns, and escalates complex issues.",
      features: ["Natural language processing", "Knowledge base integration", "Multi-language support", "Human handoff protocols"],
      pricing: "Starting at $297/month"
    },
    {
      title: "Sales Assistant",
      description: "Qualify leads, schedule demos, and guide prospects through your sales funnel with personalized recommendations.",
      features: ["Lead qualification", "Product recommendations", "Demo scheduling", "CRM integration"],
      pricing: "Starting at $497/month"
    },
    {
      title: "Technical Support Bot",
      description: "Handle technical troubleshooting, software setup guidance, and FAQ responses for complex products.",
      features: ["Step-by-step guidance", "Screen sharing integration", "Ticket creation", "Documentation search"],
      pricing: "Starting at $397/month"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Website AI Assistants - Advanta AI</title>
        <meta name="description" content="Deploy intelligent AI chatbots and virtual assistants on your website. 24/7 customer support, lead qualification, and sales assistance." />
        <meta name="keywords" content="AI chatbot, website assistant, customer support bot, sales assistant, virtual assistant" />
        <meta property="og:title" content="Website AI Assistants - Advanta AI" />
        <meta property="og:description" content="Deploy intelligent AI chatbots and virtual assistants on your website for 24/7 customer support and lead qualification." />
        <meta property="og:type" content="website" />
      </Helmet>

      <NewHeader />

      <main className="pt-28">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-6 text-blue-600 border-blue-600/50">
                  Website AI Assistants
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <GradientText>Intelligent Virtual Assistants</GradientText> for Your Website
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Transform your website visitors into customers with AI assistants that provide instant support, qualify leads, and guide prospects through your sales process 24/7.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <a href="#contact">Get My Assistant</a>
                  </Button>
                  <Button size="lg" variant="outline">
                    <a href="#demo">See Live Demo</a>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Assistant Types Section */}
        <section id="assistants" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Choose Your <GradientText>AI Assistant Type</GradientText>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Specialized assistants designed for different business functions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {assistantTypes.map((assistant, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold mb-4">{assistant.title}</h3>
                  <p className="text-muted-foreground mb-6">{assistant.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {assistant.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-primary/10 rounded-lg p-4 mb-6">
                    <div className="font-semibold text-primary">{assistant.pricing}</div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    <a href="#contact">Get Started</a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
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
                Advanced <GradientText>AI Capabilities</GradientText>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Powered by state-of-the-art AI technology with enterprise-grade security
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: "🧠", title: "Natural Language Understanding", description: "Comprehends context and intent like a human agent" },
                { icon: "🔗", title: "System Integration", description: "Connects with your CRM, help desk, and business tools" },
                { icon: "🎨", title: "Brand Customization", description: "Matches your brand voice, tone, and visual identity" },
                { icon: "📊", title: "Analytics Dashboard", description: "Track conversations, conversions, and performance metrics" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center bg-background rounded-xl p-6 border border-border"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See It In <GradientText>Action</GradientText>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Try our demo assistant and experience the difference intelligent AI can make
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-border"
              >
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-4xl">🤖</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Interactive Demo Assistant</h3>
                  <p className="text-muted-foreground mb-8">
                    Click below to start a conversation with our demo assistant and see how it handles common customer inquiries.
                  </p>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Start Demo Conversation
                  </Button>
                </div>
              </motion.div>
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
                Ready to Deploy Your <GradientText>AI Assistant?</GradientText>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get a custom AI assistant designed for your business needs. Setup takes less than 7 days with full training included.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Book Consultation
                </Button>
                <Button size="lg" variant="outline">
                  View Pricing
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