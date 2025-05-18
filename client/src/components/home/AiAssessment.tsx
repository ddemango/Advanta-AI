import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

export default function AiAssessment() {
  return (
    <section className="py-20 bg-background neural-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-col lg:flex-row items-center bg-muted rounded-2xl overflow-hidden border border-border"
        >
          <motion.div 
            variants={fadeInUp}
            className="lg:w-1/2 p-8 lg:p-12"
          >
            <h2 className="text-3xl font-bold mb-4">Is Your Business AI-Ready?</h2>
            <p className="text-muted-foreground mb-6">
              Our AI Readiness Assessment tool analyzes your current operations and identifies the highest-value AI opportunities specific to your business.
            </p>
            
            <div className="bg-background rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Answer 5 Questions to Get:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-secondary mt-1 mr-3"></i>
                  <span className="text-gray-300">Custom AI opportunity roadmap</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-secondary mt-1 mr-3"></i>
                  <span className="text-gray-300">Implementation timeline & cost estimates</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-secondary mt-1 mr-3"></i>
                  <span className="text-gray-300">Projected ROI analysis for your industry</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-secondary mt-1 mr-3"></i>
                  <span className="text-gray-300">Technology stack recommendations</span>
                </li>
              </ul>
            </div>
            
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Free Assessment
            </Button>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            className="lg:w-1/2 p-8 lg:p-0"
          >
            {/* A digital transformation visualization */}
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600" 
              alt="Digital transformation assessment visualization with data points and AI analysis" 
              className="rounded-xl lg:rounded-l-none w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
