import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/ui/gradient-text';
import { CaseStudy } from '@/components/ui/case-study-card';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { Helmet } from 'react-helmet';

export default function CaseStudiesPage() {
  const [activeIndustry, setActiveIndustry] = useState('All Industries');
  const [visibleCount, setVisibleCount] = useState(6);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // All industries represented in the case studies
  const industries = [
    'All Industries',
    'eCommerce',
    'SaaS',
    'Real Estate',
    'Finance',
    'Healthcare',
    'Retail',
    'Manufacturing',
    'Transportation',
    'Education',
    'Legal',
    'Energy',
    'Media & Entertainment'
  ];
  
  // Comprehensive case study data
  const caseStudies = [
    {
      id: 1,
      title: 'Personalization Engine Overhaul',
      client: 'FashionGo',
      logo: 'FG',
      logoColor: '#4A90E2',
      industry: 'eCommerce',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
      problem: 'FashionGo struggled with generic product recommendations that resulted in low conversion rates across their platform, with customers often abandoning searches after viewing only a few products.',
      solution: 'We implemented a custom AI-driven personalization system that analyzes real-time user behavior, purchase history, and fashion trends to deliver highly relevant product suggestions.',
      result: 'The new personalization engine transformed their customer experience by delivering product recommendations that align with individual style preferences and shopping patterns.',
      metrics: [
        { label: 'Conversion Rate', value: '+38%' },
        { label: 'Average Order Value', value: '+22%' },
        { label: 'Customer Retention', value: '+47%' }
      ],
      quote: 'The AI recommendations are so accurate that customers ask if we are reading their minds.',
      spokespersonName: 'Sarah Chen',
      spokespersonTitle: 'Director of eCommerce',
      technologies: ['NLP', 'Visual Recognition AI', 'Reinforcement Learning'],
      implementationTime: '21 days',
      color: 'primary',
      featured: true
    },
    {
      id: 2,
      title: 'AI Task Prioritization & Assignment',
      client: 'TaskMaster',
      logo: 'TM',
      logoColor: '#8957E5',
      industry: 'SaaS',
      image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
      problem: 'TaskMaster project management software lacked intelligent task allocation, causing teams to waste time in planning meetings and miss critical deadlines.',
      solution: 'We developed an AI system that learns team members skills, work patterns, and availability to automatically prioritize and assign tasks for optimal workflow efficiency.',
      result: 'Teams using TaskMaster now spend less time planning and more time executing, with the AI handling routine task management decisions.',
      metrics: [
        { label: 'Team Productivity', value: '+41%' },
        { label: 'Project Completion Time', value: '-28%' },
        { label: 'User Engagement', value: '+63%' }
      ],
      quote: 'We have eliminated endless planning meetings with AI that learns team patterns.',
      spokespersonName: 'Michael Reynolds',
      spokespersonTitle: 'Chief Product Officer',
      technologies: ['Machine Learning', 'Predictive Analytics', 'API Integration'],
      implementationTime: '30 days',
      color: 'accent',
      featured: true
    },
    {
      id: 3,
      title: 'Fraud Detection & Risk Analysis',
      client: 'FinCore',
      logo: 'FC',
      logoColor: '#10B981',
      industry: 'Finance',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
      problem: 'FinCore traditional fraud detection systems generated excessive false positives, frustrating legitimate customers while still missing sophisticated fraud patterns.',
      solution: 'We built a multi-layered AI system that combines behavioral biometrics, transaction pattern analysis, and network effect modeling to identify fraudulent activities with unprecedented accuracy.',
      result: 'FinCore now detects fraudulent transactions with remarkable precision while reducing the friction for legitimate customers.',
      metrics: [
        { label: 'Fraud Detection Rate', value: '+92%' },
        { label: 'False Positives', value: '-76%' },
        { label: 'Operational Cost', value: '-34%' }
      ],
      quote: 'The system identified patterns that would take months for human analysts to discover.',
      spokespersonName: 'Alicia Mendez',
      spokespersonTitle: 'Chief Risk Officer',
      technologies: ['Deep Learning', 'Network Analysis', 'Behavioral Analytics'],
      implementationTime: '45 days',
      color: 'secondary',
      featured: true
    },
    {
      id: 4,
      title: 'Inventory Optimization System',
      client: 'RetailPro',
      logo: 'RP',
      logoColor: '#F59E0B',
      industry: 'Retail',
      image: 'https://images.unsplash.com/photo-1580894732930-0babd100d356?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
      problem: 'RetailPro struggled with inventory management across multiple locations, resulting in frequent stockouts of popular items and excess inventory of slow-moving products.',
      solution: 'We implemented a predictive inventory management system that forecasts demand patterns, optimizes stock levels, and automatically adjusts purchasing recommendations based on multiple factors like seasonality, promotions, and market trends.',
      result: 'The AI solution transformed RetailPro inventory management, ensuring optimal stock levels across all store locations and significantly reducing carrying costs.',
      metrics: [
        { label: 'Stockout Reduction', value: '-68%' },
        { label: 'Inventory Carrying Cost', value: '-32%' },
        { label: 'Forecast Accuracy', value: '+45%' }
      ],
      quote: 'The AI system predicts demand better than our most experienced team members.',
      spokespersonName: 'Damon Morris',
      spokespersonTitle: 'VP of Operations',
      technologies: ['Predictive Analytics', 'Time Series Analysis', 'Supply Chain Optimization'],
      implementationTime: '28 days',
      color: 'primary'
    },
    {
      id: 5,
      title: 'Patient Care Optimization',
      client: 'HealthCorp',
      logo: 'HC',
      logoColor: '#EF4444',
      industry: 'Healthcare',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
      problem: 'HealthCorp hospitals faced increasing patient wait times, staff burnout, and inefficient resource allocation across departments.',
      solution: 'We created an AI-driven patient flow optimization system that predicts patient volume, optimizes staff scheduling, and intelligently allocates resources based on real-time demand patterns.',
      result: 'HealthCorp achieved significant improvements in resource utilization and patient satisfaction while reducing the burden on healthcare staff.',
      metrics: [
        { label: 'Patient Wait Times', value: '-56%' },
        { label: 'Staff Efficiency', value: '+37%' },
        { label: 'Patient Satisfaction', value: '+48%' }
      ],
      quote: 'Our care quality improved while simultaneously reducing staff burnout.',
      spokespersonName: 'Dr. Elena Patel',
      spokespersonTitle: 'Medical Director',
      technologies: ['Predictive Modeling', 'Queue Optimization', 'Resource Allocation AI'],
      implementationTime: '60 days',
      color: 'accent'
    },
    {
      id: 6,
      title: 'Real Estate Market Predictor',
      client: 'HomeVista',
      logo: 'HV',
      logoColor: '#0EA5E9',
      industry: 'Real Estate',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
      problem: 'HomeVista relied on traditional market analysis methods that could not accurately predict neighborhood-specific price trends, causing missed opportunities and suboptimal property investments.',
      solution: 'We built a predictive AI platform that ingests multiple data sources including historical sales, local economics, development permits, and social sentiment to forecast market movements at a hyper-local level.',
      result: 'HomeVista now has unprecedented visibility into market trends, allowing them to make data-driven decisions weeks before their competitors.',
      metrics: [
        { label: 'Price Prediction Accuracy', value: '+85%' },
        { label: 'Days on Market', value: '-42%' },
        { label: 'Client Portfolio Growth', value: '+29%' }
      ],
      quote: 'We can now pinpoint market shifts months before our competitors.',
      spokespersonName: 'Jonathan Miller',
      spokespersonTitle: 'Director of Acquisitions',
      technologies: ['Geospatial AI', 'Economic Modeling', 'Sentiment Analysis'],
      implementationTime: '35 days',
      color: 'secondary'
    },
    {
      id: 7,
      title: 'Supply Chain Predictive Maintenance',
      client: 'GlobalManufacturing',
      logo: 'GM',
      logoColor: '#6366F1',
      industry: 'Manufacturing',
      image: 'https://images.unsplash.com/photo-1621574539437-8732dcaef4b3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
      problem: 'GlobalManufacturing experienced frequent unplanned equipment failures that disrupted production schedules and significantly increased maintenance costs.',
      solution: 'We deployed IoT sensors throughout their manufacturing facilities and developed an AI system that predicts equipment failures before they occur by analyzing patterns in temperature, vibration, and performance data.',
      result: 'The predictive maintenance system transformed GlobalManufacturing operations by dramatically reducing unexpected downtime and extending the useful life of critical equipment.',
      metrics: [
        { label: 'Unplanned Downtime', value: '-78%' },
        { label: 'Maintenance Costs', value: '-42%' },
        { label: 'Equipment Lifespan', value: '+32%' }
      ],
      quote: 'Our AI now predicts equipment failures weeks before they would occur, transforming our maintenance operations.',
      spokespersonName: 'Robert Zhang',
      spokespersonTitle: 'Head of Operations',
      technologies: ['IoT Integration', 'Anomaly Detection', 'Predictive Modeling'],
      implementationTime: '90 days',
      color: 'primary'
    },
    {
      id: 8,
      title: 'Fleet Optimization System',
      client: 'TransGlobal',
      logo: 'TG',
      logoColor: '#0D9488',
      industry: 'Transportation',
      image: 'https://images.unsplash.com/photo-1620370018846-be2953441456?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
      problem: 'TransGlobal logistics operations were plagued by inefficient routing, vehicle utilization issues, and unpredictable fuel costs that eroded their profit margins.',
      solution: 'We implemented an AI-driven fleet management system that optimizes routes in real-time based on current traffic conditions, weather forecasts, delivery priorities, and fuel efficiency calculations.',
      result: 'The solution has revolutionized TransGlobal logistics operations, significantly reducing delivery times while minimizing operational costs.',
      metrics: [
        { label: 'Fuel Consumption', value: '-25%' },
        { label: 'On-Time Deliveries', value: '+37%' },
        { label: 'Fleet Utilization', value: '+40%' }
      ],
      quote: 'Our delivery efficiency has reached levels we previously thought impossible.',
      spokespersonName: 'Carlos Rivera',
      spokespersonTitle: 'Logistics Director',
      technologies: ['Route Optimization', 'Real-time Traffic Analysis', 'Fuel Efficiency Modeling'],
      implementationTime: '45 days',
      color: 'accent'
    },
    {
      id: 9,
      title: 'Personalized Learning Platform',
      client: 'EduConnect',
      logo: 'EC',
      logoColor: '#8B5CF6',
      industry: 'Education',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
      problem: 'EduConnect one-size-fits-all educational content resulted in disengagement from students with different learning styles and knowledge levels.',
      solution: 'We built an adaptive learning platform that uses AI to assess each student knowledge gaps, learning style, and pace, then customizes educational content and exercises accordingly.',
      result: 'The personalized learning system has transformed student engagement and outcomes across EduConnect platform.',
      metrics: [
        { label: 'Student Engagement', value: '+58%' },
        { label: 'Completion Rates', value: '+62%' },
        { label: 'Test Score Improvement', value: '+43%' }
      ],
      quote: 'Our AI creates truly personalized learning journeys that adapt to each student needs.',
      spokespersonName: 'Priya Sharma',
      spokespersonTitle: 'Chief Learning Officer',
      technologies: ['Adaptive Learning', 'Knowledge Mapping', 'Content Personalization'],
      implementationTime: '60 days',
      color: 'secondary'
    },
    {
      id: 10,
      title: 'Legal Document Analysis System',
      client: 'LexisNova',
      logo: 'LN',
      logoColor: '#EC4899',
      industry: 'Legal',
      image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
      problem: 'LexisNova attorneys spent countless hours manually reviewing case documents, contracts, and legal precedents, reducing their productivity and increasing client costs.',
      solution: 'We developed an AI-powered legal document analysis system that automatically extracts key information, identifies contractual risks, and connects relevant case precedents to current matters.',
      result: 'The system dramatically accelerated document review processes while improving accuracy and consistency of legal analysis.',
      metrics: [
        { label: 'Document Review Time', value: '-73%' },
        { label: 'Risk Identification', value: '+67%' },
        { label: 'Case Research Time', value: '-58%' }
      ],
      quote: 'Our AI system finds connections between cases that would take days for human attorneys to discover.',
      spokespersonName: 'Marcus Bennett',
      spokespersonTitle: 'Managing Partner',
      technologies: ['Natural Language Processing', 'Legal Knowledge Graphs', 'Semantic Search'],
      implementationTime: '75 days',
      color: 'primary'
    },
    {
      id: 11,
      title: 'Smart Grid Management System',
      client: 'PowerGrid',
      logo: 'PG',
      logoColor: '#FBBF24',
      industry: 'Energy',
      image: 'https://images.unsplash.com/photo-1581094289810-adf5d25690e3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
      problem: 'PowerGrid struggled with inefficient energy distribution, difficulty integrating renewable sources, and challenges predicting demand fluctuations.',
      solution: 'We implemented an AI-driven grid management system that predicts energy demand, optimizes distribution in real-time, and smoothly integrates intermittent renewable energy sources.',
      result: 'The smart grid system has significantly improved PowerGrid distribution efficiency while enabling greater adoption of renewable energy sources.',
      metrics: [
        { label: 'Distribution Efficiency', value: '+31%' },
        { label: 'Renewable Integration', value: '+54%' },
        { label: 'Outage Duration', value: '-47%' }
      ],
      quote: 'Our grid now anticipates demand shifts and automatically rebalances for optimal efficiency.',
      spokespersonName: 'Lisa Johnson',
      spokespersonTitle: 'Grid Operations Director',
      technologies: ['Demand Forecasting', 'Real-time Optimization', 'Renewable Integration'],
      implementationTime: '120 days',
      color: 'accent'
    },
    {
      id: 12,
      title: 'Content Personalization Engine',
      client: 'StreamVerse',
      logo: 'SV',
      logoColor: '#7C3AED',
      industry: 'Media & Entertainment',
      image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
      problem: 'StreamVerse content recommendations were based on limited factors, resulting in poor engagement and high subscriber churn rates.',
      solution: 'We developed a sophisticated content personalization engine that analyzes viewing patterns, content characteristics, emotional responses, and contextual factors to deliver highly relevant recommendations.',
      result: 'The personalization system has transformed user engagement with StreamVerse platform, significantly reducing subscriber churn.',
      metrics: [
        { label: 'User Engagement', value: '+72%' },
        { label: 'Content Discovery', value: '+83%' },
        { label: 'Subscriber Retention', value: '+47%' }
      ],
      quote: 'Our viewers now find content they love without endless scrolling, transforming their experience.',
      spokespersonName: 'David Kim',
      spokespersonTitle: 'Chief Content Officer',
      technologies: ['Recommendation Algorithms', 'Content Analysis', 'Behavioral Modeling'],
      implementationTime: '60 days',
      color: 'secondary'
    }
  ];
  
  const filteredCaseStudies = activeIndustry === 'All Industries'
    ? caseStudies
    : caseStudies.filter(study => study.industry === activeIndustry);

  const visibleCaseStudies = filteredCaseStudies.slice(0, visibleCount);
  const hasMore = visibleCaseStudies.length < filteredCaseStudies.length;
  
  // Responsive industry filter display
  const isDesktop = windowWidth >= 768;

  return (
    <>
      <Helmet>
        <title>Case Studies & Results | Advanta AI</title>
        <meta name="description" content="Explore our AI success stories across industries. See how our clients achieved measurable business outcomes with our enterprise AI solutions." />
        <meta name="keywords" content="AI case studies, enterprise AI results, artificial intelligence ROI, business transformation, industry solutions" />
        <meta property="og:title" content="Case Studies & Results | Advanta AI" />
        <meta property="og:description" content="Explore our AI success stories across industries. See how our clients achieved measurable business outcomes with our enterprise AI solutions." />
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
                Case Studies & <GradientText>Results</GradientText>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Real business transformation with measurable outcomes across industries
              </motion.p>
            </motion.div>
            
            {/* Industry Statistics */}
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-background/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">12+</div>
                <div className="text-gray-300">Industries Served</div>
              </div>
              <div className="bg-background/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-gray-300">Client Satisfaction</div>
              </div>
              <div className="bg-background/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">385%</div>
                <div className="text-gray-300">Average ROI</div>
              </div>
              <div className="bg-background/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">14-30</div>
                <div className="text-gray-300">Days to Implementation</div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Industry Filters */}
        <section className="py-8 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Browse by Industry</h2>
              
              {isDesktop ? (
                // Desktop - Buttons in rows
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {industries.map((industry) => (
                    <Button
                      key={industry}
                      variant={activeIndustry === industry ? "default" : "outline"}
                      className={`text-sm font-medium ${activeIndustry === industry ? 'bg-primary text-white' : ''}`}
                      onClick={() => {
                        setActiveIndustry(industry);
                        setVisibleCount(6); // Reset visible count when filter changes
                      }}
                    >
                      {industry}
                    </Button>
                  ))}
                </div>
              ) : (
                // Mobile - Horizontal scrolling tabs
                <div className="overflow-x-auto pb-4 mb-4 -mx-4 px-4">
                  <div className="flex space-x-2" style={{ minWidth: 'max-content' }}>
                    {industries.map((industry) => (
                      <Button
                        key={industry}
                        variant={activeIndustry === industry ? "default" : "outline"}
                        className={`text-sm font-medium whitespace-nowrap ${activeIndustry === industry ? 'bg-primary text-white' : ''}`}
                        onClick={() => {
                          setActiveIndustry(industry);
                          setVisibleCount(6);
                        }}
                      >
                        {industry}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
        
        {/* Featured Case Studies */}
        {activeIndustry === 'All Industries' && (
          <section className="py-12 bg-black/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-4">
                  Featured Success Stories
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Our most impactful AI implementations with transformative results
                </motion.p>
              </motion.div>
              
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {caseStudies
                  .filter(study => study.featured)
                  .map((study) => (
                    <motion.div key={study.id} variants={fadeIn}>
                      <div className="bg-background border border-white/10 rounded-xl overflow-hidden h-full flex flex-col">
                        <div className="relative">
                          <img 
                            src={study.image} 
                            alt={`${study.client} case study`} 
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                          <div className="absolute bottom-3 left-3 bg-primary text-white text-xs font-medium py-1 px-2 rounded">
                            {study.industry}
                          </div>
                          <div 
                            className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: study.logoColor || '#4A90E2' }}
                          >
                            {study.logo}
                          </div>
                        </div>
                        
                        <div className="p-6 flex-grow">
                          <h3 className="text-xl font-bold mb-2">{study.title}</h3>
                          <p className="text-gray-400 text-sm mb-4">{study.client}</p>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-1">Challenge:</h4>
                            <p className="text-gray-400 text-sm">{study.problem}</p>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-1">Solution:</h4>
                            <p className="text-gray-400 text-sm">{study.solution}</p>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-1">Results:</h4>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                              {study.metrics.map((metric, i) => (
                                <div key={i} className="bg-background/50 border border-white/5 rounded-lg p-3 text-center">
                                  <div className="text-xl font-bold text-primary">{metric.value}</div>
                                  <div className="text-gray-400 text-xs">{metric.label}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 pt-0 border-t border-white/5 mt-auto flex justify-between items-center">
                          <div className="text-xs text-gray-400">
                            Implementation: {study.implementationTime || "14-30 days"}
                          </div>
                          <Button asChild variant="link" className="p-0 h-auto">
                            <Link href={`/case-study/${study.id}`}>
                              Full Case Study <i className="fas fa-arrow-right ml-1"></i>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          </section>
        )}
        
        {/* All Case Studies */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-4">
                {activeIndustry === 'All Industries' 
                  ? 'All Case Studies' 
                  : `${activeIndustry} Success Stories`}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto">
                {activeIndustry === 'All Industries'
                  ? 'Discover how our AI solutions deliver measurable results across all industries'
                  : `See how our AI solutions transform ${activeIndustry} businesses with measurable outcomes`}
              </motion.p>
            </motion.div>
            
            {filteredCaseStudies.length > 0 ? (
              <>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {visibleCaseStudies.map((study) => (
                    <motion.div key={study.id} variants={fadeIn}>
                      <div className="bg-background border border-white/10 rounded-xl overflow-hidden h-full flex flex-col">
                        <div className="relative">
                          <img 
                            src={study.image} 
                            alt={`${study.client} case study`} 
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                          <div className="absolute bottom-3 left-3 bg-primary text-white text-xs font-medium py-1 px-2 rounded">
                            {study.industry}
                          </div>
                          <div 
                            className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: study.logoColor || '#4A90E2' }}
                          >
                            {study.logo}
                          </div>
                        </div>
                        
                        <div className="p-6 flex-grow">
                          <h3 className="text-xl font-bold mb-2">{study.title}</h3>
                          <p className="text-gray-400 text-sm mb-4">{study.client}</p>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-1">Challenge:</h4>
                            <p className="text-gray-400 text-sm">{study.problem}</p>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-1">Solution:</h4>
                            <p className="text-gray-400 text-sm">{study.solution}</p>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-1">Results:</h4>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                              {study.metrics.map((metric, i) => (
                                <div key={i} className="bg-background/50 border border-white/5 rounded-lg p-3 text-center">
                                  <div className="text-xl font-bold text-primary">{metric.value}</div>
                                  <div className="text-gray-400 text-xs">{metric.label}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 pt-0 border-t border-white/5 mt-auto flex justify-between items-center">
                          <div className="text-xs text-gray-400">
                            Implementation: {study.implementationTime || "14-30 days"}
                          </div>
                          <Button asChild variant="link" className="p-0 h-auto">
                            <Link href={`/case-study/${study.id}`}>
                              Full Case Study <i className="fas fa-arrow-right ml-1"></i>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                
                {hasMore && (
                  <div className="text-center mt-12">
                    <Button 
                      onClick={() => setVisibleCount(prev => prev + 6)}
                      variant="outline"
                      size="lg"
                      className="min-w-[200px]"
                    >
                      Load More Case Studies
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 text-primary/50">
                  <i className="fas fa-folder-open"></i>
                </div>
                <h3 className="text-2xl font-bold mb-2">No Case Studies Found</h3>
                <p className="text-gray-400 mb-6">
                  We do not have any case studies for this industry yet, but we are constantly adding new success stories.
                </p>
                <Button onClick={() => setActiveIndustry('All Industries')}>
                  View All Industries
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Metrics Overview */}
        <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-4">
                Impact <GradientText>Overview</GradientText>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto">
                Average results our clients achieve with our AI solutions
              </motion.p>
            </motion.div>
            
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                {
                  category: "Revenue Growth",
                  value: "+48%",
                  description: "Average revenue increase after AI implementation",
                  icon: "fas fa-chart-line"
                },
                {
                  category: "Operational Efficiency",
                  value: "+62%",
                  description: "Improved productivity and resource optimization",
                  icon: "fas fa-cogs"
                },
                {
                  category: "Cost Reduction",
                  value: "-35%",
                  description: "Decreased operational expenses",
                  icon: "fas fa-piggy-bank"
                },
                {
                  category: "Customer Satisfaction",
                  value: "+57%",
                  description: "Enhanced customer experience and loyalty",
                  icon: "fas fa-smile"
                },
                {
                  category: "Time Savings",
                  value: "-73%",
                  description: "Reduced time for critical business processes",
                  icon: "fas fa-clock"
                },
                {
                  category: "Accuracy",
                  value: "+89%",
                  description: "Improved prediction and process precision",
                  icon: "fas fa-bullseye"
                },
                {
                  category: "Decision Making",
                  value: "5.7x",
                  description: "Faster and more data-driven decisions",
                  icon: "fas fa-brain"
                },
                {
                  category: "ROI Timeline",
                  value: "3-6 mos",
                  description: "Average time to investment recovery",
                  icon: "fas fa-calendar-check"
                }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-background border border-white/10 rounded-xl p-6"
                >
                  <div className="text-2xl text-primary mb-4">
                    <i className={metric.icon}></i>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{metric.category}</h3>
                  <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                  <p className="text-gray-400 text-sm">{metric.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-black/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Become Our Next <GradientText>Success Story</GradientText>?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8">
                Schedule a consultation with our AI specialists to explore how our services can be tailored to your specific needs and industry.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/services">Explore Our Solutions</Link>
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