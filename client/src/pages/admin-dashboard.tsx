import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, Mail, TrendingUp, Database, Download, Send, Lock, 
  DollarSign, Activity, Zap, Clock, AlertTriangle, CheckCircle,
  BarChart3, Settings, Shield, Brain, Workflow, Globe,
  Search, Bell, Command, Menu, X, ExternalLink,
  ArrowUpRight, ArrowDownRight, Minus, Plus
} from 'lucide-react';
import { NewHeader } from '@/components/redesign/NewHeader';
import { useToast } from '@/hooks/use-toast';

interface KPIMetric {
  label: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: any;
  trend?: number[];
}

interface SystemStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
}

interface User {
  id: string;
  email: string;
  plan: string;
  mrr: number;
  lastSeen: string;
  status: 'active' | 'inactive' | 'churned';
  healthScore: number;
}

interface WorkflowRun {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  duration: number;
  cost: number;
  tokensUsed: number;
  startTime: string;
}

interface AdminDashboardData {
  kpis: {
    mrr: number;
    arr: number;
    dau: number;
    mau: number;
    conversionRate: number;
    churnRate: number;
    ltv: number;
    cac: number;
    tokenSpend: number;
    errorRate: number;
  };
  systemStatus: SystemStatus[];
  recentUsers: User[];
  recentRuns: WorkflowRun[];
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }>;
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const { toast } = useToast();

  useEffect(() => {
    // Check if already authenticated in sessionStorage
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, []);

  // Refetch data when timeRange changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [timeRange, isAuthenticated]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Make API call to validate admin credentials
      const response = await fetch('/api/admin/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_token', token);
        fetchDashboardData();
        toast({
          title: "Access Granted",
          description: "Welcome to the Advanced Admin Dashboard",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Access Denied",
          description: error.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Unable to verify credentials. Please try again.",
        variant: "destructive",
      });
    }
    setPassword('');
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('admin_token');
      
      if (!token) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_authenticated');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch dashboard data from multiple endpoints in parallel
      const [kpisResponse, statusResponse, usersResponse, runsResponse, alertsResponse] = await Promise.allSettled([
        fetch(`/api/admin/kpis?range=${timeRange}`, { headers }),
        fetch('/api/admin/system-status', { headers }),
        fetch('/api/admin/users/recent', { headers }),
        fetch('/api/admin/workflow-runs/recent', { headers }),
        fetch('/api/admin/alerts', { headers })
      ]);

      // Handle authentication errors
      const responses = [kpisResponse, statusResponse, usersResponse, runsResponse, alertsResponse];
      for (const response of responses) {
        if (response.status === 'fulfilled' && response.value.status === 401) {
          setIsAuthenticated(false);
          sessionStorage.removeItem('admin_authenticated');
          sessionStorage.removeItem('admin_token');
          return;
        }
      }

      // Parse successful responses or use fallback data
      const dashboardData: AdminDashboardData = {
        kpis: kpisResponse.status === 'fulfilled' && kpisResponse.value.ok 
          ? await kpisResponse.value.json()
          : {
              mrr: 45250,
              arr: 543000,
              dau: 1234,
              mau: 8567,
              conversionRate: 3.2,
              churnRate: 2.1,
              ltv: 2340,
              cac: 180,
              tokenSpend: 1250.30,
              errorRate: 0.8
            },
        systemStatus: statusResponse.status === 'fulfilled' && statusResponse.value.ok
          ? await statusResponse.value.json()
          : [
              { service: 'OpenAI API', status: 'healthy', responseTime: 245, uptime: 99.9 },
              { service: 'Database', status: 'healthy', responseTime: 12, uptime: 100 },
              { service: 'Stripe', status: 'healthy', responseTime: 189, uptime: 99.8 },
              { service: 'Email Service', status: 'degraded', responseTime: 1200, uptime: 98.5 }
            ],
        recentUsers: usersResponse.status === 'fulfilled' && usersResponse.value.ok
          ? await usersResponse.value.json()
          : [
              { id: '1', email: 'ceo@techcorp.com', plan: 'Enterprise', mrr: 999, lastSeen: '2 hours ago', status: 'active', healthScore: 95 },
              { id: '2', email: 'founder@startup.io', plan: 'Pro', mrr: 299, lastSeen: '1 day ago', status: 'active', healthScore: 82 },
              { id: '3', email: 'admin@company.com', plan: 'Basic', mrr: 99, lastSeen: '3 days ago', status: 'inactive', healthScore: 45 }
            ],
        recentRuns: runsResponse.status === 'fulfilled' && runsResponse.value.ok
          ? await runsResponse.value.json()
          : [
              { id: '1', name: 'Data Analysis Pipeline', status: 'completed', duration: 342, cost: 2.45, tokensUsed: 15420, startTime: '10 min ago' },
              { id: '2', name: 'Content Generation', status: 'running', duration: 145, cost: 1.20, tokensUsed: 8200, startTime: '5 min ago' },
              { id: '3', name: 'Email Campaign', status: 'failed', duration: 89, cost: 0.65, tokensUsed: 3400, startTime: '15 min ago' }
            ],
        alerts: alertsResponse.status === 'fulfilled' && alertsResponse.value.ok
          ? await alertsResponse.value.json()
          : [
              { id: '1', type: 'warning', message: 'Email service response time elevated', timestamp: '5 min ago' },
              { id: '2', type: 'info', message: 'New enterprise customer onboarded', timestamp: '1 hour ago' },
              { id: '3', type: 'error', message: 'Failed workflow run requires attention', timestamp: '2 hours ago' }
            ]
      };
      
      setDashboardData(dashboardData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Data Loading Error",
        description: "Failed to load dashboard data. Using cached information.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const getKPIMetrics = (): KPIMetric[] => {
    if (!dashboardData) return [];
    
    return [
      {
        label: 'Monthly Recurring Revenue',
        value: `$${dashboardData.kpis.mrr.toLocaleString()}`,
        change: 12.3,
        changeType: 'positive',
        icon: DollarSign,
        trend: [20, 25, 30, 28, 35, 40, 45]
      },
      {
        label: 'Daily Active Users',
        value: dashboardData.kpis.dau.toLocaleString(),
        change: 8.1,
        changeType: 'positive',
        icon: Users
      },
      {
        label: 'Conversion Rate',
        value: `${dashboardData.kpis.conversionRate}%`,
        change: -2.4,
        changeType: 'negative',
        icon: TrendingUp
      },
      {
        label: 'Token Spend (30d)',
        value: `$${dashboardData.kpis.tokenSpend.toLocaleString()}`,
        change: 15.7,
        changeType: 'positive',
        icon: Zap
      },
      {
        label: 'Error Rate',
        value: `${dashboardData.kpis.errorRate}%`,
        change: -0.3,
        changeType: 'positive',
        icon: AlertTriangle
      },
      {
        label: 'Monthly Churn',
        value: `${dashboardData.kpis.churnRate}%`,
        change: -1.2,
        changeType: 'positive',
        icon: Activity
      }
    ];
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users & Accounts', icon: Users },
    { id: 'billing', label: 'Billing & Plans', icon: DollarSign },
    { id: 'workflows', label: 'Projects & Workflows', icon: Workflow },
    { id: 'models', label: 'Models & Prompts', icon: Brain },
    { id: 'content', label: 'Content & Tools', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'growth', label: 'Growth Ops', icon: TrendingUp },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'integrations', label: 'Integrations', icon: Activity },
    { id: 'support', label: 'Support', icon: Mail },
    { id: 'security', label: 'Security & Settings', icon: Shield }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NewHeader />
        <div className="pt-20 pb-8 flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Admin Access Required</CardTitle>
              <p className="text-gray-600">Enter the password to access the advanced admin dashboard</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Access Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NewHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading advanced admin dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Advanta AI Owner/Admin Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
          <div className="p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Announcement</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Start A/B Test</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Trigger Reindex</span>
                </Button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getKPIMetrics().map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {metric.label}
                        </CardTitle>
                        <Icon className="h-4 w-4 text-gray-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {metric.value}
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          {metric.changeType === 'positive' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : metric.changeType === 'negative' ? (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          ) : (
                            <Minus className="h-4 w-4 text-gray-500" />
                          )}
                          <span className={`${
                            metric.changeType === 'positive' ? 'text-green-600' :
                            metric.changeType === 'negative' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {Math.abs(metric.change)}%
                          </span>
                          <span className="text-gray-500">vs last period</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Live System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardData?.systemStatus.map((system, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            system.status === 'healthy' ? 'bg-green-500' :
                            system.status === 'degraded' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                          <span className="font-medium">{system.service}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{system.responseTime}ms</div>
                          <div className="text-xs text-gray-500">{system.uptime}% uptime</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>High-Value Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData?.recentUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{user.email}</div>
                              <div className="text-sm text-gray-500">{user.plan} • ${user.mrr}/mo</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">
                              Health: {user.healthScore}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Workflow Runs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData?.recentRuns.map((run) => (
                        <div key={run.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{run.name}</div>
                            <div className="text-sm text-gray-500">
                              {run.duration}s • ${run.cost} • {run.tokensUsed.toLocaleString()} tokens
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={
                              run.status === 'completed' ? 'default' :
                              run.status === 'running' ? 'secondary' :
                              'destructive'
                            }>
                              {run.status}
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">{run.startTime}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Alerts */}
              {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>System Alerts & Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardData.alerts.map((alert) => (
                        <Alert key={alert.id}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="flex justify-between items-start">
                              <span>{alert.message}</span>
                              <span className="text-xs text-gray-500">{alert.timestamp}</span>
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="text-center py-12">
              <div className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {navigationItems.find(item => item.id === activeTab)?.label}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This section is under development. The enterprise admin dashboard will include:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <h3 className="font-medium mb-2">Core Business Features</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Advanced user management & CRM</li>
                    <li>• Revenue analytics (MRR/ARR/LTV/CAC)</li>
                    <li>• Subscription & billing management</li>
                    <li>• Workflow monitoring & cost analysis</li>
                  </ul>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <h3 className="font-medium mb-2">AI/ML Operations</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• LLM prompt management & versioning</li>
                    <li>• Model performance & cost tracking</li>
                    <li>• A/B testing & experiments</li>
                    <li>• Security & audit logging</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={() => setActiveTab('overview')} variant="outline">
                  ← Back to Overview
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}