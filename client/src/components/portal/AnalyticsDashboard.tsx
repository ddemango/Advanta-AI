import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Analytics dashboard with real-time data visualization
export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Sample analytics data - in a real implementation, this would come from an API
  const usageData = [
    { date: 'Mon', queries: 120, users: 45, sessions: 67 },
    { date: 'Tue', queries: 145, users: 52, sessions: 78 },
    { date: 'Wed', queries: 162, users: 61, sessions: 92 },
    { date: 'Thu', queries: 134, users: 49, sessions: 74 },
    { date: 'Fri', queries: 187, users: 64, sessions: 98 },
    { date: 'Sat', queries: 103, users: 38, sessions: 61 },
    { date: 'Sun', queries: 91, users: 32, sessions: 54 }
  ];
  
  const sentimentData = [
    { name: 'Positive', value: 68 },
    { name: 'Neutral', value: 21 },
    { name: 'Negative', value: 11 }
  ];
  
  const topQueriesData = [
    { query: 'Pricing information', count: 156 },
    { query: 'Technical support', count: 129 },
    { query: 'Product features', count: 118 },
    { query: 'Integration help', count: 97 },
    { query: 'Account issues', count: 84 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A73AEB'];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-2xl font-bold">Analytics Dashboard</h3>
        
        <div className="flex items-center space-x-4">
          <div>
            <Label htmlFor="timeRange">Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger id="timeRange" className="w-[150px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-background">
          <div className="text-sm text-muted-foreground">Total Queries</div>
          <div className="text-3xl font-bold text-primary mt-1">942</div>
          <div className="text-xs text-green-500 mt-2">
            <span className="inline-block mr-1">&#9650;</span> 12.5% from previous period
          </div>
        </Card>
        
        <Card className="p-4 bg-background">
          <div className="text-sm text-muted-foreground">Active Users</div>
          <div className="text-3xl font-bold text-primary mt-1">341</div>
          <div className="text-xs text-green-500 mt-2">
            <span className="inline-block mr-1">&#9650;</span> 8.2% from previous period
          </div>
        </Card>
        
        <Card className="p-4 bg-background">
          <div className="text-sm text-muted-foreground">Avg. Response Time</div>
          <div className="text-3xl font-bold text-primary mt-1">1.2s</div>
          <div className="text-xs text-green-500 mt-2">
            <span className="inline-block mr-1">&#9660;</span> 15.3% from previous period
          </div>
        </Card>
        
        <Card className="p-4 bg-background">
          <div className="text-sm text-muted-foreground">Completion Rate</div>
          <div className="text-3xl font-bold text-primary mt-1">94.7%</div>
          <div className="text-xs text-green-500 mt-2">
            <span className="inline-block mr-1">&#9650;</span> 2.1% from previous period
          </div>
        </Card>
      </div>
      
      {/* Usage Trends */}
      <Card className="p-6 bg-background">
        <h4 className="text-lg font-medium mb-4">Usage Trends</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="queries" stroke="#0088FE" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="users" stroke="#00C49F" />
              <Line type="monotone" dataKey="sessions" stroke="#FFBB28" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* Split view: User Sentiment and Top Queries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-background">
          <h4 className="text-lg font-medium mb-4">User Sentiment</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-6 bg-background">
          <h4 className="text-lg font-medium mb-4">Top Queries</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topQueriesData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="query" />
                <Tooltip />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* AI Performance Metrics */}
      <Card className="p-6 bg-background">
        <h4 className="text-lg font-medium mb-4">AI Performance Metrics</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Accuracy</div>
            <div className="text-2xl font-bold mt-1">92.7%</div>
            <div className="w-full bg-muted h-1.5 rounded-full mt-2">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '92.7%' }}></div>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Precision</div>
            <div className="text-2xl font-bold mt-1">89.4%</div>
            <div className="w-full bg-muted h-1.5 rounded-full mt-2">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '89.4%' }}></div>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Recall</div>
            <div className="text-2xl font-bold mt-1">86.2%</div>
            <div className="w-full bg-muted h-1.5 rounded-full mt-2">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '86.2%' }}></div>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">F1 Score</div>
            <div className="text-2xl font-bold mt-1">87.8%</div>
            <div className="w-full bg-muted h-1.5 rounded-full mt-2">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '87.8%' }}></div>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="text-sm text-muted-foreground text-center mt-4">
        <p>This dashboard shows analytics from your AI system across all touchpoints.</p>
        <p>Connect additional data sources through the integration panel to enrich your analytics.</p>
      </div>
    </div>
  );
}