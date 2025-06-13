import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { LogOut, User, Settings, Shield, Zap, Bot, Workflow, Clock, Play, CheckCircle, AlertCircle } from "lucide-react";
import { PromptInput } from "@/components/workflow/PromptInput";
import { WorkflowPreview } from "@/components/workflow/WorkflowPreview";
import { WorkflowList } from "@/components/workflow/WorkflowList";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/auth/user'],
    retry: false,
    queryFn: async () => {
      const res = await fetch('/auth/user', {
        credentials: 'include',
      });
      
      if (res.status === 401) {
        return null; // Return null instead of throwing for 401s
      }
      
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      
      return await res.json();
    },
  });

  console.log('Dashboard render:', { user, isLoading, error });

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
      setLocation('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!isLoading && !user) {
    console.log('Dashboard: No user found after loading completed, redirecting to login');
    setLocation('/login');
    return null;
  }

  console.log('Dashboard: Rendering dashboard with user:', user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-300">Welcome back to your portal</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Google Ads Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="lg:col-span-3"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.5 3C10.37 3 8.75 4.95 8.99 7.04L9.29 9.88L5.97 9.88C3.61 9.88 1.85 11.92 2.09 14.23C2.29 16.18 3.95 17.63 5.91 17.63H15.5C17.99 17.63 20 15.62 20 13.13V10.5C20 6.91 17.09 4 13.5 4H12.5V3Z"/>
                  </svg>
                  Google Ads Workflow AI
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Connect your Google Ads account to automate campaigns and optimize performance with AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M9.93 13.5h4.14L12 7.98zM20 15.5c-1.25 0-2.45-.2-3.57-.57c-.1-.04-.21-.05-.31-.05c-.26 0-.51.1-.71.29l-2.2 2.2c-2.83-1.45-5.15-3.76-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1c0 9.39 7.61 17 17 17c.55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Google Ads Account</h3>
                      <p className="text-gray-400 text-sm">Connect to enable AI-powered campaign management</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/google-ads-oauth'}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Connect Account
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-white font-medium mb-2">Campaign Optimization</h4>
                    <p className="text-gray-400 text-sm">AI-driven bid adjustments and keyword optimization</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-white font-medium mb-2">Performance Analytics</h4>
                    <p className="text-gray-400 text-sm">Real-time insights and conversion tracking</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-white font-medium mb-2">Automated Reporting</h4>
                    <p className="text-gray-400 text-sm">Daily performance summaries and recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          {/* User Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:col-span-2"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <User className="w-6 h-6" />
                  User Profile
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Your account information and authentication details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.picture} alt={user.firstName || user.email} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg">
                      {user.firstName ? user.firstName[0] : user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.firstName || 'User'
                      }
                    </h3>
                    <p className="text-gray-300">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Authenticated
                      </Badge>
                      {user.provider && (
                        <Badge variant="outline" className="border-blue-600/30 text-blue-400">
                          {user.provider === 'local' ? 'Email' : user.provider}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-gray-400 text-sm">Member Since</p>
                    <p className="text-white font-medium">
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'Recent'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Account Type</p>
                    <p className="text-white font-medium">Standard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Settings className="w-6 h-6" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Update Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Change Password
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="md:col-span-2 lg:col-span-3"
          >
            <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border-blue-600/30 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    🎉 Authentication System Complete!
                  </h2>
                  <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
                    Your comprehensive authentication system is now ready with both OAuth (Google & Apple) 
                    and traditional email/password options. The system includes secure password hashing, 
                    session management, and a modern glassmorphism design.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-white font-semibold">OAuth Ready</h3>
                      <p className="text-gray-300 text-sm">Google & Apple</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-white font-semibold">Secure Auth</h3>
                      <p className="text-gray-300 text-sm">bcrypt + Sessions</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-white font-semibold">User Signup</h3>
                      <p className="text-gray-300 text-sm">Registration Flow</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-white font-semibold">Dashboard</h3>
                      <p className="text-gray-300 text-sm">User Portal</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}