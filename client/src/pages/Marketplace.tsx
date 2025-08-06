import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Store, 
  Bell, 
  Rocket, 
  Zap, 
  Brain, 
  Users, 
  TrendingUp, 
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Marketplace() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const notifyMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest('/api/marketplace/notify', 'POST', { email, source: 'marketplace_page' });
    },
    onSuccess: () => {
      toast({
        title: "You're on the list!",
        description: "We'll notify you as soon as the AI Marketplace launches.",
      });
      setEmail('');
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  });

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    notifyMutation.mutate(email);
  };

  const comingSoonFeatures = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Pre-Built AI Agents",
      description: "Ready-to-deploy AI agents for every business function"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Custom Workflows",
      description: "Drag-and-drop workflow builder with AI integrations"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Marketplace",
      description: "Buy, sell, and share AI solutions with other businesses"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level security for all marketplace transactions"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Real-time insights on AI performance and ROI"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Optimization",
      description: "Automatically optimize AI agents for peak performance"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Businesses Ready to Join" },
    { number: "500+", label: "AI Agents in Development" },
    { number: "50+", label: "Industry Categories" },
    { number: "99.9%", label: "Uptime Guarantee" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Helmet>
        <title>AI Marketplace - Coming Soon | Advanta AI</title>
        <meta name="description" content="The world's first comprehensive AI marketplace. Pre-built agents, custom workflows, and enterprise solutions launching soon." />
        <meta property="og:title" content="AI Marketplace - Coming Soon | Advanta AI" />
        <meta property="og:description" content="The world's first comprehensive AI marketplace. Get notified when we launch." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Coming Soon Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8"
          >
            <Clock className="w-4 h-4" />
            <span>Coming Soon</span>
            <Badge variant="secondary" className="bg-blue-600 text-white">First of its Kind</Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              The World's First
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI Marketplace
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12">
              Discover, deploy, and monetize AI agents like never before. From pre-built solutions to custom workflows, everything you need to scale your business with AI.
            </p>
          </motion.div>

          {/* Notification Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md mx-auto mb-16"
          >
            <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="text-center mb-4">
                <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-gray-900">Get Early Access</h3>
                <p className="text-gray-600">Be the first to know when we launch</p>
              </div>
              <form onSubmit={handleNotifySubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-center"
                />
                <Button
                  type="submit"
                  disabled={notifyMutation.isPending || !email}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {notifyMutation.isPending ? 'Joining...' : 'Notify Me at Launch'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What's Coming to the Marketplace
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionary features that will transform how businesses discover, implement, and scale AI solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comingSoonFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why First Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4" />
              <span>Industry First</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why We're Building the First AI Marketplace
            </h2>
            <p className="text-xl opacity-90 max-w-4xl mx-auto mb-12">
              The AI landscape is fragmented. Businesses struggle to find, integrate, and scale AI solutions. 
              We're creating the first comprehensive marketplace where AI meets business needs seamlessly.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-xl font-semibold mb-3">Unified Platform</h3>
                <p className="opacity-80">One marketplace for all AI solutions, from simple automations to complex enterprise systems.</p>
              </div>
              <div className="text-center">
                <Rocket className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-xl font-semibold mb-3">Instant Deployment</h3>
                <p className="opacity-80">Deploy AI agents in minutes, not months. No technical expertise required.</p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
                <p className="opacity-80">Built by the community, for the community. Share, improve, and monetize AI solutions.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Store className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Be Part of AI History
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of forward-thinking businesses preparing for the AI marketplace revolution.
            </p>
            <div className="max-w-md mx-auto">
              <Card className="p-6 shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <form onSubmit={handleNotifySubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Get exclusive early access"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-center border-2 border-blue-200 focus:border-blue-500"
                  />
                  <Button
                    type="submit"
                    disabled={notifyMutation.isPending || !email}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3"
                  >
                    {notifyMutation.isPending ? 'Securing Your Spot...' : 'Secure Early Access'}
                    <Bell className="w-4 h-4 ml-2" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  No spam. Unsubscribe anytime. Launch expected Q2 2025.
                </p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}