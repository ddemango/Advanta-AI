import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NewHeader } from '@/components/redesign/NewHeader';
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
    // Industry factors - different industries have different AI impact multipliers
    const industryFactors: Record<string, { eff: number, cost: number, rev: number }> = {
      "eCommerce": { eff: 1.2, cost: 1.1, rev: 1.3 },
      "Financial Services": { eff: 1.4, cost: 1.3, rev: 1.1 },
      "Healthcare": { eff: 1.1, cost: 1.5, rev: 0.9 },
      "Manufacturing": { eff: 1.3, cost: 1.4, rev: 1.0 },
      "Real Estate": { eff: 0.9, cost: 1.0, rev: 1.2 },
      "Technology": { eff: 1.5, cost: 1.2, rev: 1.5 },
      "Education": { eff: 1.1, cost: 1.0, rev: 0.8 },
      "Retail": { eff: 1.2, cost: 1.2, rev: 1.2 },
      "Hospitality": { eff: 1.0, cost: 1.3, rev: 1.1 },
      "Media & Entertainment": { eff: 1.2, cost: 0.9, rev: 1.4 }
    };
    
    // Company size factor (larger companies see different benefits from AI)
    const sizeFactors = {
      small: { eff: 1.1, cost: 0.9, rev: 1.2 }, // Small companies see bigger revenue boosts
      medium: { eff: 1.2, cost: 1.1, rev: 1.1 },
      large: { eff: 1.3, cost: 1.2, rev: 1.0 },
      enterprise: { eff: 1.4, cost: 1.3, rev: 0.9 } // Enterprise sees bigger efficiency gains
    };
    
    // Determine size category
    let sizeCat = 'small';
    if (companySize < 25) sizeCat = 'small';
    else if (companySize < 50) sizeCat = 'medium';
    else if (companySize < 75) sizeCat = 'large';
    else sizeCat = 'enterprise';
    
    // Current efficiency factor (lower efficiency means more room for improvement)
    const efficiencyFactor = Math.max(0.5, (100 - currentEfficiency) / 60);
    
    // Get industry multipliers (default to eCommerce if not found)
    const indFactors = industryFactors[industry] || industryFactors["eCommerce"];
    const szFactors = sizeFactors[sizeCat as keyof typeof sizeFactors];
    
    // Calculate final result ranges with all factors applied
    // Efficiency improvement calculation
    let effBase = 30 + (Math.random() * 5);
    let effFactor = indFactors.eff * szFactors.eff * efficiencyFactor;
    let effMin = Math.round(effBase * effFactor * 0.9);
    let effMax = Math.round(effBase * effFactor * 1.1);
    setEfficiencyImprovement(`${effMin}-${effMax}%`);
    
    // Cost reduction calculation
    let costBase = 20 + (Math.random() * 5);
    let costFactor = indFactors.cost * szFactors.cost;
    let costMin = Math.round(costBase * costFactor * 0.9);
    let costMax = Math.round(costBase * costFactor * 1.1);
    setCostReduction(`${costMin}-${costMax}%`);
    
    // Revenue growth calculation
    let revBase = 15 + (Math.random() * 5);
    let revFactor = indFactors.rev * szFactors.rev;
    let revMin = Math.round(revBase * revFactor * 0.9);
    let revMax = Math.round(revBase * revFactor * 1.1);
    setRevenueGrowth(`${revMin}-${revMax}%`);
    
    // Estimated ROI calculation - more heavily weighted by cost reduction and revenue growth
    let roiBase = ((costMin + costMax) / 2) + ((revMin + revMax) / 2) * 2.5;
    let roiMin = Math.round(roiBase * 2.8);
    let roiMax = Math.round(roiBase * 3.5);
    
    // Ensure ROI ranges make sense (roiMin < roiMax, reasonable numbers)
    roiMin = Math.min(roiMin, 800);
    roiMax = Math.min(roiMax, 1000);
    if (roiMin > roiMax) [roiMin, roiMax] = [roiMax, roiMin];
    
    setEstimatedROI(`${roiMin}-${roiMax}%`);
  }, [industry, companySize, currentEfficiency]);

  return (
    <>
      <Helmet>
        <title>AI ROI Calculator | Advanta AI</title>
        <meta name="description" content="Calculate the potential return on investment for implementing AI solutions in your business." />
      </Helmet>
      
      <NewHeader />
      
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
                      <div 
                        className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${parseInt(efficiencyImprovement.split('-')[0]) || 40}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost Reduction</span>
                      <span className="font-medium">{costReduction}</span>
                    </div>
                    <div className="w-full bg-emerald-900/30 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${parseInt(costReduction.split('-')[0]) || 25}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue Growth</span>
                      <span className="font-medium">{revenueGrowth}</span>
                    </div>
                    <div className="w-full bg-blue-900/30 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${parseInt(revenueGrowth.split('-')[0]) || 20}%` }}
                      ></div>
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