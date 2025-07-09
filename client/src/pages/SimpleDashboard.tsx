import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { LogOut, User, Settings, Shield, Zap, Bot, Workflow, Clock, Play, CheckCircle, AlertCircle, Plus } from "lucide-react";

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function SimpleDashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/auth/user', {
          credentials: 'include',
        });
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setLocation('/login');
        }
      } catch (error) {
        console.error('Auth error:', error);
        setLocation('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      setLocation('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-lg">Loading your dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <Helmet>
        <title>Dashboard - Advanta AI</title>
        <meta name="description" content="Your AI automation workspace dashboard" />
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-500" />
              AI Workflow Dashboard
              <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full font-medium">Live</span>
            </h1>
            <p className="text-gray-300">Welcome back to your AI automation workspace</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                  {user.firstName ? user.firstName[0] : user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{user.firstName || user.email}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Dashboard Ready
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your Advanta AI workspace is now active. You're successfully logged in as {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-400 mb-2" />
                  <h3 className="font-semibold text-blue-300">AI Builder</h3>
                  <p className="text-sm text-gray-300">Create workflows with natural language</p>
                </div>
                <div className="p-4 bg-purple-500/20 rounded-lg">
                  <Workflow className="w-6 h-6 text-purple-400 mb-2" />
                  <h3 className="font-semibold text-purple-300">Automation</h3>
                  <p className="text-sm text-gray-300">Deploy and manage your workflows</p>
                </div>
                <div className="p-4 bg-green-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-green-400 mb-2" />
                  <h3 className="font-semibold text-green-300">Analytics</h3>
                  <p className="text-sm text-gray-300">Track performance and insights</p>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                Create Workflow
              </CardTitle>
              <CardDescription className="text-gray-300">
                Build a new AI automation workflow
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Account Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage your profile and preferences
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Security
              </CardTitle>
              <CardDescription className="text-gray-300">
                View security settings and activity
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400">All systems operational</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Last login: {new Date().toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}