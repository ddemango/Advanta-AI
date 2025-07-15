import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
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

  // Calculate ROI based on real AI implementation studies (McKinsey, PWC, Deloitte 2024)
  useEffect(() => {
    // Industry factors based on 2024 AI implementation studies
    // McKinsey: Only 5% see >10% EBIT gains, most see modest returns
    // PWC: 20-30% productivity gains, revenue increases ≤5% for most
    // Deloitte: 20% report ROI >30%, 74% meet expectations
    const industryFactors: Record<string, { eff: number, cost: number, rev: number }> = {
      "eCommerce": { eff: 0.15, cost: 0.08, rev: 0.03 }, // Moderate automation gains
      "Financial Services": { eff: 0.20, cost: 0.12, rev: 0.04 }, // Process optimization
      "Healthcare": { eff: 0.12, cost: 0.06, rev: 0.02 }, // Compliance constraints
      "Manufacturing": { eff: 0.18, cost: 0.10, rev: 0.03 }, // Operational efficiency
      "Real Estate": { eff: 0.10, cost: 0.05, rev: 0.04 }, // Limited automation
      "Technology": { eff: 0.25, cost: 0.15, rev: 0.06 }, // Highest adoption
      "Education": { eff: 0.08, cost: 0.04, rev: 0.02 }, // Budget constraints
      "Retail": { eff: 0.14, cost: 0.07, rev: 0.03 }, // Customer analytics
      "Hospitality": { eff: 0.11, cost: 0.06, rev: 0.03 }, // Service optimization
      "Media & Entertainment": { eff: 0.16, cost: 0.09, rev: 0.05 } // Content automation
    };
    
    // Company size factors based on research data
    const sizeFactors = {
      small: { multiplier: 0.7 }, // Limited resources
      medium: { multiplier: 1.0 }, // Baseline
      large: { multiplier: 1.3 }, // Better implementation
      enterprise: { multiplier: 1.5 } // Best resources and scale
    };
    
    // Determine size category
    let sizeCat = 'small';
    if (companySize < 25) sizeCat = 'small';
    else if (companySize < 50) sizeCat = 'medium';
    else if (companySize < 75) sizeCat = 'large';
    else sizeCat = 'enterprise';
    
    // Current efficiency factor - lower efficiency = more improvement potential
    const efficiencyGap = Math.max(0.3, (100 - currentEfficiency) / 100);
    
    // Get factors
    const indFactors = industryFactors[industry] || industryFactors["eCommerce"];
    const szFactors = sizeFactors[sizeCat as keyof typeof sizeFactors];
    
    // Calculate realistic efficiency improvement (5-25% based on studies)
    const baseEff = indFactors.eff * efficiencyGap * szFactors.multiplier * 100;
    const effValue1 = Math.max(5, Math.round(baseEff * 0.8));
    const effValue2 = Math.min(25, Math.round(baseEff * 1.2));
    const effMin = Math.min(effValue1, effValue2);
    const effMax = Math.max(effValue1, effValue2);
    setEfficiencyImprovement(`${effMin}-${effMax}%`);
    
    // Calculate cost reduction (3-15% based on studies)
    const baseCost = indFactors.cost * szFactors.multiplier * 100;
    const costValue1 = Math.max(3, Math.round(baseCost * 0.8));
    const costValue2 = Math.min(15, Math.round(baseCost * 1.2));
    const costMin = Math.min(costValue1, costValue2);
    const costMax = Math.max(costValue1, costValue2);
    setCostReduction(`${costMin}-${costMax}%`);
    
    // Calculate revenue growth (1-8% based on studies - most organizations see ≤5%)
    const baseRev = indFactors.rev * szFactors.multiplier * 100;
    const revValue1 = Math.max(1, Math.round(baseRev * 0.8));
    const revValue2 = Math.min(8, Math.round(baseRev * 1.2));
    const revMin = Math.min(revValue1, revValue2);
    const revMax = Math.max(revValue1, revValue2);
    setRevenueGrowth(`${revMin}-${revMax}%`);
    
    // Calculate realistic ROI (15-40% over 12-18 months based on 2024 studies)
    // McKinsey: Most don't see transformational returns, PWC: Focus on 20-30% gains
    const avgBenefit = ((effMin + effMax) / 2 + (costMin + costMax) / 2 + (revMin + revMax) / 2) / 3;
    const roiMultiplier = 1.5 + (avgBenefit / 100); // Conservative multiplier
    const roiValue1 = Math.max(15, Math.round(avgBenefit * roiMultiplier * 0.8));
    const roiValue2 = Math.min(40, Math.round(avgBenefit * roiMultiplier * 1.4));
    const roiMin = Math.min(roiValue1, roiValue2);
    const roiMax = Math.max(roiValue1, roiValue2);
    
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
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl">Current Process Efficiency</h2>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Rate how efficiently your current processes operate. Lower efficiency means more room for AI-driven improvements. Consider factors like manual tasks, processing time, error rates, and resource utilization.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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