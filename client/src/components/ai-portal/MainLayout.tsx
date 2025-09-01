"use client";
import { useState } from "react";
import TopNav from "./TopNav";
import LeftRail from "./LeftRail";
import QuickActions, { QuickActionsLower } from "./QuickActions";
import AgentDagEditor from "./AgentDagEditor";
import OperatorNotebook from "./OperatorNotebook";
import WebSearchPanel from "./WebSearchPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, Code, Search, Terminal, FileText, Database } from "lucide-react";

export default function MainLayout() {
  const [activeProjectId, setActiveProjectId] = useState("1");

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top Navigation */}
      <TopNav />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Rail */}
        <LeftRail activeProjectId={activeProjectId} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Main Content Tabs */}
          <div className="flex-1 p-4 overflow-hidden">
            <Tabs defaultValue="deepagent" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 mb-4 bg-zinc-800 border-zinc-700">
                <TabsTrigger 
                  value="deepagent" 
                  className="flex items-center gap-2 data-[state=active]:bg-zinc-700 text-zinc-300 data-[state=active]:text-white"
                >
                  <Sparkles className="h-4 w-4" />
                  DeepAgent
                </TabsTrigger>
                <TabsTrigger 
                  value="appllm" 
                  className="flex items-center gap-2 data-[state=active]:bg-zinc-700 text-zinc-300 data-[state=active]:text-white"
                >
                  <Globe className="h-4 w-4" />
                  AppLLM
                </TabsTrigger>
                <TabsTrigger 
                  value="codellm" 
                  className="flex items-center gap-2 data-[state=active]:bg-zinc-700 text-zinc-300 data-[state=active]:text-white"
                >
                  <Code className="h-4 w-4" />
                  CodeLLM
                </TabsTrigger>
                <TabsTrigger 
                  value="websearch" 
                  className="flex items-center gap-2 data-[state=active]:bg-zinc-700 text-zinc-300 data-[state=active]:text-white"
                >
                  <Search className="h-4 w-4" />
                  Web Search
                </TabsTrigger>
              </TabsList>

              {/* DeepAgent Panel */}
              <TabsContent value="deepagent" className="flex-1 overflow-hidden">
                <div className="h-full">
                  <AgentDagEditor />
                </div>
              </TabsContent>

              {/* AppLLM Panel */}
              <TabsContent value="appllm" className="flex-1 overflow-hidden">
                <Card className="h-full bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Globe className="h-5 w-5" />
                      AppLLM - Generate & Deploy Apps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <Select defaultValue="react">
                        <SelectTrigger className="bg-zinc-800 border-zinc-700">
                          <SelectValue placeholder="Template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="react">React App</SelectItem>
                          <SelectItem value="vue">Vue App</SelectItem>
                          <SelectItem value="angular">Angular App</SelectItem>
                          <SelectItem value="nextjs">Next.js App</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Input
                        placeholder="App name..."
                        className="bg-zinc-800 border-zinc-700"
                      />
                      
                      <Select defaultValue="vercel">
                        <SelectTrigger className="bg-zinc-800 border-zinc-700">
                          <SelectValue placeholder="Deploy to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vercel">Vercel</SelectItem>
                          <SelectItem value="netlify">Netlify</SelectItem>
                          <SelectItem value="railway">Railway</SelectItem>
                          <SelectItem value="render">Render</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Create App
                      </Button>
                      <Button variant="outline">
                        Deploy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* CodeLLM Panel */}
              <TabsContent value="codellm" className="flex-1 overflow-hidden">
                <div className="h-full">
                  <OperatorNotebook />
                </div>
              </TabsContent>

              {/* Web Search Panel */}
              <TabsContent value="websearch" className="flex-1 overflow-hidden">
                <div className="h-full">
                  <WebSearchPanel />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Lower Quick Actions */}
          <QuickActionsLower />
        </div>
      </div>
    </div>
  );
}