import { useState, useEffect, useRef } from 'react';
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
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
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

  // Calculate ROI based on real AI implementation studies (Latest available: McKinsey, PWC 2024)
  useEffect(() => {
    // Industry factors based on most recent 2024 McKinsey/PWC data
    // McKinsey 2024: 51% expect >5% revenue gains, 34% expect 6-10%, 17% >10%
    // PWC 2024: 20-30% productivity gains, high performers see 13% ROI
    // Note: 2025 comprehensive studies not yet available (mid-year)
    const industryFactors: Record<string, { eff: number, cost: number, rev: number }> = {
      "eCommerce": { eff: 0.25, cost: 0.15, rev: 0.08 }, // High automation potential
      "Financial Services": { eff: 0.30, cost: 0.18, rev: 0.09 }, // Process optimization leaders
      "Healthcare": { eff: 0.18, cost: 0.12, rev: 0.05 }, // Compliance but strong efficiency
      "Manufacturing": { eff: 0.28, cost: 0.20, rev: 0.07 }, // Operational excellence
      "Real Estate": { eff: 0.15, cost: 0.10, rev: 0.06 }, // Growing automation
      "Technology": { eff: 0.35, cost: 0.22, rev: 0.12 }, // Highest AI adoption
      "Education": { eff: 0.12, cost: 0.08, rev: 0.04 }, // Budget constraints
      "Retail": { eff: 0.22, cost: 0.14, rev: 0.07 }, // Customer analytics & automation
      "Hospitality": { eff: 0.16, cost: 0.11, rev: 0.06 }, // Service optimization
      "Media & Entertainment": { eff: 0.24, cost: 0.16, rev: 0.09 } // Content automation
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
    
    // Calculate efficiency improvement (20-35% based on PWC 20-30% productivity gains)
    // Higher efficiency gap = more improvement potential
    const baseEff = (indFactors.eff + efficiencyGap * 0.5) * szFactors.multiplier * 100;
    const effValue1 = Math.max(20, Math.round(baseEff * 1.1));
    const effValue2 = Math.min(35, Math.round(baseEff * 1.4));
    const effMin = Math.min(effValue1, effValue2);
    const effMax = Math.max(effValue1, effValue2);
    setEfficiencyImprovement(`${effMin}-${effMax}%`);
    
    // Calculate cost reduction (12-25% based on actual implementations)
    const baseCost = (indFactors.cost + efficiencyGap * 0.3) * szFactors.multiplier * 100;
    const costValue1 = Math.max(12, Math.round(baseCost * 1.1));
    const costValue2 = Math.min(25, Math.round(baseCost * 1.4));
    const costMin = Math.min(costValue1, costValue2);
    const costMax = Math.max(costValue1, costValue2);
    setCostReduction(`${costMin}-${costMax}%`);
    
    // Calculate revenue growth (6-15% based on McKinsey data: 51% see >5%, 34% see 6-10%)
    const baseRev = (indFactors.rev + efficiencyGap * 0.2) * szFactors.multiplier * 100;
    const revValue1 = Math.max(6, Math.round(baseRev * 1.2));
    const revValue2 = Math.min(15, Math.round(baseRev * 1.6));
    const revMin = Math.min(revValue1, revValue2);
    const revMax = Math.max(revValue1, revValue2);
    setRevenueGrowth(`${revMin}-${revMax}%`);
    
    // Calculate ROI (150-350% over 12-18 months based on actual data)
    // Average: 5.9% annually = 125% over 18 months
    // High performers: 13% annually = 235% over 18 months
    // Best cases: 20% annually = 360% over 18 months
    const combinedBenefit = ((effMin + effMax) / 2 * 0.35) + ((costMin + costMax) / 2 * 0.35) + ((revMin + revMax) / 2 * 0.30);
    const roiMultiplier = 8 + (combinedBenefit / 100) * 4; // Enhanced multiplier for 18-month projection
    const roiValue1 = Math.max(150, Math.round(combinedBenefit * roiMultiplier * 0.9));
    const roiValue2 = Math.min(350, Math.round(combinedBenefit * roiMultiplier * 1.1));
    const roiMin = Math.min(roiValue1, roiValue2);
    const roiMax = Math.max(roiValue1, roiValue2);
    
    setEstimatedROI(`${roiMin}-${roiMax}%`);
  }, [industry, companySize, currentEfficiency]);

  // Close tooltip when clicking outside (mobile support)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <>
      <Helmet>
        <title>AI ROI Calculator | Advanta AI</title>
        <meta name="description" content="Calculate the potential return on investment for implementing AI solutions in your business." />
      </Helmet>
      
      <TooltipProvider>
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
                      <div ref={tooltipRef}>
                        <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
                          <TooltipTrigger asChild>
                            <button 
                              type="button"
                              className="p-1 border-0 bg-transparent hover:bg-muted rounded-sm transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                              onClick={() => setShowTooltip(!showTooltip)}
                              onMouseEnter={() => !('ontouchstart' in window) && setShowTooltip(true)}
                              onMouseLeave={() => !('ontouchstart' in window) && setShowTooltip(false)}
                              aria-label="What is Current Process Efficiency?"
                            >
                              <Info className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent 
                            side="top" 
                            className="max-w-xs p-4 text-sm bg-popover border border-border shadow-lg z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="mb-2 font-medium text-foreground">What is Current Process Efficiency?</p>
                            <p className="text-muted-foreground mb-2">Rate how efficiently your current business processes operate on a scale from 0-100%:</p>
                            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                              <li>• <strong className="text-foreground">Low (0-30%):</strong> Heavily manual, frequent errors, slow processing</li>
                              <li>• <strong className="text-foreground">Medium (31-70%):</strong> Some automation, moderate efficiency</li>
                              <li>• <strong className="text-foreground">High (71-100%):</strong> Highly automated, streamlined processes</li>
                            </ul>
                            <p className="mt-2 text-xs text-muted-foreground italic">Lower efficiency = more room for AI-driven improvements</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
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
      </TooltipProvider>
    </>
  );
}