import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fadeIn, fadeInUp } from '@/lib/animations';
import { toast } from '@/hooks/use-toast';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEmail('');
      toast({
        title: "Success!",
        description: "You've been added to our AI trends newsletter. Check your inbox for exclusive AI insights.",
        variant: "default",
      });
    }, 1000);
  };
  
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="bg-gradient-to-br from-black/80 to-primary/10 backdrop-blur-sm rounded-xl border border-primary/20 p-8 my-12 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="relative z-10">
        <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Stay Ahead with AI Insights
          </h3>
          <p className="text-gray-300">
            Join our newsletter for exclusive AI trend reports, industry insights, and early access to new features.
          </p>
        </motion.div>
        
        <motion.form 
          variants={fadeInUp} 
          onSubmit={handleSubmit}
          className="max-w-md mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-white/5 border-white/10 focus:border-primary"
              required
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            By subscribing, you'll receive our AI Trends Report and occasional updates.
            We respect your privacy and will never share your information.
          </p>
        </motion.form>
      </div>
    </motion.div>
  );
}