import { useState, useEffect } from 'react';
import { useLocation as useWouterLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { NewHeader } from '@/components/redesign/NewHeader';

export default function GoogleAdsOAuth() {
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
        console.log('Starting Google Ads OAuth authentication...');
        
        // Complete the OAuth flow by calling the demo Google Ads auth endpoint
        const response = await fetch('/auth/demo/google-ads', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Google Ads Auth response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Google Ads Auth response data:', data);
          
          if (data.success) {
            console.log('Google Ads authentication successful, redirecting to dashboard...');
            
            // Small delay to ensure session is fully established
            await new Promise(resolve => setTimeout(resolve, 500));
            // Use setLocation for client-side routing
            console.log('Redirecting to dashboard...');
            setLocation('/dashboard');
          } else {
            console.error('Google Ads authentication failed - no success flag');
            setLocation('/dashboard?error=ads_auth_failed');
          }
        } else {
          console.error('Google Ads auth request failed with status:', response.status);
          setLocation('/dashboard?error=ads_oauth_failed');
        }
      } catch (error) {
        console.error('Google Ads OAuth error:', error);
        setLocation('/dashboard?error=ads_network_error');
      }
    }
  };

  const handleCancel = () => {
    setLocation('/dashboard');
  };

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8"
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

      {/* Google Ads + Advanta AI logos */}
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
        Link your Google Ads account to
      </h1>
      <p className="text-lg font-medium text-gray-900 mb-8">
        Advanta AI Workflow System
      </p>

      {/* Illustration */}
      <div className="mb-8 flex justify-center">
        <div className="w-64 h-32 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4 w-8 h-8 bg-blue-400 rounded-full opacity-60"></div>
          <div className="absolute top-6 right-6 w-6 h-6 bg-green-400 rounded-full opacity-60"></div>
          <div className="w-16 h-12 bg-white rounded border shadow-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
          </div>
          <div className="absolute bottom-4 right-8 w-4 h-4 bg-yellow-400 rounded-full opacity-60"></div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        This link will enable AI-powered campaign management
      </p>
      <p className="text-sm text-gray-600 mb-2">
        for your Google Ads account through Advanta AI
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
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
      className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8"
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

      {/* Google Ads + Advanta AI logos */}
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
        Advanta AI will be able to
      </h1>

      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-700">View your Google Ads campaigns and performance data</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-700">Optimize campaigns using AI-powered insights</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-700">Manage bids and budgets automatically</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-600 mb-2">
          Google Ads helps you manage campaign data safely
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
      className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8"
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

      {/* Google Ads + Advanta AI logos */}
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

      <h1 className="text-xl font-medium text-gray-900 mb-4">
        Final step
      </h1>
      <p className="text-gray-600 mb-8">
        Confirm the connection between your Google Ads account and Advanta AI Workflow System
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-medium text-gray-900">AI Campaign Optimization</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-medium text-gray-900">Performance Analytics</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-medium text-gray-900">Automated Reporting</span>
        </div>
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
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          {isLoading ? 'Connecting...' : 'Agree and Connect'}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <NewHeader />
      <div className="flex items-center justify-center p-4 pt-20">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
}