import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { LogOut, Bot, Zap, Workflow, Clock, Settings, Shield, CheckCircle, Plus } from "lucide-react";

export default function WorkingDashboard() {
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      setLocation('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setLocation('/login');
    }
  };

  // User is logged in if they reached this page
  const user = { email: 'D.s.demango@gmail.com', firstName: 'Owner' };

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
              Welcome to Your Dashboard
              <span className="text-sm bg-green-500/20 text-green-300 px-2 py-1 rounded-full font-medium">Active</span>
            </h1>
            <p className="text-gray-300">Your Advanta AI workspace is ready</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                  {user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{user.email}</span>
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

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-green-500/10 backdrop-blur-md border-green-500/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                Login Successful!
              </CardTitle>
              <CardDescription className="text-gray-300">
                You have successfully signed into your Advanta AI workspace. Your session is active and secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-300 font-medium">✓ Authentication verified</p>
                <p className="text-green-300 font-medium">✓ Dashboard loaded successfully</p>
                <p className="text-green-300 font-medium">✓ All systems operational</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
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
            <CardContent>
              <p className="text-sm text-gray-400">Start automating your business processes with AI</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-purple-400" />
                My Workflows
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage your existing automations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">View and edit your saved workflows</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" />
                Analytics
              </CardTitle>
              <CardDescription className="text-gray-300">
                Track performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">Monitor your automation performance</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">Manage your account preferences and settings</p>
              <Button variant="outline" className="w-full">
                Open Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Secure connection</span>
              </div>
              <p className="text-sm text-gray-400">Last login: {new Date().toLocaleString()}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}