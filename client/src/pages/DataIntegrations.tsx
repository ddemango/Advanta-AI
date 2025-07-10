import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Database, 
  Link, 
  Settings, 
  Check,
  AlertCircle,
  Clock,
  Upload,
  Download,
  RefreshCw,
  Globe,
  Shield,
  Zap
} from "lucide-react";

export default function DataIntegrations() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const connectedIntegrations = [
    {
      id: 1,
      name: "Salesforce CRM",
      type: "CRM",
      status: "connected",
      lastSync: "2 minutes ago",
      records: "15,247",
      icon: "🏢",
      description: "Customer relationship management data"
    },
    {
      id: 2,
      name: "Google Analytics",
      type: "Analytics",
      status: "connected",
      lastSync: "1 hour ago",
      records: "892,451",
      icon: "📈",
      description: "Website traffic and user behavior data"
    },
    {
      id: 3,
      name: "Slack Workspace",
      type: "Communication",
      status: "connected",
      lastSync: "5 minutes ago",
      records: "8,234",
      icon: "💬",
      description: "Team communication and workflow data"
    },
    {
      id: 4,
      name: "HubSpot Marketing",
      type: "Marketing",
      status: "error",
      lastSync: "2 days ago",
      records: "45,672",
      icon: "🎯",
      description: "Marketing automation and lead data"
    }
  ];

  const availableIntegrations = [
    {
      name: "Microsoft 365",
      type: "Productivity",
      icon: "📄",
      description: "Connect Office apps and SharePoint data",
      featured: true
    },
    {
      name: "Shopify Store",
      type: "E-commerce",
      icon: "🛒",
      description: "Product catalog and order data",
      featured: true
    },
    {
      name: "Zendesk Support",
      type: "Support",
      icon: "🎧",
      description: "Customer support tickets and knowledge base",
      featured: false
    },
    {
      name: "PostgreSQL",
      type: "Database",
      icon: "🗄️",
      description: "Direct database connection",
      featured: false
    },
    {
      name: "AWS S3",
      type: "Storage",
      icon: "☁️",
      description: "Cloud file storage and data lakes",
      featured: false
    },
    {
      name: "Stripe Payments",
      type: "Finance",
      icon: "💳",
      description: "Payment and subscription data",
      featured: true
    }
  ];

  const dataUploads = [
    {
      id: 1,
      name: "Customer_Database_Q4.csv",
      size: "2.4 MB",
      uploaded: "2 days ago",
      status: "processed",
      records: "12,847"
    },
    {
      id: 2,
      name: "Product_Catalog_2024.json",
      size: "890 KB",
      uploaded: "1 week ago",
      status: "processed",
      records: "3,421"
    },
    {
      id: 3,
      name: "Marketing_Campaigns.xlsx",
      size: "1.2 MB",
      uploaded: "3 days ago",
      status: "processing",
      records: "5,678"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Check className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Data & Integrations - Advanta AI</title>
        <meta name="description" content="Manage data connections and integrations for your AI workflows" />
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data & Integrations</h1>
          <p className="text-gray-600">Connect your data sources and manage integrations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected Sources</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
                <Link className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">961K</p>
                </div>
                <Database className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Sync</p>
                  <p className="text-2xl font-bold text-gray-900">2m</p>
                </div>
                <RefreshCw className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Health</p>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                </div>
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="connected" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connected">Connected Sources</TabsTrigger>
            <TabsTrigger value="available">Available Integrations</TabsTrigger>
            <TabsTrigger value="uploads">Data Uploads</TabsTrigger>
          </TabsList>

          {/* Connected Sources */}
          <TabsContent value="connected" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search connected sources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync All
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {connectedIntegrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{integration.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integration.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(integration.status)}>
                        {getStatusIcon(integration.status)}
                        {integration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Records</p>
                        <p className="font-semibold text-gray-900">{integration.records}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Sync</p>
                        <p className="font-semibold text-gray-700">{integration.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Sync
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Available Integrations */}
          <TabsContent value="available" className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Featured Integrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableIntegrations.filter(i => i.featured).map((integration) => (
                  <Card key={integration.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{integration.icon}</div>
                      <h4 className="font-semibold mb-2">{integration.name}</h4>
                      <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                      <Button className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">All Integrations</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {availableIntegrations.map((integration) => (
                  <Card key={integration.name} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="text-2xl">{integration.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                        <Badge variant="outline" className="mt-1">{integration.type}</Badge>
                      </div>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Connect
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Data Uploads */}
          <TabsContent value="uploads" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Uploaded Data Files</h3>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload New File
              </Button>
            </div>

            <div className="space-y-4">
              {dataUploads.map((upload) => (
                <Card key={upload.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Database className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold">{upload.name}</h4>
                        <p className="text-sm text-gray-600">
                          {upload.size} • {upload.uploaded} • {upload.records} records
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(upload.status)}>
                        {upload.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Upload Area */}
            <Card className="border-dashed border-2">
              <CardContent className="p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Data Files</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop files here, or click to browse. Supports CSV, JSON, Excel, and more.
                </p>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}