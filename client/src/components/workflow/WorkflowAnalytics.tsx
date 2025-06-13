import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface WorkflowAnalyticsProps {
  workflowId: number;
}

export function WorkflowAnalytics({ workflowId }: WorkflowAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/workflows', workflowId, 'analytics', timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/workflows/${workflowId}/analytics?timeRange=${timeRange}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    }
  });

  const { data: insights } = useQuery({
    queryKey: ['/api/workflows', workflowId, 'insights'],
    queryFn: async () => {
      const response = await fetch(`/api/workflows/${workflowId}/insights`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch insights');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Workflow Analytics</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Executions</p>
                <p className="text-2xl font-bold">{analytics?.totalExecutions || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className={`text-2xl font-bold ${getSuccessRateColor(analytics?.successRate || 0)}`}>
                  {analytics?.successRate?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={analytics?.successRate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Execution Time</p>
                <p className="text-2xl font-bold">{analytics?.averageExecutionTime?.toFixed(1) || 0}s</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold text-red-600">{analytics?.errorRate?.toFixed(1) || 0}%</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Execution Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Execution Trend</CardTitle>
          <CardDescription>Daily workflow executions and success rate over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.executionTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="executions" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="successes" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Error Analysis */}
      {analytics?.topErrors && analytics.topErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Errors</CardTitle>
            <CardDescription>Most common errors in this workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topErrors.map((error, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-sm">{error.error}</span>
                  </div>
                  <Badge variant="destructive">{error.count} times</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getPerformanceIcon(insights.performanceScore)}
                <span>Performance Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Performance</span>
                  <Badge variant={insights.performanceScore >= 80 ? 'default' : 'secondary'}>
                    {insights.performanceScore}/100
                  </Badge>
                </div>
                <Progress value={insights.performanceScore} />
                
                <div className="flex items-center justify-between">
                  <span>Reliability</span>
                  <Badge variant={insights.reliabilityScore >= 90 ? 'default' : 'secondary'}>
                    {insights.reliabilityScore}/100
                  </Badge>
                </div>
                <Progress value={insights.reliabilityScore} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimization Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {insights.optimizationSuggestions?.length > 0 ? (
                  insights.optimizationSuggestions.map((suggestion, index) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">{suggestion}</AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No optimization suggestions at this time.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recommendations */}
      {insights?.recommendations && insights.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>AI-powered suggestions to improve your workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}