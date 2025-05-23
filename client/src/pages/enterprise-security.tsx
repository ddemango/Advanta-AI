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
  Lock, 
  Key,
  Eye,
  Server,
  Globe,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Database,
  Network,
  Cpu,
  FileText as FileShield,
  Activity,
  Target
} from "lucide-react";

interface SecurityMetric {
  name: string;
  value: string | number;
  status: 'secure' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface ThreatAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  timestamp: string;
  status: 'active' | 'mitigated' | 'investigating';
  affected_systems: string[];
}

export default function EnterpriseSecurity() {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [threatAlerts, setThreatAlerts] = useState<ThreatAlert[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  useEffect(() => {
    // Initialize security metrics
    const mockSecurityMetrics: SecurityMetric[] = [
      {
        name: 'Zero-Trust Score',
        value: 98.5,
        status: 'secure',
        trend: 'up',
        description: 'Network access control and verification protocols'
      },
      {
        name: 'Encryption Coverage',
        value: '100%',
        status: 'secure',
        trend: 'stable',
        description: 'Data encryption at rest and in transit'
      },
      {
        name: 'Access Violations',
        value: 0,
        status: 'secure',
        trend: 'stable',
        description: 'Unauthorized access attempts in 24h'
      },
      {
        name: 'Vulnerability Score',
        value: 2.1,
        status: 'secure',
        trend: 'down',
        description: 'CVSS score based on active vulnerabilities'
      },
      {
        name: 'Multi-Factor Auth',
        value: '100%',
        status: 'secure',
        trend: 'stable',
        description: 'Users with MFA enabled'
      },
      {
        name: 'Security Patches',
        value: '99.8%',
        status: 'secure',
        trend: 'up',
        description: 'Systems with latest security updates'
      }
    ];

    const mockThreatAlerts: ThreatAlert[] = [
      {
        id: 'THREAT-2024-001',
        severity: 'low',
        type: 'Anomalous Login Pattern',
        description: 'Unusual login times detected for user account (off-hours access)',
        timestamp: '2024-01-21T14:45:00Z',
        status: 'investigating',
        affected_systems: ['User Authentication Portal']
      },
      {
        id: 'THREAT-2024-002',
        severity: 'medium',
        type: 'API Rate Limit Exceeded',
        description: 'Multiple rapid API calls from external IP address',
        timestamp: '2024-01-21T13:30:00Z',
        status: 'mitigated',
        affected_systems: ['Public API Gateway']
      }
    ];

    setSecurityMetrics(mockSecurityMetrics);
    setThreatAlerts(mockThreatAlerts);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
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
            <Lock className="h-8 w-8 text-green-500" />
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4">
            Enterprise <span className="text-primary">Security Hub</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Military-grade security architecture with zero-trust protocols. 
            Protecting Fortune 500 AI implementations with enterprise-level security controls.
          </motion.p>
        </motion.div>

        {/* Security Status Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp}>
            <Card className="bg-background/80 backdrop-blur-sm border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Security Status</p>
                    <p className="text-3xl font-bold text-green-500">SECURE</p>
                  </div>
                  <Shield className="h-12 w-12 text-green-500" />
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  All systems protected
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="bg-background/80 backdrop-blur-sm border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Threats</p>
                    <p className="text-3xl font-bold text-blue-500">2</p>
                  </div>
                  <Eye className="h-12 w-12 text-blue-500" />
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Low priority, monitored
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="bg-background/80 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quantum Ready</p>
                    <p className="text-3xl font-bold text-purple-500">100%</p>
                  </div>
                  <Cpu className="h-12 w-12 text-purple-500" />
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Future-proof encryption
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Security Dashboard */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="access">Access Control</TabsTrigger>
              <TabsTrigger value="threats">Threat Monitor</TabsTrigger>
              <TabsTrigger value="encryption">Encryption</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-6 w-6 mr-2 text-primary" />
                      Security Metrics
                    </CardTitle>
                    <CardDescription>
                      Real-time security health indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {securityMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{metric.name}</h4>
                            <p className="text-xs text-muted-foreground">{metric.description}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                              {metric.value}{typeof metric.value === 'number' && metric.value < 10 ? '/10' : ''}
                            </div>
                            <div className="flex items-center justify-end space-x-1">
                              <Badge variant="secondary" className="text-xs">
                                {metric.status}
                              </Badge>
                              {metric.trend === 'up' && <span className="text-green-500 text-xs">↗</span>}
                              {metric.trend === 'down' && <span className="text-red-500 text-xs">↘</span>}
                              {metric.trend === 'stable' && <span className="text-blue-500 text-xs">→</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Network className="h-6 w-6 mr-2 text-primary" />
                      Infrastructure Security
                    </CardTitle>
                    <CardDescription>
                      Multi-cloud security architecture status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <Server className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">AWS Infrastructure</p>
                          <p className="text-xs text-green-500">Secure</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <Globe className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">Azure Backup</p>
                          <p className="text-xs text-green-500">Secure</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <Database className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">GCP Analytics</p>
                          <p className="text-xs text-green-500">Secure</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">Edge Nodes</p>
                          <p className="text-xs text-green-500">12 Active</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Access Control Tab */}
            <TabsContent value="access" className="space-y-6">
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-6 w-6 mr-2 text-primary" />
                    Zero-Trust Access Control
                  </CardTitle>
                  <CardDescription>
                    Advanced role-based access management with continuous verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">User Authentication</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Multi-Factor Auth</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={100} className="w-16 h-2" />
                            <span className="text-green-500 font-semibold">100%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Biometric Auth</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={87} className="w-16 h-2" />
                            <span className="text-green-500 font-semibold">87%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Hardware Tokens</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={72} className="w-16 h-2" />
                            <span className="text-blue-500 font-semibold">72%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Access Levels</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Executive Access</span>
                          <Badge variant="secondary">8 Users</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Admin Access</span>
                          <Badge variant="secondary">15 Users</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Developer Access</span>
                          <Badge variant="secondary">45 Users</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Analyst Access</span>
                          <Badge variant="secondary">89 Users</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Read-Only Access</span>
                          <Badge variant="secondary">156 Users</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Session Security</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Active Sessions</span>
                          <span className="font-semibold">247</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Session Timeout</span>
                          <span className="font-semibold">30 min</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Concurrent Sessions</span>
                          <span className="font-semibold">Max 3</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Failed Attempts</span>
                          <span className="font-semibold text-green-500">0 (24h)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Threat Monitor Tab */}
            <TabsContent value="threats" className="space-y-6">
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-6 w-6 mr-2 text-primary" />
                    Advanced Threat Detection
                  </CardTitle>
                  <CardDescription>
                    AI-powered threat intelligence and real-time monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-500">0</div>
                          <div className="text-sm text-muted-foreground">Critical Threats</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-500">1</div>
                          <div className="text-sm text-muted-foreground">Medium Threats</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-500">1</div>
                          <div className="text-sm text-muted-foreground">Low Threats</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-500">47</div>
                          <div className="text-sm text-muted-foreground">Threats Blocked</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Active Threat Alerts</h3>
                      {threatAlerts.map((alert, index) => (
                        <div key={index} className="border border-border/50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge className={getSeverityColor(alert.severity)}>
                                  {alert.severity.toUpperCase()}
                                </Badge>
                                <span className="text-sm font-medium">{alert.type}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{alert.description}</p>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              {new Date(alert.timestamp).toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-xs">
                              <strong>Affected:</strong> {alert.affected_systems.join(', ')}
                            </div>
                            <Badge variant={alert.status === 'mitigated' ? 'secondary' : 'outline'}>
                              {alert.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Encryption Tab */}
            <TabsContent value="encryption" className="space-y-6">
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileShield className="h-6 w-6 mr-2 text-primary" />
                    Quantum-Resistant Encryption
                  </CardTitle>
                  <CardDescription>
                    Advanced encryption protocols ready for the quantum computing era
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Encryption Status</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <span className="text-sm">Data at Rest</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500 font-semibold">AES-256-GCM</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <span className="text-sm">Data in Transit</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500 font-semibold">TLS 1.3</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <span className="text-sm">AI Model Protection</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500 font-semibold">Homomorphic</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                          <span className="text-sm">Quantum-Resistant</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-purple-500 font-semibold">CRYSTALS-Kyber</span>
                            <CheckCircle className="h-4 w-4 text-purple-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Key Management</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Active Keys</span>
                          <span className="font-semibold">2,847</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Key Rotation</span>
                          <span className="font-semibold">Automated (90 days)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hardware Security Modules</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <span>Zero-Knowledge Architecture</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <span>Multi-Signature Support</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-6">
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-primary" />
                    Security Compliance Framework
                  </CardTitle>
                  <CardDescription>
                    Enterprise security standards and regulatory compliance status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Compliance Standards</h3>
                      <div className="space-y-3">
                        {[
                          { name: 'SOC 2 Type II', status: 'Certified', score: 100 },
                          { name: 'ISO 27001', status: 'Certified', score: 100 },
                          { name: 'FedRAMP', status: 'In Progress', score: 87 },
                          { name: 'NIST Framework', status: 'Compliant', score: 96 },
                          { name: 'PCI DSS', status: 'Certified', score: 100 },
                        ].map((standard, index) => (
                          <div key={index} className="flex justify-between items-center p-3 rounded-lg border border-border/50">
                            <span className="text-sm font-medium">{standard.name}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={standard.score} className="w-16 h-2" />
                              <Badge variant={standard.status === 'Certified' ? 'default' : 'secondary'}>
                                {standard.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Security Certifications</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Security Audits</span>
                          <span className="font-semibold">Quarterly</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Penetration Testing</span>
                          <span className="font-semibold">Monthly</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vulnerability Scans</span>
                          <span className="font-semibold">Continuous</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Security Audit</span>
                          <span className="font-semibold">Dec 2023</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Audit</span>
                          <span className="font-semibold">Mar 2024</span>
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
            <FileShield className="h-4 w-4 mr-2" />
            Generate Security Report
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Schedule Penetration Test
          </Button>
        </motion.div>
      </div>
    </div>
  );
}