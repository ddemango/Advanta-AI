import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Lock, Star, Users, Zap, Crown, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { motion } from 'framer-motion';
import { NewHeader } from '@/components/redesign/NewHeader';

export default function ClientSuiteWaitlist() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const submitWaitlist = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest('POST', '/api/waitlist/client-suite', { 
        email, 
        source: 'client-suite-portal' 
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Welcome to the exclusive list!",
        description: "You'll be among the first to access the Client Suite Portal.",
      });
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    submitWaitlist.mutate(email);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Helmet>
          <title>Welcome to the Exclusive List - Advanta AI Client Suite</title>
          <meta name="description" content="You're now on the exclusive waitlist for Advanta AI's Client Suite Portal" />
        </Helmet>
        <NewHeader />
        <div className="flex items-center justify-center p-4 pt-20">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              You're In! 🎉
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Welcome to the exclusive Client Suite Portal waitlist. You'll be among the first to experience the future of AI business automation.
            </p>
          </div>
          
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-white mb-4">What happens next?</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">Priority access when we launch (within 7 days)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Exclusive preview of premium features</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Special founding member pricing</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-gray-400 mt-8">
            Keep an eye on your inbox - something amazing is coming very soon.
          </p>
        </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Helmet>
        <title>Exclusive Access - Advanta AI Client Suite Portal</title>
        <meta name="description" content="Join the exclusive waitlist for Advanta AI's premium Client Suite Portal. Limited early access for select businesses." />
      </Helmet>
      <NewHeader />
      <div className="flex items-center justify-center p-4 pt-20">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-4 py-2 mb-6">
              <Crown className="w-4 h-4 mr-2" />
              EXCLUSIVE INVITATION ONLY
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Great things come
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic">
                to those who wait.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              The Client Suite Portal is our most advanced AI automation platform. 
              Built exclusively for ambitious businesses ready to transform their operations.
            </p>
            
            <p className="text-lg text-gray-400 mb-8">
              Limited early access. Select businesses only.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {/* Waitlist Form */}
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-8">
              <div className="mb-6">
                <Lock className="w-8 h-8 text-yellow-400 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">Request Exclusive Access</h3>
                <p className="text-gray-300">Join the waitlist for priority access to our premium business automation suite.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Your business email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={submitWaitlist.isPending || !email}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg"
                >
                  {submitWaitlist.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Securing Your Spot...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Get Notified
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
              
              <p className="text-xs text-gray-400 mt-4 text-center">
                By joining, you agree to receive exclusive updates about the Client Suite Portal.
              </p>
            </CardContent>
          </Card>

          {/* Exclusive Features */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white mb-6">What makes it exclusive?</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Enterprise-Grade AI Automation</h4>
                  <p className="text-gray-300 text-sm">Advanced workflow automation that typically costs $50K+ to develop internally.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Dedicated Success Manager</h4>
                  <p className="text-gray-300 text-sm">Personal AI implementation specialist for your business transformation.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Custom API Integrations</h4>
                  <p className="text-gray-300 text-sm">Connect any system, database, or tool to create seamless automated workflows.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Enterprise Security & Compliance</h4>
                  <p className="text-gray-300 text-sm">Bank-level security with SOC 2, GDPR, and HIPAA compliance options.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Proof & Urgency */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">200+</div>
              <div className="text-sm text-gray-400">Businesses on waitlist</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">7 Days</div>
              <div className="text-sm text-gray-400">Until launch</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">$2M+</div>
              <div className="text-sm text-gray-400">In automation savings</div>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm">
            <span className="text-yellow-400 font-medium">Limited to 50 founding members.</span> Join the exclusive list before spots fill up.
          </p>
        </motion.div>
        </div>
      </div>
    </div>
  );
}