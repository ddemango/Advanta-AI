import { motion } from 'framer-motion';
import { fadeIn, fadeInUp } from '@/lib/animations';
import { Card } from '@/components/ui/card';

interface CaseStudyProps {
  client: string;
  industry: string;
  challenge?: string;
  problem?: string;
  solution: string;
  results?: string[];
  metrics?: {
    label: string;
    value: string;
    icon?: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
  primaryColor?: string;
  secondaryColor?: string;
  id?: number;
  title?: string;
}

export const CaseStudy = ({
  client,
  industry,
  challenge,
  problem,
  solution,
  results,
  metrics,
  testimonial,
  primaryColor = 'from-blue-500',
  secondaryColor = 'to-indigo-600',
  id,
  title
}: CaseStudyProps & { problem?: string }) => {
  // Use challenge if provided, otherwise use problem (for backward compatibility)
  const challengeText = challenge || problem;
  // Function to get appropriate industry icons
  const getIndustryIcon = (industryName: string): string => {
    const lowerIndustry = industryName.toLowerCase();
    
    if (lowerIndustry.includes('manufacturing')) return 'fas fa-industry';
    if (lowerIndustry.includes('retail') || lowerIndustry.includes('e-commerce')) return 'fas fa-shopping-cart';
    if (lowerIndustry.includes('tech') || lowerIndustry.includes('saas')) return 'fas fa-microchip';
    if (lowerIndustry.includes('finance') || lowerIndustry.includes('banking')) return 'fas fa-chart-line';
    if (lowerIndustry.includes('health') || lowerIndustry.includes('medical')) return 'fas fa-heartbeat';
    if (lowerIndustry.includes('education')) return 'fas fa-graduation-cap';
    if (lowerIndustry.includes('media') || lowerIndustry.includes('publishing')) return 'fas fa-newspaper';
    if (lowerIndustry.includes('hospitality') || lowerIndustry.includes('hotel')) return 'fas fa-concierge-bell';
    if (lowerIndustry.includes('marketing') || lowerIndustry.includes('advertising')) return 'fas fa-bullhorn';
    if (lowerIndustry.includes('logistics') || lowerIndustry.includes('transportation')) return 'fas fa-truck';
    if (lowerIndustry.includes('energy') || lowerIndustry.includes('utilities')) return 'fas fa-bolt';
    
    // Default icon if no match
    return 'fas fa-building';
  };

  return (
    <motion.div 
      variants={fadeIn}
      initial="hidden"
      animate="show"
      className="my-10"
    >
      <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-gray-800 shadow-xl shadow-black/20">
        {/* Header */}
        <div className={`bg-gradient-to-r ${primaryColor} ${secondaryColor} p-6 rounded-t-xl relative overflow-hidden`}>
          <div className="absolute inset-0 bg-grid-white/5 bg-[length:20px_20px] opacity-20"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{client}</h3>
              <p className="text-white/80 text-sm flex items-center">
                <i className={`mr-2 ${getIndustryIcon(industry)}`}></i>
                {industry}
              </p>
            </div>
            <div className="hidden md:flex h-14 w-14 rounded-full bg-white/10 items-center justify-center">
              <i className={`text-white text-2xl ${getIndustryIcon(industry)}`}></i>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Challenge & Solution */}
          <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-6">
            <Card className="p-5 bg-black/30 border-gray-800">
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                  <i className="fas fa-exclamation-triangle text-red-500 text-sm"></i>
                </span>
                Challenge
              </h4>
              <p className="text-gray-300 text-sm">{challengeText}</p>
            </Card>
            
            <Card className="p-5 bg-black/30 border-gray-800">
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <i className="fas fa-lightbulb text-green-500 text-sm"></i>
                </span>
                Solution
              </h4>
              <p className="text-gray-300 text-sm">{solution}</p>
            </Card>
          </motion.div>
          
          {/* Results */}
          <motion.div variants={fadeInUp} className="mt-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <i className="fas fa-chart-line text-blue-500 text-sm"></i>
              </span>
              Results
            </h4>
            
            <ul className="grid md:grid-cols-2 gap-x-4 gap-y-2 mb-6">
              {results && results.length > 0 ? results.map((result, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">
                    <i className="fas fa-check-circle"></i>
                  </span>
                  <span className="text-gray-300 text-sm">{result}</span>
                </li>
              )) : (
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">
                    <i className="fas fa-check-circle"></i>
                  </span>
                  <span className="text-gray-300 text-sm">Significant improvements in business metrics and operational efficiency</span>
                </li>
              )}
            </ul>
          </motion.div>
          
          {/* Metrics */}
          <motion.div variants={fadeInUp} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metrics && metrics.map((metric, index) => (
                <div key={index} className="bg-black/80 border border-gray-800 rounded-lg overflow-hidden">
                  <div className="flex flex-col items-center p-6">
                    <div className="mb-4 bg-indigo-500/20 p-3 rounded-full">
                      <i className={`${metric.icon || 'fas fa-chart-bar'} text-indigo-400 text-xl`}></i>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-primary">{metric.value}</p>
                      <p className="text-sm text-gray-400 mt-1">{metric.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Data Insights & Analytics */}
          <motion.div variants={fadeInUp} className="mt-8">
            <Card className="p-6 border-gray-800 bg-gradient-to-br from-gray-900/90 to-black/90">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center mr-3">
                  <i className="fas fa-chart-pie text-blue-500 text-sm"></i>
                </span>
                Data Insights
              </h4>
              {/* No grid with metrics here anymore - removed as requested */}
              
              {/* Service-specific insights */}
              <div className="mt-4 bg-black/40 border border-gray-800 rounded-lg p-5">
                <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
                  <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                  Why This Solution Works
                </h5>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mt-0.5 mr-3">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <p><span className="text-white font-medium">Enterprise-Grade Architecture:</span> Built on a scalable cloud infrastructure that handles millions of transactions with sub-second response times.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mt-0.5 mr-3">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <p><span className="text-white font-medium">Proprietary AI Models:</span> Our solution uses custom-trained neural networks that outperform generic AI models by an average of 37% in accuracy for this specific industry.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mt-0.5 mr-3">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <p><span className="text-white font-medium">Continuous Improvement:</span> Self-learning algorithms automatically adapt to changing patterns, resulting in 8.3% performance gains per quarter without manual intervention.</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Testimonial */}
          {testimonial && (
            <motion.div variants={fadeInUp} className="mt-8">
              <Card className="p-6 border-gray-800 bg-gradient-to-br from-gray-900/80 to-black/80">
                <div className="flex flex-col">
                  <div className="flex mb-4">
                    <span className="text-4xl text-primary/40">"</span>
                  </div>
                  <p className="text-gray-300 italic text-sm mb-4">{testimonial.quote}</p>
                  <div className="flex items-center mt-auto">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <i className="fas fa-user text-primary"></i>
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-medium">{testimonial.author}</p>
                      <p className="text-gray-400 text-xs">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
          
          {/* CTA */}
          <motion.div variants={fadeInUp} className="mt-8 flex justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
              <i className="fas fa-comments mr-2"></i>
              Discuss Your Project
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};