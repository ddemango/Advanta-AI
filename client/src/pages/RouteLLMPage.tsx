import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Route, Key, Globe, Code } from "lucide-react";

export default function RouteLLMPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
            <Route className="h-8 w-8 text-indigo-600" />
            RouteLLM API
          </h1>
          <p className="text-zinc-600 mt-2">Developer documentation and API keys for routing LLMs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage your RouteLLM API keys and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input 
                  id="apiKey" 
                  type="password" 
                  defaultValue="rl_1234567890abcdef" 
                  readOnly 
                />
              </div>
              <div className="flex gap-2">
                <Button>Generate New Key</Button>
                <Button variant="outline">Copy Key</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                API Endpoints
              </CardTitle>
              <CardDescription>
                Available endpoints for RouteLLM integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Base URL</div>
                <code className="text-xs bg-zinc-100 px-2 py-1 rounded">
                  https://api.routellm.com/v1
                </code>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Route Chat</div>
                <code className="text-xs bg-zinc-100 px-2 py-1 rounded">
                  POST /route/chat
                </code>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Get Models</div>
                <code className="text-xs bg-zinc-100 px-2 py-1 rounded">
                  GET /models
                </code>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Quick Start Example
              </CardTitle>
              <CardDescription>
                Get started with RouteLLM API in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import { RouteLLM } from '@advanta/route-llm';

const client = new RouteLLM({
  apiKey: 'your-api-key-here'
});

const response = await client.route({
  messages: [
    { role: 'user', content: 'Hello, world!' }
  ],
  strategy: 'cost-optimized' // or 'performance'
});

console.log(response.content);`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}