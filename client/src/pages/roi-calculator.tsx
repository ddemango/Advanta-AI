import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { Helmet } from 'react-helmet';
import { HoverCardEffect } from '@/components/ui/hover-card-effect';

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
  const [companySize, setCompanySize] = useState(50); // Value 0-100, maps to employee count
  const [currentEfficiency, setCurrentEfficiency] = useState(60); // Percentage 0-100
  
  // State for calculated results
  const [efficiencyImprovement, setEfficiencyImprovement] = useState("35-45%");
  const [costReduction, setCostReduction] = useState("20-30%");
  const [revenueGrowth, setRevenueGrowth] = useState("15-25%");
  const [estimatedROI, setEstimatedROI] = useState("210-280%");
  
  // Function to map company size slider to employee count
  const getCompanySizeLabel = (sliderValue: number) => {
    if (sliderValue < 33) return "1-50 employees";
    if (sliderValue < 66) return "51-200 employees";
    if (sliderValue < 80) return "201-500 employees";
    return "500+ employees";
  };

  // Calculate ROI based on input changes
  useEffect(() => {
    // These are example calculations - in a real app, you'd have more complex formulas
    
    // Efficiency improvement calculation
    let effMin = 30 + (currentEfficiency / 10);
    let effMax = 40 + (currentEfficiency / 8);
    setEfficiencyImprovement(`${Math.round(effMin)}-${Math.round(effMax)}%`);
    
    // Cost reduction calculation
    let costMin = 15 + (companySize / 10);
    let costMax = 25 + (companySize / 8);
    setCostReduction(`${Math.round(costMin)}-${Math.round(costMax)}%`);
    
    // Revenue growth calculation
    let revMin = 10 + (companySize / 10);
    let revMax = 20 + (companySize / 10);
    setRevenueGrowth(`${Math.round(revMin)}-${Math.round(revMax)}%`);
    
    // Estimated ROI calculation
    let roiMin = 180 + companySize + currentEfficiency / 2;
    let roiMax = 250 + companySize + currentEfficiency / 2;
    setEstimatedROI(`${Math.round(roiMin)}-${Math.round(roiMax)}%`);
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
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6 text-center">
              AI <span className="gradient-text">ROI Calculator</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
              Estimate your potential return on investment with our AI solutions. Adjust the sliders to match your business scenario.
            </motion.p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Inputs - Left Side */}
              <motion.div variants={fadeIn} className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h2 className="text-xl font-semibold">Industry</h2>
                    <div className="text-lg font-medium">{industry}</div>
                  </div>
                  <Select 
                    value={industry} 
                    onValueChange={setIndustry}
                  >
                    <SelectTrigger className="w-full bg-background border-border">
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(ind => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <HoverCardEffect className="rounded-lg">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <h2 className="text-xl font-semibold">Company Size</h2>
                      <div className="text-lg font-medium">{getCompanySizeLabel(companySize)}</div>
                    </div>
                    <div className="py-6 px-4">
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
                        <span>51-200</span>
                        <span>201-500</span>
                        <span>500+</span>
                      </div>
                    </div>
                  </div>
                </HoverCardEffect>
                
                <HoverCardEffect className="rounded-lg">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <h2 className="text-xl font-semibold">Current Process Efficiency</h2>
                      <div className="text-lg font-medium">{currentEfficiency}%</div>
                    </div>
                    <div className="py-6 px-4">
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
                  </div>
                </HoverCardEffect>
              </motion.div>
              
              {/* Results - Right Side */}
              <motion.div variants={fadeIn} className="space-y-8">
                <div className="bg-muted p-6 rounded-xl border border-border">
                  <h2 className="text-2xl font-semibold mb-6">Estimated Results</h2>
                  
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Efficiency Improvement</span>
                        <span className="font-medium">{efficiencyImprovement}</span>
                      </div>
                      <Progress value={parseInt(efficiencyImprovement.split('-')[1], 10)} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost Reduction</span>
                        <span className="font-medium">{costReduction}</span>
                      </div>
                      <Progress value={parseInt(costReduction.split('-')[1], 10)} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Revenue Growth</span>
                        <span className="font-medium">{revenueGrowth}</span>
                      </div>
                      <Progress value={parseInt(revenueGrowth.split('-')[1], 10)} className="h-2" />
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-semibold">Estimated ROI</span>
                        <span className="text-xl font-bold text-primary">{estimatedROI}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Over 12-18 months</div>
                    </div>
                  </div>
                </div>
                
                <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Ready to Maximize Your ROI?</h3>
                    <p className="text-muted-foreground mb-4">
                      Our team of AI experts will analyze your specific needs and create a detailed ROI analysis for your business.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg font-medium">
                        Request Detailed Analysis
                      </button>
                      <button className="border border-primary text-primary hover:bg-primary/10 py-2 px-4 rounded-lg font-medium">
                        Schedule Consultation
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}