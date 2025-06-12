import { useState, useEffect } from 'react';
import { useLocation as useWouterLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';

export default function OAuthConsent() {
  const [, setLocation] = useWouterLocation();
  const [isLoading, setIsLoading] = useState(false);

  const permissions = [
    {
      icon: "👤",
      title: "Associate you with your personal info on Google",
      description: "This includes your name, email address, and profile picture"
    },
    {
      icon: "📧", 
      title: "See your personal info, including any personal info you've made publicly available",
      description: "Access to basic profile information"
    },
    {
      icon: "✉️",
      title: "See your primary Google Account email address", 
      description: "Required for account identification"
    },
    {
      icon: "☁️",
      title: "See, edit, create, and delete all of your Google Drive files",
      description: "Full access to your Google Drive storage",
      checked: false
    }
  ];

  const handleAllow = async () => {
    setIsLoading(true);
    
    // Simulate OAuth processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Complete the OAuth flow
    const response = await fetch('/auth/google/callback?code=demo_auth_code&state=demo', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (response.ok || response.redirected) {
      setLocation('/dashboard');
    } else {
      setLocation('/login?error=oauth_failed');
    }
  };

  const handleCancel = () => {
    setLocation('/login');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Google Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-xl font-medium text-gray-800">Sign in</span>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            https://accounts.google.com/signin/oauth/v2/consentsummary?authuser=0&part...
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          </div>
        </div>

        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-xl font-medium text-gray-900 mb-2">
                <span className="bg-red-600 text-white px-2 py-0.5 rounded text-sm">demo-app.replit.app</span> wants access to your Google Account
              </h1>
              <p className="text-sm text-gray-600">
                <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs">demo@example.com</span>
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Select what <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs">demo-app.replit.app</span> can access
              </h2>
              
              <div className="space-y-4">
                {permissions.map((permission, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full text-blue-600">
                      {permission.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {permission.title}
                        </p>
                        <Checkbox 
                          defaultChecked={permission.checked !== false}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                      </div>
                      {permission.description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {permission.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Make sure you trust <span className="bg-red-600 text-white px-1 py-0.5 rounded text-xs">demo-app.replit.app</span>
              </h3>
              <p className="text-xs text-gray-600">
                You may be sharing sensitive info with this site or app. You can always see or remove access in your Google Account.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 h-10 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAllow}
                disabled={isLoading}
                className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Allow'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            English (United States) • Help • Privacy • Terms
          </p>
        </div>
      </motion.div>
    </div>
  );
}