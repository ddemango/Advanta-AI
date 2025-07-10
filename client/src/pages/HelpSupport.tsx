import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  MessageCircle, 
  FileText, 
  Video, 
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Send,
  ExternalLink
} from "lucide-react";

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  
  const faqItems = [
    {
      question: "How do I create my first AI automation?",
      answer: "Start by navigating to Projects and clicking 'New Project'. Choose a template or start from scratch, then follow our step-by-step wizard to configure your automation.",
      category: "Getting Started"
    },
    {
      question: "What data formats are supported for integrations?",
      answer: "We support CSV, JSON, Excel (.xlsx), XML, and direct API connections to popular platforms like Salesforce, HubSpot, and Google Analytics.",
      category: "Integrations"
    },
    {
      question: "How do I monitor my automation performance?",
      answer: "Use the Analytics dashboard to view real-time metrics, success rates, and performance trends. You can also set up custom alerts for important events.",
      category: "Analytics"
    },
    {
      question: "Can I customize my GPT responses?",
      answer: "Yes! Use the GPT Configuration panel to adjust personality, tone, knowledge base, and response parameters to match your brand voice.",
      category: "AI Models"
    },
    {
      question: "What are the API rate limits?",
      answer: "Rate limits vary by plan: Starter (1,000/hour), Pro (10,000/hour), Enterprise (unlimited). View your current usage in Account Settings.",
      category: "API"
    }
  ];

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Complete walkthrough for new users",
      type: "guide",
      duration: "15 min read",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      title: "API Documentation",
      description: "Comprehensive API reference and examples",
      type: "docs",
      duration: "Reference",
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
      type: "video",
      duration: "2-10 min each",
      icon: <Video className="w-5 h-5" />
    },
    {
      title: "Best Practices",
      description: "Tips for optimizing your workflows",
      type: "guide",
      duration: "20 min read",
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  const supportTickets = [
    {
      id: "T-001",
      subject: "Integration with Salesforce not syncing",
      status: "open",
      priority: "high",
      created: "2 hours ago",
      lastUpdate: "1 hour ago"
    },
    {
      id: "T-002",
      subject: "API rate limit question",
      status: "resolved",
      priority: "medium",
      created: "2 days ago",
      lastUpdate: "1 day ago"
    },
    {
      id: "T-003",
      subject: "Custom GPT configuration help",
      status: "in_progress",
      priority: "low",
      created: "1 week ago",
      lastUpdate: "3 days ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Help & Support - Advanta AI</title>
        <meta name="description" content="Get help and support for your Advanta AI account" />
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600">Find answers, resources, and get help when you need it</p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-4">Get instant help from our support team</p>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-4">Send us a detailed message</p>
              <Badge className="bg-blue-100 text-blue-800">24h response</Badge>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-sm text-gray-600 mb-4">Speak directly with our team</p>
              <Badge className="bg-orange-100 text-orange-800">Business hours</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search frequently asked questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index} className="hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{item.question}</CardTitle>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-blue-600">
                        {resource.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{resource.title}</h3>
                        <p className="text-gray-600 mb-3">{resource.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{resource.duration}</Badge>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Topics</CardTitle>
                <CardDescription>Most searched help topics this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["API Integration", "Data Upload", "GPT Configuration", "Billing", "Automation Setup", "Analytics"].map((topic) => (
                    <Badge key={topic} variant="secondary" className="cursor-pointer hover:bg-gray-200">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Support Tickets</h3>
              <Button>
                <MessageCircle className="w-4 h-4 mr-2" />
                Create New Ticket
              </Button>
            </div>

            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{ticket.subject}</h4>
                        <p className="text-sm text-gray-600">Ticket #{ticket.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Created</p>
                        <p className="font-medium">{ticket.created}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Update</p>
                        <p className="font-medium">{ticket.lastUpdate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Us Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Describe your issue and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="Brief description of your issue"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Please provide as much detail as possible about your issue..."
                    rows={6}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Critical Issues</span>
                      <span>&lt; 1 hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High Priority</span>
                      <span>&lt; 4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>General Support</span>
                      <span>&lt; 24 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}