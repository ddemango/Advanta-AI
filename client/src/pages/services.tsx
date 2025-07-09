import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NewHeader } from '@/components/redesign/NewHeader';
import { NewFooter } from '@/components/redesign/NewFooter';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { 
  Bot, 
  Brain, 
  BarChart3, 
  Workflow, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Quote,
  Star,
  Play
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: any;
  link: string;
}

interface Benefit {
  text: string;
  icon: any;
}

interface IndustryCase {
  industry: string;
  title: string;
  description: string;
  stat: string;
}

interface Testimonial {
  quote: string;
  author: string;
  company: string;
  rating: number;
}

export default function ServicesPage() {
  const [, setLocation] = useLocation();
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // Handle sticky CTA bar visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setShowStickyCTA(scrollPercentage > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services: Service[] = [
    {
      id: 'ai-assistants',
      title: 'AI Assistants',
      description: 'Custom GPT agents that understand your business and handle customer support, sales, and operations 24/7.',
      icon: Bot,
      link: '/custom-gpt-generator'
    },
    {
      id: 'gpt-apps',
      title: 'GPT Apps',
      description: 'Specialized AI applications for content creation, data analysis, and workflow automation.',
      icon: Brain,
      link: '/build-my-ai-stack'
    },
    {
      id: 'marketing-tools',
      title: 'Marketing Tools',
      description: 'AI-powered content generation, campaign optimization, and customer insight tools.',
      icon: BarChart3,
      link: '/marketing-copy-generator'
    },
    {
      id: 'workflow-automation',
      title: 'Workflow Automation',
      description: 'Intelligent process automation that learns and adapts to your business needs.',
      icon: Workflow,
      link: '/automation-builder'
    },
    {
      id: 'analytics-insights',
      title: 'Analytics & Insights',
      description: 'Real-time business intelligence and predictive analytics powered by AI.',
      icon: Zap,
      link: '/roi-calculator'
    }
  ];

  const benefits: Benefit[] = [
    { text: 'Deploy in days, not months', icon: CheckCircle },
    { text: 'No-code workflows anyone can manage', icon: CheckCircle },
    { text: 'Reduce workload by 30–50%', icon: CheckCircle },
    { text: 'Trusted by 500+ teams', icon: CheckCircle }
  ];

  const industryCases: IndustryCase[] = [
    {
      industry: 'Retail',
      title: 'Customer Support Revolution',
      description: 'AI assistants handling product inquiries and order management across multiple channels.',
      stat: 'Saved 10+ hours/week'
    },
    {
      industry: 'Healthcare',
      title: 'Patient Experience Enhancement',
      description: 'Automated appointment scheduling and patient communication systems.',
      stat: 'Reduced support tickets 35%'
    },
    {
      industry: 'Agencies',
      title: 'Creative Workflow Optimization',
      description: 'AI-powered content creation and client management automation.',
      stat: 'Increased productivity 40%'
    }
  ];

  const testimonials: Testimonial[] = [
    {
      quote: "Advanta AI transformed our customer service. Response times dropped from hours to seconds, and our team can focus on complex issues.",
      author: "Sarah Chen",
      company: "TechFlow Solutions",
      rating: 5
    },
    {
      quote: "The AI automation tools saved us 15 hours per week on repetitive tasks. ROI was clear within the first month.",
      author: "Marcus Rodriguez",
      company: "Digital Dynamics",
      rating: 5
    }
  ];

  const trustedLogos = [
    { name: 'TechFlow', width: 'w-24' },
    { name: 'InnovateCorp', width: 'w-28' },
    { name: 'FutureWorks', width: 'w-26' },
    { name: 'NextGen', width: 'w-22' },
    { name: 'CloudFirst', width: 'w-25' }
  ];

  return (
    <>
      <Helmet>
        <title>Custom AI Solutions That Scale With You | Advanta AI</title>
        <meta name="description" content="Explore automation tools, GPT apps, and analytics designed to simplify your workflow and accelerate growth. Deploy in days, not months." />
        <meta name="keywords" content="AI solutions, custom GPT, automation tools, AI assistants, workflow automation, business AI" />
        
        <meta property="og:title" content="Custom AI Solutions That Scale With You | Advanta AI" />
        <meta property="og:description" content="Explore automation tools, GPT apps, and analytics designed to simplify your workflow and accelerate growth." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <NewHeader />
        
        <main>
          {/* Header Section */}
          <section className="pt-20 pb-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Custom AI Solutions That{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Scale With You
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Explore automation tools, GPT apps, and analytics designed to simplify your workflow and accelerate growth
                </p>
              </motion.div>
            </div>
          </section>

          {/* Services Cards Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Mobile: Horizontal Scroll */}
              <div className="block lg:hidden">
                <div className="flex space-x-6 overflow-x-auto pb-6 snap-x snap-mandatory">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex-none w-80 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 snap-start"
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <service.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                      <Button
                        onClick={() => setLocation(service.link)}
                        variant="outline"
                        className="w-full group"
                      >
                        Learn more
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Desktop: Grid Layout */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                      <service.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    <Button
                      onClick={() => setLocation(service.link)}
                      variant="outline"
                      className="group"
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Why Businesses Choose Advanta AI
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Industry Use Cases */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Proven Results Across Industries
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {industryCases.map((caseItem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{caseItem.industry}</h3>
                    <h4 className="text-lg font-semibold text-blue-600 mb-4">{caseItem.title}</h4>
                    <p className="text-gray-600 mb-6 leading-relaxed">{caseItem.description}</p>
                    <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                      {caseItem.stat}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials & Trust */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Testimonials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white rounded-2xl p-8 shadow-lg"
                  >
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-blue-200 mb-4" />
                    <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-gray-600">{testimonial.company}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trust Logos */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-8">Trusted by teams at…</h3>
                <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                  {trustedLogos.map((logo, index) => (
                    <div key={index} className={`${logo.width} h-8 bg-gray-300 rounded`}>
                      {/* Placeholder for actual logos */}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-white"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Build Smarter?</h2>
                <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                  Let's design your custom GPT or automation system—tailored to your business goals
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    onClick={() => setLocation('/build-my-ai-stack')}
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                  >
                    Get Started
                  </Button>
                  <Button
                    onClick={() => setLocation('/demo')}
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Book Demo
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Sticky CTA Bar (Mobile Only) */}
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="lg:hidden fixed bottom-20 left-4 right-4 z-40"
          >
            <div className="bg-blue-600 text-white rounded-xl p-4 shadow-lg">
              <Button
                onClick={() => setLocation('/demo')}
                className="w-full bg-white text-blue-600 hover:bg-gray-100"
              >
                Want to see it live? Book a 15‑min demo →
              </Button>
            </div>
          </motion.div>
        )}

        <NewFooter />
      </div>
    </>
  );
}