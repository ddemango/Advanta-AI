import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  Calendar,
  Users,
  Activity,
  TrendingUp
} from "lucide-react";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const projects = [
    {
      id: 1,
      name: "Customer Support Automation",
      description: "AI-powered customer service chatbot with natural language processing",
      status: "active",
      type: "Chatbot",
      lastActive: "2 hours ago",
      performance: "98.5%",
      interactions: "2,847"
    },
    {
      id: 2,
      name: "Sales Lead Qualification",
      description: "Automated lead scoring and qualification system",
      status: "deployed",
      type: "Workflow",
      lastActive: "1 day ago",
      performance: "94.2%",
      interactions: "1,523"
    },
    {
      id: 3,
      name: "Content Generation Assistant",
      description: "AI content creator for marketing materials and blog posts",
      status: "draft",
      type: "GPT",
      lastActive: "3 days ago",
      performance: "89.7%",
      interactions: "756"
    },
    {
      id: 4,
      name: "Inventory Management Bot",
      description: "Automated inventory tracking and reorder system",
      status: "active",
      type: "Integration",
      lastActive: "5 hours ago",
      performance: "96.8%",
      interactions: "4,231"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'deployed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Chatbot': return '🤖';
      case 'Workflow': return '⚡';
      case 'GPT': return '🧠';
      case 'Integration': return '🔗';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Projects - Advanta AI</title>
        <meta name="description" content="Manage your AI automation projects and workflows" />
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage and monitor your AI automation projects</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
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
                  <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                  <p className="text-2xl font-bold text-gray-900">94.8%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Interactions</p>
                  <p className="text-2xl font-bold text-gray-900">9.3K</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getTypeIcon(project.type)}</div>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="mt-1">{project.description}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <span className="text-sm text-gray-500">{project.lastActive}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Performance</p>
                    <p className="font-semibold text-green-600">{project.performance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Interactions</p>
                    <p className="font-semibold text-gray-900">{project.interactions}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  {project.status === 'active' ? (
                    <Button size="sm" variant="outline">
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-1" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}