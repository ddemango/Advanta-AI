import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

export default function PricingCta() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-20 bg-muted neural-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-10"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started with AI?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Use our interactive calculator to get an instant estimate for your custom AI solution.
          </motion.p>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-col sm:flex-row justify-center gap-6 mt-8"
        >
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-lg"
            onClick={() => setLocation('/calculator')}
          >
            <i className="fas fa-calculator mr-2"></i>
            Try AI Cost Calculator
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg"
            asChild
          >
            <a href="/calculator">Build My AI Stack</a>
          </Button>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          <div className="bg-background p-6 rounded-xl border border-border">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <i className="fas fa-bolt text-primary text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant Estimates</h3>
            <p className="text-muted-foreground">
              Get immediate pricing based on your project requirements with our interactive calculator.
            </p>
          </div>
          
          <div className="bg-background p-6 rounded-xl border border-border">
            <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
              <i className="fas fa-sliders-h text-accent text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Customizable Options</h3>
            <p className="text-muted-foreground">
              Adjust features, timelines, and project scope to see how they impact your investment.
            </p>
          </div>
          
          <div className="bg-background p-6 rounded-xl border border-border">
            <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
              <i className="fas fa-file-invoice-dollar text-secondary text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Transparent Pricing</h3>
            <p className="text-muted-foreground">
              No hidden fees or surprises. Get clear, upfront estimates before you commit.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}