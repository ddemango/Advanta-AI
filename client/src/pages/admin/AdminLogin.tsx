import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return apiRequest('/api/admin/login', 'POST', credentials);
    },
    onSuccess: (data) => {
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      setLocation('/admin-dashboard');
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: "Invalid credentials or access denied",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Helmet>
        <title>Admin Access - Advanta AI</title>
        <meta name="description" content="Administrative access for Advanta AI team members" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <CardDescription>
            Administrative access for team members only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <Lock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              This area is restricted to authorized personnel only. All access attempts are logged.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@advanta-ai.com"
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loginMutation.isPending ? 'Authenticating...' : 'Access Admin Area'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setLocation('/')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Main Site
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}