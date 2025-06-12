import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { LogOut, User, Settings, Activity } from "lucide-react";

interface User {
  id: number;
  email: string;
  name?: string;
  picture?: string;
  provider: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetch('/auth/user')
      .then(res => res.json())
      .then(userData => {
        if (userData) {
          setUser(userData);
        } else {
          setLocation('/login');
        }
        setLoading(false);
      })
      .catch(() => {
        setLocation('/login');
        setLoading(false);
      });
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
      setLocation('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.name || user.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.picture} alt={user.name || user.email} />
                <AvatarFallback className="bg-blue-600 text-white text-lg">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">
                  {user.name || 'User'}
                </h3>
                <p className="text-gray-300">{user.email}</p>
                <p className="text-gray-400 text-sm mt-1">
                  Signed in with {user.provider === 'google' ? 'Google' : 'Apple'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  Movie Recommendations
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Get personalized movie and TV show recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setLocation('/movie-matchmaker-simple')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Get Recommendations
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your account preferences and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  View Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <User className="w-5 h-5" />
                  Profile
                </CardTitle>
                <CardDescription className="text-gray-300">
                  View and edit your profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}