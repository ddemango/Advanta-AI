import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Mock data for dashboard
const analyticsData = [
  { month: 'Jan', interactions: 1200, tokens: 25000 },
  { month: 'Feb', interactions: 1900, tokens: 32000 },
  { month: 'Mar', interactions: 2400, tokens: 48000 },
  { month: 'Apr', interactions: 3100, tokens: 57000 },
  { month: 'May', interactions: 3400, tokens: 62000 },
  { month: 'Jun', interactions: 3800, tokens: 71000 },
];

const aiAssistants = [
  {
    id: 1,
    name: 'Sales Assistant',
    description: 'Handles product inquiries and qualification',
    status: 'active',
    interactions: 1245,
    lastUpdated: '2 days ago',
    efficiency: 78,
    engagement: 82,
    type: 'chatbot'
  },
  {
    id: 2,
    name: 'Email Responder',
    description: 'Automates email replies to common questions',
    status: 'active',
    interactions: 3782,
    lastUpdated: '1 day ago',
    efficiency: 92,
    engagement: 68,
    type: 'email'
  },
  {
    id: 3,
    name: 'Customer Support Bot',
    description: 'Resolves support tickets and escalations',
    status: 'paused',
    interactions: 956,
    lastUpdated: '5 days ago',
    efficiency: 65,
    engagement: 74,
    type: 'chatbot'
  },
  {
    id: 4,
    name: 'Product Recommender',
    description: 'Suggests products based on customer preferences',
    status: 'active',
    interactions: 2128,
    lastUpdated: '3 days ago',
    efficiency: 85,
    engagement: 91,
    type: 'analytics'
  }
];

const integrations = [
  { name: 'Slack', status: 'connected', icon: 'slack' },
  { name: 'Zapier', status: 'connected', icon: 'bolt' },
  { name: 'Google Sheets', status: 'connected', icon: 'table' },
  { name: 'Shopify', status: 'not connected', icon: 'shopping-cart' },
  { name: 'HubSpot', status: 'not connected', icon: 'h-square' },
  { name: 'Notion', status: 'connected', icon: 'book' }
];

const billing = {
  plan: 'Professional',
  nextBilling: 'June 15, 2023',
  amount: '$199.00',
  usageTokens: {
    used: 720000,
    total: 1000000,
    percentage: 72
  },
  usageAssistants: {
    used: 4,
    total: 10,
    percentage: 40
  }
};

// Auth guard to ensure user is logged in
function useAuthGuard() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const auth = sessionStorage.getItem('isAuthenticated');
      if (!auth) {
        setLocation('/login');
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [setLocation]);

  return { isAuthenticated, loading };
}

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuthGuard();
  const [userEmail, setUserEmail] = useState<string>('');
  
  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          <p className="mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect will happen in the useAuthGuard hook
  }

  return (
    <>
      <Helmet>
        <title>Client Dashboard | Advanta AI</title>
        <meta name="description" content="Manage your AI assistants, view analytics, and control your AI stack from your personalized dashboard." />
      </Helmet>
      
      <Header />
      
      <main className="py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {userEmail.split('@')[0]}</h1>
                <p className="text-muted-foreground">Here's what's happening with your AI assistants today.</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <i className="fas fa-plus mr-2"></i>
                Create New Assistant
              </Button>
            </motion.div>
            
            {/* Dashboard Overview Cards */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <Card className="bg-muted border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">8,111</div>
                    <div className="text-green-500 flex items-center text-sm">
                      <i className="fas fa-arrow-up mr-1"></i>
                      12.5%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">vs. last month</p>
                </CardContent>
              </Card>
              
              <Card className="bg-muted border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Active Assistants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">3</div>
                    <div className="text-green-500 flex items-center text-sm">
                      <i className="fas fa-check-circle mr-1"></i>
                      Healthy
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">1 assistant paused</p>
                </CardContent>
              </Card>
              
              <Card className="bg-muted border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Token Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">72%</div>
                    <div className="text-yellow-500 flex items-center text-sm">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      Moderate
                    </div>
                  </div>
                  <Progress value={72} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">720K/1M tokens used</p>
                </CardContent>
              </Card>
              
              <Card className="bg-muted border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Avg. Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">80%</div>
                    <div className="text-green-500 flex items-center text-sm">
                      <i className="fas fa-arrow-up mr-1"></i>
                      5.2%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">vs. industry avg. (74.8%)</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          {/* Main Dashboard Tabs */}
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <Tabs defaultValue="assistants" className="w-full">
              <TabsList className="w-full md:w-auto mb-6">
                <TabsTrigger value="assistants">My Assistants</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              
              {/* Assistants Tab Content */}
              <TabsContent value="assistants" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">My AI Assistants</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <i className="fas fa-filter mr-2"></i>
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <i className="fas fa-sort mr-2"></i>
                      Sort
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiAssistants.map((assistant) => (
                    <Card key={assistant.id} className={`bg-muted border-border transition-all hover:shadow-md ${assistant.status === 'paused' ? 'opacity-70' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-2 items-center">
                            <div className={`h-8 w-8 rounded-md flex items-center justify-center ${
                              assistant.type === 'chatbot' ? 'bg-primary/20' :
                              assistant.type === 'email' ? 'bg-blue-500/20' :
                              'bg-green-500/20'
                            }`}>
                              <i className={`fas fa-${
                                assistant.type === 'chatbot' ? 'robot' :
                                assistant.type === 'email' ? 'envelope' :
                                'chart-pie'
                              } text-${
                                assistant.type === 'chatbot' ? 'primary' :
                                assistant.type === 'email' ? 'blue-500' :
                                'green-500'
                              }`}></i>
                            </div>
                            <CardTitle className="text-lg">{assistant.name}</CardTitle>
                          </div>
                          <Badge variant={assistant.status === 'active' ? 'default' : 'secondary'}>
                            {assistant.status === 'active' ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{assistant.description}</p>
                        <div className="flex justify-between text-sm">
                          <span>Interactions</span>
                          <span className="font-medium">{assistant.interactions.toLocaleString()}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Efficiency</span>
                            <span className="font-medium">{assistant.efficiency}%</span>
                          </div>
                          <Progress value={assistant.efficiency} className="h-1.5" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Engagement</span>
                            <span className="font-medium">{assistant.engagement}%</span>
                          </div>
                          <Progress value={assistant.engagement} className="h-1.5" />
                        </div>
                        <div className="pt-2 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <i className="fas fa-edit mr-1"></i> Edit
                          </Button>
                          {assistant.status === 'active' ? (
                            <Button variant="outline" size="sm" className="flex-1">
                              <i className="fas fa-pause mr-1"></i> Pause
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="flex-1">
                              <i className="fas fa-play mr-1"></i> Resume
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Analytics Tab Content */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-muted border-border">
                    <CardHeader>
                      <CardTitle>Total Interactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analyticsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                                border: '1px solid rgba(255,255,255,0.2)' 
                              }} 
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="interactions" 
                              name="Interactions" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2} 
                              dot={{ strokeWidth: 2 }} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted border-border">
                    <CardHeader>
                      <CardTitle>Token Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analyticsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                                border: '1px solid rgba(255,255,255,0.2)' 
                              }} 
                            />
                            <Legend />
                            <Bar 
                              dataKey="tokens" 
                              name="Tokens Used" 
                              fill="hsl(var(--accent))" 
                              radius={[4, 4, 0, 0]} 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted border-border lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Assistant Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-3 px-2">Assistant</th>
                              <th className="text-left py-3 px-2">Type</th>
                              <th className="text-left py-3 px-2">Interactions</th>
                              <th className="text-left py-3 px-2">Efficiency</th>
                              <th className="text-left py-3 px-2">Engagement</th>
                              <th className="text-left py-3 px-2">Last Updated</th>
                            </tr>
                          </thead>
                          <tbody>
                            {aiAssistants.map((assistant) => (
                              <tr key={assistant.id} className="border-b border-border">
                                <td className="py-3 px-2 font-medium">{assistant.name}</td>
                                <td className="py-3 px-2 capitalize">{assistant.type}</td>
                                <td className="py-3 px-2">{assistant.interactions.toLocaleString()}</td>
                                <td className="py-3 px-2">
                                  <div className="flex items-center gap-2">
                                    <Progress value={assistant.efficiency} className="h-1.5 w-20" />
                                    <span>{assistant.efficiency}%</span>
                                  </div>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="flex items-center gap-2">
                                    <Progress value={assistant.engagement} className="h-1.5 w-20" />
                                    <span>{assistant.engagement}%</span>
                                  </div>
                                </td>
                                <td className="py-3 px-2 text-muted-foreground">{assistant.lastUpdated}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Integrations Tab Content */}
              <TabsContent value="integrations" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Connected Services</h2>
                  <Button>
                    <i className="fas fa-plus mr-2"></i>
                    Connect New Service
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {integrations.map((integration) => (
                    <Card key={integration.name} className="bg-muted border-border">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                              <i className={`fab fa-${integration.icon} text-2xl`}></i>
                            </div>
                            <div>
                              <h3 className="font-medium">{integration.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {integration.status === 'connected' ? 'Connected and active' : 'Not connected'}
                              </p>
                            </div>
                          </div>
                          <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'}>
                            {integration.status === 'connected' ? 'Connected' : 'Connect'}
                          </Badge>
                        </div>
                        
                        {integration.status === 'connected' && (
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" className="flex-1">
                              Configure
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Disconnect
                            </Button>
                          </div>
                        )}
                        
                        {integration.status !== 'connected' && (
                          <Button className="w-full mt-4">
                            Connect
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Billing Tab Content */}
              <TabsContent value="billing" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="bg-muted border-border lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Subscription Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-border">
                          <div>
                            <h3 className="font-medium mb-1">Current Plan</h3>
                            <div className="flex items-center">
                              <Badge className="mr-2">{billing.plan}</Badge>
                              <span className="text-muted-foreground text-sm">Billed monthly</span>
                            </div>
                          </div>
                          <Button variant="outline">Change Plan</Button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Next Billing Date</h4>
                              <p>{billing.nextBilling}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Amount</h4>
                              <p>{billing.amount}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-1">Payment Method</h4>
                            <div className="flex items-center">
                              <div className="h-8 w-12 bg-background flex items-center justify-center rounded mr-3">
                                <i className="fab fa-cc-visa text-blue-500"></i>
                              </div>
                              <span>Visa ending in 4242</span>
                              <Button variant="ghost" size="sm" className="ml-3">
                                <i className="fas fa-pen-to-square"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                          <Button variant="outline">View Invoices</Button>
                          <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                            Cancel Subscription
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted border-border">
                    <CardHeader>
                      <CardTitle>Usage This Month</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Token Usage</span>
                          <span className="font-medium">
                            {billing.usageTokens.used.toLocaleString()} / {billing.usageTokens.total.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={billing.usageTokens.percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {100 - billing.usageTokens.percentage}% remaining this month
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>AI Assistants</span>
                          <span className="font-medium">
                            {billing.usageAssistants.used} / {billing.usageAssistants.total}
                          </span>
                        </div>
                        <Progress value={billing.usageAssistants.percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {billing.usageAssistants.total - billing.usageAssistants.used} more assistants available
                        </p>
                      </div>
                      
                      <Button className="w-full">
                        Upgrade Plan
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}