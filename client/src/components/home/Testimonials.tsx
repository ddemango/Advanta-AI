import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { DigitalRain } from '@/components/ui/digital-rain';
import { ParticleText } from '@/components/ui/particle-text';
import { GlassCard } from '@/components/ui/glass-card';

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'CEO, TechForward',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=150&h=150',
    quote: 'Advanta AI transformed our customer service operations with their PromptCore solution. We\'ve seen a 67% reduction in resolution time and significantly higher satisfaction scores. Their team was incredible throughout the entire process.',
    rating: 5,
    tags: ['PromptCore™', 'Customer Service', 'SaaS']
  },
  {
    id: 2,
    name: 'Michael Chen',
    position: 'CTO, RetailNext',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=150&h=150',
    quote: 'The SignalFlow predictive analytics platform completely changed how we forecast inventory and manage our supply chain. We\'ve cut waste by 31% and improved product availability. The ROI was evident within the first quarter.',
    rating: 5,
    tags: ['SignalFlow™', 'Retail', 'Supply Chain']
  },
  {
    id: 3,
    name: 'Rebecca Martinez',
    position: 'Marketing Director, GrowFast',
    image: 'https://images.unsplash.com/photo-1551069613-1904dbdcda11?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=150&h=150',
    quote: 'NeuroAds has been a game-changer for our digital marketing. We\'re seeing 42% higher conversion rates and 28% lower acquisition costs. The platform continuously optimizes our campaigns without constant manual adjustments.',
    rating: 4.5,
    tags: ['NeuroAds™', 'Marketing', 'eCommerce']
  }
];

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [industry, setIndustry] = useState('eCommerce');
  const [companySize, setCompanySize] = useState(60);
  const [efficiency, setEfficiency] = useState(60);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Recalculate slide width on window resize
  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current) {
        const slideItems = sliderRef.current.querySelectorAll('.testimonial-slide');
        if (slideItems.length > 0) {
          setSlideWidth(slideItems[0].clientWidth);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle navigation
  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="testimonials" className="py-20 bg-background relative overflow-hidden">
      {/* Digital rain background effect */}
      <div className="absolute inset-0 opacity-10">
        <DigitalRain />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="inline-block h-16 md:h-20 mb-6">
            <ParticleText text="What Our Clients Say" fontSize={40} color="#ffffff" className="h-full" />
          </motion.div>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From startups to enterprise organizations, our clients experience measurable results with our AI solutions.
          </motion.p>
        </motion.div>
        
        <div className="relative testimonial-slider">
          <div className="overflow-hidden">
            <div 
              ref={sliderRef}
              className="testimonial-slides flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentSlide * slideWidth}px)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="testimonial-slide w-full lg:w-1/2 flex-shrink-0 px-4">
                  <motion.div 
                    whileHover={{ scale: 1.03 }} 
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <GlassCard>
                      <TestimonialCard testimonial={testimonial} />
                    </GlassCard>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Slider Controls */}
          <div className="flex justify-center mt-8">
            <Button 
              onClick={goToPrev}
              variant="outline" 
              size="icon" 
              className="rounded-full h-10 w-10 mr-4"
            >
              <i className="fas fa-arrow-left"></i>
            </Button>
            <div className="flex items-center">
              {testimonials.map((_, index) => (
                <span 
                  key={index} 
                  className={`dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                ></span>
              ))}
            </div>
            <Button 
              onClick={goToNext}
              variant="outline" 
              size="icon" 
              className="rounded-full h-10 w-10 ml-4"
            >
              <i className="fas fa-arrow-right"></i>
            </Button>
          </div>
        </div>
        
        {/* Advanced ROI Calculator */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-20 relative rounded-2xl overflow-hidden"
        >
          {/* Animated background effects */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/95 z-10" />
            <div className="absolute inset-0 overflow-hidden opacity-30">
              <FlowingData />
            </div>
          </div>
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-4">AI ROI Calculator</h3>
            <p className="text-muted-foreground mb-6">
              Estimate your potential return on investment with our AI solutions. Adjust the sliders to match your business scenario.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <label className="text-white font-medium">Industry</label>
                    <span className="text-muted-foreground">{industry}</span>
                  </div>
                  <Select
                    value={industry}
                    onValueChange={setIndustry}
                  >
                    <SelectTrigger className="w-full bg-background border border-border text-white rounded-lg p-3">
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eCommerce">eCommerce</SelectItem>
                      <SelectItem value="SaaS">SaaS</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <label className="text-white font-medium">Company Size</label>
                    <span className="text-muted-foreground">
                      {companySize < 25 ? '1-50 employees' : 
                       companySize < 50 ? '50-200 employees' : 
                       companySize < 75 ? '201-500 employees' : '500+ employees'}
                    </span>
                  </div>
                  <Slider
                    value={[companySize]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setCompanySize(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1-50</span>
                    <span>50-200</span>
                    <span>201-500</span>
                    <span>500+</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <label className="text-white font-medium">Current Process Efficiency</label>
                    <span className="text-muted-foreground">{efficiency}%</span>
                  </div>
                  <Slider
                    value={[efficiency]}
                    min={20}
                    max={90}
                    step={1}
                    onValueChange={(value) => setEfficiency(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-background rounded-xl p-6">
                <h4 className="text-lg font-bold mb-4">Estimated Results</h4>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Efficiency Improvement</span>
                      <span className="text-white font-medium">35-45%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-1">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost Reduction</span>
                      <span className="text-white font-medium">20-30%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-1">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue Growth</span>
                      <span className="text-white font-medium">15-25%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-1">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Estimated ROI</span>
                      <span className="text-primary">210-280%</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Over 12-18 months</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border p-6 bg-background bg-opacity-50">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
                Results are estimates based on industry averages and client results.
              </div>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href="#contact">Get Detailed Analysis</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
