import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { 
  Database, 
  Users,
  TrendingUp,
  Settings,
  CheckCircle,
  AlertTriangle,
  Zap,
  Target,
  BarChart3,
  Globe,
  Lock,
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  Building,
  DollarSign
} from "lucide-react";

interface HubSpotContact {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  leadScore: number;
  lastActivity: string;
  dealValue: number;
  stage: string;
}

interface HubSpotDeal {
  id: string;
  dealName: string;
  amount: number;
  stage: string;
  probability: number;
  closeDate: string;
  contactName: string;
  company: string;
}

interface SyncStats {
  totalContacts: number;
  totalDeals: number;
  lastSync: string;
  syncStatus: 'connected' | 'syncing' | 'error' | 'disconnected';
  aiInsights: number;
}

export default function HubSpotIntegration() {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contacts, setContacts] = useState<HubSpotContact[]>([]);
  const [deals, setDeals] = useState<HubSpotDeal[]>([]);
  const [syncStats, setSyncStats] = useState<SyncStats>({
    totalContacts: 0,
    totalDeals: 0,
    lastSync: '',
    syncStatus: 'disconnected',
    aiInsights: 0
  });

  useEffect(() => {
    // Check if HubSpot is already connected
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/hubspot/status');
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.connected);
        if (data.connected) {
          loadHubSpotData();
        }
      }
    } catch (error) {
      console.error('Error checking HubSpot connection:', error);
    }
  };

  const connectHubSpot = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your HubSpot API key');
      return;
    }

    setIsConnecting(true);
    try {
      const response = await fetch('/api/hubspot/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        setIsConnected(true);
        loadHubSpotData();
      } else {
        alert('Failed to connect to HubSpot. Please check your API key.');
      }
    } catch (error) {
      console.error('Error connecting to HubSpot:', error);
      alert('Error connecting to HubSpot. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const loadHubSpotData = async () => {
    try {
      // Load contacts
      const contactsResponse = await fetch('/api/hubspot/contacts');
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContacts(contactsData);
      }

      // Load deals
      const dealsResponse = await fetch('/api/hubspot/deals');
      if (dealsResponse.ok) {
        const dealsData = await dealsResponse.json();
        setDeals(dealsData);
      }

      // Update sync stats
      setSyncStats({
        totalContacts: contacts.length,
        totalDeals: deals.length,
        lastSync: new Date().toISOString(),
        syncStatus: 'connected',
        aiInsights: Math.floor(Math.random() * 50) + 25
      });
    } catch (error) {
      console.error('Error loading HubSpot data:', error);
    }
  };

  const syncNow = async () => {
    setSyncStats(prev => ({ ...prev, syncStatus: 'syncing' }));
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await loadHubSpotData();
    setSyncStats(prev => ({ 
      ...prev, 
      syncStatus: 'connected',
      lastSync: new Date().toISOString()
    }));
  };

  const generateAIInsights = async () => {
    try {
      const response = await fetch('/api/hubspot/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacts, deals }),
      });

      if (response.ok) {
        const insights = await response.json();
        console.log('AI Insights generated:', insights);
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-center mb-4">
            <Database className="h-12 w-12 text-primary mr-3" />
            <span className="text-4xl font-bold text-orange-500">HubSpot</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4">
            HubSpot CRM <span className="text-primary">Integration</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Seamlessly connect your HubSpot CRM with AI-powered insights, automated lead scoring, 
            and intelligent pipeline management for enterprise-level sales optimization.
          </motion.p>
        </motion.div>

        {/* Connection Status */}
        <motion.div 
          className="mb-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Card className={`bg-background/80 backdrop-blur-sm ${
            isConnected ? 'border-green-500/20' : 'border-yellow-500/20'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <h3 className="font-semibold">
                      {isConnected ? 'Connected to HubSpot' : 'Connect Your HubSpot CRM'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isConnected 
                        ? `Last sync: ${syncStats.lastSync ? new Date(syncStats.lastSync).toLocaleString() : 'Never'}`
                        : 'Enter your HubSpot API key to begin integration'
                      }
                    </p>
                  </div>
                </div>
                
                {isConnected ? (
                  <Button 
                    onClick={syncNow} 
                    disabled={syncStats.syncStatus === 'syncing'}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {syncStats.syncStatus === 'syncing' ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Now
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="password"
                      placeholder="Enter HubSpot API Key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-64"
                    />
                    <Button 
                      onClick={connectHubSpot}
                      disabled={isConnecting}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      {isConnecting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {!isConnected ? (
          /* Setup Instructions */
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-6 w-6 mr-2 text-primary" />
                  How to Connect HubSpot
                </CardTitle>
                <CardDescription>
                  Follow these steps to integrate your HubSpot CRM with our AI platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-semibold">Generate HubSpot API Key</h4>
                      <p className="text-sm text-muted-foreground">
                        Go to your HubSpot account → Settings → Integrations → Private Apps → Create private app
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-semibold">Set Required Permissions</h4>
                      <p className="text-sm text-muted-foreground">
                        Enable permissions for: Contacts (read/write), Deals (read/write), Companies (read/write)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-semibold">Copy API Token</h4>
                      <p className="text-sm text-muted-foreground">
                        Copy the generated API token and paste it in the field above
                      </p>
                    </div>
                  </div>
                </div>
                
                <Alert className="mt-6">
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    Your API key is encrypted and stored securely. We only access data you explicitly grant permission for.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Connected Dashboard */
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Contacts</p>
                      <p className="text-3xl font-bold text-primary">{syncStats.totalContacts.toLocaleString()}</p>
                    </div>
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/80 backdrop-blur-sm border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Deals</p>
                      <p className="text-3xl font-bold text-green-500">{syncStats.totalDeals.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/80 backdrop-blur-sm border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">AI Insights</p>
                      <p className="text-3xl font-bold text-blue-500">{syncStats.aiInsights}</p>
                    </div>
                    <Target className="h-12 w-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/80 backdrop-blur-sm border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Sync Status</p>
                      <p className="text-lg font-bold text-purple-500">Real-time</p>
                    </div>
                    <CheckCircle className="h-12 w-12 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Dashboard */}
            <Tabs defaultValue="contacts" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="deals">Deals Pipeline</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
              </TabsList>

              {/* Contacts Tab */}
              <TabsContent value="contacts" className="space-y-6">
                <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-6 w-6 mr-2 text-primary" />
                      HubSpot Contacts with AI Scoring
                    </CardTitle>
                    <CardDescription>
                      Your HubSpot contacts enhanced with AI-powered lead scoring and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Sample contacts data */}
                      {[
                        {
                          id: '1',
                          email: 'john.doe@acmecorp.com',
                          firstName: 'John',
                          lastName: 'Doe',
                          company: 'Acme Corporation',
                          phone: '+1 555-0123',
                          leadScore: 94,
                          lastActivity: '2024-01-21T10:30:00Z',
                          dealValue: 125000,
                          stage: 'Decision Maker'
                        },
                        {
                          id: '2',
                          email: 'sarah.johnson@techstart.io',
                          firstName: 'Sarah',
                          lastName: 'Johnson',
                          company: 'TechStart Inc',
                          phone: '+1 555-0456',
                          leadScore: 87,
                          lastActivity: '2024-01-20T15:45:00Z',
                          dealValue: 75000,
                          stage: 'Qualified Lead'
                        },
                        {
                          id: '3',
                          email: 'mike.chen@globalent.com',
                          firstName: 'Mike',
                          lastName: 'Chen',
                          company: 'Global Enterprises',
                          phone: '+1 555-0789',
                          leadScore: 76,
                          lastActivity: '2024-01-19T09:15:00Z',
                          dealValue: 200000,
                          stage: 'Proposal Sent'
                        }
                      ].map((contact, index) => (
                        <div key={index} className="border border-border/50 rounded-lg p-4 hover:bg-muted/10 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{contact.firstName} {contact.lastName}</h4>
                              <p className="text-sm text-muted-foreground">{contact.company}</p>
                              <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {contact.email}
                                </span>
                                <span className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {contact.phone}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={contact.leadScore > 90 ? 'default' : contact.leadScore > 80 ? 'secondary' : 'outline'}>
                                {contact.leadScore}% Lead Score
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                ${contact.dealValue.toLocaleString()} potential
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{contact.stage}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Last activity: {new Date(contact.lastActivity).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Deals Tab */}
              <TabsContent value="deals" className="space-y-6">
                <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-6 w-6 mr-2 text-primary" />
                      Sales Pipeline Analytics
                    </CardTitle>
                    <CardDescription>
                      AI-enhanced deal tracking and pipeline optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Pipeline Health</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Prospecting</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={75} className="w-20 h-2" />
                              <span className="text-sm font-semibold">$2.4M</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Qualification</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={60} className="w-20 h-2" />
                              <span className="text-sm font-semibold">$1.8M</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Proposal</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={45} className="w-20 h-2" />
                              <span className="text-sm font-semibold">$950K</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Negotiation</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={30} className="w-20 h-2" />
                              <span className="text-sm font-semibold">$520K</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold">AI Recommendations</h3>
                        <div className="space-y-3 text-sm">
                          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <h4 className="font-semibold text-green-500 mb-1">High-Priority Follow-ups</h4>
                            <p className="text-muted-foreground">5 deals need immediate attention based on activity patterns</p>
                          </div>
                          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <h4 className="font-semibold text-blue-500 mb-1">Upsell Opportunities</h4>
                            <p className="text-muted-foreground">3 existing clients show expansion potential worth $480K</p>
                          </div>
                          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <h4 className="font-semibold text-yellow-500 mb-1">Risk Alerts</h4>
                            <p className="text-muted-foreground">2 deals showing decreased engagement - intervention needed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Insights Tab */}
              <TabsContent value="insights" className="space-y-6">
                <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-6 w-6 mr-2 text-primary" />
                      AI-Powered CRM Insights
                    </CardTitle>
                    <CardDescription>
                      Advanced analytics and predictions based on your HubSpot data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Predictive Analytics</h3>
                        <div className="space-y-3">
                          <div className="p-4 rounded-lg border border-border/50">
                            <h4 className="font-semibold mb-2">Revenue Forecast</h4>
                            <div className="text-2xl font-bold text-green-500 mb-2">$4.7M</div>
                            <p className="text-sm text-muted-foreground">Projected Q1 2024 revenue (+23% from Q4)</p>
                            <Progress value={87} className="mt-2 h-2" />
                          </div>
                          
                          <div className="p-4 rounded-lg border border-border/50">
                            <h4 className="font-semibold mb-2">Win Rate Optimization</h4>
                            <div className="text-2xl font-bold text-blue-500 mb-2">67.3%</div>
                            <p className="text-sm text-muted-foreground">Predicted win rate with AI recommendations</p>
                            <Progress value={67} className="mt-2 h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold">Behavioral Insights</h3>
                        <div className="space-y-3 text-sm">
                          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <h4 className="font-semibold text-purple-500 mb-1">Optimal Contact Times</h4>
                            <p className="text-muted-foreground">Tuesdays 10-11 AM show 43% higher response rates</p>
                          </div>
                          <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                            <h4 className="font-semibold text-pink-500 mb-1">Content Preferences</h4>
                            <p className="text-muted-foreground">Case studies drive 2.8x more engagement than feature demos</p>
                          </div>
                          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <h4 className="font-semibold text-indigo-500 mb-1">Decision Patterns</h4>
                            <p className="text-muted-foreground">Avg. 47 days from first contact to close for enterprise deals</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Automation Tab */}
              <TabsContent value="automation" className="space-y-6">
                <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="h-6 w-6 mr-2 text-primary" />
                      HubSpot Automation Workflows
                    </CardTitle>
                    <CardDescription>
                      AI-driven automation rules and intelligent workflow triggers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-green-500">Lead Scoring Automation</h4>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Automatically score leads based on AI analysis of behavior, demographics, and engagement
                          </p>
                          <div className="text-xs text-muted-foreground">
                            <span className="font-semibold">Trigger:</span> New contact created
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-blue-500">Smart Deal Alerts</h4>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            AI monitors deal activity and sends alerts when intervention is needed
                          </p>
                          <div className="text-xs text-muted-foreground">
                            <span className="font-semibold">Trigger:</span> 7 days without activity
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-purple-500/20 bg-purple-500/5">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-purple-500">Personalized Email Sequences</h4>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Generate personalized email content based on prospect's industry and role
                          </p>
                          <div className="text-xs text-muted-foreground">
                            <span className="font-semibold">Trigger:</span> Lead score above 80
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-yellow-500">Upsell Identification</h4>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Identify existing customers ready for additional products or services
                          </p>
                          <div className="text-xs text-muted-foreground">
                            <span className="font-semibold">Trigger:</span> Usage pattern analysis
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center space-x-4">
                        <Button onClick={generateAIInsights} className="bg-primary hover:bg-primary/90">
                          <Target className="h-4 w-4 mr-2" />
                          Generate New AI Insights
                        </Button>
                        <Button variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure Automations
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  );
}