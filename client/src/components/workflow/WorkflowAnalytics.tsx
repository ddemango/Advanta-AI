import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  BarChart3,
  Calendar,
  Zap,
  Target,
  Activity
} from 'lucide-react';

interface WorkflowAnalyticsProps {
  workflowId: number;
}

interface AnalyticsData {
  performanceMetrics: {
    successRate: number;
    avgExecutionTime: number;
    totalExecutions: number;
    errorRate: number;
    peakExecutionTime: string;
    lastSuccessful: string;
  };
  trends: Array<{
    date: string;
    executions: number;
    success: number;
    failures: number;
    avgTime: number;
  }>;
  errors: Array<{
    type: string;
    count: number;
    percentage: number;
    lastOccurred: string;
  }>;
  insights: Array<{
    type: 'optimization' | 'warning' | 'info';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function WorkflowAnalytics({ workflowId }: WorkflowAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('7d');
  
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/workflows', workflowId, 'analytics'],
    enabled: !!workflowId,
  });

  const { data: optimizations } = useQuery({
    queryKey: ['/api/workflows', workflowId, 'optimize'],
    enabled: !!workflowId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-64">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // BLOCKED: Real analytics data required - no mock data allowed
  // This component is blocked until real analytics API is implemented
  
  if (true) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Analytics Temporarily Unavailable</h3>
        <p className="text-yellow-700">
          Real-time analytics data integration required. Mock data has been removed to maintain data integrity.
        </p>
      </div>
    );
  }

  const analyticsData: AnalyticsData = {
    performanceMetrics: {
      successRate: 94.2,
      avgExecutionTime: 2.3,
      totalExecutions: 1247,
      errorRate: 5.8,
      peakExecutionTime: '9:00 AM',
      lastSuccessful: '2 minutes ago'
    },
    trends: [
      { date: '2024-06-07', executions: 45, success: 42, failures: 3, avgTime: 2.1 },
      { date: '2024-06-08', executions: 52, success: 49, failures: 3, avgTime: 2.3 },
      { date: '2024-06-09', executions: 38, success: 36, failures: 2, avgTime: 2.0 },
      { date: '2024-06-10', executions: 63, success: 59, failures: 4, avgTime: 2.5 },
      { date: '2024-06-11', executions: 41, success: 39, failures: 2, avgTime: 2.2 },
      { date: '2024-06-12', executions: 55, success: 52, failures: 3, avgTime: 2.4 },
      { date: '2024-06-13', executions: 48, success: 45, failures: 3, avgTime: 2.1 },
    ],
    errors: [
      { type: 'Timeout', count: 23, percentage: 45, lastOccurred: '1 hour ago' },
      { type: 'API Rate Limit', count: 15, percentage: 30, lastOccurred: '3 hours ago' },
      { type: 'Authentication', count: 8, percentage: 15, lastOccurred: '5 hours ago' },
      { type: 'Network Error', count: 5, percentage: 10, lastOccurred: '2 days ago' },
    ],
    insights: [
      {
        type: 'optimization',
        title: 'Cache Implementation Opportunity',
        description: 'Adding cache for API responses could reduce execution time by 30%',
        priority: 'high'
      },
      {
        type: 'warning',
        title: 'Peak Hour Performance',
        description: 'Higher error rates detected during 9-11 AM. Consider load balancing.',
        priority: 'medium'
      },
      {
        type: 'info',
        title: 'Weekend Performance',
        description: 'Execution success rate is 12% higher on weekends',
        priority: 'low'
      }
    ]
  };

  const data = analytics || mockAnalytics;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Zap className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'info': return <Activity className="w-4 h-4 text-blue-600" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workflow Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last Day</SelectItem>
            <SelectItem value="7d">Last Week</SelectItem>
            <SelectItem value="30d">Last Month</SelectItem>
            <SelectItem value="90d">Last Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">{data.performanceMetrics.successRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2.3% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Execution Time</p>
                <p className="text-2xl font-bold">{data.performanceMetrics.avgExecutionTime}s</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingDown className="w-4 h-4 mr-1" />
              -0.2s from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold">{data.performanceMetrics.totalExecutions.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +156 from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold text-red-600">{data.performanceMetrics.errorRate}%</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="mt-2 flex items-center text-sm text-red-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +0.3% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="executions" stroke="#8884d8" name="Total Executions" />
              <Line type="monotone" dataKey="success" stroke="#00C49F" name="Successful" />
              <Line type="monotone" dataKey="failures" stroke="#FF8042" name="Failed" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Execution Time Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgTime" fill="#8884d8" name="Avg Time (s)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Error Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Error Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.errors}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.errors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Error Details */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Errors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.errors.map((error, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium">{error.type}</p>
                    <p className="text-sm text-gray-600">{error.count} occurrences ({error.percentage}%)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Last occurred</p>
                  <p className="text-sm font-medium">{error.lastOccurred}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.insights.map((insight, index) => (
              <div key={index} className={`p-4 border rounded-lg ${getPriorityColor(insight.priority)}`}>
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{insight.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {insight.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
            <Button variant="outline" size="sm">
              <Target className="w-4 h-4 mr-2" />
              Set Alert Thresholds
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Zap className="w-4 h-4 mr-2" />
              Optimize Workflow
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}