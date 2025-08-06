// PRESERVED FOR FUTURE CLIENT SUITE PORTAL LAUNCH
// This is the original signup page saved for when we launch the Client Suite Portal  
// Do not delete - this will be used once the portal is ready

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Shield } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function PreservedSignup() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const signupMutation = useMutation({
    mutationFn: async (data: Omit<typeof formData, 'confirmPassword' | 'agreeToTerms'>) => {
      return apiRequest('/api/auth/signup', 'POST', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Account created successfully!",
        description: "Welcome to Advanta AI. Please check your email to verify your account.",
      });
      setLocation('/dashboard');
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: "Please check your information and try again",
        variant: "destructive",
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to our terms of service to continue",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    const { confirmPassword, agreeToTerms, ...submitData } = formData;
    signupMutation.mutate(submitData);
  };

  const handleGoogleSignup = () => {
    // This will be implemented when Client Suite Portal launches
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Helmet>
        <title>Create Account - Client Suite Portal | Advanta AI</title>
        <meta name="description" content="Create your Advanta AI Client Suite Portal account" />
      </Helmet>

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>
            Join thousands of businesses automating with AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company (Optional)
              </label>
              <Input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company name"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: !!checked }))}
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="/terms" target="_blank" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              disabled={signupMutation.isPending || !formData.agreeToTerms}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}
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
            onClick={handleGoogleSignup}
            className="w-full mt-4"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <button
              onClick={() => setLocation('/login')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </button>
          </div>

          <Alert className="mt-4">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your data is protected with enterprise-grade security and encryption
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}