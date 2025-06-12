import { useState, useEffect } from 'react';
import { useLocation as useWouterLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';

export default function OAuthConsent() {
  const [, setLocation] = useWouterLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const queryClient = useQueryClient();

  const handleContinue = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      
      // Simulate OAuth processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        console.log('Starting OAuth authentication...');
        
        // Complete the OAuth flow by calling the demo Google auth endpoint
        const response = await fetch('/auth/demo/google', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Auth response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Auth response data:', data);
          
          if (data.success) {
            console.log('Authentication successful, verifying user...');
            
            // Verify authentication state before redirecting
            const userCheck = await fetch('/auth/user', {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              }
            });
            
            console.log('User check status:', userCheck.status);
            
            if (userCheck.ok) {
              const userData = await userCheck.json();
              console.log('User data:', userData);
              
              if (userData && userData.id) {
                console.log('User verified, invalidating cache and redirecting to dashboard...');
                // Invalidate React Query cache to ensure fresh user data on dashboard
                queryClient.invalidateQueries({ queryKey: ['/auth/user'] });
                // Successfully authenticated and verified, redirect to dashboard
                setLocation('/dashboard');
              } else {
                console.error('User verification failed - no user data');
                setLocation('/login?error=verification_failed');
              }
            } else {
              console.error('User check failed with status:', userCheck.status);
              setLocation('/login?error=verification_failed');
            }
          } else {
            console.error('Authentication failed - no success flag');
            setLocation('/login?error=auth_failed');
          }
        } else {
          console.error('Auth request failed with status:', response.status);
          setLocation('/login?error=oauth_failed');
        }
      } catch (error) {
        console.error('OAuth error:', error);
        setLocation('/login?error=network_error');
      }
    }
  };

  const handleCancel = () => {
    setLocation('/login');
  };

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="text-center"
    >
      {/* Close button */}
      <div className="flex justify-start mb-6">
        <button
          onClick={handleCancel}
          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Google + Advanta AI logos */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <svg className="w-8 h-8" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
      </div>

      <h1 className="text-lg font-medium text-gray-900 mb-2">
        Link your accounts to control
      </h1>
      <p className="text-lg font-medium text-gray-900 mb-8">
        Advanta AI on any device
      </p>

      {/* Illustration */}
      <div className="mb-8 flex justify-center">
        <div className="w-64 h-32 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-300 rounded-full opacity-60"></div>
          <div className="absolute top-6 right-6 w-6 h-6 bg-green-300 rounded-full opacity-60"></div>
          <div className="w-16 h-12 bg-white rounded border shadow-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
          </div>
          <div className="absolute bottom-4 right-8 w-4 h-4 bg-pink-300 rounded-full opacity-60"></div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        This link will be available on devices or services
      </p>
      <p className="text-sm text-gray-600 mb-2">
        where you're signed into your Google Account
      </p>
      <p className="text-sm text-gray-600 mb-8">
        You can always change this link in your Google Account.
      </p>

      <div className="flex gap-3">
        <Button
          onClick={handleCancel}
          variant="ghost"
          className="text-blue-600 hover:bg-blue-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Close button */}
      <div className="flex justify-start mb-6">
        <button
          onClick={handleCancel}
          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Google + Advanta AI logos */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <svg className="w-8 h-8" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
      </div>

      <h1 className="text-lg font-medium text-gray-900 mb-8">
        When you link your accounts,<br />
        Google will be able to
      </h1>

      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-700">See your account information</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-700">Control your media, when you ask</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-700">See your content</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Advanta AI will be able to
        </h2>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-700">Receive data from Google</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-600 mb-2">
          Google helps you share data safely
        </p>
        <p className="text-sm text-blue-600 underline cursor-pointer">
          Learn more
        </p>
        <p className="text-sm text-gray-600 mt-2">
          See Advanta AI's Privacy Policy
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleCancel}
          variant="ghost"
          className="text-blue-600 hover:bg-blue-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          Agree and continue
        </Button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Mobile-like header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCancel}
            className="w-6 h-6 flex items-center justify-center text-gray-500"
          >
            ✕
          </button>
          <div className="w-4 h-4 bg-gray-800 rounded-sm"></div>
          <span className="text-sm text-gray-600">connect.advanta-ai.com</span>
        </div>
        <div className="text-gray-400">⋮</div>
      </div>

      {/* Advanta AI logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="text-xl font-medium text-gray-900">advanta ai</span>
      </div>

      <p className="text-sm text-gray-700 mb-6">
        By agreeing, you are allowing Advanta AI to share data with Google.
      </p>

      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-700">Basic account information</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-700">Your searches</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-700">Playlists you make or follow</span>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-8">
        You can remove this access at any time at advanta-ai.com/account
      </p>

      <div className="flex gap-3">
        <Button
          onClick={handleCancel}
          variant="outline"
          className="flex-1 text-gray-600 border-gray-300"
        >
          CANCEL
        </Button>
        <Button
          onClick={handleContinue}
          disabled={isLoading}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-full"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Connecting...
            </div>
          ) : (
            'AGREE'
          )}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </motion.div>
    </div>
  );
}