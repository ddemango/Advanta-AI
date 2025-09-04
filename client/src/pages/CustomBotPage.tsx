import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bot, Plus, Settings, Zap } from "lucide-react";

export default function CustomBotPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
            <Bot className="h-8 w-8 text-indigo-600" />
            Custom Bot Settings
          </h1>
          <p className="text-zinc-600 mt-2">Create and configure your custom AI assistants</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Bot
              </CardTitle>
              <CardDescription>
                Build a custom AI assistant for specific tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="botName">Bot Name</Label>
                <Input id="botName" placeholder="e.g. Marketing Assistant" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="botPrompt">System Prompt</Label>
                <Textarea 
                  id="botPrompt" 
                  placeholder="Define your bot's personality, expertise, and behavior..."
                  className="h-32"
                />
              </div>
              <Button className="w-full">Create Bot</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Bot Configuration
              </CardTitle>
              <CardDescription>
                Advanced settings for bot behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="contextMemory">Context Memory</Label>
                <Switch id="contextMemory" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="webSearch">Web Search Access</Label>
                <Switch id="webSearch" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="codeExecution">Code Execution</Label>
                <Switch id="codeExecution" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="fileAccess">File Processing</Label>
                <Switch id="fileAccess" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Custom Bots</CardTitle>
            <CardDescription>
              Manage your existing AI assistants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Marketing Assistant</h4>
                  <p className="text-sm text-zinc-600">Specialized in content creation and campaign planning</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">
                    <Zap className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Code Reviewer</h4>
                  <p className="text-sm text-zinc-600">Reviews code for best practices and security issues</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">
                    <Zap className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Research Analyst</h4>
                  <p className="text-sm text-zinc-600">Conducts thorough research and analysis on various topics</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">
                    <Zap className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}