"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Save, Search, Code, Sparkles, Globe, FileText, Terminal, Zap, Eye, Wrench, HelpCircle } from "lucide-react";
import Editor from "@monaco-editor/react";
import { AgentDagEditor } from "@/components/ai-portal/AgentDagEditor";
import { OperatorNotebook } from "@/components/ai-portal/OperatorNotebook";
import { WebSearchPanel } from "@/components/ai-portal/WebSearchPanel";

interface AgentStep {
  id: string;
  title: string;
  status: "pending" | "running" | "done" | "error";
  output?: any;
}

interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
}

interface CodeResult {
  stdout: string;
  stderr?: string;
  returncode?: number;
}

export default function CriticalTierSuite() {
  // DeepAgent State
  const [agentGoal, setAgentGoal] = useState("");
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [agentResult, setAgentResult] = useState("");
  const [agentLoading, setAgentLoading] = useState(false);

  // AppLLM State
  const [appTemplate, setAppTemplate] = useState("react");
  const [appName, setAppName] = useState("");
  const [appTarget, setAppTarget] = useState("vercel");
  const [appId, setAppId] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [appLoading, setAppLoading] = useState(false);

  // CodeLLM State
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [codeContent, setCodeContent] = useState(`// Welcome to CodeLLM
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(5));`);
  const [codeResult, setCodeResult] = useState<CodeResult | null>(null);
  const [codeSuggestion, setCodeSuggestion] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  // Web Search State
  const [searchProvider, setSearchProvider] = useState("bing");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const editorRef = useRef<any>(null);

  // DeepAgent Functions
  const planAgent = async () => {
    if (!agentGoal.trim()) return;
    
    setAgentLoading(true);
    try {
      const response = await fetch("/api/agent/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          goal: agentGoal, 
          enableMemory: true, 
          autoRefine: false 
        }),
      });
      
      const data = await response.json();
      if (data.steps) {
        setAgentSteps(data.steps.map((step: any, i: number) => ({
          id: `step-${i}`,
          title: step.title || step.tool || `Step ${i + 1}`,
          status: "pending" as const,
          output: undefined
        })));
      }
    } catch (error) {
      console.error("Planning failed:", error);
    } finally {
      setAgentLoading(false);
    }
  };

  const executeAgent = async () => {
    if (agentSteps.length === 0) return;
    
    setAgentLoading(true);
    try {
      // Execute steps sequentially
      for (let i = 0; i < agentSteps.length; i++) {
        const step = agentSteps[i];
        
        // Update step status to running
        setAgentSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "running" } : s
        ));

        const response = await fetch("/api/agent/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goal: agentGoal,
            stepId: step.id,
            title: step.title,
            enableMemory: true,
            autoRefine: false,
            verbose: true
          }),
        });

        const data = await response.json();
        
        // Update step with result
        setAgentSteps(prev => prev.map((s, idx) => 
          idx === i ? { 
            ...s, 
            status: data.error ? "error" : "done",
            output: data.output || data.error
          } : s
        ));

        if (i === agentSteps.length - 1) {
          setAgentResult(data.output || "Agent execution completed");
        }
      }
    } catch (error) {
      console.error("Execution failed:", error);
    } finally {
      setAgentLoading(false);
    }
  };

  const saveAgentArtifact = async () => {
    if (!agentResult) return;
    
    try {
      await fetch("/api/agent/save-artifact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: agentGoal,
          markdown: agentResult,
          tasks: agentSteps.map(s => ({ title: s.title, status: s.status }))
        }),
      });
    } catch (error) {
      console.error("Save artifact failed:", error);
    }
  };

  // AppLLM Functions
  const createApp = async () => {
    if (!appName.trim()) return;
    
    setAppLoading(true);
    try {
      const response = await fetch("/api/appllm/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: appTemplate,
          name: appName,
          target: appTarget
        }),
      });
      
      const data = await response.json();
      if (data.id) {
        setAppId(data.id);
      }
    } catch (error) {
      console.error("App creation failed:", error);
    } finally {
      setAppLoading(false);
    }
  };

  const deployApp = async () => {
    if (!appId) return;
    
    setAppLoading(true);
    try {
      const response = await fetch("/api/appllm/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: appId,
          target: appTarget
        }),
      });
      
      const data = await response.json();
      if (data.url) {
        setAppUrl(data.url);
      }
    } catch (error) {
      console.error("App deployment failed:", error);
    } finally {
      setAppLoading(false);
    }
  };

  // CodeLLM Functions
  const runCode = async () => {
    const code = editorRef.current?.getValue() || codeContent;
    
    setCodeLoading(true);
    try {
      const response = await fetch("/api/code/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: codeLanguage,
          code
        }),
      });
      
      const data = await response.json();
      setCodeResult(data);
    } catch (error) {
      console.error("Code execution failed:", error);
    } finally {
      setCodeLoading(false);
    }
  };

  const suggestCode = async () => {
    const code = editorRef.current?.getValue() || codeContent;
    
    setCodeLoading(true);
    try {
      const response = await fetch("/api/codellm/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: codeLanguage,
          code
        }),
      });
      
      const data = await response.json();
      setCodeSuggestion(data.result || "");
    } catch (error) {
      console.error("Code suggestion failed:", error);
    } finally {
      setCodeLoading(false);
    }
  };

  const fixCode = async () => {
    const code = editorRef.current?.getValue() || codeContent;
    
    setCodeLoading(true);
    try {
      const response = await fetch("/api/codellm/fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: codeLanguage,
          code
        }),
      });
      
      const data = await response.json();
      if (data.result) {
        setCodeContent(data.result);
        editorRef.current?.setValue(data.result);
      }
    } catch (error) {
      console.error("Code fix failed:", error);
    } finally {
      setCodeLoading(false);
    }
  };

  const explainCode = async () => {
    const code = editorRef.current?.getValue() || codeContent;
    
    setCodeLoading(true);
    try {
      const response = await fetch("/api/codellm/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: codeLanguage,
          code
        }),
      });
      
      const data = await response.json();
      setCodeSuggestion(data.result || "");
    } catch (error) {
      console.error("Code explanation failed:", error);
    } finally {
      setCodeLoading(false);
    }
  };

  // Web Search Functions
  const searchWeb = async () => {
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    try {
      const response = await fetch("/api/search/web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: searchProvider,
          query: searchQuery,
          topK: 10
        }),
      });
      
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Web search failed:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const saveSearchResults = async () => {
    if (searchResults.length === 0) return;
    
    try {
      await fetch("/api/search/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: searchProvider,
          query: searchQuery,
          results: searchResults
        }),
      });
    } catch (error) {
      console.error("Save search failed:", error);
    }
  };

  return (
    <div className="h-screen bg-gray-50 p-4">
      <Tabs defaultValue="deepagent" className="w-full h-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="deepagent" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            DeepAgent
          </TabsTrigger>
          <TabsTrigger value="appllm" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            AppLLM
          </TabsTrigger>
          <TabsTrigger value="codellm" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            CodeLLM
          </TabsTrigger>
          <TabsTrigger value="websearch" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Web Search
          </TabsTrigger>
        </TabsList>

        {/* DeepAgent Panel */}
        <TabsContent value="deepagent" className="h-[calc(100%-4rem)]">
          <AgentDagEditor />
        </TabsContent>

        {/* Original DeepAgent (preserved as fallback) */}
        <TabsContent value="deepagent-old" className="h-[calc(100%-4rem)]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                DeepAgent Studio
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)] flex flex-col gap-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your goal..."
                  value={agentGoal}
                  onChange={(e) => setAgentGoal(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={planAgent} disabled={agentLoading || !agentGoal.trim()}>
                  <Zap className="h-4 w-4 mr-2" />
                  Plan
                </Button>
                <Button 
                  onClick={executeAgent} 
                  disabled={agentLoading || agentSteps.length === 0}
                  variant="default"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Execute
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Execution Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <AnimatePresence>
                        {agentSteps.map((step, i) => (
                          <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-3 border rounded mb-2"
                          >
                            <Badge 
                              variant={
                                step.status === "done" ? "default" :
                                step.status === "running" ? "secondary" :
                                step.status === "error" ? "destructive" : "outline"
                              }
                            >
                              {step.status}
                            </Badge>
                            <span className="flex-1 text-sm">{step.title}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      Results
                      {agentResult && (
                        <Button size="sm" variant="outline" onClick={saveAgentArtifact}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <Textarea
                        value={agentResult}
                        readOnly
                        className="min-h-[280px] resize-none"
                        placeholder="Results will appear here..."
                      />
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AppLLM Panel */}
        <TabsContent value="appllm" className="h-[calc(100%-4rem)]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                AppLLM Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Template</label>
                  <Select value={appTemplate} onValueChange={setAppTemplate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="nextjs">Next.js</SelectItem>
                      <SelectItem value="vue">Vue</SelectItem>
                      <SelectItem value="svelte">Svelte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">App Name</label>
                  <Input
                    placeholder="my-awesome-app"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Deploy Target</label>
                  <Select value={appTarget} onValueChange={setAppTarget}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vercel">Vercel</SelectItem>
                      <SelectItem value="netlify">Netlify</SelectItem>
                      <SelectItem value="replit">Replit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={createApp} 
                  disabled={appLoading || !appName.trim()}
                  className="flex-1"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create App
                </Button>
                <Button 
                  onClick={deployApp} 
                  disabled={appLoading || !appId}
                  variant="outline"
                  className="flex-1"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Deploy
                </Button>
              </div>

              {appId && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>App Created:</strong> {appId}
                  </p>
                </div>
              )}

              {appUrl && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Deployed at:</strong>{" "}
                    <a href={appUrl} target="_blank" rel="noopener noreferrer" className="underline">
                      {appUrl}
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CodeLLM Panel */}
        <TabsContent value="codellm" className="h-[calc(100%-4rem)]">
          <div className="space-y-4 h-full">
            <OperatorNotebook />
          </div>
        </TabsContent>

        {/* Web Search Panel */}
        <TabsContent value="websearch" className="h-[calc(100%-4rem)]">
          <WebSearchPanel projectId="demo" />
        </TabsContent>

        {/* Original CodeLLM (preserved as fallback) */}
        <TabsContent value="codellm-old" className="h-[calc(100%-4rem)]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                CodeLLM Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)] flex flex-col gap-4">
              <div className="flex gap-2">
                <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={runCode} disabled={codeLoading}>
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </Button>
                <Button size="sm" variant="outline" onClick={suggestCode} disabled={codeLoading}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Suggest
                </Button>
                <Button size="sm" variant="outline" onClick={fixCode} disabled={codeLoading}>
                  <Wrench className="h-4 w-4 mr-2" />
                  Fix
                </Button>
                <Button size="sm" variant="outline" onClick={explainCode} disabled={codeLoading}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Explain
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Code Editor</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <Editor
                      height="400px"
                      language={codeLanguage}
                      value={codeContent}
                      onChange={(value) => setCodeContent(value || "")}
                      onMount={(editor) => { editorRef.current = editor; }}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on"
                      }}
                    />
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {codeResult && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Terminal className="h-4 w-4" />
                          Output
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[150px]">
                          <pre className="text-sm font-mono">
                            {codeResult.stdout}
                            {codeResult.stderr && (
                              <span className="text-red-500">{codeResult.stderr}</span>
                            )}
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}

                  {codeSuggestion && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">AI Suggestion</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[150px]">
                          <div className="text-sm whitespace-pre-wrap">{codeSuggestion}</div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Web Search Panel */}
        <TabsContent value="websearch" className="h-[calc(100%-4rem)]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Web Search Connector
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)] flex flex-col gap-4">
              <div className="flex gap-2">
                <Select value={searchProvider} onValueChange={setSearchProvider}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bing">Bing</SelectItem>
                    <SelectItem value="brave">Brave</SelectItem>
                    <SelectItem value="serper">Serper</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Enter search query..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && searchWeb()}
                />
                <Button onClick={searchWeb} disabled={searchLoading || !searchQuery.trim()}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                {searchResults.length > 0 && (
                  <Button variant="outline" onClick={saveSearchResults}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                )}
              </div>

              <Card className="flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    Search Results ({searchResults.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {searchResults.map((result, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <h3 className="font-medium text-blue-600 hover:underline cursor-pointer">
                            <a href={result.url} target="_blank" rel="noopener noreferrer">
                              {result.title}
                            </a>
                          </h3>
                          {result.snippet && (
                            <p className="text-sm text-gray-600 mt-1">{result.snippet}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {result.source || searchProvider}
                            </Badge>
                            <span className="text-xs text-gray-500">{result.url}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}