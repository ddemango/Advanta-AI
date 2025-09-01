import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
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
  Wand2,
  ChevronDown, 
  Paperclip, 
  Send, 
  Image as ImageIcon, 
  FlaskConical, 
  FileBarChart2, 
  MoreHorizontal, 
  Users2, 
  UserRound, 
  FolderPlus, 
  Plus, 
  Search as SearchIcon, 
  ChevronRight, 
  ListStart
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

/** CHIP & TOOL BUTTON PRIMITIVES **/
function Chip({ children, iconLeft, onClick }: { children: React.ReactNode; iconLeft?: React.ReactNode; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
    >
      {iconLeft ? <span className="text-gray-700">{iconLeft}</span> : null}
      <span>{children}</span>
    </button>
  );
}

function ToolButton({ children, icon, onClick }: { children: React.ReactNode; icon?: React.ReactNode; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
    >
      {icon ? <span className="text-gray-700">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
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
  
  // Tab state
  const [activeTab, setActiveTab] = useState('chat');
  
  // Project and chat management
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<string>('');
  const [currentChat, setCurrentChat] = useState<string>('');

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Audio state
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Search results
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  // Usage tracking
  const [usage, setUsage] = useState<any[]>([]);
  
  // Data analysis
  const [csvData, setCsvData] = useState<any[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUsage();
      loadProjects();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const loadUsage = async () => {
    try {
      const response = await fetch('/api/ai-portal/usage');
      const data = await response.json();
      if (data.ok) {
        setUsage(data.usage);
      }
    } catch (error) {
      console.error('Failed to load usage:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/ai-portal/projects');
      const data = await response.json();
      if (data.ok) {
        setProjects(data.projects);
        if (data.projects.length > 0) {
          setCurrentProject(data.projects[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const createNewProject = async () => {
    const name = prompt('Project name:');
    if (!name) return;
    
    try {
      const response = await fetch('/api/ai-portal/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: '' })
      });
      const data = await response.json();
      if (data.ok) {
        await loadProjects();
        setCurrentProject(data.project.id);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const createNewChat = async () => {
    if (!currentProject) return;
    
    try {
      const response = await fetch('/api/ai-portal/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId: currentProject, 
          title: 'New Chat',
          messages: []
        })
      });
      const data = await response.json();
      if (data.ok) {
        await loadProjects();
        setCurrentChat(data.chat.id);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-portal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const executeCode = async (code: string) => {
    try {
      const response = await fetch('/api/ai-portal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      return await response.json();
    } catch (error) {
      console.error('Code execution error:', error);
      return { ok: false, error: error.message };
    }
  };

  const performWebSearch = async (query: string) => {
    try {
      const response = await fetch('/api/ai-portal/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      if (data.ok) {
        setSearchResults(data.results);
      }
      return data;
    } catch (error) {
      console.error('Search error:', error);
      return { ok: false, error: error.message };
    }
  };

  const generateSpeech = async (text: string) => {
    try {
      const response = await fetch('/api/ai-portal/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      if (data.ok) {
        setAudioUrl(data.audioUrl);
      }
      return data;
    } catch (error) {
      console.error('Speech generation error:', error);
      return { ok: false, error: error.message };
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-white text-gray-900 flex items-center justify-center">
        <Helmet>
          <title>AI Portal - Advanta AI</title>
        </Helmet>
        
        {/* Top App Bar */}
        <header className="fixed top-0 z-40 w-full border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-3 py-3 md:px-5">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-[28px] rounded-sm bg-gradient-to-b from-[#6a6cf6] to-[#8b7bff]" />
              <span className="text-lg font-semibold tracking-tight">ADVANTA.AI</span>
            </div>
            
            {/* Login indicator */}
            <div className="text-sm text-gray-600">AI Portal Access</div>
          </div>
        </header>

        <div className="w-full max-w-md mx-auto p-6">
          <Card className="border border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-gray-900">Access AI Portal</CardTitle>
              <p className="text-sm text-gray-600">Enter password to continue</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="border-gray-200"
              />
              <Button onClick={handleLogin} className="w-full bg-[#5b46f3] hover:bg-[#5b46f3]/90">
                Access Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      <Helmet>
        <title>AI Portal - Advanta AI</title>
      </Helmet>

      {/* Top App Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-3 py-3 md:px-5">
          {/* Left cluster: hamburger (mobile) + logo */}
          <div className="flex items-center gap-3">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 md:hidden"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-[28px] rounded-sm bg-gradient-to-b from-[#6a6cf6] to-[#8b7bff]" />
              <span className="text-lg font-semibold tracking-tight">ADVANTA.AI</span>
            </div>
          </div>

          {/* Center: Model selector */}
          <button
            className="group hidden min-w-[160px] items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium md:flex"
            aria-haspopup="listbox"
            aria-label="Model selector"
          >
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#5b46f3]/10">
              <span className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-[#5b46f3]" />
            </span>
            <span>{model}</span>
            <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-hover:translate-y-[1px]" />
          </button>

          {/* Right cluster: portal info + avatar */}
          <div className="flex items-center gap-3">
            <button className="hidden rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium md:inline-flex">
              AI Portal / Team
            </button>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-bold"
              aria-label="Profile"
            >
              A
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-0 md:gap-4">
        {/* Sidebar (desktop + mobile overlay) */}
        <aside className={`${sidebarOpen ? 'fixed inset-0 z-30 md:relative md:inset-auto' : 'hidden'} md:block w-[300px] shrink-0 border-r border-gray-200 bg-white`}>
          {sidebarOpen && (
            <div className="md:hidden fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
          )}
          <div className={`${sidebarOpen ? 'relative z-10 bg-white h-full' : ''} px-4 py-4`}>
            {/* Projects header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Projects</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={createNewProject}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200" 
                  aria-label="Add Project"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200" aria-label="Project Options">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Search projects */}
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
              <SearchIcon className="h-4 w-4 text-gray-500" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                placeholder="Search projects"
              />
            </div>

            {/* Chats header */}
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Chats</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={createNewChat}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200" 
                  aria-label="New Chat"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200" aria-label="Collapse">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chats */}
            <nav className="space-y-1">
              {projects.find(p => p.id === currentProject)?.chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setCurrentChat(chat.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                    currentChat === chat.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className="line-clamp-1 pr-3">{chat.title}</span>
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </nav>

            {/* Tool Tabs */}
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setActiveTab('chat')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm ${
                  activeTab === 'chat' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </div>
              </button>
              <button
                onClick={() => setActiveTab('operator')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm ${
                  activeTab === 'operator' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Virtual Computer
                </div>
              </button>
              <button
                onClick={() => setActiveTab('humanize')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm ${
                  activeTab === 'humanize' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  Text Humanization
                </div>
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm ${
                  activeTab === 'data' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Data Analysis
                </div>
              </button>
            </div>

            {/* Sidebar footer icons */}
            <div className="mt-auto border-t border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users2 className="h-5 w-5" />
                  <span className="text-sm">AI Portal</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
              <div className="mt-3 grid grid-cols-6 gap-2 text-gray-600">
                <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2" aria-label="Apps">
                  <FolderPlus className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2" aria-label="Tasks">
                  <ListStart className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2" aria-label="CodeLLM">
                  <Code2 className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2" aria-label="Icon1">
                  <UserRound className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2" aria-label="Icon2">
                  <Search className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2" aria-label="Icon3">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex min-h-[calc(100vh-56px)] flex-1 flex-col px-3 md:px-6">
          {activeTab === 'chat' && (
            <>
              {/* Suggestion chips row (web) */}
              <div className="mx-auto mt-8 hidden w-full max-w-5xl flex-wrap items-center justify-center gap-3 md:flex">
                <Chip onClick={() => handleQuickPrompt('Generate Python code for data analysis')}>
                  Data Analysis Code
                </Chip>
                <Chip 
                  iconLeft={<FileBarChart2 className="h-4 w-4" />}
                  onClick={() => handleQuickPrompt('Create a CSV report from this data')}
                >
                  CSV Report
                </Chip>
                <Chip 
                  iconLeft={<Code2 className="h-4 w-4" />}
                  onClick={() => handleQuickPrompt('Execute Python script in virtual computer')}
                >
                  Python Execution
                </Chip>
                <Chip 
                  iconLeft={<ImageIcon className="h-4 w-4" />}
                  onClick={() => handleQuickPrompt('Humanize this text for professional tone')}
                >
                  Text Humanization
                </Chip>
              </div>

              {/* Suggestion chips (mobile variant) */}
              <div className="mx-auto mt-8 flex w-full max-w-xl flex-wrap items-center justify-center gap-3 md:hidden">
                <Chip onClick={() => handleQuickPrompt('Generate Python code')}>Python Code</Chip>
                <Chip 
                  iconLeft={<FileBarChart2 className="h-4 w-4" />}
                  onClick={() => handleQuickPrompt('Create CSV report')}
                >
                  CSV Report
                </Chip>
                <Chip 
                  iconLeft={<Code2 className="h-4 w-4" />}
                  onClick={() => handleQuickPrompt('Execute Python')}
                >
                  Execute
                </Chip>
              </div>

              {/* Chat messages */}
              <div className="mx-auto mt-6 w-full max-w-5xl flex-1">
                <div className="space-y-4 mb-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-[#5b46f3] text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Composer */}
              <div className="mx-auto mt-6 w-full max-w-5xl rounded-2xl border border-gray-200 bg-white p-3 md:p-4">
                {/* Input row */}
                <div className="flex items-end gap-2">
                  <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200" aria-label="Attach file">
                    <Paperclip className="h-5 w-5" />
                  </button>

                  <div className="flex-1">
                    <label className="sr-only" htmlFor="composer">Write something…</label>
                    <textarea
                      id="composer"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                      className="h-16 w-full resize-none rounded-2xl bg-gray-50 px-4 py-3 text-base outline-none placeholder:text-gray-400 md:h-20"
                      placeholder="Ask about AI development, code execution, or data analysis..."
                    />

                    {/* Controls under textarea */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm" aria-label="Language">
                          <Globe className="h-4 w-4" />
                        </button>
                        <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm" aria-haspopup="menu" aria-label="Chat mode">
                          <span>Chat</span>
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200" aria-label="Voice input">
                          <Mic className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={sendMessage}
                          disabled={loading || !input.trim()}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#5b46f3] text-white shadow-sm disabled:opacity-50" 
                          aria-label="Send"
                        >
                          <Send className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tools row */}
              <div className="mx-auto mt-4 flex w-full max-w-5xl flex-wrap items-center justify-center gap-3">
                <ToolButton 
                  icon={<ImageIcon className="h-4 w-4" />}
                  onClick={() => setActiveTab('humanize')}
                >
                  Humanize
                </ToolButton>
                <ToolButton 
                  icon={<Code2 className="h-4 w-4" />}
                  onClick={() => handleQuickPrompt('Execute this Python code:\n\nprint("Hello, World!")')}
                >
                  Code
                </ToolButton>
                <ToolButton 
                  icon={<FlaskConical className="h-4 w-4" />}
                  onClick={() => setActiveTab('operator')}
                >
                  Virtual Computer
                </ToolButton>
                <ToolButton 
                  icon={<FileBarChart2 className="h-4 w-4" />}
                  onClick={() => setActiveTab('data')}
                >
                  Data Analysis
                </ToolButton>
                <ToolButton 
                  icon={<Search className="h-4 w-4" />}
                  onClick={() => handleQuickPrompt('Search the web for information about: ')}
                >
                  Web Search
                </ToolButton>
                <ToolButton 
                  icon={<MoreHorizontal className="h-4 w-4" />}
                  onClick={() => {}}
                >
                  More
                </ToolButton>
              </div>

              {/* Footer link */}
              <div className="mx-auto my-8 w-full max-w-5xl text-center">
                <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-[#5b46f3] hover:underline">
                  <span>AI Portal Documentation & Tips</span>
                </a>
              </div>
            </>
          )}

          {activeTab === 'operator' && (
            <div className="mt-8">
              <OperatorPanel />
            </div>
          )}

          {activeTab === 'humanize' && (
            <div className="mt-8">
              <HumanizePanel />
            </div>
          )}

          {activeTab === 'data' && (
            <div className="mt-8">
              <DataPanel />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}