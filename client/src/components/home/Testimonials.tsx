import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { Button } from '@/components/ui/button';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { DigitalRain } from '@/components/ui/digital-rain';
import { EnterpriseText } from '@/components/ui/enterprise-text';
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
            <EnterpriseText text="What Our Clients Say" fontSize={40} className="h-full" />
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
        

      </div>
    </section>
  );
}
