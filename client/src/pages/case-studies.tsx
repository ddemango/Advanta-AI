import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NewHeader } from '@/components/redesign/NewHeader';
import { NewFooter } from '@/components/redesign/NewFooter';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { 
  CheckCircle, 
  TrendingUp, 
  Rocket, 
  Filter,
  ArrowRight,
  Store,
  Heart,
  Briefcase,
  MessageSquare,
  BarChart3,
  Users,
  Play
} from 'lucide-react';

interface CaseStudy {
  id: string;
  company: string;
  logo: string;
  industry: string;
  industryIcon: any;
  category: string;
  headline: string;
  summary: string;
  metrics: {
    label: string;
    value: string;
  }[];
  link: string;
  featured?: boolean;
}

interface ResultStat {
  number: string;
  label: string;
  icon: any;
}

export default function CaseStudiesPage() {
  const [, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: Filter },
    { id: 'workflow-automation', label: 'Workflow Automation', icon: CheckCircle },
    { id: 'api-integration', label: 'API Integration', icon: MessageSquare },
    { id: 'ai-learning', label: 'Industry AI Learning', icon: TrendingUp },
    { id: 'customer-interaction', label: 'Customer Interactions', icon: Users },
    { id: 'data-optimization', label: 'Data Optimization', icon: BarChart3 },
    { id: 'free-resources', label: 'Free Resources', icon: Rocket }
  ];

  const caseStudies: CaseStudy[] = [
    {
      id: 'medtech-workflow-automation',
      company: 'MedTech Solutions',
      logo: 'MT',
      industry: 'Healthcare',
      industryIcon: Heart,
      category: 'healthcare',
      headline: 'Automated 92% of appointment workflows in 7 days',
      summary: 'AI Workflow Automation eliminated manual scheduling, automated patient reminders, and streamlined follow-up communications across 5 clinic locations.',
      metrics: [
        { label: 'Workflow Automation', value: '92%' },
        { label: 'Manual Tasks Reduced', value: '-75%' },
        { label: 'Implementation Time', value: '7 days' }
      ],
      link: '/case-studies/medtech',
      featured: true
    },
    {
      id: 'proptech-api-integration',
      company: 'PropTech Realty',
      logo: 'PT',
      industry: 'Real Estate',
      industryIcon: Briefcase,
      category: 'api-integration',
      headline: 'Custom ChatGPT integration boosted lead conversion 67%',
      summary: 'Custom API & ChatGPT Integration connected MLS data with intelligent lead qualification, providing instant property recommendations and scheduling showings.',
      metrics: [
        { label: 'Lead Conversion', value: '+67%' },
        { label: 'Response Time', value: '24/7 instant' },
        { label: 'Qualified Leads', value: '+45%' }
      ],
      link: '/case-studies/proptech',
      featured: true
    },
    {
      id: 'fintech-industry-learning',
      company: 'FinanceFlow Corp',
      logo: 'FF',
      industry: 'Finance',
      industryIcon: BarChart3,
      category: 'ai-learning',
      headline: 'Industry-specific AI learned complex compliance in 5 days',
      summary: 'Industry-Specific AI Learning adapted to financial regulations, compliance requirements, and customer scenarios, processing 94% of inquiries accurately.',
      metrics: [
        { label: 'Compliance Accuracy', value: '94%' },
        { label: 'Learning Time', value: '5 days' },
        { label: 'Manual Review Reduced', value: '-80%' }
      ],
      link: '/case-studies/fintech'
    },
    {
      id: 'ecommerce-customer-interaction',
      company: 'ShopSmart',
      logo: 'SS',
      industry: 'E-commerce',
      industryIcon: Store,
      category: 'customer-interaction',
      headline: 'AI-powered interactions increased sales 54%',
      summary: 'AI-Powered Customer Interactions transformed website into 24/7 sales assistant, helping customers find products, check inventory, and complete purchases.',
      metrics: [
        { label: 'Sales Increase', value: '+54%' },
        { label: 'Cart Abandonment', value: '-38%' },
        { label: 'Customer Satisfaction', value: '4.8/5' }
      ],
      link: '/case-studies/shopsmart'
    },
    {
      id: 'marketing-data-optimization',
      company: 'GrowthTech Agency',
      logo: 'GT',
      industry: 'Marketing',
      industryIcon: TrendingUp,
      category: 'data-optimization',
      headline: 'Data-driven optimization improved ROI 89%',
      summary: 'Data-Driven Optimization continuously analyzed campaign performance, automatically adjusted budgets, and identified high-converting audiences in real-time.',
      metrics: [
        { label: 'ROI Improvement', value: '+89%' },
        { label: 'Budget Efficiency', value: '+72%' },
        { label: 'Decision Speed', value: 'Real-time' }
      ],
      link: '/case-studies/growthtech',
      featured: true
    },
    {
      id: 'startup-free-resources',
      company: 'TechStartup Inc',
      logo: 'TS',
      industry: 'SaaS',
      industryIcon: Rocket,
      category: 'free-resources',
      headline: 'Free AI resources accelerated automation by 6 months',
      summary: 'Free AI Resources & Tools provided templates and playbooks that enabled rapid implementation of customer onboarding and support automation.',
      metrics: [
        { label: 'Implementation Speed', value: '6 months faster' },
        { label: 'Setup Cost', value: '$0 initial' },
        { label: 'Automation Coverage', value: '85%' }
      ],
      link: '/case-studies/techstartup'
    },
    {
      id: 'retail-workflow-automation',
      company: 'RetailMax Chain',
      logo: 'RM',
      industry: 'Retail',
      industryIcon: Store,
      category: 'workflow-automation',
      headline: 'Automated inventory management saved 25 hours/week',
      summary: 'AI Workflow Automation eliminated manual stock tracking, automated reorder alerts, and streamlined supplier communications across 12 locations.',
      metrics: [
        { label: 'Time Saved', value: '25 hrs/week' },
        { label: 'Stock Accuracy', value: '+94%' },
        { label: 'Reorder Efficiency', value: '+78%' }
      ],
      link: '/case-studies/retailmax'
    },
    {
      id: 'legal-api-integration',
      company: 'LawTech Partners',
      logo: 'LP',
      industry: 'Legal',
      industryIcon: Briefcase,
      category: 'api-integration',
      headline: 'Custom AI integration reduced document review time 73%',
      summary: 'Custom API & ChatGPT Integration connected case management system with intelligent document analysis and legal research capabilities.',
      metrics: [
        { label: 'Review Time', value: '-73%' },
        { label: 'Accuracy Rate', value: '97%' },
        { label: 'Client Satisfaction', value: '+85%' }
      ],
      link: '/case-studies/lawtech'
    },
    {
      id: 'education-ai-learning',
      company: 'EduTech Academy',
      logo: 'EA',
      industry: 'Education',
      industryIcon: Users,
      category: 'ai-learning',
      headline: 'AI learned curriculum specifics and improved student engagement 91%',
      summary: 'Industry-Specific AI Learning adapted to educational content, student behavior patterns, and course requirements for personalized learning experiences.',
      metrics: [
        { label: 'Student Engagement', value: '+91%' },
        { label: 'Completion Rate', value: '+67%' },
        { label: 'Learning Efficiency', value: '+52%' }
      ],
      link: '/case-studies/edutech'
    }
  ];

  const resultStats: ResultStat[] = [
    { number: '120+', label: 'Businesses Automated', icon: Users },
    { number: '7 days', label: 'Average Implementation', icon: Rocket },
    { number: '200+', label: 'AI Workflows Deployed', icon: CheckCircle },
    { number: '89%', label: 'Average ROI Improvement', icon: TrendingUp }
  ];

  const trustedCompanies = [
    { name: 'MedTech Solutions', industry: 'Healthcare' },
    { name: 'PropTech Realty', industry: 'Real Estate' },
    { name: 'FinanceFlow Corp', industry: 'Finance' },
    { name: 'ShopSmart', industry: 'E-commerce' },
    { name: 'GrowthTech Agency', industry: 'Marketing' },
    { name: 'TechStartup Inc', industry: 'SaaS' },
    { name: 'RetailMax Chain', industry: 'Retail' },
    { name: 'LawTech Partners', industry: 'Legal' },
    { name: 'EduTech Academy', industry: 'Education' }
  ];

  const filteredCaseStudies = activeFilter === 'all' 
    ? caseStudies 
    : caseStudies.filter(study => study.category === activeFilter);

  return (
    <>
      <Helmet>
        <title>Real Results with Advanta AI | Case Studies</title>
        <meta name="description" content="Discover how businesses are scaling faster, saving time, and boosting productivity with AI-powered solutions. Real case studies, real results." />
        <meta name="keywords" content="AI case studies, business automation results, AI success stories, customer testimonials, business transformation" />
        
        <meta property="og:title" content="Real Results with Advanta AI | Case Studies" />
        <meta property="og:description" content="Discover how businesses are scaling faster, saving time, and boosting productivity with AI-powered solutions." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <NewHeader />
        
        <main>
          {/* Hero Section */}
          <section className="pt-20 pb-16 bg-gradient-to-br from-green-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Real Results with{' '}
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Advanta AI
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-4">
                  See how our 6 core capabilities transform businesses across industries with measurable outcomes
                </p>
                <p className="text-lg text-gray-500">
                  AI Workflow Automation • Custom API Integrations • Industry-Specific Learning • Customer Interactions • Data Optimization • Free Resources
                </p>
              </motion.div>
            </div>
          </section>

          {/* Filter Buttons */}
          <section className="py-8 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeFilter === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Case Study Cards */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Mobile: Vertical Stack with Swipe */}
              <div className="block lg:hidden space-y-6">
                {filteredCaseStudies.map((study, index) => (
                  <motion.div
                    key={study.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl border-2 p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      study.featured ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' : 'border-gray-200'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-600">
                        {study.logo}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <study.industryIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">{study.industry}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{study.company}</h3>
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-semibold text-blue-600 mb-3">{study.headline}</h4>
                    <p className="text-gray-600 mb-6 leading-relaxed">{study.summary}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {study.metrics.map((metric, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                          <div className="text-xs text-gray-500">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => setLocation(study.link)}
                      className="w-full group"
                    >
                      View Full Case Study
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Desktop: Staggered Grid */}
              <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredCaseStudies.map((study, index) => (
                  <motion.div
                    key={study.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl border-2 p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      study.featured ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' : 'border-gray-200'
                    }`}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center font-bold text-blue-600 text-lg">
                        {study.logo}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <study.industryIcon className="w-5 h-5 text-gray-500" />
                          <span className="text-sm text-gray-500">{study.industry}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{study.company}</h3>
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-semibold text-blue-600 mb-4">{study.headline}</h4>
                    <p className="text-gray-600 mb-6 leading-relaxed">{study.summary}</p>
                    
                    <div className="space-y-3 mb-8">
                      {study.metrics.map((metric, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-gray-600">{metric.label}</span>
                          <span className="font-bold text-gray-900">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => setLocation(study.link)}
                      variant="outline"
                      className="w-full group"
                    >
                      View Full Case Study
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Results Stats Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Proven Impact Across Industries
                </h2>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {resultStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Trust Reinforcement */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-12">Trusted by Industry Leaders</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                  {trustedCompanies.map((company, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold text-gray-600">
                        {company.name.slice(0, 2)}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{company.name}</div>
                      <div className="text-xs text-gray-500">{company.industry}</div>
                    </motion.div>
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
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Want to Be Our Next Success Story?</h2>
                <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                  Let's build your own AI assistant or workflow — custom-built to solve real challenges
                </p>
                <Button
                  onClick={() => setLocation('/demo')}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Book a Demo
                </Button>
              </motion.div>
            </div>
          </section>
        </main>

        <NewFooter />
      </div>
    </>
  );
}