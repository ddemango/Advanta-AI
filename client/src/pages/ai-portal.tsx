import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Play, 
  Search, 
  Volume2, 
  Download, 
  Upload,
  Terminal,
  Bot,
  Code2,
  Globe,
  Mic,
  FileText,
  Zap,
  Settings,
  Database,
  Wand2
} from 'lucide-react';
import { ModelSelector } from '@/components/ai-portal/ModelSelector';
import { HumanizePanel } from '@/components/ai-portal/HumanizePanel';
import { DataPanel } from '@/components/ai-portal/DataPanel';
import { OperatorPanel } from '@/components/ai-portal/OperatorPanel';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  chats: Chat[];
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface CodeExecutionResult {
  stdout: string;
  stderr: string;
  returncode: number;
}

export function AIPortal() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gpt-4o');
  
  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  
  // Code execution state
  const [code, setCode] = useState('print("Hello from AI Portal!")');
  const [codeOutput, setCodeOutput] = useState<CodeExecutionResult | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // TTS state
  const [ttsText, setTtsText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Active tab
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'search' | 'operator' | 'humanize' | 'data' | 'tts' | 'projects'>('chat');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simple password authentication
  const handleAuth = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      initializePortal();
    } else {
      alert('Invalid password');
    }
  };

  const initializePortal = () => {
    // Initialize with a default project
    const defaultProject: Project = {
      id: 'default',
      name: 'AI Development',
      description: 'Primary AI development workspace',
      chats: []
    };
    setProjects([defaultProject]);
    setCurrentProject('default');
    
    // Add welcome message
    const welcomeMessage: Message = {
      role: 'assistant',
      content: 'Welcome to your AI Portal! This is your private AI development environment. You can chat with AI models, execute code, search the web, generate speech, and manage projects.',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          model,
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Chat request failed');
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const executeCode = async () => {
    if (!code.trim() || codeLoading) return;
    
    setCodeLoading(true);
    try {
      const response = await fetch('/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'python',
          code
        })
      });

      const result = await response.json();
      setCodeOutput(result);
    } catch (error) {
      setCodeOutput({
        stdout: '',
        stderr: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        returncode: 1
      });
    } finally {
      setCodeLoading(false);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim() || searchLoading) return;
    
    setSearchLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: searchQuery,
          max_results: 10
        })
      });

      const data = await response.json();
      if (data.ok) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const generateSpeech = async () => {
    if (!ttsText.trim()) return;
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ttsText })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      }
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const createNewProject = () => {
    const name = prompt('Enter project name:');
    if (name) {
      const newProject: Project = {
        id: Date.now().toString(),
        name,
        description: '',
        chats: []
      };
      setProjects(prev => [...prev, newProject]);
      setCurrentProject(newProject.id);
    }
  };

  // If not authenticated, show login
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>AI Portal Access | Advanta AI</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-6 h-6" />
                AI Portal Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter access password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                />
              </div>
              <Button onClick={handleAuth} className="w-full">
                Access Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>AI Portal | Private Development Environment</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <NewHeader />

      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-950 text-white">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-500" />
              AI Portal
              <Badge variant="secondary">Private Access</Badge>
            </h1>
            <p className="text-zinc-400">Advanced AI development environment</p>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {[
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'code', label: 'Code Runner', icon: Terminal },
              { id: 'search', label: 'Search', icon: Search },
              { id: 'operator', label: 'Virtual Computer', icon: Terminal },
              { id: 'humanize', label: 'Humanize', icon: Wand2 },
              { id: 'data', label: 'Data Analysis', icon: Database },
              { id: 'tts', label: 'Text-to-Speech', icon: Volume2 },
              { id: 'projects', label: 'Projects', icon: FileText }
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeTab === id ? 'default' : 'outline'}
                onClick={() => setActiveTab(id as any)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3 space-y-4">
              {/* Model Settings */}
              <ModelSelector 
                selectedModel={model}
                onModelChange={setModel}
                showAdvanced={true}
              />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" onClick={clearChat} className="w-full">
                    Clear Chat
                  </Button>
                  <Button variant="outline" size="sm" onClick={createNewProject} className="w-full">
                    New Project
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              {activeTab === 'chat' && (
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      AI Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-zinc-900/50 rounded">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : message.role === 'assistant'
                                ? 'bg-zinc-700 text-white'
                                : 'bg-zinc-600 text-zinc-200'
                            }`}
                          >
                            <div className="text-xs opacity-70 mb-1">
                              {message.role} • {message.timestamp.toLocaleTimeString()}
                            </div>
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex justify-start">
                          <div className="bg-zinc-700 rounded-lg p-3 text-zinc-300">
                            Thinking...
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="resize-none"
                        rows={2}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <Button onClick={sendMessage} disabled={loading}>
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'code' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="w-5 h-5" />
                      Python Code Runner
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter Python code..."
                        className="font-mono min-h-[200px]"
                      />
                    </div>
                    <Button onClick={executeCode} disabled={codeLoading}>
                      <Play className="w-4 h-4 mr-2" />
                      {codeLoading ? 'Running...' : 'Run Code'}
                    </Button>
                    {codeOutput && (
                      <div className="space-y-2">
                        {codeOutput.stdout && (
                          <div>
                            <label className="text-sm text-green-400">Output:</label>
                            <pre className="bg-zinc-900 p-3 rounded text-green-300 text-sm overflow-auto">
                              {codeOutput.stdout}
                            </pre>
                          </div>
                        )}
                        {codeOutput.stderr && (
                          <div>
                            <label className="text-sm text-red-400">Errors:</label>
                            <pre className="bg-zinc-900 p-3 rounded text-red-300 text-sm overflow-auto">
                              {codeOutput.stderr}
                            </pre>
                          </div>
                        )}
                        <div className="text-xs text-zinc-400">
                          Exit code: {codeOutput.returncode}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === 'search' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Web Search
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search the web..."
                        onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                      />
                      <Button onClick={performSearch} disabled={searchLoading}>
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                    {searchResults.length > 0 && (
                      <div className="space-y-3">
                        {searchResults.map((result, index) => (
                          <div key={index} className="border border-zinc-700 rounded p-3">
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 font-medium"
                            >
                              {result.title}
                            </a>
                            <p className="text-zinc-400 text-sm mt-1">{result.snippet}</p>
                            <div className="text-xs text-zinc-500 mt-1">{result.url}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === 'operator' && (
                <OperatorPanel />
              )}

              {activeTab === 'humanize' && (
                <HumanizePanel model={model} />
              )}

              {activeTab === 'data' && (
                <DataPanel projectId={currentProject || undefined} />
              )}

              {activeTab === 'tts' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5" />
                      Text-to-Speech
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={ttsText}
                      onChange={(e) => setTtsText(e.target.value)}
                      placeholder="Enter text to convert to speech..."
                      rows={4}
                    />
                    <Button onClick={generateSpeech}>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Generate Speech
                    </Button>
                    {audioUrl && (
                      <div className="space-y-2">
                        <audio controls className="w-full">
                          <source src={audioUrl} type="audio/mpeg" />
                        </audio>
                        <Button variant="outline" size="sm" asChild>
                          <a href={audioUrl} download="speech.mp3">
                            <Download className="w-4 h-4 mr-2" />
                            Download Audio
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === 'projects' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className={`border rounded p-4 cursor-pointer transition-colors ${
                            currentProject === project.id
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-zinc-700 hover:border-zinc-600'
                          }`}
                          onClick={() => setCurrentProject(project.id)}
                        >
                          <div className="font-medium">{project.name}</div>
                          {project.description && (
                            <div className="text-sm text-zinc-400 mt-1">{project.description}</div>
                          )}
                          <div className="text-xs text-zinc-500 mt-2">
                            {project.chats.length} chats
                          </div>
                        </div>
                      ))}
                      <Button onClick={createNewProject} variant="outline" className="w-full">
                        Create New Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}