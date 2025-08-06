import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Play,
  Building2,
  Heart,
  Home,
  UtensilsCrossed,
  DollarSign,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: any;
  link: string;
  detailedInfo: {
    whatItDoes: string;
    industries: IndustryApplication[];
  };
}

interface IndustryApplication {
  industry: string;
  icon: any;
  description: string;
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
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [expandedIndustry, setExpandedIndustry] = useState<string | null>(null);

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
      id: 'ai-workflow-automation',
      title: 'AI Workflow Automation',
      description: 'Automate daily tasks across departments using AI-powered workflows. Free your team from manual work.',
      icon: Workflow,
      link: '/workflow-automation',
      detailedInfo: {
        whatItDoes: "Automates repetitive tasks, reduces manual data entry, and streamlines operations.",
        industries: [
          {
            industry: "E-commerce",
            icon: Building2,
            description: "Automate order tracking, inventory updates, and abandoned cart follow-ups."
          },
          {
            industry: "Healthcare", 
            icon: Heart,
            description: "Auto-schedule appointments, process patient forms, and send reminders."
          },
          {
            industry: "Real Estate",
            icon: Home,
            description: "Generate property listings from MLS data, automate client follow-up emails."
          },
          {
            industry: "Hospitality",
            icon: UtensilsCrossed,
            description: "Automate booking confirmations, guest check-in instructions, and upsell campaigns."
          },
          {
            industry: "Finance",
            icon: DollarSign,
            description: "Reconcile transactions, auto-generate expense reports, and trigger compliance alerts."
          }
        ]
      }
    },
    {
      id: 'api-integrations',
      title: 'Custom API & ChatGPT Integrations',
      description: 'Embed AI assistants, chatbots, and automation tools directly into your website or business systems. Smarter websites and systems.',
      icon: Brain,
      link: '/build-my-ai-stack',
      detailedInfo: {
        whatItDoes: "Embeds AI-driven assistants and connects business tools into one seamless system.",
        industries: [
          {
            industry: "E-commerce",
            icon: Building2,
            description: "Integrate AI chatbots with Shopify or BigCommerce to answer product questions in real-time."
          },
          {
            industry: "Healthcare", 
            icon: Heart,
            description: "Link AI to EMR systems for instant patient record retrieval or symptom triage."
          },
          {
            industry: "Real Estate",
            icon: Home,
            description: "AI property search assistants embedded on websites that respond to buyer criteria."
          },
          {
            industry: "Hospitality",
            icon: UtensilsCrossed,
            description: "Connect AI to booking engines to upsell rooms or provide 24/7 guest support."
          },
          {
            industry: "Finance",
            icon: DollarSign,
            description: "Integrate AI into CRM or accounting tools to provide instant financial summaries or forecast reports."
          }
        ]
      }
    },
    {
      id: 'customer-interactions',
      title: 'AI-Powered Customer Interactions',
      description: 'Transform your website into an interactive experience where customers can chat, book, and get answers instantly. 24/7 automated engagement.',
      icon: Bot,
      link: '/customer-interactions',
      detailedInfo: {
        whatItDoes: "Turns websites into interactive, AI-driven customer service and sales hubs.",
        industries: [
          {
            industry: "E-commerce",
            icon: Building2,
            description: "Real-time product Q&A bots that help shoppers choose the right item."
          },
          {
            industry: "Healthcare", 
            icon: Heart,
            description: "Virtual intake assistants that collect patient info before their visit."
          },
          {
            industry: "Real Estate",
            icon: Home,
            description: "Chat-based virtual tours or scheduling for property showings."
          },
          {
            industry: "Hospitality",
            icon: UtensilsCrossed,
            description: "AI concierge bots to recommend dining, activities, or loyalty perks."
          },
          {
            industry: "Finance",
            icon: DollarSign,
            description: "AI-guided financial planning tools that suggest budgeting or investment steps."
          }
        ]
      }
    },
    {
      id: 'data-optimization',
      title: 'Data-Driven Optimization',
      description: 'Continuously improve workflows with analytics and machine learning feedback loops.',
      icon: BarChart3,
      link: '/data-optimization',
      detailedInfo: {
        whatItDoes: "Uses analytics and machine learning feedback loops to improve results over time.",
        industries: [
          {
            industry: "E-commerce",
            icon: Building2,
            description: "Identify best-performing campaigns and automatically scale them."
          },
          {
            industry: "Healthcare", 
            icon: Heart,
            description: "Track patient follow-up rates and optimize scheduling for fewer no-shows."
          },
          {
            industry: "Real Estate",
            icon: Home,
            description: "Analyze lead sources to focus on high-converting marketing channels."
          },
          {
            industry: "Hospitality",
            icon: UtensilsCrossed,
            description: "Optimize booking funnel performance and monitor guest satisfaction trends."
          },
          {
            industry: "Finance",
            icon: DollarSign,
            description: "Provide predictive cash flow and profitability forecasts for smarter planning."
          }
        ]
      }
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
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Core Capabilities
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-4">
                  <strong>Advanta AI is an AI-driven automation and workflow integration agency</strong> designed to help businesses streamline operations, eliminate repetitive tasks, and provide seamless ways for customers to interact with companies using AI.
                </p>
                <p className="text-xl text-gray-600 leading-relaxed">
                  We specialize in combining APIs, ChatGPT, and intelligent automation tools to build smarter, more connected websites and workflows that scale with your business.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Core Capabilities with Industry Applications */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              {services.map((service, serviceIndex) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: serviceIndex * 0.2 }}
                  className="bg-gray-50 rounded-3xl p-8 md:p-12"
                >
                  {/* Service Header */}
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{service.title}</h2>
                      <p className="text-xl text-gray-600 leading-relaxed mb-2">{service.detailedInfo.whatItDoes}</p>
                      <p className="text-lg text-gray-500 leading-relaxed">{service.description}</p>
                    </div>
                  </div>

                  {/* Industry Applications */}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-8">Industry Applications</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {service.detailedInfo.industries.map((industry, index) => (
                        <motion.div
                          key={industry.industry}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: (serviceIndex * 0.1) + (index * 0.05) }}
                          className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <industry.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900 mb-3">{industry.industry}</h4>
                              <p className="text-gray-600 leading-relaxed">{industry.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Service CTA */}
                  <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => setLocation('/demo')}
                      size="lg"
                      className="px-8 py-3 text-lg font-semibold"
                    >
                      Book a Demo
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button
                      onClick={() => setLocation('/contact')}
                      variant="outline"
                      size="lg"
                      className="px-8 py-3 text-lg font-semibold"
                    >
                      Get Started
                    </Button>
                  </div>
                </motion.div>
              ))}
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