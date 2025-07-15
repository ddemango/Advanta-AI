import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Mail, TrendingUp, Database, Download, Send, Lock } from 'lucide-react';
import { NewHeader } from '@/components/redesign/NewHeader';
import { useToast } from '@/hooks/use-toast';

interface Subscriber {
  id: number;
  email: string;
  is_active: boolean;
  unsubscribe_token: string;
}

interface BlogPost {
  id: number;
  title: string;
  category: string;
  published: boolean;
  created_at: string;
}

interface Analytics {
  total_subscribers: number;
  active_subscribers: number;
  unsubscribed: number;
  total_blog_posts: number;
  published_posts: number;
}

export default function AdminDashboard() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Check if already authenticated in sessionStorage
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'FamilyStrong42!') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      fetchData();
      toast({
        title: "Access Granted",
        description: "Welcome to the Admin Dashboard",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
      setPassword('');
    }
  };

  const fetchData = async () => {
    try {
      // Fetch subscribers
      const subscribersRes = await fetch('/api/admin/subscribers');
      const subscribersData = await subscribersRes.json();
      setSubscribers(subscribersData);

      // Fetch blog posts
      const blogRes = await fetch('/api/admin/blog-posts');
      const blogData = await blogRes.json();
      setBlogPosts(blogData);

      // Fetch analytics
      const analyticsRes = await fetch('/api/admin/analytics');
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Status', 'Subscriber ID'].join(','),
      ...subscribers.map(sub => [
        sub.email,
        sub.is_active ? 'Active' : 'Unsubscribed',
        sub.id
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sendTestNewsletter = async () => {
    try {
      const response = await fetch('/api/admin/send-test-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        alert('Test newsletter sent successfully!');
      } else {
        alert('Failed to send test newsletter');
      }
    } catch (error) {
      alert('Error sending test newsletter');
    }
  };

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
              <p className="text-gray-600">Enter the password to access the admin dashboard</p>
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
            <div className="text-lg">Loading admin dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NewHeader />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={exportSubscribers} variant="outline" className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export Subscribers
              </Button>
              <Button onClick={sendTestNewsletter} className="w-full sm:w-auto">
                <Send className="w-4 h-4 mr-2" />
                Send Test Newsletter
              </Button>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.total_subscribers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.active_subscribers || 0} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{analytics?.active_subscribers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Receiving newsletters
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.total_blog_posts || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.published_posts || 0} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{analytics?.unsubscribed || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total unsubscribes
              </p>
            </CardContent>
          </Card>
          </div>

          {/* Recent Subscribers */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscribers.slice(0, 10).map((subscriber) => (
                  <div key={subscriber.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {subscriber.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{subscriber.email}</p>
                        <p className="text-sm text-gray-500">ID: {subscriber.id}</p>
                      </div>
                    </div>
                    <Badge variant={subscriber.is_active ? "default" : "secondary"} className="self-start sm:self-center">
                      {subscriber.is_active ? "Active" : "Unsubscribed"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Blog Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blogPosts.slice(0, 10).map((post) => (
                  <div key={post.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-gray-500">
                        Category: {post.category} • Created: {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={post.published ? "default" : "secondary"} className="self-start sm:self-center">
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}