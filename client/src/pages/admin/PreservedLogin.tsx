// PRESERVED FOR FUTURE CLIENT SUITE PORTAL LAUNCH
// This is the original login page saved for when we launch the Client Suite Portal
// Do not delete - this will be used once the portal is ready

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function PreservedLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return apiRequest('/api/auth/login', 'POST', credentials);
    },
    onSuccess: (data) => {
      toast({
        title: "Welcome back!",
        description: "Successfully logged into your account",
      });
      setLocation('/dashboard');
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: "Please check your email and password",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate({ email, password });
  };

  const handleGoogleLogin = () => {
    // This will be implemented when Client Suite Portal launches
    window.location.href = '/api/auth/google';
  };

  const handleForgotPassword = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }
    setLocation('/reset-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Helmet>
        <title>Login - Client Suite Portal | Advanta AI</title>
        <meta name="description" content="Access your Advanta AI Client Suite Portal account" />
      </Helmet>

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your Client Suite Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-2" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6">
            <Separator />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full mt-4"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <button
              onClick={() => setLocation('/signup')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </button>
          </div>

          <Alert className="mt-4">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Your data is protected with enterprise-grade security
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}