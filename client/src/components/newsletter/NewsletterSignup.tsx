import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Check } from 'lucide-react';

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'hero';
  className?: string;
}

export function NewsletterSignup({ variant = 'default', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubscribed(true);
        setEmail('');
        toast({
          title: "Successfully Subscribed!",
          description: data.message,
        });
      } else {
        toast({
          title: "Subscription Failed",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Unable to subscribe. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div 
        className={`bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-lg p-4 border border-primary/20 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Stay Updated</h3>
            <p className="text-xs text-muted-foreground">Daily AI insights in your inbox</p>
          </div>
        </div>
        
        {isSubscribed ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Check className="h-4 w-4" />
            <span>Thanks for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm h-8"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="sm"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 h-8 px-3"
            >
              {isLoading ? "..." : "Join"}
            </Button>
          </form>
        )}
      </motion.div>
    );
  }

  if (variant === 'hero') {
    return (
      <motion.div 
        className={`bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-xl p-8 border border-primary/30 ${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-xl mx-auto text-center">
          <motion.div 
            className="inline-flex items-center gap-3 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-3 bg-primary/20 rounded-lg">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Subscribe to Our Newsletter</h2>
          </motion.div>
          
          <motion.p 
            className="text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Get the latest AI insights and updates delivered to your inbox daily.
          </motion.p>
          
          {isSubscribed ? (
            <motion.div 
              className="flex items-center justify-center gap-3 text-green-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Check className="h-5 w-5" />
              <span className="text-lg font-medium">Thanks for subscribing!</span>
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleSubmit} 
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white text-gray-900 placeholder:text-gray-500 border-white/20 focus:border-white focus:ring-2 focus:ring-white/20"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold whitespace-nowrap"
              >
                {isLoading ? "Subscribing..." : "Sign Up"}
              </Button>
            </motion.form>
          )}
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div 
      className={`bg-gradient-to-r from-primary/15 via-accent/15 to-secondary/15 rounded-xl p-6 border border-primary/25 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/20 rounded-lg shrink-0">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Stay Ahead with AI Insights</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Join thousands of professionals getting daily AI updates, industry trends, and actionable insights.
          </p>
          
          {isSubscribed ? (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span className="font-medium">Thanks for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "..." : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}