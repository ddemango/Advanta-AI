import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { LogOut, User, Settings, Shield } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/auth/user'],
    retry: false,
  });

  console.log('Dashboard render:', { user, isLoading, error });

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
      setLocation('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    console.log('Dashboard: No user found, redirecting to login');
    setLocation('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-300">Welcome back to your portal</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:col-span-2"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <User className="w-6 h-6" />
                  User Profile
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Your account information and authentication details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.picture} alt={user.firstName || user.email} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg">
                      {user.firstName ? user.firstName[0] : user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.firstName || 'User'
                      }
                    </h3>
                    <p className="text-gray-300">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Authenticated
                      </Badge>
                      {user.provider && (
                        <Badge variant="outline" className="border-blue-600/30 text-blue-400">
                          {user.provider === 'local' ? 'Email' : user.provider}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-gray-400 text-sm">Member Since</p>
                    <p className="text-white font-medium">
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'Recent'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Account Type</p>
                    <p className="text-white font-medium">Standard</p>
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
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Settings className="w-6 h-6" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Update Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Change Password
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="md:col-span-2 lg:col-span-3"
          >
            <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border-blue-600/30 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    🎉 Authentication System Complete!
                  </h2>
                  <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
                    Your comprehensive authentication system is now ready with both OAuth (Google & Apple) 
                    and traditional email/password options. The system includes secure password hashing, 
                    session management, and a modern glassmorphism design.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-white font-semibold">OAuth Ready</h3>
                      <p className="text-gray-300 text-sm">Google & Apple</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-white font-semibold">Secure Auth</h3>
                      <p className="text-gray-300 text-sm">bcrypt + Sessions</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-white font-semibold">User Signup</h3>
                      <p className="text-gray-300 text-sm">Registration Flow</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-white font-semibold">Dashboard</h3>
                      <p className="text-gray-300 text-sm">User Portal</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}