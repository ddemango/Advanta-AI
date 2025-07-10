import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import ChatbotWorkflowBuilder from "@/components/ChatbotWorkflowBuilder";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  Workflow, 
  Bot, 
  Database, 
  Settings, 
  HelpCircle, 
  Bell, 
  Menu, 
  X, 
  Plus, 
  Play, 
  Clock, 
  Activity, 
  Users, 
  Zap,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function ModernDashboard() {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

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

  const handleWorkflowCreate = (workflow: any) => {
    toast({
      title: "Workflow Created!",
      description: `"${workflow.title}" has been created successfully. Check your Projects page to configure and deploy it.`,
    });
    
    // In a real app, this would save to the backend
    console.log('New workflow created:', workflow);
  };

  const user = { email: 'D.s.demango@gmail.com', firstName: 'Admin' };

  const navigationItems = [
    { icon: Home, label: 'Home', href: '/dashboard', active: true },
    { icon: Bot, label: 'AI Chatbot Builder', href: '/chatbot-builder', isNew: true },
    { icon: Workflow, label: 'Projects', href: '/projects' },
    { icon: Bot, label: 'My GPTs', href: '/my-gpts' },
    { icon: Database, label: 'Data & Integrations', href: '/data-integrations' },
    { icon: Settings, label: 'Account Settings', href: '/account-settings' },
    { icon: HelpCircle, label: 'Help & Support', href: '/help-support' },
  ];

  const recentProjects = [
    { name: 'GPT Sales Email Generator', lastUsed: '2h ago', status: 'active' },
    { name: 'Customer Support Bot', lastUsed: '1d ago', status: 'deployed' },
    { name: 'Content Marketing Assistant', lastUsed: '3d ago', status: 'draft' },
  ];

  const keyMetrics = [
    { label: 'Total Automations', value: '24', change: '+12%' },
    { label: 'Time Saved', value: '156h', change: '+8%' },
    { label: 'Active Workflows', value: '8', change: '+3' },
    { label: 'Success Rate', value: '96%', change: '+2%' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Create New GPT', color: 'bg-blue-500' },
    { icon: Database, label: 'Upload Dataset', color: 'bg-green-500' },
    { icon: Zap, label: 'Connect App', color: 'bg-purple-500' },
  ];

  const onboardingSteps = [
    { label: 'Connect an app', completed: true },
    { label: 'Create a prompt', completed: true },
    { label: 'Launch a test run', completed: false },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Helmet>
        <title>Dashboard - Advanta AI</title>
        <meta name="description" content="Your AI automation workspace dashboard" />
      </Helmet>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 border-r bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:z-auto lg:shadow-none ${
          darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : ''
        }`}
        >
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Advanta AI
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start gap-3 relative ${
                  item.active ? 'bg-blue-50 text-blue-600 border-blue-200' : ''
                } ${darkMode && !item.active ? 'text-gray-300 hover:text-white' : ''}`}
                onClick={() => setLocation(item.href)}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.isNew && (
                  <Badge className="bg-green-500 hover:bg-green-500 text-white text-xs px-1.5 py-0.5 h-5">
                    NEW
                  </Badge>
                )}
              </Button>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm ${
          darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : ''
        }`}>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                  {user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {user.email}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-6 space-y-6 lg:space-y-8 pb-20 lg:pb-6">
          {/* Welcome Section */}
          <div>
            <h2 className={`text-xl lg:text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, {user.firstName || 'Admin'}!
            </h2>
            <p className={`text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Here's what's happening with your AI workflows today.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {keyMetrics.map((metric, index) => (
              <Card key={metric.label} className={darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : ''}>
                <CardContent className="p-3 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
                    <div>
                      <p className={`text-xs lg:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {metric.label}
                      </p>
                      <p className={`text-lg lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {metric.value}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-green-600 bg-green-100 text-xs lg:text-sm self-start lg:self-auto">
                      {metric.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3 lg:gap-4">
              {quickActions.map((action) => (
                <Card key={action.label} className={`cursor-pointer transition-all hover:shadow-md ${
                  darkMode ? 'dark:bg-gray-800 dark:border-gray-700 hover:dark:bg-gray-750' : 'hover:bg-gray-50'
                }`}>
                  <CardContent className="p-4 lg:p-6 flex items-center gap-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium text-sm lg:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {action.label}
                      </h4>
                      <p className={`text-xs lg:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Get started in minutes
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Projects & Onboarding */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Recent Projects */}
            <div>
              <Card className={darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                    <Workflow className="w-5 h-5" />
                    Recent Projects
                  </CardTitle>
                  <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                    Your latest AI workflows and automations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.name} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {project.name}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Last used: {project.lastUsed}
                        </p>
                      </div>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Projects
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Onboarding Progress */}
            <div>
              <Card className={darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                    <TrendingUp className="w-5 h-5" />
                    Getting Started
                  </CardTitle>
                  <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                    Complete these steps to unlock the full potential
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {onboardingSteps.map((step, index) => (
                      <div key={step.label} className="flex items-center gap-3">
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <span className={`${
                          step.completed 
                            ? darkMode ? 'text-green-400' : 'text-green-600'
                            : darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Progress value={67} className="w-full" />
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    2 of 3 steps completed
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Agents */}
          <div>
            <Card className={darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                  <Bot className="w-5 h-5" />
                  Your AI Agents
                </CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                  Manage and deploy your custom AI assistants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Sales Assistant', 'Report Summarizer', 'Content Generator'].map((agent) => (
                    <div key={agent} className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {agent}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Active
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t shadow-lg lg:hidden dark:bg-gray-800 dark:border-gray-700">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigationItems.slice(0, 4).map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`flex-col gap-1 h-16 ${
                item.active ? 'text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
              onClick={() => setLocation(item.href)}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Chatbot Workflow Builder */}
      <ChatbotWorkflowBuilder onWorkflowCreate={handleWorkflowCreate} />
    </div>
  );
}