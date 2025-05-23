import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Lock,
  FileText,
  Scale,
  Eye,
  Cpu,
  Globe,
  Zap,
  TrendingUp,
  AlertCircle,
  Clock,
  Users,
  Database,
  Network
} from "lucide-react";

interface ComplianceScore {
  category: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
}

interface AIAuditEntry {
  timestamp: string;
  model: string;
  decision: string;
  confidence: number;
  dataPoints: number;
  user: string;
  outcome: string;
}

export default function EnterpriseGovernance() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [auditEntries, setAuditEntries] = useState<AIAuditEntry[]>([]);
  const [complianceScores, setComplianceScores] = useState<ComplianceScore[]>([]);

  useEffect(() => {
    // Simulate real-time compliance monitoring
    const mockComplianceData: ComplianceScore[] = [
      {
        category: 'GDPR Compliance',
        score: 98,
        status: 'excellent',
        issues: [],
        recommendations: ['Implement automated data retention policies']
      },
      {
        category: 'SOX Financial Controls',
        score: 94,
        status: 'excellent',
        issues: [],
        recommendations: ['Enhanced audit trail encryption']
      },
      {
        category: 'HIPAA Healthcare',
        score: 89,
        status: 'good',
        issues: ['2 minor data access violations'],
        recommendations: ['Update access control policies', 'Enhanced PHI encryption']
      },
      {
        category: 'AI Bias Detection',
        score: 92,
        status: 'excellent',
        issues: [],
        recommendations: ['Expand demographic testing datasets']
      },
      {
        category: 'Data Security',
        score: 96,
        status: 'excellent',
        issues: [],
        recommendations: ['Implement quantum-resistant encryption']
      }
    ];

    const mockAuditData: AIAuditEntry[] = [
      {
        timestamp: '2024-01-21T14:30:00Z',
        model: 'Customer Risk Assessment AI',
        decision: 'Credit Approval - $250,000 business loan',
        confidence: 94.2,
        dataPoints: 847,
        user: 'sarah.johnson@fortune500corp.com',
        outcome: 'Approved'
      },
      {
        timestamp: '2024-01-21T14:28:00Z',
        model: 'Fraud Detection Engine',
        decision: 'Transaction flagged as suspicious',
        confidence: 97.8,
        dataPoints: 1203,
        user: 'system.automated',
        outcome: 'Blocked'
      },
      {
        timestamp: '2024-01-21T14:25:00Z',
        model: 'HR Candidate Screening',
        decision: 'Candidate recommendation for senior role',
        confidence: 87.3,
        dataPoints: 542,
        user: 'hr.recruiter@fortune500corp.com',
        outcome: 'Recommended'
      }
    ];

    setComplianceScores(mockComplianceData);
    setAuditEntries(mockAuditData);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'good': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
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
            <Shield className="h-12 w-12 text-primary mr-3" />
            <Scale className="h-8 w-8 text-green-500" />
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4">
            Enterprise AI <span className="text-primary">Governance Hub</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete transparency, compliance monitoring, and governance for Fortune 500 AI implementations.
            Real-time oversight that meets the highest enterprise standards.
          </motion.p>
        </motion.div>

        {/* Key Metrics Dashboard */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp}>
            <Card className="bg-background/80 backdrop-blur-sm border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overall Compliance</p>
                    <p className="text-3xl font-bold text-green-500">94.6%</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <div className="mt-4">
                  <Progress value={94.6} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="bg-background/80 backdrop-blur-sm border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Decisions Today</p>
                    <p className="text-3xl font-bold text-blue-500">2,847</p>
                  </div>
                  <Cpu className="h-12 w-12 text-blue-500" />
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  +23% from yesterday
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="bg-background/80 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Audits</p>
                    <p className="text-3xl font-bold text-purple-500">12</p>
                  </div>
                  <FileText className="h-12 w-12 text-purple-500" />
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  3 scheduled this week
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="bg-background/80 backdrop-blur-sm border-orange-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                    <p className="text-3xl font-bold text-orange-500">Low</p>
                  </div>
                  <Shield className="h-12 w-12 text-orange-500" />
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  2.3/10 risk index
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Dashboard */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Tabs defaultValue="compliance" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
              <TabsTrigger value="bias">Bias Detection</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-6">
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scale className="h-6 w-6 mr-2 text-primary" />
                    Regulatory Compliance Dashboard
                  </CardTitle>
                  <CardDescription>
                    Real-time monitoring of regulatory compliance across all AI systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {complianceScores.map((compliance, index) => (
                      <div key={index} className="border border-border/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(compliance.status)}
                            <h3 className="font-semibold">{compliance.category}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-2xl font-bold ${getStatusColor(compliance.status)}`}>
                              {compliance.score}%
                            </span>
                            <Badge variant={compliance.status === 'excellent' ? 'default' : 'secondary'}>
                              {compliance.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <Progress value={compliance.score} className="h-2 mb-3" />
                        
                        {compliance.issues.length > 0 && (
                          <Alert className="mb-3">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Issues:</strong> {compliance.issues.join(', ')}
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        <div className="text-sm text-muted-foreground">
                          <strong>Recommendations:</strong> {compliance.recommendations.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Trail Tab */}
            <TabsContent value="audit" className="space-y-6">
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-6 w-6 mr-2 text-primary" />
                    AI Decision Audit Trail
                  </CardTitle>
                  <CardDescription>
                    Complete transparency of all AI decisions for regulatory compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditEntries.map((entry, index) => (
                      <div key={index} className="border border-border/50 rounded-lg p-4 hover:bg-muted/10 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-sm">{entry.model}</h4>
                            <p className="text-muted-foreground text-xs">
                              {new Date(entry.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {entry.confidence}% confidence
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Decision:</strong> {entry.decision}</p>
                            <p><strong>Data Points:</strong> {entry.dataPoints.toLocaleString()}</p>
                          </div>
                          <div>
                            <p><strong>User:</strong> {entry.user}</p>
                            <p><strong>Outcome:</strong> 
                              <Badge variant="secondary" className="ml-2">
                                {entry.outcome}
                              </Badge>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Export Full Audit Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bias Detection Tab */}
            <TabsContent value="bias" className="space-y-6">
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-6 w-6 mr-2 text-primary" />
                    AI Bias Detection & Fairness Monitoring
                  </CardTitle>
                  <CardDescription>
                    Advanced algorithms monitoring for bias across demographics and decision patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Fairness Metrics</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Gender Parity</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={96} className="w-20 h-2" />
                            <span className="text-green-500 font-semibold">96%</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Racial Equity</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={94} className="w-20 h-2" />
                            <span className="text-green-500 font-semibold">94%</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Age Distribution</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={92} className="w-20 h-2" />
                            <span className="text-green-500 font-semibold">92%</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Economic Background</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={89} className="w-20 h-2" />
                            <span className="text-blue-500 font-semibold">89%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Recent Bias Alerts</h3>
                      
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          No bias alerts in the last 30 days. All models performing within fairness thresholds.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>• 50,000+ decisions analyzed this month</p>
                        <p>• 12 demographic categories monitored</p>
                        <p>• Real-time bias detection active</p>
                        <p>• Automated fairness corrections enabled</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-6 w-6 mr-2 text-primary" />
                    Enterprise Security & Access Control
                  </CardTitle>
                  <CardDescription>
                    Zero-trust architecture with enterprise-grade security monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <Database className="h-4 w-4 mr-2" />
                          Data Encryption
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Data at Rest</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex justify-between">
                            <span>Data in Transit</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex justify-between">
                            <span>Model Encryption</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex justify-between">
                            <span>Quantum Resistant</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Access Control
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Active Users</span>
                            <span className="font-semibold">247</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Admin Roles</span>
                            <span className="font-semibold">12</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Failed Logins (24h)</span>
                            <span className="font-semibold text-green-500">0</span>
                          </div>
                          <div className="flex justify-between">
                            <span>MFA Enabled</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <Network className="h-4 w-4 mr-2" />
                          Network Security
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Firewall Status</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex justify-between">
                            <span>DDoS Protection</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex justify-between">
                            <span>VPN Tunnels</span>
                            <span className="font-semibold">8 Active</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Intrusion Detection</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2 text-primary" />
                    Enterprise Performance Analytics
                  </CardTitle>
                  <CardDescription>
                    Real-time performance monitoring and optimization insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">System Performance</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Response Time</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500 font-semibold">47ms</span>
                            <Badge variant="secondary">Excellent</Badge>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Uptime</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500 font-semibold">99.97%</span>
                            <Badge variant="secondary">SLA Met</Badge>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Throughput</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-500 font-semibold">15.2K req/min</span>
                            <Badge variant="secondary">Optimal</Badge>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Error Rate</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500 font-semibold">0.02%</span>
                            <Badge variant="secondary">Excellent</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Global Infrastructure</h3>
                      
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>🌍 Active Regions</span>
                          <span className="font-semibold">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span>☁️ Cloud Providers</span>
                          <span className="font-semibold">3 (AWS, Azure, GCP)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🔧 Auto-scaling Enabled</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <span>📊 Load Balancing</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <span>💾 Data Replication</span>
                          <span className="font-semibold">3x Redundancy</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex justify-center space-x-4 mt-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Button className="bg-primary hover:bg-primary/90">
            <FileText className="h-4 w-4 mr-2" />
            Generate Compliance Report
          </Button>
          <Button variant="outline">
            <Globe className="h-4 w-4 mr-2" />
            Schedule Executive Briefing
          </Button>
        </motion.div>
      </div>
    </div>
  );
}