import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Bot, 
  Edit, 
  Trash2, 
  Share2, 
  Copy,
  MessageSquare,
  Settings,
  Play,
  Pause,
  BarChart3,
  Users
} from "lucide-react";

export default function MyGPTs() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const gpts = [
    {
      id: 1,
      name: "Sales Email Generator",
      description: "Creates personalized sales emails based on prospect information and company data",
      model: "GPT-4 Turbo",
      status: "active",
      category: "Sales",
      conversations: 1247,
      accuracy: "96.8%",
      lastUsed: "2 hours ago",
      created: "2 weeks ago"
    },
    {
      id: 2,
      name: "Customer Support Assistant",
      description: "Handles customer inquiries and provides support for common issues",
      model: "GPT-4",
      status: "active",
      category: "Support",
      conversations: 3891,
      accuracy: "94.2%",
      lastUsed: "1 hour ago",
      created: "1 month ago"
    },
    {
      id: 3,
      name: "Content Marketing Specialist",
      description: "Generates blog posts, social media content, and marketing copy",
      model: "GPT-4 Turbo",
      status: "draft",
      category: "Marketing",
      conversations: 567,
      accuracy: "92.5%",
      lastUsed: "3 days ago",
      created: "1 week ago"
    },
    {
      id: 4,
      name: "Technical Documentation Writer",
      description: "Creates comprehensive technical documentation and API guides",
      model: "GPT-4",
      status: "paused",
      category: "Technical",
      conversations: 234,
      accuracy: "98.1%",
      lastUsed: "1 week ago",
      created: "3 days ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Sales': return 'bg-blue-100 text-blue-800';
      case 'Support': return 'bg-purple-100 text-purple-800';
      case 'Marketing': return 'bg-pink-100 text-pink-800';
      case 'Technical': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>My GPTs - Advanta AI</title>
        <meta name="description" content="Manage your custom GPT assistants and AI models" />
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My GPTs</h1>
          <p className="text-gray-600">Create, manage, and deploy your custom AI assistants</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search your GPTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New GPT
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total GPTs</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active GPTs</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
                <Play className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">5.9K</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
                  <p className="text-2xl font-bold text-gray-900">95.4%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GPTs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {gpts.map((gpt) => (
            <Card key={gpt.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{gpt.name}</CardTitle>
                      <CardDescription className="mt-1">{gpt.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getStatusColor(gpt.status)}>
                    {gpt.status}
                  </Badge>
                  <Badge className={getCategoryColor(gpt.category)}>
                    {gpt.category}
                  </Badge>
                  <Badge variant="outline">{gpt.model}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Conversations</p>
                    <p className="font-semibold text-gray-900">{gpt.conversations.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Accuracy</p>
                    <p className="font-semibold text-green-600">{gpt.accuracy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Used</p>
                    <p className="font-semibold text-gray-700">{gpt.lastUsed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-semibold text-gray-700">{gpt.created}</p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="w-4 h-4 mr-1" />
                    Clone
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Create Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Quick Create GPT
            </CardTitle>
            <CardDescription>
              Quickly create a new GPT assistant for your specific needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Customer Service", icon: "💬", description: "Handle customer inquiries" },
                { name: "Content Writer", icon: "✍️", description: "Generate marketing content" },
                { name: "Data Analyst", icon: "📊", description: "Analyze business data" },
                { name: "Sales Assistant", icon: "💼", description: "Support sales processes" }
              ].map((template) => (
                <Card key={template.name} className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{template.icon}</div>
                    <h3 className="font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}