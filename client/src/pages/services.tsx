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
      description: 'Replaces repetitive tasks with automated flows, reduces human error, saves time.',
      icon: Workflow,
      link: '/workflow-automation',
      detailedInfo: {
        whatItDoes: "Replaces repetitive tasks with automated flows, reduces human error, saves time.",
        industries: [
          {
            industry: "E-commerce",
            icon: Building2,
            description: "Automates abandoned cart emails, shipping updates, and product tagging."
          },
          {
            industry: "Healthcare", 
            icon: Heart,
            description: "Auto-schedules appointments, sends reminders, and follows up with post-visit instructions."
          },
          {
            industry: "Real Estate",
            icon: Home,
            description: "Sends lead nurture emails, follows up after showings, automates listing input."
          },
          {
            industry: "Finance & Accounting",
            icon: DollarSign,
            description: "Auto-generates invoices, reconciles transactions, flags anomalies."
          },
          {
            industry: "Hospitality",
            icon: UtensilsCrossed,
            description: "Handles guest check-ins, upsells room add-ons, automates concierge responses."
          },
          {
            industry: "Marketing Agencies",
            icon: Building2,
            description: "Automates campaign reporting, client updates, and performance alerts."
          },
          {
            industry: "Legal Services",
            icon: Building2,
            description: "Automates document intake, reminders for court dates or filings."
          },
          {
            industry: "Education & eLearning",
            icon: Building2,
            description: "Sends enrollment confirmations, follow-up lessons, and certificate issuance."
          },
          {
            industry: "Construction",
            icon: Building2,
            description: "Automates bid submissions, change order tracking, and project timelines."
          },
          {
            industry: "SaaS Companies",
            icon: Building2,
            description: "Onboards users with automated walkthroughs, sends renewal alerts."
          },
          {
            industry: "Recruitment/HR",
            icon: Building2,
            description: "Schedules interviews, sends onboarding paperwork, updates candidate status."
          },
          {
            industry: "Insurance",
            icon: Building2,
            description: "Automates claims intake, document requests, and status updates."
          },
          {
            industry: "Retail (In-store + Online)",
            icon: Building2,
            description: "Manages stock alerts, loyalty programs, and order confirmations."
          },
          {
            industry: "Nonprofits",
            icon: Building2,
            description: "Automates donor acknowledgments, event invites, and grant tracking."
          },
          {
            industry: "Travel Agencies",
            icon: Building2,
            description: "Automates itineraries, visa reminders, and upsell of excursions or upgrades."
          }
        ]
      }
    },
    {
      id: 'api-integrations',
      title: 'Custom API & ChatGPT Integrations',
      description: 'Connects your backend tools and websites to ChatGPT and other AI models to provide smart, interactive capabilities.',
      icon: Brain,
      link: '/build-my-ai-stack',
      detailedInfo: {
        whatItDoes: "Connects your backend tools and websites to ChatGPT and other AI models to provide smart, interactive capabilities.",
        industries: [
          {
            industry: "E-commerce",
            icon: Building2,
            description: "ChatGPT product assistant, order lookup via API integration, upsell recommendations."
          },
          {
            industry: "Healthcare", 
            icon: Heart,
            description: "Virtual assistant for symptom triage, integrated with EMRs to access schedules."
          },
          {
            industry: "Finance",
            icon: DollarSign,
            description: "Personal finance advisor bot connected to bank feeds or QuickBooks APIs."
          },
          {
            industry: "Real Estate",
            icon: Home,
            description: "Smart lead qualifier that integrates with MLS data and CRM tools."
          },
          {
            industry: "Hospitality",
            icon: UtensilsCrossed,
            description: "24/7 guest support chatbot integrated with booking platforms like Booking.com or Cloudbeds."
          },
          {
            industry: "Education",
            icon: Building2,
            description: "AI tutor or chatbot that answers curriculum-related questions and checks homework."
          },
          {
            industry: "SaaS",
            icon: Building2,
            description: "In-app support bots connected to ticketing systems like Zendesk or Intercom."
          },
          {
            industry: "Insurance",
            icon: Building2,
            description: "AI that checks policy status, coverage options, or claim progress through CRM APIs."
          }
        ]
      }
    },
    {
      id: 'industry-ai-learning',
      title: 'Industry-Specific AI Learning',
      description: 'Our AI adapts to your industry, learning from your unique processes for better results.',
      icon: Zap,
      link: '/industry-ai-learning',
      detailedInfo: {
        whatItDoes: "AI models are fine-tuned on your processes, terms, workflows, and customer scenarios—so they speak your industry language.",
        industries: [
          {
            industry: "Healthcare",
            icon: Heart,
            description: "Learns HIPAA-compliant protocols, diagnosis terms, and insurance codes."
          },
          {
            industry: "Real Estate",
            icon: Home,
            description: "Adapts to neighborhood nuances, property types, and buyer behavior."
          },
          {
            industry: "Marketing Agencies",
            icon: Building2,
            description: "Understands campaign types, funnel stages, and performance metrics."
          },
          {
            industry: "Legal",
            icon: Building2,
            description: "Learns legal terminology, case types, and document workflows."
          },
          {
            industry: "Finance",
            icon: DollarSign,
            description: "Adapts to accounting workflows, reporting standards, and tax codes."
          },
          {
            industry: "Education",
            icon: Building2,
            description: "Learns course content, student behavior patterns, and progress metrics."
          }
        ]
      }
    },
    {
      id: 'customer-interactions',
      title: 'AI-Powered Customer Interactions',
      description: 'Transforms your website into an interactive assistant—available 24/7 to answer questions, book services, and guide users.',
      icon: Bot,
      link: '/customer-interactions',
      detailedInfo: {
        whatItDoes: "Transforms your website into an interactive assistant—available 24/7 to answer questions, book services, and guide users.",
        industries: [
          {
            industry: "E-commerce",
            icon: Building2,
            description: "AI chats for sizing help, restock notifications, and order status updates."
          },
          {
            industry: "Hospitality",
            icon: UtensilsCrossed,
            description: "Guests can ask for late checkout, restaurant recs, or book spa services."
          },
          {
            industry: "Real Estate",
            icon: Home,
            description: "Leads can book showings, ask neighborhood Qs, and receive dynamic property suggestions."
          },
          {
            industry: "Education",
            icon: Building2,
            description: "Prospective students can ask about courses, tuition, and register instantly."
          },
          {
            industry: "Finance",
            icon: DollarSign,
            description: "Visitors can ask for budgeting tips, investment insights, or tax prep info."
          },
          {
            industry: "Healthcare",
            icon: Heart,
            description: "Patients can check symptoms, reschedule visits, or request refills."
          }
        ]
      }
    },
    {
      id: 'data-optimization',
      title: 'Data-Driven Optimization',
      description: 'Tracks user interactions and automations, identifies trends, and helps improve workflows using feedback loops.',
      icon: BarChart3,
      link: '/data-optimization',
      detailedInfo: {
        whatItDoes: "Tracks user interactions and automations, identifies trends, and helps improve workflows using feedback loops.",
        industries: [
          {
            industry: "E-commerce",
            icon: Building2,
            description: "Tracks product views vs conversions to suggest better product placement."
          },
          {
            industry: "Healthcare", 
            icon: Heart,
            description: "Tracks no-show rates, treatment completion, and optimizes reminder timing."
          },
          {
            industry: "Marketing",
            icon: Building2,
            description: "Monitors ad performance by platform and shifts budget in real time."
          },
          {
            industry: "SaaS",
            icon: Building2,
            description: "Tracks feature usage to prioritize development."
          },
          {
            industry: "Retail",
            icon: Building2,
            description: "Uses sales patterns to predict inventory needs."
          },
          {
            industry: "Finance",
            icon: DollarSign,
            description: "Analyzes revenue trends and automates financial insights."
          }
        ]
      }
    },
    {
      id: 'free-ai-resources',
      title: 'Free AI Resources & Tools',
      description: 'Access templates, playbooks, and resources to start automating today.',
      icon: CheckCircle,
      link: '/free-resources',
      detailedInfo: {
        whatItDoes: "Access templates, playbooks, and resources to start automating today.",
        industries: [
          {
            industry: "All Industries",
            icon: Building2,
            description: "Get started with free automation templates, step-by-step playbooks, and resource guides tailored to your business needs."
          },
          {
            industry: "Small Business",
            icon: Building2,
            description: "Free tools and templates for email automation, customer onboarding, and basic workflow setup."
          },
          {
            industry: "Startups",
            icon: Building2,
            description: "Resource library with growth automation playbooks, customer acquisition workflows, and scaling guides."
          },
          {
            industry: "Enterprises",
            icon: Building2,
            description: "Advanced automation frameworks, integration guides, and best practices for large-scale deployment."
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