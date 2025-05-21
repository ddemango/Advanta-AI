import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { GradientText } from '@/components/ui/gradient-text';
import { Button } from '@/components/ui/button';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { Helmet } from 'react-helmet';
import { CaseStudy } from '@/components/ui/case-study';

type ServiceCategory = 'all' | 'custom-ai' | 'analytics' | 'automation' | 'integration';

interface CaseStudy {
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  metrics: {
    label: string;
    value: string;
    icon?: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
}

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  category: ServiceCategory;
  caseStudyLink?: string;
  caseStudy?: CaseStudy;
  primaryColor: string;
  secondaryColor: string;
}

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  
  const services: Service[] = [
    {
      id: 'custom-gpt-agents',
      title: 'Custom GPT Agents',
      description: 'AI assistants tailored to your brand voice, trained on your business data, and optimized for your specific use cases.',
      features: [
        'Personalized Knowledge Base',
        'Multi-language Support',
        'Custom Training on Private Data',
        'Voice & Tone Matching',
        'Secure Data Handling',
        'Performance Analytics Dashboard'
      ],
      icon: 'fas fa-robot',
      category: 'custom-ai',
      caseStudyLink: '/case-studies/ecommerce',
      caseStudy: {
        client: 'GlobalShop',
        industry: 'E-commerce / Retail',
        challenge: "GlobalShop was struggling with a 34% cart abandonment rate and overwhelmed customer service team handling over 12,000 inquiries per month. Their existing chatbot couldn't handle complex product questions, leading to frustrated customers and lost sales.",
        solution: "We deployed a custom GPT agent trained on GlobalShop's entire product catalog, customer service history, and brand voice guidelines. The agent could answer detailed product questions, make personalized recommendations, and handle order issues in real-time across 14 languages.",
        results: [
          'Reduced cart abandonment rate by 42% in the first quarter',
          'Automated 78% of customer inquiries, freeing up human agents',
          'Increased average order value by 23% through intelligent product recommendations',
          'Customer satisfaction scores improved from 3.2/5 to 4.7/5'
        ],
        metrics: [
          {
            label: 'ROI',
            value: '386%',
            icon: 'fas fa-chart-line'
          },
          {
            label: 'Revenue Increase',
            value: '$4.2M annually',
            icon: 'fas fa-dollar-sign'
          },
          {
            label: 'Customer Support Cost Reduction',
            value: '62%',
            icon: 'fas fa-hand-holding-usd'
          }
        ],
        testimonial: {
          quote: "The Advanta AI custom agent completely transformed our customer experience. Our customers actually prefer the AI for most questions, and our team can focus on complex cases. The ROI has been remarkable—we've seen sales growth far beyond our expectations.",
          author: "Sarah Chen",
          position: "VP of Digital Experience, GlobalShop"
        }
      },
      primaryColor: 'from-blue-500',
      secondaryColor: 'to-indigo-600'
    },
    {
      id: 'ai-workflow-automation',
      title: 'AI Workflow Automation',
      description: 'Automate repetitive tasks, data processing, and customer journeys with intelligent AI workflows.',
      features: [
        'Document Processing Automation',
        'Intelligent Form Handling',
        'Decision Support Systems',
        'Customer Journey Orchestration',
        'Process Mining & Optimization',
        'Conditional Logic Workflows'
      ],
      icon: 'fas fa-cogs',
      category: 'automation',
      caseStudyLink: '/case-studies/saas',
      caseStudy: {
        client: 'CloudSoft Solutions',
        industry: 'SaaS / Software',
        challenge: 'CloudSoft was experiencing lengthy customer onboarding times (averaging 28 days) and high error rates in their documentation processing. Their manual data verification process required 4 full-time employees and still had a 12% error rate, delaying revenue recognition.',
        solution: 'We implemented an AI-powered workflow automation system that intelligently processed client documents, validated data across systems, and orchestrated the entire onboarding journey with conditional logic based on client type and requirements.',
        results: [
          'Reduced onboarding time from 28 days to just 4 days',
          'Decreased document processing errors by 94%',
          'Automated 87% of the verification steps with human oversight for complex cases',
          'Enabled faster revenue recognition and improved cash flow'
        ],
        metrics: [
          {
            label: 'Productivity Increase',
            value: '340%',
            icon: 'fas fa-tasks'
          },
          {
            label: 'Cost Savings',
            value: '$1.8M annually',
            icon: 'fas fa-hand-holding-usd'
          },
          {
            label: 'Employee Satisfaction',
            value: '+47%',
            icon: 'fas fa-smile'
          }
        ],
        testimonial: {
          quote: "Advanta AI's workflow automation transformed our operations. What used to take a month now happens in days, and our team is freed up for high-value work instead of manual data entry. Our customers are delighted with the seamless experience, and we've been able to scale without adding headcount.",
          author: "Michael Torres",
          position: "COO, CloudSoft Solutions"
        }
      },
      primaryColor: 'from-purple-500',
      secondaryColor: 'to-pink-600'
    },
    {
      id: 'predictive-dashboards',
      title: 'Predictive Dashboards',
      description: 'Real-time analytics and forecasting dashboards powered by AI to help you make data-driven decisions.',
      features: [
        'Real-time Data Visualization',
        'Trend Prediction & Anomaly Detection',
        'Customizable KPI Tracking',
        'Multi-source Data Integration',
        'Interactive Business Intelligence',
        'Automated Reporting Systems'
      ],
      icon: 'fas fa-chart-line',
      category: 'analytics',
      caseStudyLink: '/case-studies/finance',
      caseStudy: {
        client: "CapitalWise Investments",
        industry: "Financial Services",
        challenge: "CapitalWise was struggling with outdated reporting systems that delayed critical investment decisions. Their analysis process took 3-5 days, causing them to miss market opportunities and deliver lower returns to clients. Traditional dashboards couldn't predict market trends or identify emerging risks.",
        solution: "We developed a predictive analytics dashboard that ingested data from 16 different financial sources, including market feeds, economic indicators, and proprietary datasets. The system uses AI to forecast market movements, identify investment opportunities, and alert analysts to potential risks.",
        results: [
          "Reduced analysis time from days to minutes",
          "Increased investment portfolio performance by 12.4% year-over-year",
          "Identified 28 high-opportunity investments that human analysts missed",
          "Detected early warning signs for market volatility two weeks before traditional indicators"
        ],
        metrics: [
          {
            label: "Client Retention",
            value: "97%",
            icon: "fas fa-user-check"
          },
          {
            label: "Decision Speed",
            value: "95% faster",
            icon: "fas fa-bolt"
          },
          {
            label: "ROI",
            value: "473%",
            icon: "fas fa-chart-line"
          }
        ],
        testimonial: {
          quote: "The predictive dashboard from Advanta AI has completely transformed how we make investment decisions. We can identify opportunities and risks before our competitors, giving our clients a significant edge in the market. The ROI has been exceptional.",
          author: "Elizabeth Morgan",
          position: "Chief Investment Officer, CapitalWise"
        }
      },
      primaryColor: 'from-green-500',
      secondaryColor: 'to-emerald-600'
    },
    {
      id: 'multilingual-support-bots',
      title: 'Multilingual Support Bots',
      description: 'AI assistants that communicate fluently in multiple languages to serve your global customer base.',
      features: [
        'Support for 95+ Languages',
        'Cultural Context Adaptation',
        'Speech-to-Text Capabilities',
        'Accent & Dialect Recognition',
        'Seamless Language Switching',
        'Idiom & Slang Understanding'
      ],
      icon: 'fas fa-language',
      category: 'custom-ai',
      primaryColor: 'from-amber-500',
      secondaryColor: 'to-orange-600'
    },
    {
      id: 'crm-app-integrations',
      title: 'CRM/App Integrations',
      description: 'Seamlessly connect your AI solutions with your existing CRM, marketing, and business tools.',
      features: [
        'Native Salesforce & HubSpot Integration',
        'Custom API Development',
        'Two-way Data Synchronization',
        'Workflow Trigger Management',
        'Compliance & Security Controls',
        'Cross-platform Compatibility'
      ],
      icon: 'fas fa-plug',
      category: 'integration',
      primaryColor: 'from-sky-500',
      secondaryColor: 'to-blue-600'
    },
    {
      id: 'ai-trained-on-client-data',
      title: 'AI Trained on Client Data',
      description: 'Custom AI models trained on your proprietary data for maximum relevance and effectiveness.',
      features: [
        'Secure Data Processing Pipeline',
        'Custom Model Training',
        'Proprietary Algorithm Development',
        'Iterative Performance Optimization',
        'Model Versioning & Management',
        'Ethical AI Implementation'
      ],
      icon: 'fas fa-database',
      category: 'custom-ai',
      caseStudyLink: '/case-studies/healthcare',
      caseStudy: {
        client: "MediCore Health Systems",
        industry: "Healthcare",
        challenge: "MediCore had accumulated 12+ years of patient data across their network of 8 hospitals but couldn't effectively use this information to improve patient outcomes. Traditional analytics couldn't identify complex patterns or predict patient risks accurately. They faced rising readmission rates of 18.3% and struggled with resource allocation.",
        solution: "We developed a custom AI model trained specifically on MediCore's anonymized patient data, incorporating their unique clinical workflows, physician notes, treatment protocols, and regional health factors. The model was fine-tuned to predict patient risks, recommend personalized treatment plans, and optimize resource allocation.",
        results: [
          "Reduced 30-day readmission rates by 42%",
          "Identified high-risk patients with 89% accuracy (up from 64%)",
          "Improved resource allocation, reducing average length of stay by 2.3 days",
          "Generated personalized care plans that increased treatment effectiveness by 31%"
        ],
        metrics: [
          {
            label: "Cost Savings",
            value: "$4.2M annually",
            icon: "fas fa-hand-holding-usd"
          },
          {
            label: "Patient Outcomes",
            value: "+28%",
            icon: "fas fa-heartbeat"
          },
          {
            label: "Time Saved",
            value: "1,200+ hours/month",
            icon: "fas fa-clock"
          }
        ],
        testimonial: {
          quote: "Advanta AI's custom-trained model has revolutionized how we deliver care. By leveraging our own data, the AI understands the unique characteristics of our patient population in ways generic models simply cannot. The improvement in patient outcomes speaks for itself, and the ROI has exceeded our most optimistic projections.",
          author: "Dr. Samantha Wu",
          position: "Chief Medical Officer, MediCore Health Systems"
        }
      },
      primaryColor: 'from-red-500',
      secondaryColor: 'to-pink-600'
    },
    {
      id: 'white-label-portals',
      title: 'White-Label Portals',
      description: 'Offer clients their own branded portal with analytics, bot controls, and CRM integrations.',
      features: [
        'Fully Customizable Branding',
        'Client Access Management',
        'Multi-tenant Architecture',
        'Usage & Performance Analytics',
        'Configurable Feature Sets',
        'Tiered Service Levels'
      ],
      icon: 'fas fa-copyright',
      category: 'integration',
      primaryColor: 'from-violet-500',
      secondaryColor: 'to-purple-600'
    },
    {
      id: 'autoblog-faq-generator',
      title: 'AutoBlog + FAQ Generator',
      description: 'AI-powered content generation for blogs, FAQs, and help documentation based on your business data.',
      features: [
        'SEO-optimized Content Creation',
        'Topic & Keyword Research',
        'Scheduled Publishing',
        'Content Style Adaptation',
        'Multimedia Content Suggestions',
        'Multilingual Content Generation'
      ],
      icon: 'fas fa-brain',
      category: 'automation',
      primaryColor: 'from-blue-500',
      secondaryColor: 'to-cyan-600'
    },
    {
      id: 'ai-lead-scoring',
      title: 'AI Lead Scoring & Qualification',
      description: 'Intelligent prioritization of sales leads based on AI-analyzed likelihood to convert.',
      features: [
        'Behavioral Pattern Analysis',
        'Engagement Scoring Algorithm',
        'Custom Qualification Criteria',
        'Pipeline Velocity Optimization',
        'Real-time Lead Reassignment',
        'Conversion Probability Prediction'
      ],
      icon: 'fas fa-user-check',
      category: 'analytics',
      primaryColor: 'from-green-500',
      secondaryColor: 'to-teal-600'
    },
    {
      id: 'sentiment-analysis',
      title: 'Sentiment Analysis Engine',
      description: 'Advanced AI that monitors customer feedback, reviews, and communications to detect sentiment trends.',
      features: [
        'Multilingual Sentiment Detection',
        'Emotion Classification',
        'Topic & Entity Extraction',
        'Trend Analysis Dashboard',
        'Real-time Alert System',
        'Competitive Benchmark Comparison'
      ],
      icon: 'fas fa-smile',
      category: 'analytics',
      primaryColor: 'from-yellow-500',
      secondaryColor: 'to-amber-600'
    },
    {
      id: 'ai-product-recommendation',
      title: 'AI Product Recommendation',
      description: 'Personalized product suggestions that adapt to user behavior and preferences in real-time.',
      features: [
        'Behavioral Analytics Engine',
        'Cross-selling Optimization',
        'Visual Similarity Matching',
        'Seasonal Trend Adaptation',
        'Inventory-aware Recommendations',
        'A/B Testing Framework'
      ],
      icon: 'fas fa-gift',
      category: 'custom-ai',
      caseStudyLink: '/case-studies/retail',
      caseStudy: {
        client: "LuxeStyle Brands",
        industry: "Retail / E-commerce",
        challenge: "LuxeStyle was facing declining conversion rates (2.1%) and stagnant average order values ($42). Their generic product recommendation system showed the same items to all users regardless of browsing history, preferences, or purchase patterns, resulting in poor engagement and missed sales opportunities.",
        solution: "We implemented an AI-powered product recommendation engine that analyzes customer behavior in real-time, evaluates purchase history, identifies visual similarities between products, and adapts to seasonal trends. The system also integrates with their inventory management to prioritize in-stock items and implements an A/B testing framework to continuously optimize recommendations.",
        results: [
          "Increased conversion rate from 2.1% to 4.8% within 3 months",
          "Improved average order value by 37% ($42 to $57.50)",
          "Boosted repeat purchase rate by 42%",
          "Reduced inventory holding costs by 21% through smarter recommendation of slow-moving items"
        ],
        metrics: [
          {
            label: "Revenue Growth",
            value: "+31% YoY",
            icon: "fas fa-chart-line"
          },
          {
            label: "Cross-sell Rate",
            value: "48% increase",
            icon: "fas fa-shopping-cart"
          },
          {
            label: "ROI",
            value: "529%",
            icon: "fas fa-dollar-sign"
          }
        ],
        testimonial: {
          quote: "The AI recommendation engine from Advanta AI completely transformed our online shopping experience. Our customers now discover products they love but might never have found on their own. The system pays for itself many times over, and we've seen both immediate sales growth and stronger long-term customer loyalty.",
          author: "Marcus Johnson",
          position: "Director of E-commerce, LuxeStyle Brands"
        }
      },
      primaryColor: 'from-red-500',
      secondaryColor: 'to-rose-600'
    },
    {
      id: 'predictive-maintenance',
      title: 'Predictive Maintenance AI',
      description: 'AI systems that predict equipment failures before they happen, reducing downtime and maintenance costs.',
      features: [
        'IoT Sensor Data Integration',
        'Failure Pattern Recognition',
        'Maintenance Schedule Optimization',
        'Cost Savings Calculator',
        'Remote Monitoring Interface',
        'Asset Lifetime Prediction'
      ],
      icon: 'fas fa-tools',
      category: 'analytics',
      primaryColor: 'from-blue-500',
      secondaryColor: 'to-sky-600'
    }
  ];
  
  const categories = [
    { id: 'all', name: 'All Services', icon: 'fas fa-th-large' },
    { id: 'custom-ai', name: 'Custom AI', icon: 'fas fa-robot' },
    { id: 'analytics', name: 'Analytics & Intelligence', icon: 'fas fa-chart-line' },
    { id: 'automation', name: 'Automation', icon: 'fas fa-cogs' },
    { id: 'integration', name: 'Integration & Portals', icon: 'fas fa-plug' }
  ];
  
  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>AI Services & Solutions | Advanta AI</title>
        <meta name="description" content="Explore our comprehensive suite of AI solutions including custom GPT agents, predictive analytics, workflow automation, and system integrations." />
        <meta name="keywords" content="AI services, custom GPT, analytics, predictive dashboards, AI automation, machine learning solutions" />
        <meta property="og:title" content="AI Services & Solutions | Advanta AI" />
        <meta property="og:description" content="Explore our comprehensive suite of AI solutions including custom GPT agents, predictive analytics, workflow automation, and system integrations." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 bg-[length:40px_40px] opacity-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="text-center mb-12"
            >
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Our Enterprise <GradientText>AI Solutions</GradientText>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Transformative intelligence that delivers measurable business outcomes through our suite of specialized AI services.
              </motion.p>
            </motion.div>
            
            {/* Category Navigation */}
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center gap-6 mb-20"
            >
              <h3 className="text-xl text-gray-200 mb-3">Select a service category to explore:</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? 'default' : 'outline'}
                    className={`text-sm font-medium py-6 px-6 rounded-lg transition-all duration-300 ${
                      activeCategory === category.id 
                        ? 'bg-primary text-white scale-105 shadow-lg shadow-primary/20' 
                        : 'hover:border-primary/50 hover:bg-primary/5'
                    }`}
                    onClick={() => setActiveCategory(category.id as ServiceCategory)}
                  >
                    <i className={`${category.icon} text-lg mr-3`}></i>
                    {category.name}
                  </Button>
                ))}
              </div>
              <div className="mt-3 text-center text-muted-foreground text-sm">
                {activeCategory !== 'all' && (
                  <p>Showing {filteredServices.length} services in {categories.find(c => c.id === activeCategory)?.name}</p>
                )}
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Services Listing */}
        <section className="py-16 bg-muted relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredServices.map((service, index) => (
                <motion.div 
                  key={service.id}
                  variants={fadeIn}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <div className="bg-background rounded-xl overflow-hidden border border-white/10 h-full flex flex-col">
                    <div className={`bg-gradient-to-r ${service.primaryColor} ${service.secondaryColor} p-5`}>
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-xl">
                        <i className={service.icon}></i>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-grow">
                      <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                      <p className="text-gray-400 mb-4">{service.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          {service.features.slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span className="text-sm text-gray-400">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="p-6 pt-0 mt-auto">
                      <Link href={`/service/${service.id}`}>
                        <Button variant="outline" className="w-full">
                          Learn More
                          <i className="fas fa-arrow-right ml-2"></i>
                        </Button>
                      </Link>
                      
                      {service.caseStudyLink && (
                        <div className="mt-3 text-center">
                          <Link href={service.caseStudyLink} className="text-xs text-primary hover:underline">
                            View Case Study
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Implementation Process */}
        <section className="py-20 bg-black/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 bg-[length:40px_40px] opacity-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
                Enterprise-Grade <GradientText>Implementation Process</GradientText>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our systematic approach ensures rapid deployment with minimal disruption to your operations.
              </motion.p>
            </motion.div>
            
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {[
                {
                  number: '1',
                  title: 'Strategic AI Discovery Session',
                  description: 'Our AI architects analyze your business processes to identify high-ROI automation opportunities and competitive advantages.',
                  icon: 'fa-solid fa-lightbulb'
                },
                {
                  number: '2',
                  title: 'Proprietary Algorithm Implementation',
                  description: 'We deploy our enterprise-grade algorithms trained on your specific industry data for maximum accuracy and performance.',
                  icon: 'fa-solid fa-code'
                },
                {
                  number: '3',
                  title: 'Accelerated Market Deployment',
                  description: 'Launch within 14 days with real-time analytics dashboard monitoring performance, ROI metrics, and competitive intelligence.',
                  icon: 'fa-solid fa-rocket'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="relative"
                >
                  <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-8 h-full">
                    {/* Step number */}
                    <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xl font-bold">{step.number}</span>
                    </div>
                    
                    {/* Connector line */}
                    {index < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-primary/40 z-0">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                    )}
                    
                    <div className="mb-4 text-3xl text-primary mt-4">
                      <i className={step.icon}></i>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Business with <GradientText>Enterprise AI</GradientText>?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8">
                Schedule a consultation with our AI specialists to explore how our services can be tailored to your specific needs.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/calculator">Build Custom AI Stack</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}