import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { Counter } from '@/components/ui/counter';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

export default function Hero() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="pt-28 pb-20 relative overflow-hidden neural-bg" id="hero">
      <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/40 blur-[80px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/40 blur-[80px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
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
              Engineering the <GradientText>Future of Intelligence</GradientText>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Transforming businesses with AI-powered solutions, custom machine learning development, and industry-specific applications that drive real results.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <a href="#contact">Book a Discovery Call</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#ai-demo">Test the AI Suite</a>
              </Button>
            </div>
          </motion.div>
          
          {/* Hero Image/Animation */}
          <motion.div 
            variants={fadeIn}
            className="lg:w-1/2 relative"
          >
            {/* A futuristic neural network visualization */}
            <img 
              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600" 
              alt="Futuristic AI visualization with glowing neural network connections" 
              className="rounded-xl shadow-2xl w-full h-auto relative z-10 animate-float"
            />
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl blur-lg"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-xl blur-lg"></div>
          </motion.div>
        </motion.div>
        
        {/* Stats Strip */}
        <div ref={ref} className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
