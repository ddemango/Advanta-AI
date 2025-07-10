import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  MessageCircle, 
  Zap, 
  Settings, 
  Play, 
  Save, 
  Plus,
  Edit,
  Trash2,
  Copy,
  Share,
  Download,
  Upload,
  ArrowLeft,
  Sparkles,
  Brain,
  Workflow,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function ChatbotBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('builder');
  const [chatbotName, setChatbotName] = useState('');
  const [chatbotDescription, setChatbotDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const chatbotTemplates = [
    {
      id: 'email-assistant',
      name: 'Email Assistant',
      description: 'Automatically draft, summarize, and manage emails',
      icon: '📧',
      category: 'Productivity',
      features: ['Email drafting', 'Smart replies', 'Scheduling', 'Priority sorting']
    },
    {
      id: 'linkedin-creator',
      name: 'LinkedIn Content Creator',
      description: 'Generate engaging LinkedIn posts from meeting notes',
      icon: '💼',
      category: 'Marketing',
      features: ['Content generation', 'Hashtag optimization', 'Post scheduling', 'Engagement tracking']
    },
    {
      id: 'slack-reporter',
      name: 'Slack Reporting Bot',
      description: 'Create automated reports and send to Slack channels',
      icon: '📊',
      category: 'Analytics',
      features: ['Data aggregation', 'Visual reports', 'Scheduled delivery', 'Custom metrics']
    },
    {
      id: 'crm-followup',
      name: 'CRM Follow-up Assistant',
      description: 'Automate personalized customer follow-up sequences',
      icon: '🤝',
      category: 'Sales',
      features: ['Lead scoring', 'Personalization', 'Follow-up sequences', 'Conversion tracking']
    },
    {
      id: 'content-calendar',
      name: 'Content Calendar Manager',
      description: 'Plan and generate content across multiple platforms',
      icon: '📅',
      category: 'Marketing',
      features: ['Multi-platform publishing', 'Content ideation', 'Calendar view', 'Performance analytics']
    },
    {
      id: 'customer-support',
      name: 'Customer Support Bot',
      description: 'Handle customer inquiries with intelligent responses',
      icon: '🎧',
      category: 'Support',
      features: ['Ticket routing', 'FAQ automation', 'Escalation rules', 'Satisfaction tracking']
    }
  ];

  const myBots = [
    {
      id: 1,
      name: 'Sales Email Generator',
      type: 'Email Assistant',
      status: 'active',
      lastUsed: '2 hours ago',
      conversations: 147,
      success_rate: 94
    },
    {
      id: 2,
      name: 'LinkedIn Post Creator',
      type: 'Content Creator',
      status: 'active',
      lastUsed: '1 day ago',
      conversations: 89,
      success_rate: 97
    },
    {
      id: 3,
      name: 'Weekly Report Bot',
      type: 'Slack Bot',
      status: 'deployed',
      lastUsed: '3 days ago',
      conversations: 234,
      success_rate: 91
    }
  ];

  const handleCreateBot = () => {
    if (!selectedTemplate || !chatbotName) {
      toast({
        title: "Missing Information",
        description: "Please select a template and enter a bot name.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Chatbot Created!",
      description: `"${chatbotName}" has been created successfully and is ready for configuration.`,
    });

    // Reset form
    setChatbotName('');
    setChatbotDescription('');
    setSelectedTemplate('');
    setActiveTab('my-bots');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>AI Chatbot Builder - Advanta AI</title>
        <meta name="description" content="Build and deploy intelligent AI chatbots for automation" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bot className="w-8 h-8 text-blue-600" />
                AI Chatbot Builder
              </h1>
              <p className="text-gray-600 mt-1">Create intelligent chatbots with natural language processing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
          {[
            { id: 'builder', label: 'Builder', icon: Plus },
            { id: 'my-bots', label: 'My Bots', icon: Bot },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`flex-1 ${
                activeTab === tab.id 
                  ? 'bg-white shadow-sm' 
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Builder Tab */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Template Selection */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Choose a Template
                  </CardTitle>
                  <CardDescription>
                    Start with a pre-built template or create from scratch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chatbotTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{template.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {template.category}
                              </Badge>
                            </div>
                            <ul className="mt-2 space-y-1">
                              {template.features.slice(0, 2).map((feature, index) => (
                                <li key={index} className="text-xs text-gray-500 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Configuration Panel */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configure Bot
                  </CardTitle>
                  <CardDescription>
                    Customize your chatbot settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Bot Name
                    </label>
                    <Input
                      placeholder="Enter bot name..."
                      value={chatbotName}
                      onChange={(e) => setChatbotName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Description
                    </label>
                    <Textarea
                      placeholder="Describe what your bot does..."
                      value={chatbotDescription}
                      onChange={(e) => setChatbotDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {selectedTemplate && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Selected Template:</h4>
                      <p className="text-sm text-blue-700">
                        {chatbotTemplates.find(t => t.id === selectedTemplate)?.name}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {chatbotTemplates.find(t => t.id === selectedTemplate)?.features.map((feature, index) => (
                          <li key={index} className="text-xs text-blue-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button 
                    onClick={handleCreateBot}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedTemplate || !chatbotName}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Chatbot
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* My Bots Tab */}
        {activeTab === 'my-bots' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Chatbots</h2>
              <Button onClick={() => setActiveTab('builder')} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Bot
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBots.map((bot) => (
                <Card key={bot.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                      <Badge 
                        variant={bot.status === 'active' ? 'default' : 'secondary'}
                        className={bot.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {bot.status}
                      </Badge>
                    </div>
                    <CardDescription>{bot.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last used:</span>
                        <span className="font-medium">{bot.lastUsed}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Conversations:</span>
                        <span className="font-medium">{bot.conversations}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Success Rate:</span>
                          <span className="font-medium">{bot.success_rate}%</span>
                        </div>
                        <Progress value={bot.success_rate} className="h-2" />
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Play className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Chatbot Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Conversations', value: '470', change: '+18%', icon: MessageCircle },
                { label: 'Average Success Rate', value: '94%', change: '+3%', icon: CheckCircle },
                { label: 'Active Bots', value: '3', change: '+1', icon: Bot },
                { label: 'Time Saved', value: '127h', change: '+12h', icon: Clock },
              ].map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{metric.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        <p className="text-sm text-green-600">{metric.change}</p>
                      </div>
                      <metric.icon className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bot Performance Overview</CardTitle>
                <CardDescription>Performance metrics for your active chatbots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myBots.map((bot) => (
                    <div key={bot.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bot className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{bot.name}</p>
                          <p className="text-sm text-gray-600">{bot.conversations} conversations</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{bot.success_rate}%</p>
                          <p className="text-xs text-gray-600">Success Rate</p>
                        </div>
                        <Progress value={bot.success_rate} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}