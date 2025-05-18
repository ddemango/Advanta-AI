import { useState } from 'react';
import { motion } from 'framer-motion';
import { CaseStudyCard } from '@/components/ui/case-study-card';
import { Button } from '@/components/ui/button';
import { fadeIn, staggerContainer } from '@/lib/animations';

// Case study data
const caseStudies = [
  {
    id: 1,
    title: 'Personalization Engine Overhaul',
    client: 'FashionGo',
    logo: 'FG',
    industry: 'eCommerce',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
    metrics: [
      { label: 'Conversion Rate', value: '+38%' },
      { label: 'Average Order Value', value: '+22%' },
      { label: 'Customer Retention', value: '+47%' }
    ],
    quote: 'The AI recommendations are so accurate that customers ask if we\'re reading their minds.',
    color: 'primary'
  },
  {
    id: 2,
    title: 'AI Task Prioritization & Assignment',
    client: 'TaskMaster',
    logo: 'TM',
    industry: 'SaaS',
    image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
    metrics: [
      { label: 'Team Productivity', value: '+41%' },
      { label: 'Project Completion Time', value: '-28%' },
      { label: 'User Engagement', value: '+63%' }
    ],
    quote: 'We\'ve eliminated endless planning meetings with AI that learns team patterns.',
    color: 'accent'
  },
  {
    id: 3,
    title: 'Fraud Detection & Risk Analysis',
    client: 'FinCore',
    logo: 'FC',
    industry: 'Finance',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
    metrics: [
      { label: 'Fraud Detection Rate', value: '+92%' },
      { label: 'False Positives', value: '-76%' },
      { label: 'Operational Cost', value: '-34%' }
    ],
    quote: 'The system identified patterns that would take months for human analysts to discover.',
    color: 'secondary'
  },
  {
    id: 4,
    title: 'Inventory Optimization System',
    client: 'RetailPro',
    logo: 'RP',
    industry: 'Retail',
    image: 'https://images.unsplash.com/photo-1580894732930-0babd100d356?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
    metrics: [
      { label: 'Stockout Reduction', value: '-68%' },
      { label: 'Inventory Carrying Cost', value: '-32%' },
      { label: 'Forecast Accuracy', value: '+45%' }
    ],
    quote: 'The AI system predicts demand better than our most experienced team members.',
    color: 'primary'
  },
  {
    id: 5,
    title: 'Patient Care Optimization',
    client: 'HealthCorp',
    logo: 'HC',
    industry: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
    metrics: [
      { label: 'Patient Wait Times', value: '-56%' },
      { label: 'Staff Efficiency', value: '+37%' },
      { label: 'Patient Satisfaction', value: '+48%' }
    ],
    quote: 'Our care quality improved while simultaneously reducing staff burnout.',
    color: 'accent'
  },
  {
    id: 6,
    title: 'Real Estate Market Predictor',
    client: 'HomeVista',
    logo: 'HV',
    industry: 'Real Estate',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=500',
    metrics: [
      { label: 'Price Prediction Accuracy', value: '+85%' },
      { label: 'Days on Market', value: '-42%' },
      { label: 'Client Portfolio Growth', value: '+29%' }
    ],
    quote: 'We can now pinpoint market shifts months before our competitors.',
    color: 'secondary'
  }
];

const industries = [
  'All Industries',
  'eCommerce',
  'SaaS',
  'Real Estate',
  'Finance',
  'Healthcare',
  'Retail'
];

export default function CaseStudies() {
  const [activeIndustry, setActiveIndustry] = useState('All Industries');
  const [visibleCount, setVisibleCount] = useState(3);

  const filteredCaseStudies = activeIndustry === 'All Industries'
    ? caseStudies
    : caseStudies.filter(study => study.industry === activeIndustry);

  const visibleCaseStudies = filteredCaseStudies.slice(0, visibleCount);
  const hasMore = visibleCaseStudies.length < filteredCaseStudies.length;

  return (
    <section id="case-studies" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">Case Studies & Results</motion.h2>
          <motion.p variants={fadeIn} className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how our AI solutions have transformed businesses across industries with measurable outcomes.
          </motion.p>
        </motion.div>
        
        {/* Case Study Filters */}
        <motion.div 
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-wrap justify-center mb-10 gap-2"
        >
          {industries.map((industry, index) => (
            <Button
              key={index}
              variant={activeIndustry === industry ? "default" : "outline"}
              className={`text-sm font-medium ${activeIndustry === industry ? 'bg-primary text-white' : ''}`}
              onClick={() => {
                setActiveIndustry(industry);
                setVisibleCount(3); // Reset visible count when filter changes
              }}
            >
              {industry}
            </Button>
          ))}
        </motion.div>
        
        {/* Case Studies Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {visibleCaseStudies.map((study) => (
            <motion.div key={study.id} variants={fadeIn}>
              <CaseStudyCard caseStudy={study} />
            </motion.div>
          ))}
        </motion.div>
        
        {hasMore && (
          <div className="text-center mt-12">
            <Button 
              onClick={() => setVisibleCount(prev => prev + 3)}
              variant="outline"
              size="lg"
            >
              View More Case Studies
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
