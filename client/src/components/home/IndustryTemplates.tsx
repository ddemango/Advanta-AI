import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GradientText } from '@/components/ui/gradient-text';
import { GlassCard } from '@/components/ui/glass-card';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { ArrowRight, Check, Star } from 'lucide-react';

// Detailed industry templates with expanded information
const industryTemplates = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: 'fa-solid fa-house',
    color: 'from-blue-500 to-sky-700',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    features: [
      'Property listing chatbot with virtual tours integration',
      'AI-powered lead qualification with 24/7 response',
      'Personalized property recommendations based on buyer preferences',
      'Automated market analysis reports with pricing predictions',
      'Smart document processing for faster transactions'
    ],
    metrics: [
      { label: 'Lead Response Time', value: '< 1 minute' },
      { label: 'Conversion Rate Increase', value: '32%' },
      { label: 'Agent Hours Saved', value: '15-20 hrs/week' }
    ],
    useCases: [
      {
        title: 'Automated Property Matching',
        description: 'AI analyzes client preferences and matches them with available properties, considering factors beyond basic search criteria.'
      },
      {
        title: '24/7 Inquiry Handling',
        description: 'Virtual assistants answer detailed questions about properties, neighborhoods, and pricing at any time of day.'
      }
    ],
    testimonial: {
      quote: "The AI assistant helped us respond to leads 24/7 and increased our conversion rate by 38%. Our agents now focus on closing deals instead of answering basic questions.",
      author: "Jessica Miller",
      company: "ReMax Premier Properties"
    },
    description: 'AI assistants that help real estate professionals qualify leads, answer property questions, and schedule viewings 24/7 while providing detailed market insights and personalized recommendations.'
  },
  {
    id: 'med-spas',
    name: 'Med Spas',
    icon: 'fa-solid fa-spa',
    color: 'from-purple-500 to-pink-600',
    badgeColor: 'bg-purple-500/20 text-purple-400',
    features: [
      'AI-driven treatment recommendation engine based on skin analysis',
      'Intelligent appointment scheduling with capacity optimization',
      'Automated post-treatment follow-ups with personalized care tips',
      'Customized skincare regimen planning with product recommendations',
      'Patient retention workflows with timed promotions'
    ],
    metrics: [
      { label: 'Booking Increase', value: '46%' },
      { label: 'Patient Retention', value: '27% higher' },
      { label: 'Treatment Upgrades', value: '35% increase' }
    ],
    useCases: [
      {
        title: 'Personalized Treatment Planning',
        description: 'AI analyzes patient history, skin type, and concerns to recommend optimal treatment sequences and products.'
      },
      {
        title: 'Intelligent Follow-up System',
        description: 'Automated follow-ups that adapt based on treatment type, patient response, and results tracking.'
      }
    ],
    testimonial: {
      quote: "Our AI assistant helped us create personalized treatment plans that increased our patient satisfaction scores to 4.9/5. The automated follow-ups have been a game-changer for retention.",
      author: "Dr. Amanda Chen",
      company: "Radiance Med Spa"
    },
    description: 'Intelligent virtual assistants that help med spas automate consultations, treatment recommendations, follow-ups, and create personalized skincare regimens based on individual patient needs and goals.'
  },
  {
    id: 'agencies',
    name: 'Agencies',
    icon: 'fa-solid fa-people-group',
    color: 'from-orange-500 to-amber-600',
    badgeColor: 'bg-orange-500/20 text-orange-400',
    features: [
      'Streamlined client onboarding with automated data collection',
      'Real-time project status updates with predictive timeline alerts',
      'AI-powered resource allocation based on team capacity and skills',
      'Content idea generation with trend analysis and performance prediction',
      'Automated reporting with client-specific insights dashboard'
    ],
    metrics: [
      { label: 'Project Delivery', value: '28% faster' },
      { label: 'Admin Time Reduced', value: '42%' },
      { label: 'Client Satisfaction', value: '+31% improvement' }
    ],
    useCases: [
      {
        title: 'Creative Content Generation',
        description: 'AI assists with generating campaign ideas, copy variations, and visual concepts based on brand guidelines and past performance.'
      },
      {
        title: 'Resource Optimization',
        description: 'Smart allocation of team members based on skills, workload, and project requirements to maximize efficiency.'
      }
    ],
    testimonial: {
      quote: "The AI assistant has transformed our workflow. We've reduced administrative tasks by over 40% and improved our creative output with AI-generated concepts and optimization.",
      author: "Mark Thompson",
      company: "Elevate Digital Agency"
    },
    description: 'AI solutions that help agencies streamline project management, generate creative content, optimize resource allocation, and automate client communications with data-driven insights.'
  },
  {
    id: 'law-firms',
    name: 'Law Firms',
    icon: 'fa-solid fa-scale-balanced',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
    features: [
      'Comprehensive legal FAQ assistant with regulation updates',
      'Intelligent case intake with conflict checking and complexity assessment',
      'Advanced document analysis with clause identification and risk flagging',
      'Precedent research with relevance ranking and jurisdiction filtering',
      'Client portal with secure document handling and case status updates'
    ],
    metrics: [
      { label: 'Document Review', value: '73% faster' },
      { label: 'Case Intake Time', value: 'Reduced by 62%' },
      { label: 'Billable Hours Increase', value: '22%' }
    ],
    useCases: [
      {
        title: 'Contract Analysis',
        description: 'AI reviews contracts to flag potential issues, compare against standard templates, and suggest modifications based on historical outcomes.'
      },
      {
        title: 'Case Precedent Research',
        description: 'Intelligent research assistant that finds relevant cases, analyzes similarities and differences, and highlights key arguments.'
      }
    ],
    testimonial: {
      quote: "Our AI assistant has revolutionized how we review documents and conduct research. Tasks that took days now take hours, allowing our attorneys to focus on strategic case work instead of administrative tasks.",
      author: "Benjamin Walsh",
      company: "Walsh & Parker Law"
    },
    description: 'AI assistants that help law firms automate routine client inquiries, document review, preliminary case analysis, and streamline research with intelligent filtering and relevance scoring.'
  },
  {
    id: 'ecommerce',
    name: 'eCommerce',
    icon: 'fa-solid fa-cart-shopping',
    color: 'from-red-500 to-rose-600',
    badgeColor: 'bg-red-500/20 text-red-400',
    features: [
      'Advanced product recommendation engine with purchase pattern analysis',
      'Conversational shopping assistant with product comparison capabilities',
      'Predictive inventory management with seasonal trend forecasting',
      'Multilingual customer support automation with sentiment analysis',
      'Personalized email campaigns with timing optimization'
    ],
    metrics: [
      { label: 'Cart Value', value: '+24% increase' },
      { label: 'Customer Support', value: '67% automation' },
      { label: 'Return Rate', value: 'Decreased by 18%' }
    ],
    useCases: [
      {
        title: 'Personalized Shopping Experience',
        description: 'AI creates custom shopping experiences by analyzing browsing behavior, purchase history, and similar customer profiles.'
      },
      {
        title: 'Intelligent Inventory Management',
        description: 'Predictive system that forecasts inventory needs based on multiple factors including seasonality, marketing campaigns, and external events.'
      }
    ],
    testimonial: {
      quote: "The AI recommendation engine increased our average order value by 24%. Customer service inquiries are down 40% thanks to the shopping assistant, and our inventory forecasting is now remarkably accurate.",
      author: "Sarah Chen",
      company: "StyleHub Boutique"
    },
    description: 'AI-powered shopping assistants and recommendation engines that boost conversions, provide 24/7 customer support, and optimize inventory management with predictive analytics.'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: 'fa-solid fa-stethoscope',
    color: 'from-blue-600 to-indigo-700',
    badgeColor: 'bg-blue-600/20 text-blue-400',
    features: [
      'HIPAA-compliant patient screening with symptom analysis',
      'Smart appointment scheduling with urgency prioritization',
      'Personalized medication reminders with adherence tracking',
      'Detailed care plan explanations with visual aids and simple language',
      'Physician assistant with medical record summarization'
    ],
    metrics: [
      { label: 'Patient Wait Times', value: 'Reduced by 41%' },
      { label: 'Medication Adherence', value: 'Improved by 32%' },
      { label: 'Administrative Tasks', value: '58% reduction' }
    ],
    useCases: [
      {
        title: 'Intelligent Triage System',
        description: 'AI assesses patient symptoms and medical history to prioritize appointments and prepare relevant information for providers.'
      },
      {
        title: 'Treatment Adherence Program',
        description: 'Personalized reminder system that adapts based on patient behavior, medication complexity, and reported side effects.'
      }
    ],
    testimonial: {
      quote: "Our AI assistant has transformed our practice workflow. Patient satisfaction is up, administrative burden is down, and our providers have more time to focus on direct patient care.",
      author: "Dr. James Wilson",
      company: "Cornerstone Medical Group"
    },
    description: 'HIPAA-compliant AI assistants that streamline patient intake, appointment prioritization, treatment plan explanations, and medical adherence monitoring with intelligent follow-up systems.'
  },
  {
    id: 'entertainment-media',
    name: 'Entertainment & Media',
    icon: 'fa-solid fa-film',
    color: 'from-pink-500 to-purple-600',
    badgeColor: 'bg-pink-500/20 text-pink-400',
    features: [
      'Content recommendation engine with personalized viewer profiles',
      'Automated video editing and scene selection tools',
      'AI scriptwriting and story development assistants',
      'Audience sentiment analysis for content optimization',
      'Smart content distribution and promotional targeting'
    ],
    metrics: [
      { label: 'Content Production', value: '35% faster' },
      { label: 'Viewer Engagement', value: '+47% increase' },
      { label: 'Audience Growth', value: '29% improvement' }
    ],
    useCases: [
      {
        title: 'Personalized Content Delivery',
        description: 'AI analyzes viewer preferences and behavior to deliver tailored content recommendations that increase watch time and retention.'
      },
      {
        title: 'Automated Content Creation',
        description: 'Smart assistants that streamline video editing, caption generation, and promotional material creation for multi-platform distribution.'
      }
    ],
    testimonial: {
      quote: "Our AI content system has revolutionized how we create and distribute media. Production time is down by a third, and viewer engagement metrics have skyrocketed across all our platforms.",
      author: "Michael Rodriguez",
      company: "Stellar Media Productions"
    },
    description: 'AI-powered solutions for media companies to streamline content creation, personalize viewer experiences, optimize distribution, and analyze audience engagement across multiple platforms.'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: 'fa-solid fa-shield-alt',
    color: 'from-gray-700 to-slate-800',
    badgeColor: 'bg-gray-700/20 text-gray-400',
    features: [
      'Real-time threat detection and anomaly identification',
      'Automated security incident response and remediation',
      'Predictive risk analysis and vulnerability scanning',
      'Intelligent phishing prevention with user behavior analysis',
      'Advanced network traffic monitoring with pattern recognition'
    ],
    metrics: [
      { label: 'Threat Detection', value: '98.7% accuracy' },
      { label: 'Response Time', value: 'Under 3 minutes' },
      { label: 'False Positives', value: 'Reduced by 64%' }
    ],
    useCases: [
      {
        title: 'Intelligent Security Operations',
        description: 'AI continuously monitors systems and network traffic to identify threats and respond to security incidents automatically.'
      },
      {
        title: 'Proactive Defense System',
        description: 'Predictive analysis identifies potential vulnerabilities and security gaps before they can be exploited by attackers.'
      }
    ],
    testimonial: {
      quote: "The AI security platform has transformed our cybersecurity operations. We've dramatically reduced our mean time to detect and respond to threats while allowing our security team to focus on strategic initiatives.",
      author: "Alexandra Chen",
      company: "SecureDefend Technologies"
    },
    description: 'AI-powered cybersecurity platforms that provide continuous threat monitoring, automated incident response, predictive risk analysis, and proactive vulnerability management.'
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'fa-solid fa-graduation-cap',
    color: 'from-green-500 to-emerald-600',
    badgeColor: 'bg-green-500/20 text-green-400',
    features: [
      'Personalized learning paths with adaptive difficulty scaling',
      'Automated grading and feedback generation',
      'Student engagement monitoring with intervention recommendations',
      'AI tutoring with conceptual explanations and examples',
      'Learning analytics dashboard for educators'
    ],
    metrics: [
      { label: 'Student Performance', value: '+31% improvement' },
      { label: 'Teacher Time Saved', value: '12+ hours/week' },
      { label: 'Learner Satisfaction', value: '92% positive' }
    ],
    useCases: [
      {
        title: 'Adaptive Learning System',
        description: 'AI analyzes student performance to create personalized learning experiences that adapt to individual strengths, weaknesses, and learning styles.'
      },
      {
        title: 'Educator Support Dashboard',
        description: 'Comprehensive analytics and early intervention tools that help teachers identify at-risk students and provide targeted support.'
      }
    ],
    testimonial: {
      quote: "Our AI education platform has revolutionized how we teach and support students. We've seen remarkable improvements in learning outcomes while reducing teacher administrative burden significantly.",
      author: "Dr. Rebecca Johnson",
      company: "Evergreen Learning Academy"
    },
    description: 'AI-powered education solutions that personalize learning experiences, automate administrative tasks, provide intelligent tutoring, and deliver actionable insights to educators and administrators.'
  }
];

export default function IndustryTemplates() {
  const [activeTab, setActiveTab] = useState('real-estate');
  const activeTemplate = industryTemplates.find(template => template.id === activeTab);

  return (
    <section id="industry-templates" className="py-20 bg-background relative overflow-hidden">
      {/* Background with digital patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0">
          <svg width="100%" height="100%">
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Industry-Specific <GradientText>Templates</GradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Pre-built AI solutions tailored specifically for your industry's unique challenges and opportunities
            </p>
          </motion.div>
        </motion.div>

        <Tabs 
          defaultValue="real-estate" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex flex-col items-center mb-8">
            <h3 className="text-xl font-semibold mb-4 text-center">Select Your Industry</h3>
            
            <div className="w-full max-w-4xl">
              <div className="relative mx-auto flex items-center justify-center bg-white/5 backdrop-blur-lg rounded-full p-1">
                <button 
                  className="h-10 w-10 flex items-center justify-center rounded-full transition-colors z-20 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => {
                    const tabsContainer = document.querySelector('.industry-tabs-container');
                    if (tabsContainer) {
                      tabsContainer.scrollLeft -= 300;
                    }
                  }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                <div className="overflow-x-auto flex-1 relative mx-4">
                  <TabsList className="industry-tabs-container flex gap-1 px-1 py-1 bg-transparent border-0" style={{ scrollBehavior: 'smooth' }}>
                    {industryTemplates.map(template => {
                      const isActive = activeTab === template.id;
                      return (
                        <TabsTrigger 
                          key={template.id} 
                          value={template.id}
                          className={`rounded-full px-3 py-1.5 whitespace-nowrap flex-shrink-0 transition-all duration-200 font-medium text-xs ${
                            isActive 
                              ? `bg-white text-black` 
                              : 'bg-transparent hover:bg-white/10 text-white'
                          }`}
                        >
                          <i className={`${template.icon} mr-1.5`}></i>
                          {template.name}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </div>
                
                <button 
                  className="h-10 w-10 flex items-center justify-center rounded-full transition-colors z-20 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => {
                    const tabsContainer = document.querySelector('.industry-tabs-container');
                    if (tabsContainer) {
                      tabsContainer.scrollLeft += 300;
                    }
                  }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
            
            {/* Industry description - adds context to what the user is selecting */}
            <div className="mt-4 text-center max-w-xl">
              <p className="text-sm text-gray-300">
                {industryTemplates.find(t => t.id === activeTab)?.description.slice(0, 120)}...
              </p>
            </div>
          </div>

          {industryTemplates.map(template => (
            <TabsContent 
              key={template.id} 
              value={template.id}
              className="mt-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Main solution details */}
                <div className="lg:col-span-2">
                  <GlassCard>
                    <div className="p-8">
                      <div className="mb-8 flex items-center">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center text-white text-2xl mr-5 shadow-lg`}>
                          <i className={template.icon}></i>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{template.name} AI Solution</h3>
                          <Badge className={`mt-2 ${template.badgeColor}`}>Industry-Optimized</Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-8 text-lg leading-relaxed">{template.description}</p>
                      
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                          <span className="bg-primary/20 p-1 rounded text-primary mr-2"><Check size={16} /></span>
                          Key Features & Capabilities
                        </h4>
                        <ul className="space-y-3 ml-2">
                          {template.features.map((feature, index) => (
                            <li key={index} className="flex items-start bg-background/40 p-3 rounded-lg border border-muted">
                              <span className="text-primary mr-3 mt-0.5">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                          <span className="bg-primary/20 p-1 rounded text-primary mr-2"><Star size={16} /></span>
                          Performance Metrics
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {template.metrics.map((metric, index) => (
                            <div key={index} className="bg-background/40 p-4 rounded-lg border border-muted text-center">
                              <div className="text-2xl font-bold text-primary mb-1">{metric.value}</div>
                              <div className="text-sm text-muted-foreground">{metric.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        {template.useCases.map((useCase, index) => (
                          <div key={index} className="bg-background/40 p-5 rounded-lg border border-muted">
                            <h5 className="font-medium text-primary mb-2">{useCase.title}</h5>
                            <p className="text-sm text-muted-foreground">{useCase.description}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild className={`bg-gradient-to-r ${template.color} hover:opacity-90 transition-opacity`}>
                          <a href="/calculator">
                            Build My {template.name} AI
                          </a>
                        </Button>
                        <Button variant="outline" asChild>
                          <a href="/demo">See Live Demo</a>
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </div>
                
                {/* Sidebar with testimonial and preview */}
                <div className="space-y-6">
                  {/* Testimonial */}
                  <GlassCard className="bg-gradient-to-br from-background/80 to-background/30">
                    <div className="p-6">
                      <div className="flex justify-center mb-4">
                        <div className="flex -space-x-2">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xs">★</div>
                          ))}
                        </div>
                      </div>
                      <blockquote className="text-gray-300 italic mb-4 text-sm">
                        "{template.testimonial.quote}"
                      </blockquote>
                      <div className="text-right">
                        <div className="font-medium text-white">{template.testimonial.author}</div>
                        <div className="text-xs text-muted-foreground">{template.testimonial.company}</div>
                      </div>
                    </div>
                  </GlassCard>
                  
                  {/* Assistant Preview */}
                  <div className="rounded-lg overflow-hidden bg-black/40 backdrop-blur-md border border-white/10 relative">
                    <div className="absolute top-0 left-0 right-0 h-10 bg-background/40 flex items-center px-4 border-b border-white/10">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-xs text-center flex-1">{template.name} Assistant</div>
                    </div>
                    
                    <div className="pt-12 pb-6 px-6 flex flex-col items-center justify-center min-h-[280px]">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${template.color} flex items-center justify-center text-white text-3xl mb-4 shadow-lg`}>
                        <i className={template.icon}></i>
                      </div>
                      <h4 className="text-xl font-bold mb-2">{template.name} Assistant</h4>
                      <p className="text-gray-400 mb-4 text-center text-sm">Intelligent AI customized for {template.name.toLowerCase()} businesses</p>
                      <Button asChild size="sm" className={`bg-gradient-to-r ${template.color} hover:opacity-90 transition-opacity mt-2`}>
                        <a href="/calculator">Try Demo</a>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Industry Stats */}
                  <div className="bg-background/20 rounded-lg border border-muted p-4">
                    <h5 className="font-medium mb-3 text-sm">Implementation Timeline</h5>
                    <div className="flex items-center">
                      <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${template.color}`} style={{width: '80%'}}></div>
                      </div>
                      <span className="text-sm ml-3 font-bold">3-4 weeks</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">Don't see your industry? We create custom AI solutions for any business type.</p>
          <Button variant="outline" size="lg" className="mx-auto" asChild>
            <a href="/calculator">
              <i className="fas fa-industry mr-2"></i>
              Request Custom Industry Solution
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}