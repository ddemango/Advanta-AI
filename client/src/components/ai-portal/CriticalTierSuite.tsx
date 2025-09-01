"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  useNodesState, 
  useEdgesState,
  Node,
  Edge,
  Connection,
  ReactFlowProvider
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { 
  Play, 
  Search, 
  Code, 
  Zap, 
  Download, 
  Settings, 
  Monitor, 
  Cpu, 
  Globe, 
  Terminal,
  ChevronDown,
  Plus,
  Save,
  Upload,
  BarChart3,
  Layers,
  MessageSquare,
  FileText,
  Sparkles
} from "lucide-react";

type ActiveTool = "deepagent" | "appllm" | "codellm" | "websearch";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

interface AgentExecution {
  goal: string;
  steps: Array<{
    id: string;
    tool: string;
    title: string;
    status: "pending" | "running" | "done" | "error";
  }>;
  output?: string;
  downloadUrl?: string;
}

interface CodeSession {
  language: string;
  code: string;
  output?: string;
}

interface WebSearchSession {
  provider: string;
  query: string;
  results: SearchResult[];
}

interface AppProject {
  id: string;
  name: string;
  template: string;
  status: "created" | "building" | "deployed" | "error";
  url?: string;
}

const CriticalTierSuite: React.FC = () => {
  // Main state
  const [activeTool, setActiveTool] = useState<ActiveTool>("deepagent");
  const [isLoading, setIsLoading] = useState(false);

  // DeepAgent Studio state
  const [agentGoal, setAgentGoal] = useState("");
  const [agentExecution, setAgentExecution] = useState<AgentExecution | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([
    { id: "plan", position: { x: 0, y: 0 }, data: { label: "plan", tool: "plan" }, type: "input" },
    { id: "llm", position: { x: 220, y: 80 }, data: { label: "llm", tool: "llm" }, type: "default" },
    { id: "output", position: { x: 440, y: 0 }, data: { label: "output", tool: "output" }, type: "output" }
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: "e1", source: "plan", target: "llm", animated: true },
    { id: "e2", source: "llm", target: "output", animated: true }
  ]);

  // CodeLLM state
  const [codeLanguage, setCodeLanguage] = useState("python");
  const [codeSession, setCodeSession] = useState<CodeSession>({
    language: "python",
    code: "# Enter your code here\nprint('Hello, World!')"
  });

  // Web Search state
  const [searchProvider, setSearchProvider] = useState("bing");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // AppLLM state
  const [appTemplate, setAppTemplate] = useState("react");
  const [appName, setAppName] = useState("");
  const [appProjects, setAppProjects] = useState<AppProject[]>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // Agent execution functions
  const executeAgent = async () => {
    if (!agentGoal.trim()) return;
    
    setIsLoading(true);
    try {
      const graph = { nodes, edges };
      const response = await fetch('/api/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: agentGoal,
          graph,
          enableMemory: true,
          autoRefine: false,
          verbose: true
        })
      });
      
      const data = await response.json();
      if (data.ok) {
        setAgentExecution({
          goal: agentGoal,
          steps: [
            { id: 'step1', tool: 'plan', title: 'Plan Generated', status: 'done' },
            { id: 'step2', tool: 'llm', title: 'LLM Response', status: 'done' },
            { id: 'step3', tool: 'output', title: 'Results Compiled', status: 'done' }
          ],
          output: data.output,
          downloadUrl: data.downloadUrl
        });
      }
    } catch (error) {
      console.error('Agent execution error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Code execution functions
  const runCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: codeLanguage,
          code: codeSession.code
        })
      });
      
      const data = await response.json();
      if (data.ok) {
        setCodeSession(prev => ({
          ...prev,
          output: data.stdout + (data.stderr ? `\nErrors:\n${data.stderr}` : '')
        }));
      }
    } catch (error) {
      console.error('Code execution error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/codellm/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: codeLanguage,
          code: codeSession.code
        })
      });
      
      const data = await response.json();
      if (data.ok) {
        setCodeSession(prev => ({ ...prev, code: data.result }));
      }
    } catch (error) {
      console.error('Code suggestion error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Web search functions
  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/search/web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: searchProvider,
          query: searchQuery,
          topK: 10
        })
      });
      
      const data = await response.json();
      if (data.ok) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // App creation functions
  const createApp = async () => {
    if (!appName.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/appllm/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: appTemplate,
          name: appName,
          target: 'production'
        })
      });
      
      const data = await response.json();
      if (data.ok) {
        const newProject: AppProject = {
          id: data.id,
          name: appName,
          template: appTemplate,
          status: 'created'
        };
        setAppProjects(prev => [...prev, newProject]);
        setAppName("");
      }
    } catch (error) {
      console.error('App creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deployApp = async (projectId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/appllm/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: projectId,
          target: 'production'
        })
      });
      
      const data = await response.json();
      if (data.ok) {
        setAppProjects(prev => prev.map(project => 
          project.id === projectId 
            ? { ...project, status: 'deployed', url: data.url }
            : project
        ));
      }
    } catch (error) {
      console.error('App deployment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toolButtons = [
    { id: "deepagent", label: "DeepAgent Studio", icon: Zap, color: "from-purple-500 to-pink-500" },
    { id: "appllm", label: "AppLLM", icon: Monitor, color: "from-blue-500 to-cyan-500" },
    { id: "codellm", label: "CodeLLM", icon: Code, color: "from-green-500 to-emerald-500" },
    { id: "websearch", label: "Web Search", icon: Globe, color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Critical Tier Suite
            </h1>
          </div>
          <div className="text-sm text-gray-400">Enterprise AI Development Platform</div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Production Ready</span>
          </div>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tool Navigation */}
      <div className="h-20 border-b border-gray-700 bg-gray-800/30 flex items-center px-6">
        <div className="flex space-x-2">
          {toolButtons.map((tool) => (
            <motion.button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as ActiveTool)}
              className={`
                px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200
                ${activeTool === tool.id 
                  ? `bg-gradient-to-r ${tool.color} text-white shadow-lg` 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tool.icon className="w-4 h-4" />
              <span className="font-medium">{tool.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTool === "deepagent" && (
            <motion.div
              key="deepagent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex"
            >
              {/* Left Panel - Graph Editor */}
              <div className="w-2/3 border-r border-gray-700 flex flex-col">
                <div className="h-12 border-b border-gray-700 bg-gray-800/30 flex items-center justify-between px-4">
                  <h3 className="font-semibold">Visual DAG Editor</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-xs rounded">
                      <Save className="w-3 h-3 inline mr-1" />
                      Save
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-xs rounded">
                      <Plus className="w-3 h-3 inline mr-1" />
                      Node
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 bg-gray-900/50">
                  <ReactFlowProvider>
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onConnect={onConnect}
                      fitView
                      className="bg-gray-900"
                    >
                      <MiniMap className="bg-gray-800" />
                      <Controls className="bg-gray-800" />
                      <Background color="#374151" gap={16} />
                    </ReactFlow>
                  </ReactFlowProvider>
                </div>
              </div>

              {/* Right Panel - Controls & Output */}
              <div className="w-1/3 flex flex-col">
                <div className="h-12 border-b border-gray-700 bg-gray-800/30 flex items-center px-4">
                  <h3 className="font-semibold">Agent Control</h3>
                </div>
                
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium mb-2">Goal</label>
                    <textarea
                      value={agentGoal}
                      onChange={(e) => setAgentGoal(e.target.value)}
                      placeholder="Describe what you want the agent to accomplish..."
                      className="w-full h-24 bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={executeAgent}
                    disabled={isLoading || !agentGoal.trim()}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>{isLoading ? "Executing..." : "Execute Agent"}</span>
                  </button>

                  {agentExecution && (
                    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Execution Results</h4>
                        {agentExecution.downloadUrl && (
                          <button className="text-xs bg-green-600 px-2 py-1 rounded flex items-center space-x-1">
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {agentExecution.steps.map((step, idx) => (
                          <div key={step.id} className="flex items-center space-x-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${
                              step.status === 'done' ? 'bg-green-400' :
                              step.status === 'running' ? 'bg-yellow-400' :
                              step.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
                            }`} />
                            <span className="text-gray-300">{step.title}</span>
                          </div>
                        ))}
                      </div>
                      
                      {agentExecution.output && (
                        <div className="bg-gray-900 rounded p-3 text-xs font-mono overflow-auto max-h-40">
                          <pre className="text-green-400 whitespace-pre-wrap">{agentExecution.output}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTool === "codellm" && (
            <motion.div
              key="codellm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex"
            >
              {/* Code Editor */}
              <div className="w-2/3 border-r border-gray-700 flex flex-col">
                <div className="h-12 border-b border-gray-700 bg-gray-800/30 flex items-center justify-between px-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold">Code Editor</h3>
                    <select
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
                    >
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={suggestCode}
                      disabled={isLoading}
                      className="px-3 py-1 bg-blue-600 text-xs rounded flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Suggest</span>
                    </button>
                    <button
                      onClick={runCode}
                      disabled={isLoading}
                      className="px-3 py-1 bg-green-600 text-xs rounded flex items-center space-x-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>Run</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={codeLanguage}
                    value={codeSession.code}
                    onChange={(value) => setCodeSession(prev => ({ ...prev, code: value || '' }))}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      fontFamily: 'JetBrains Mono, Consolas, monospace',
                      automaticLayout: true
                    }}
                    beforeMount={(monaco) => {
                      // Disable WebWorkers to prevent CDN loading issues
                      if (typeof window !== 'undefined') {
                        window.MonacoEnvironment = {
                          getWorker: () => new Worker(
                            URL.createObjectURL(
                              new Blob(['self.MonacoEnvironment = { baseUrl: "/" };'], { type: 'application/javascript' })
                            )
                          )
                        };
                      }
                    }}
                  />
                </div>
              </div>

              {/* Output Panel */}
              <div className="w-1/3 flex flex-col">
                <div className="h-12 border-b border-gray-700 bg-gray-800/30 flex items-center px-4">
                  <h3 className="font-semibold">Output</h3>
                </div>
                
                <div className="flex-1 p-4">
                  <div className="bg-gray-900 rounded-lg h-full p-4 font-mono text-sm overflow-auto">
                    {codeSession.output ? (
                      <pre className="text-green-400 whitespace-pre-wrap">{codeSession.output}</pre>
                    ) : (
                      <div className="text-gray-500 italic">Run code to see output...</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTool === "websearch" && (
            <motion.div
              key="websearch"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              {/* Search Header */}
              <div className="h-20 border-b border-gray-700 bg-gray-800/30 flex items-center px-6 space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Provider:</label>
                  <select
                    value={searchProvider}
                    onChange={(e) => setSearchProvider(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                  >
                    <option value="bing">Bing</option>
                    <option value="brave">Brave</option>
                    <option value="serper">Serper</option>
                  </select>
                </div>
                
                <div className="flex-1 max-w-2xl">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                      placeholder="Enter your search query..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-4 pr-12 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      onClick={performSearch}
                      disabled={isLoading || !searchQuery.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto p-6">
                {searchResults.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-400 mb-4">
                      Found {searchResults.length} results for "{searchQuery}"
                    </div>
                    {searchResults.map((result, idx) => (
                      <div key={idx} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                        <h3 className="font-medium text-blue-400 hover:text-blue-300 cursor-pointer mb-2">
                          {result.title}
                        </h3>
                        <p className="text-sm text-gray-300 mb-2">{result.snippet}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="truncate">{result.url}</span>
                          <span className="bg-gray-700 px-2 py-1 rounded">{result.source}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <div>Search the web to get started</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTool === "appllm" && (
            <motion.div
              key="appllm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex"
            >
              {/* App Creation Panel */}
              <div className="w-1/3 border-r border-gray-700 flex flex-col">
                <div className="h-12 border-b border-gray-700 bg-gray-800/30 flex items-center px-4">
                  <h3 className="font-semibold">Create App</h3>
                </div>
                
                <div className="flex-1 p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Template</label>
                    <select
                      value={appTemplate}
                      onChange={(e) => setAppTemplate(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                    >
                      <option value="react">React App</option>
                      <option value="nextjs">Next.js App</option>
                      <option value="vue">Vue.js App</option>
                      <option value="angular">Angular App</option>
                      <option value="express">Express API</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">App Name</label>
                    <input
                      type="text"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      placeholder="my-awesome-app"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={createApp}
                    disabled={isLoading || !appName.trim()}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-cyan-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isLoading ? "Creating..." : "Create App"}</span>
                  </button>
                </div>
              </div>

              {/* Projects List */}
              <div className="w-2/3 flex flex-col">
                <div className="h-12 border-b border-gray-700 bg-gray-800/30 flex items-center px-4">
                  <h3 className="font-semibold">Your Apps</h3>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto">
                  {appProjects.length > 0 ? (
                    <div className="space-y-3">
                      {appProjects.map((project) => (
                        <div key={project.id} className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{project.name}</h4>
                            <div className={`px-2 py-1 rounded text-xs ${
                              project.status === 'deployed' ? 'bg-green-600' :
                              project.status === 'building' ? 'bg-yellow-600' :
                              project.status === 'error' ? 'bg-red-600' : 'bg-gray-600'
                            }`}>
                              {project.status}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-400 mb-3">
                            Template: {project.template}
                          </div>
                          
                          <div className="flex space-x-2">
                            {project.status === 'created' && (
                              <button
                                onClick={() => deployApp(project.id)}
                                disabled={isLoading}
                                className="px-3 py-1 bg-green-600 text-xs rounded hover:bg-green-700 transition-colors"
                              >
                                Deploy
                              </button>
                            )}
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-blue-600 text-xs rounded hover:bg-blue-700 transition-colors"
                              >
                                View App
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <div>No apps created yet</div>
                        <div className="text-sm">Create your first app to get started</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CriticalTierSuite;