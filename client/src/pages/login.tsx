import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call an authentication API
      // For demo purposes, we'll simulate a successful login with a timeout
      setTimeout(() => {
        // Check for specific credentials
        if ((email === 'admin' && password === '12345') ||
            (email === 'd.s.demango@gmail.com' && password === '12345') || 
            // Also keep the email-based login for flexibility
            (email.endsWith('@advanta.ai') && password.length >= 6)) {
          
          // Store authentication in session/local storage
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('userEmail', email);
          
          // Redirect to client dashboard
          window.location.href = '/dashboard';
        } else {
          setError('Invalid email or password. Please try again.');
        }
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Client Login - Advanta AI</title>
        <meta name="description" content="Log in to your Advanta AI client portal to manage your AI solutions, view analytics, and control your AI-powered services." />
        <meta property="og:title" content="Client Login - Advanta AI" />
        <meta property="og:description" content="Log in to your Advanta AI client portal to manage your AI solutions, view analytics, and control your AI-powered services." />
      </Helmet>

      <Header />

      <main className="pt-28 pb-20 min-h-screen flex flex-col justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Client Portal Login</h1>
            <p className="text-muted-foreground">
              Access your AI solutions dashboard and management tools
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <Card className="p-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="client@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={remember}
                    onCheckedChange={(checked) => setRemember(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    Remember me for 30 days
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Logging in...</span>
                    </span>
                  ) : 'Log in to portal'}
                </Button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
                <p>Don't have an account yet?</p>
                <p className="mt-1">
                  <a 
                    onClick={() => setLocation('/calculator')}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    Build your AI stack
                  </a>{' '}
                  to get started with AdvantaAI
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Demo Credentials Notice */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="text-sm text-center text-muted-foreground"
          >
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-4">
              <h3 className="font-medium text-blue-500 mb-1">Demo Access</h3>
              <p>For demo purposes, use any email ending with @advanta.ai and a password with 6+ characters</p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}