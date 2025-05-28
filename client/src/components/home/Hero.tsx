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
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1 });

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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight">
              <span className="block mb-1 sm:mb-2">We Build Custom</span>
              <GradientText className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">AI Solutions</GradientText>
              <span className="block mb-1 sm:mb-2">For Your Business</span>
            </h1>
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Stop doing repetitive tasks manually. We create AI assistants that handle your customer support, lead generation, content creation, and data analysis - so you can focus on growing your business.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-sm sm:text-base">
                <a href="/build-my-ai-stack">⚡ Build My AI Stack</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-sm sm:text-base">
                <a href="/contact">💬 Talk to an Expert</a>
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
              className="relative aspect-[4/3] w-full z-10"
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
              
              {/* Interactive AI Demo Video */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="absolute inset-0 flex items-center justify-center z-30"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent z-10"></div>
                  
                  {/* Business AI Demo Visualization */}
                  <div className="w-full h-full relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                    <div className="absolute inset-4 grid grid-cols-3 gap-2">
                      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30">
                        <h3 className="text-xs text-purple-300 mb-2">Sales AI Agent</h3>
                        <div className="text-lg font-bold text-white">+342%</div>
                        <div className="text-xs text-green-400">Lead Generation</div>
                        <div className="mt-2 h-6 bg-gradient-to-r from-purple-500/30 to-transparent rounded animate-pulse"></div>
                      </div>
                      
                      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30">
                        <h3 className="text-xs text-blue-300 mb-2">Support AI Agent</h3>
                        <div className="text-lg font-bold text-white">24/7</div>
                        <div className="text-xs text-green-400">Response Time</div>
                        <div className="mt-2 h-6 bg-gradient-to-r from-blue-500/30 to-transparent rounded animate-pulse"></div>
                      </div>
                      
                      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-green-500/30">
                        <h3 className="text-xs text-green-300 mb-2">Analytics AI</h3>
                        <div className="text-lg font-bold text-white">94%</div>
                        <div className="text-xs text-green-400">Accuracy</div>
                        <div className="mt-2 h-6 bg-gradient-to-r from-green-500/30 to-transparent rounded animate-pulse"></div>
                      </div>
                      
                      <div className="col-span-3 bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-indigo-500/30 mt-2">
                        <h3 className="text-xs text-indigo-300 mb-2">Office Workflow Automation</h3>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-purple-500/50 rounded-full flex items-center justify-center text-xs">📊</div>
                          <div className="flex-1 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded animate-pulse"></div>
                          <div className="w-6 h-6 bg-blue-500/50 rounded-full flex items-center justify-center text-xs">🤖</div>
                          <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded animate-pulse"></div>
                          <div className="w-6 h-6 bg-green-500/50 rounded-full flex items-center justify-center text-xs">✅</div>
                        </div>
                        <div className="text-xs text-gray-300 mt-2">AI agents processing business tasks automatically</div>
                      </div>
                    </div>
                  </div>
                  

                  
                  {/* Caption */}
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <p className="text-white text-sm font-medium backdrop-blur-sm bg-black/30 p-2 rounded-md inline-block">
                      Watch how our AI transforms business data into actionable insights
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Gradient decorative elements */}
{/* Removed gradient animations */}
          </motion.div>
        </motion.div>
        
        {/* Stats Strip */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8" ref={ref as any}>
          <div className="bg-muted/40 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-glow-sm">
            <div className="text-3xl font-bold text-white mb-1">
              <Counter value={385} start={0} duration={2000} inView={inView} suffix="%" />
            </div>
            <div className="text-muted-foreground font-medium">Average Revenue Increase</div>
            <div className={`mt-2 stats-bar ${inView ? 'animate' : ''}`}></div>
          </div>
          <div className="bg-muted/40 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-glow-sm">
            <div className="text-3xl font-bold text-white mb-1">
              <Counter value={312} start={0} duration={2000} inView={inView} suffix="%" />
            </div>
            <div className="text-muted-foreground font-medium">Average ROI in First Year</div>
            <div className={`mt-2 stats-bar ${inView ? 'animate' : ''}`}></div>
          </div>
          <div className="bg-muted/40 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-glow-sm">
            <div className="text-3xl font-bold text-white mb-1">
              <Counter value={94} start={0} duration={2000} inView={inView} suffix="%" />
            </div>
            <div className="text-muted-foreground font-medium">Workflow Automation Rate</div>
            <div className={`mt-2 stats-bar ${inView ? 'animate' : ''}`}></div>
          </div>
          <div className="bg-muted/40 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-glow-sm">
            <div className="text-3xl font-bold text-white mb-1">
              <Counter value={60} start={0} duration={2000} inView={inView} suffix="+" />
            </div>
            <div className="text-muted-foreground font-medium">Fortune 500 Clients</div>
            <div className={`mt-2 stats-bar ${inView ? 'animate' : ''}`}></div>
          </div>
          <div className="bg-muted/40 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-glow-sm">
            <div className="text-3xl font-bold text-white mb-1">
              <Counter value={28} start={0} duration={2000} inView={inView} suffix="M+" />
            </div>
            <div className="text-muted-foreground font-medium">Daily AI Decisions Made</div>
            <div className={`mt-2 stats-bar ${inView ? 'animate' : ''}`}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
