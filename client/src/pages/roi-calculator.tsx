import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { Helmet } from 'react-helmet';

const industries = [
  "eCommerce",
  "Financial Services",
  "Healthcare",
  "Manufacturing",
  "Real Estate",
  "Technology",
  "Education",
  "Retail",
  "Hospitality",
  "Media & Entertainment"
];

export default function ROICalculator() {
  // State for calculator inputs
  const [industry, setIndustry] = useState("eCommerce");
  const [companySize, setCompanySize] = useState(65); // Value 0-100, maps to employee count
  const [currentEfficiency, setCurrentEfficiency] = useState(60); // Percentage 0-100
  
  // State for calculated results
  const [efficiencyImprovement, setEfficiencyImprovement] = useState("35-45%");
  const [costReduction, setCostReduction] = useState("20-30%");
  const [revenueGrowth, setRevenueGrowth] = useState("15-25%");
  const [estimatedROI, setEstimatedROI] = useState("210-280%");
  
  // Function to map company size slider to employee count
  const getCompanySizeLabel = (sliderValue: number) => {
    if (sliderValue < 25) return "1-50 employees";
    if (sliderValue < 50) return "50-200 employees";
    if (sliderValue < 75) return "201-500 employees";
    return "500+ employees";
  };

  // Calculate ROI based on input changes
  useEffect(() => {
    // These are example calculations - in a real app, you'd have more complex formulas
    
    // Efficiency improvement calculation
    let effMin = 35;
    let effMax = 45;
    setEfficiencyImprovement(`${effMin}-${effMax}%`);
    
    // Cost reduction calculation
    let costMin = 20;
    let costMax = 30;
    setCostReduction(`${costMin}-${costMax}%`);
    
    // Revenue growth calculation
    let revMin = 15;
    let revMax = 25;
    setRevenueGrowth(`${revMin}-${revMax}%`);
    
    // Estimated ROI calculation
    let roiMin = 210;
    let roiMax = 280;
    setEstimatedROI(`${roiMin}-${roiMax}%`);
  }, [industry, companySize, currentEfficiency]);

  return (
    <>
      <Helmet>
        <title>AI ROI Calculator | Advanta AI</title>
        <meta name="description" content="Calculate the potential return on investment for implementing AI solutions in your business." />
      </Helmet>
      
      <Header />
      
      <main className="py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mb-12"
          >
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4">
              AI ROI Calculator
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-10">
              Estimate your potential return on investment with our AI solutions. Adjust the sliders to match your business scenario.
            </motion.p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Inputs - Left Side */}
              <motion.div variants={fadeIn} className="space-y-12">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <h2 className="text-xl">Industry</h2>
                    <div className="text-lg">{industry}</div>
                  </div>
                  <Select 
                    value={industry} 
                    onValueChange={setIndustry}
                  >
                    <SelectTrigger className="w-full bg-background/20 border-border">
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(ind => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h2 className="text-xl">Company Size</h2>
                    <div className="text-lg">{getCompanySizeLabel(companySize)}</div>
                  </div>
                  <Slider
                    value={[companySize]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setCompanySize(value[0])}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1-50</span>
                    <span>50-200</span>
                    <span>201-500</span>
                    <span>500+</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h2 className="text-xl">Current Process Efficiency</h2>
                    <div className="text-lg">{currentEfficiency}%</div>
                  </div>
                  <Slider
                    value={[currentEfficiency]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setCurrentEfficiency(value[0])}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Results - Right Side */}
              <motion.div variants={fadeIn} className="space-y-8">
                <h2 className="text-2xl font-semibold mb-6">Estimated Results</h2>
                
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Efficiency Improvement</span>
                      <span className="font-medium">{efficiencyImprovement}</span>
                    </div>
                    <div className="w-full bg-purple-900/30 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost Reduction</span>
                      <span className="font-medium">{costReduction}</span>
                    </div>
                    <div className="w-full bg-emerald-900/30 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue Growth</span>
                      <span className="font-medium">{revenueGrowth}</span>
                    </div>
                    <div className="w-full bg-blue-900/30 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-muted">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl">Estimated ROI</span>
                      <span className="text-xl font-bold text-purple-400">{estimatedROI}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Over 12-18 months</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}