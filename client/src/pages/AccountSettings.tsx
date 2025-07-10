import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Key, 
  Globe,
  Save,
  Edit,
  Trash2,
  Plus,
  Download
} from "lucide-react";

export default function AccountSettings() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "D.s.demango@gmail.com",
    company: "",
    title: "",
    phone: ""
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    systemUpdates: true,
    marketingEmails: false
  });

  const apiKeys = [
    {
      id: 1,
      name: "Production API Key",
      key: "sk-adv-*********************xyz",
      created: "2024-01-15",
      lastUsed: "2 hours ago",
      usage: "89%"
    },
    {
      id: 2,
      name: "Development API Key",
      key: "sk-adv-*********************abc",
      created: "2024-01-10",
      lastUsed: "1 day ago",
      usage: "23%"
    }
  ];

  const billingHistory = [
    {
      id: 1,
      date: "2024-07-01",
      description: "Pro Plan - Monthly",
      amount: "$99.00",
      status: "Paid"
    },
    {
      id: 2,
      date: "2024-06-01",
      description: "Pro Plan - Monthly",
      amount: "$99.00",
      status: "Paid"
    },
    {
      id: 3,
      date: "2024-05-01",
      description: "Pro Plan - Monthly",
      amount: "$99.00",
      status: "Paid"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Account Settings - Advanta AI</title>
        <meta name="description" content="Manage your account settings, billing, and preferences" />
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and billing</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl">
                      {profile.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      JPG, PNG or SVG. Max size 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                      placeholder="Your company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => setProfile({...profile, title: e.target.value})}
                      placeholder="Your job title"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Password</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Last changed 3 months ago
                    </p>
                    <Button variant="outline">
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Authenticator App</p>
                        <p className="text-sm text-gray-600">Use an app like Google Authenticator</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Login Sessions</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage your active login sessions
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-gray-600">Chrome on Mac • Los Angeles, CA</p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Mobile App</p>
                          <p className="text-sm text-gray-600">iPhone • Last active 2 hours ago</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about updates and activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-600">
                          {key === 'emailNotifications' && 'Receive notifications via email'}
                          {key === 'pushNotifications' && 'Receive push notifications on your devices'}
                          {key === 'weeklyReports' && 'Get weekly summary reports'}
                          {key === 'systemUpdates' && 'Notifications about system updates and maintenance'}
                          {key === 'marketingEmails' && 'Product updates and promotional emails'}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, [key]: checked})
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Billing & Subscription
                </CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Current Plan</h4>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Pro Plan</span>
                        <Badge>Active</Badge>
                      </div>
                      <p className="text-2xl font-bold">$99/month</p>
                      <p className="text-sm text-gray-600">Billed monthly</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Usage This Month</h4>
                    <div className="p-4 border rounded-lg">
                      <p className="text-2xl font-bold">89%</p>
                      <p className="text-sm text-gray-600">of API calls used</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '89%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Billing History</h4>
                  <div className="space-y-3">
                    {billingHistory.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{invoice.description}</p>
                          <p className="text-sm text-gray-600">{invoice.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{invoice.amount}</p>
                          <Badge variant="secondary">{invoice.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  API Keys
                </CardTitle>
                <CardDescription>
                  Manage your API keys for integrations and development
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-end">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Generate New Key
                  </Button>
                </div>

                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{apiKey.name}</h4>
                          <p className="text-sm text-gray-600 font-mono">{apiKey.key}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Created</p>
                          <p className="font-medium">{apiKey.created}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Last Used</p>
                          <p className="font-medium">{apiKey.lastUsed}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Usage</p>
                          <p className="font-medium">{apiKey.usage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}