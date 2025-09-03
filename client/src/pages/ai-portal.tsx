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
import { OperatorTerminal } from '@/components/ai-portal/OperatorTerminal';
import { PlanGate, PlanBadge } from '@/components/ai-portal/PlanGate';
import ChatLLMHome from '@/components/ai-portal/ChatLLMHome';
import { EnhancedMarkdown } from '@/components/ai-portal/EnhancedMarkdown';




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

// Voice recognition support
const SpeechRecognition = typeof window !== "undefined" ? 
  (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition : null;

export function AIPortal() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Auto-authenticate for demo
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
  
  // Voice recognition state
  const [recognizing, setRecognizing] = useState(false);
  
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
      const response = await fetch('/api/ai-portal/usage', {
        headers: {
          'Authorization': 'Bearer admin123'
        }
      });
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
      const response = await fetch('/api/ai-portal/projects', {
        headers: {
          'Authorization': 'Bearer admin123'
        }
      });
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123'
        },
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
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
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
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
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
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const startVoiceInput = () => {
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev ? prev + ' ' : '') + transcript);
    };
    
    recognition.onend = () => {
      setRecognizing(false);
    };
    
    recognition.onerror = () => {
      setRecognizing(false);
    };
    
    setRecognizing(true);
    recognition.start();
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
    <div className="min-h-screen w-full bg-zinc-950 text-white">
      <Helmet>
        <title>AI Portal - Advanta AI</title>
      </Helmet>

      <ChatLLMHome />

    </div>
  );
}