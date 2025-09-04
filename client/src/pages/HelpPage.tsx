import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, BookOpen, MessageCircle, Mail, Search } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-indigo-600" />
            Help & Support
          </h1>
          <p className="text-zinc-600 mt-2">Get help, find answers, and contact support</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input 
              className="pl-10" 
              placeholder="Search for help articles, tutorials, and FAQs..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Documentation
              </CardTitle>
              <CardDescription>
                Comprehensive guides and API reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Browse Docs</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Live Chat
              </CardTitle>
              <CardDescription>
                Chat with our support team in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Start Chat</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-600" />
                Email Support
              </CardTitle>
              <CardDescription>
                Send us a detailed message about your issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Contact Us</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">How do I get started with the AI portal?</h4>
              <p className="text-sm text-zinc-600">Simply create a new project, start a chat, and begin interacting with your AI assistant. You can customize your experience through the settings menu.</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">What AI models are available?</h4>
              <p className="text-sm text-zinc-600">We support GPT-4o, GPT-4, Claude 3.5 Sonnet, Gemini 2.0 Flash, Grok Beta, and more. You can switch between models in the main interface.</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">How does the RouteLLM API work?</h4>
              <p className="text-sm text-zinc-600">RouteLLM automatically routes your requests to the most appropriate model based on cost, performance, or custom criteria you set.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Can I integrate with other tools?</h4>
              <p className="text-sm text-zinc-600">Yes! We offer connectors for Slack, Gmail, Google Calendar, and more. Check the Connectors page to enable integrations.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}