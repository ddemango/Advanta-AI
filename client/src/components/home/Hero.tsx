import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { Counter } from '@/components/ui/counter';
import { GradientText } from '@/components/ui/gradient-text';
import { AnimatedParticles } from '@/components/ui/animated-particles';
import { AnimatedText } from '@/components/ui/animated-text';
import { FlowingData } from '@/components/ui/flowing-data';
import { AIBrain } from '@/components/ui/ai-brain';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { useRef } from 'react';

export default function Hero() {
  const { ref: statsRef, inView } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="pt-28 pb-20 relative overflow-hidden" id="hero">
      {/* Advanced animated background */}
      <div className="absolute top-0 left-0 right-0 bottom-0">
        {/* Flowing data visualization */}
        <FlowingData className="z-0" />
        
        {/* Subtle particle effect layer */}
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-40 z-10">
          <AnimatedParticles />
        </div>
        
        {/* Abstract gradient blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/30 blur-[100px] animate-pulse-slow z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/30 blur-[100px] animate-pulse-slow z-0" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-secondary/20 blur-[80px] animate-pulse-slow z-0" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col lg:flex-row items-center"
        >
          {/* Hero Text Content */}
          <motion.div 
            variants={fadeInUp}
            className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
              <span className="block mb-2">Engineering the</span>
              <GradientText>Future of Intelligence</GradientText>
            </h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Transforming businesses with AI-powered solutions, custom machine learning development, and industry-specific applications that drive real results.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <a href="#contact">Book a Discovery Call</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#ai-demo">Test the AI Suite</a>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Advanced Data Visualization */}
          <motion.div 
            variants={fadeIn}
            className="lg:w-1/2 relative"
          >
            {/* Data visualization container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10 shadow-2xl z-10"
            >
              {/* Inner flowing data animation */}
              <div className="absolute inset-0">
                <FlowingData className="opacity-80" />
              </div>
              
              {/* Animated data nodes */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute inset-0 z-20"
              >
                {/* Data nodes */}
                {[...Array(8)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ 
                      x: Math.random() * 100 - 50 + "%", 
                      y: Math.random() * 100 - 50 + "%",
                      scale: 0 
                    }}
                    animate={{ 
                      scale: Math.random() * 0.5 + 0.5,
                      opacity: Math.random() * 0.7 + 0.3
                    }}
                    transition={{ 
                      delay: 1 + i * 0.2, 
                      duration: 0.8,
                      repeatType: "reverse",
                      repeat: Infinity,
                      repeatDelay: Math.random() * 3 + 2
                    }}
                    className={`absolute w-4 h-4 rounded-full bg-${
                      ['primary', 'secondary', 'accent'][i % 3]
                    }/80`}
                    style={{
                      left: `${Math.random() * 80 + 10}%`,
                      top: `${Math.random() * 80 + 10}%`,
                      filter: "blur(1px)",
                    }}
                  />
                ))}
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full z-10 opacity-60">
                  <g className="connections">
                    {[...Array(12)].map((_, i) => (
                      <motion.path
                        key={i}
                        stroke={`hsl(${200 + i * 10}, 80%, 60%)`}
                        strokeWidth="1"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ 
                          pathLength: 1, 
                          opacity: [0, 0.8, 0.2, 0.8, 0],
                          d: `M${Math.random() * 100} ${Math.random() * 100} Q${Math.random() * 100 + 50} ${Math.random() * 100 - 50}, ${Math.random() * 100 + 100} ${Math.random() * 100}`
                        }}
                        transition={{ 
                          delay: i * 0.3,
                          duration: 4,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </g>
                </svg>
              </motion.div>
              
              {/* AI Brain Visualization */}
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="relative w-full h-full">
                  {/* Neural AI brain animation */}
                  <div className="absolute inset-0 scale-90">
                    <AIBrain />
                  </div>
                  
                  {/* Text overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
                      className="text-center backdrop-blur-sm bg-black/10 px-6 py-4 rounded-xl border border-white/10"
                    >
                      <h3 className="font-black text-xl md:text-2xl text-white mb-2">
                        <GradientText>Neural AI Engine</GradientText>
                      </h3>
                      <p className="text-white/80 text-sm">
                        Advanced processing with dynamic learning capabilities
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Bottom labels and metrics */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-4 left-0 right-0 flex justify-between px-6 text-xs text-white/70 z-30"
              >
                <div>Real-time analytics</div>
                <div>ML confidence: 98.7%</div>
              </motion.div>
            </motion.div>
            
            {/* Gradient decorative elements */}
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="absolute -bottom-6 -right-6 w-64 h-64 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl blur-lg"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-xl blur-lg"
            ></motion.div>
          </motion.div>
        </motion.div>
        
        {/* Stats Strip */}
        <div ref={statsRef} className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-muted p-6 rounded-xl">
            <div className="text-3xl font-bold text-white mb-1">
              <Counter value={98} start={0} duration={2000} inView={inView} suffix="%" />
            </div>
            <div className="text-muted-foreground">Client Satisfaction Rate</div>
            <div className={`mt-2 stats-bar ${inView ? 'animate' : ''}`}></div>
          </div>
          <div className="bg-muted p-6 rounded-xl">
            <div className="text-3xl font-bold text-white mb-1">
              <Counter value={87} start={0} duration={2000} inView={inView} suffix="M+" />
            </div>
            <div className="text-muted-foreground">AI Predictions Generated</div>
            <div className={`mt-2 stats-bar ${inView ? 'animate' : ''}`}></div>
          </div>
          <div className="bg-muted p-6 rounded-xl">
            <div className="text-3xl font-bold text-white mb-1">
              <Counter value={42} start={0} duration={2000} inView={inView} suffix="+" />
            </div>
            <div className="text-muted-foreground">Enterprise Clients</div>
            <div className={`mt-2 stats-bar ${inView ? 'animate' : ''}`}></div>
          </div>
          <div className="bg-muted p-6 rounded-xl">
            <div className="text-3xl font-bold text-white mb-1">
              <Counter value={310} start={0} duration={2000} inView={inView} suffix="%" />
            </div>
            <div className="text-muted-foreground">Average ROI Delivered</div>
            <div className={`mt-2 stats-bar ${inView ? 'animate' : ''}`}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
