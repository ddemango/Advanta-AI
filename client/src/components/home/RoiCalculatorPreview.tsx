import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fadeIn, fadeInUp } from '@/lib/animations';
import { useLocation } from 'wouter';

export default function RoiCalculatorPreview() {
  const [, setLocation] = useLocation();
  const [industry, setIndustry] = useState('Technology');
  const [efficiency, setEfficiency] = useState(25);
  const [roi, setRoi] = useState('385-412%');
  
  // Cycle through industries for demo effect
  useEffect(() => {
    const industries = ['Technology', 'eCommerce', 'Healthcare', 'Manufacturing', 'Financial Services'];
    const interval = setInterval(() => {
      setIndustry(industries[Math.floor(Math.random() * industries.length)]);
      
      // Update efficiency and ROI values
      const newEfficiency = Math.floor(Math.random() * 40) + 20;
      setEfficiency(newEfficiency);
      
      // Calculate new ROI range
      const baseRoi = 340 + Math.floor(Math.random() * 100);
      const roiRange = `${baseRoi}-${baseRoi + Math.floor(Math.random() * 50)}%`;
      setRoi(roiRange);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="bg-black/30 backdrop-blur-sm rounded-xl border border-primary/20 shadow-lg p-6 mt-10"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <motion.div variants={fadeInUp} className="w-full md:w-7/12">
          <h3 className="text-xl font-semibold mb-2">AI ROI Calculator</h3>
          <p className="text-gray-300 mb-4">
            Discover how much your business could save with our AI solutions.
          </p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Industry</span>
                <span className="text-sm font-medium">{industry}</span>
              </div>
              <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: `${efficiency}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Estimated ROI</span>
                <span className="text-xl font-bold text-primary">{roi}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Over 12-18 months</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={fadeInUp} className="w-full md:w-5/12 text-center">
          <div className="flex flex-col justify-center items-center">
            <div className="text-center mb-2">
              <div className="inline-flex items-center bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-300">
                  {roi.split('-')[0]}
                </span>
                <span className="text-xs font-medium text-primary ml-2">
                  avg ROI
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-5">
              Our clients see significant ROI within just 90 days
            </p>
            <Button 
              onClick={() => setLocation('/roi-calculator')}
              size="lg"
              className="w-full sm:w-auto"
            >
              Calculate Your ROI
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}