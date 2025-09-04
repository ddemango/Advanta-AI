import React, { useState, useEffect, useRef } from "react";

// TypeScript interfaces for type safety
interface Message {
  role: string;
  content: string;
  timestamp?: Date;
}

interface Project {
  id: string;
  name: string;
  created_at?: string;
}

interface Chat {
  id: string;
  title?: string;
  model?: string;
  project_id?: string;
  created_at?: string;
}

interface ToolResult {
  summary?: string;
  sources?: Array<{ url: string; title: string; snippet: string }>;
  chart?: any;
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickActionTools } from "./QuickActionTools";
import { useLocation } from "wouter";
import ProfileMenu from "./ProfileMenu";
import { useProfile } from "@/contexts/ProfileContext";
import { ROUTES } from "@/lib/routes";
import { MobileComposer } from "@/components/ui/mobile-composer";
import sidebarIcon from '@assets/7168076_1757002211529.png';
import editIcon from '@assets/6543495_1757001985080.png';
import { 
  Search,
  Plus,
  Paperclip,
  Globe,
  Mic,
  Send,
  ChevronDown,
  Settings,
  Image as ImageIcon,
  Code2,
  FlaskConical,
  FileBarChart2,
  Download,
  Upload,
  MoreHorizontal,
  Play,
  Zap
} from "lucide-react";

// ChatLLM Home-like UI (light theme) to match the screenshot specification
// Layout: Header (logo/model/profile), Left Sidebar (Projects/Chats + Tools),  
// Center Stage (suggestion chips, big input, tool chips row).

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <button className="touch-target px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors text-[15px] sm:text-sm">
      {children}
    </button>
  );
}

function ToolChip({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) {
  return (
    <button 
      className="flex items-center gap-2 touch-target px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors"
      onClick={onClick}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[15px] sm:text-sm font-medium">{label}</span>
    </button>
  );
}

export default function ChatLLMHome() {
  const [, setLocation] = useLocation();
  const [model, setModel] = useState("openai:gpt-4o");
  const { profile } = useProfile();
  const [availableModels, setAvailableModels] = useState([
    { id: 'openai:gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'openai:gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
    { id: 'openai:gpt-4', name: 'GPT-4', provider: 'OpenAI' },
    { id: 'openai:gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { id: 'anthropic:claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: 'anthropic:claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
    { id: 'google:gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google' },
    { id: 'google:gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google' },
    { id: 'xai:grok-beta', name: 'Grok Beta', provider: 'xAI' },
    { id: 'cohere:command-r-plus', name: 'Command R+', provider: 'Cohere' },
    { id: 'router:RouteLLM', name: 'RouteLLM (Smart Router)', provider: 'Router' }
  ]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [showImageGen, setShowImageGen] = useState(false);
  const [showCodeRunner, setShowCodeRunner] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  const [showDataAnalysis, setShowDataAnalysis] = useState(false);
  const [showPlayground, setShowPlayground] = useState(false);
  const [showPowerPoint, setShowPowerPoint] = useState(false);
  const [showChatModeDropdown, setShowChatModeDropdown] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [chatMode, setChatMode] = useState('Chat');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
        if (data.projects.length > 0 && !currentProject) {
          setCurrentProject(data.projects[0]);
          loadChats(data.projects[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadChats = async (projectId: number) => {
    try {
      const response = await fetch(`/api/ai-portal/projects/${projectId}/chats`, {
        headers: {
          'Authorization': 'Bearer admin123'
        }
      });
      const data = await response.json();
      if (data.ok) {
        setChats(data.chats);
        if (data.chats.length > 0 && !currentChat) {
          setCurrentChat(data.chats[0]);
          loadMessages(data.chats[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const loadMessages = async (chatId: number) => {
    try {
      const response = await fetch(`/api/ai-portal/chats/${chatId}/messages`, {
        headers: {
          'Authorization': 'Bearer admin123'
        }
      });
      const data = await response.json();
      if (data.ok) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createNewProject = async () => {
    try {
      const response = await fetch('/api/ai-portal/projects', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123'
        },
        body: JSON.stringify({
          name: `Project ${projects.length + 1}`,
          description: 'New AI project'
        })
      });
      const data = await response.json();
      if (data.ok) {
        setProjects(prev => [...prev, data.project]);
        setCurrentProject(data.project);
        setChats([]);
        setMessages([{ role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }]);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const createNewChat = async () => {
    if (!currentProject) return;
    try {
      const response = await fetch('/api/ai-portal/chats', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123'
        },
        body: JSON.stringify({
          projectId: currentProject.id,
          title: `Chat ${chats.length + 1}`,
          model: model
        })
      });
      const data = await response.json();
      if (data.ok) {
        setChats(prev => [...prev, data.chat]);
        setCurrentChat(data.chat);
        setMessages([{ role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }]);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const switchProject = (project: any) => {
    setCurrentProject(project);
    loadChats(project.id);
  };

  const switchChat = (chat: any) => {
    setCurrentChat(chat);
    loadMessages(chat.id);
    setModel(chat.model || 'gpt-4o');
  };

  const loadProjectsLegacy = async () => {
    try {
      const response = await fetch('/api/ai-portal/projects');
      const data = await response.json();
      if (data.ok) {
        setProjects(data.projects);
        if (data.projects.length > 0) {
          setCurrentProject(data.projects[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load projects (legacy):', error);
    }
  };



  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;
    
    // Ensure we have a current chat
    if (!currentChat && currentProject) {
      await createNewChat();
    }
    
    const userMessage = { role: "user", content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      // Use Server-Sent Events for streaming responses
      const response = await fetch('/api/ai-portal/chat/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123'
        },
        body: JSON.stringify({
          chatId: currentChat?.id,
          messages: [...messages, userMessage],
          model: model
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';

      // Add an empty assistant message to start streaming
      setMessages(prev => [...prev, { role: "assistant", content: "", streaming: true }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                // Update the last message to remove streaming indicator
                setMessages(prev => 
                  prev.map((msg, idx) => 
                    idx === prev.length - 1 
                      ? { ...msg, streaming: false }
                      : msg
                  )
                );
                break;
              }
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantResponse += parsed.content;
                  
                  // Update the streaming message
                  setMessages(prev => 
                    prev.map((msg, idx) => 
                      idx === prev.length - 1 
                        ? { ...msg, content: assistantResponse }
                        : msg
                    )
                  );
                }
              } catch (e) {
                // Ignore parsing errors for partial chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Header */}
      <header className="h-14 border-b border-zinc-200 bg-white flex items-center justify-between px-3 sm:px-4 safe-top">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSidebarOpen(v => !v)} 
            className="sm:hidden touch-target rounded-xl border grid place-items-center" 
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-6 w-6 rounded-sm bg-gradient-to-br from-fuchsia-500 to-cyan-500" />
            <span className="text-zinc-800 font-semibold tracking-tight">ADVANTA AI</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden sm:block ml-3 text-zinc-400 hover:text-zinc-600"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <img src={sidebarIcon} alt="Toggle sidebar" className="h-4 w-4" />
          </button>
          <button 
            onClick={() => alert('Edit feature coming soon!')}
            className="hidden sm:block text-zinc-400 hover:text-zinc-600"
            title="Edit"
          >
            <img src={editIcon} alt="Edit" className="h-4 w-4" />
          </button>
        </div>

        {/* Model dropdown centered on desktop, hidden on mobile */}
        <div className="hidden sm:flex flex-1 items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-indigo-600" />
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-white border border-zinc-200 rounded-lg px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {availableModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center">
          <div className="hidden sm:flex items-center gap-3">
            <ProfileMenu
              user={{ 
                name: `${profile.firstName} ${profile.lastName}`, 
                org: profile.organization,
                avatarUrl: profile.avatar || undefined
              }}
              onProfile={() => setLocation(ROUTES.profile)}
              onCustomize={() => setLocation(ROUTES.customize)}
              onMemories={() => setLocation(ROUTES.memories)}
              onRouteLLM={() => setLocation(ROUTES.routeLLM)}
              onConnectors={() => setLocation(ROUTES.connectors)}
              onHelp={() => setLocation(ROUTES.help)}
              onCustomBot={() => setLocation(ROUTES.customBot)}
              onInvite={() => alert("Invite flow coming soon")}
              onSignOut={() => setLocation('/')}
            />
          </div>
          <div className="sm:hidden">
            <ProfileMenu
              user={{ 
                name: `${profile.firstName} ${profile.lastName}`, 
                org: profile.organization,
                avatarUrl: profile.avatar || undefined
              }}
              onProfile={() => setLocation(ROUTES.profile)}
              onCustomize={() => setLocation(ROUTES.customize)}
              onMemories={() => setLocation(ROUTES.memories)}
              onRouteLLM={() => setLocation(ROUTES.routeLLM)}
              onConnectors={() => setLocation(ROUTES.connectors)}
              onHelp={() => setLocation(ROUTES.help)}
              onCustomBot={() => setLocation(ROUTES.customBot)}
              onInvite={() => alert("Invite flow coming soon")}
              onSignOut={() => setLocation('/')}
            />
          </div>
        </div>
      </header>

      {/* Body: Sidebar + Main */}
      <div className="flex min-h-[calc(100vh-56px)]">
        {/* Mobile drawer backdrop */}
        <div
          onClick={() => setSidebarOpen(false)}
          className={`fixed inset-0 bg-black/40 z-40 sm:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        />
        
        {/* Sidebar: fixed on mobile, toggleable on desktop */}
        <aside
          className={`fixed z-50 top-14 bottom-0 left-0 w-[82vw] max-w-[320px] bg-white border-r border-zinc-200 transition-transform duration-300 sm:w-[280px] flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Projects */}
          <div className="p-4 border-b border-zinc-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-zinc-600">Projects</span>
              <div className="flex items-center gap-3 text-zinc-500">
                <button 
                  onClick={() => alert('Project search coming soon!')}
                  className="hover:text-zinc-700"
                  title="Search projects"
                >
                  <Search className="h-4 w-4" />
                </button>
                <button 
                  onClick={createNewProject}
                  className="hover:text-zinc-700"
                  title="Create new project"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {projects.map((project: any) => (
                <button
                  key={project.id}
                  onClick={() => switchProject(project)}
                  className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                    currentProject?.id === project.id
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  {project.name}
                </button>
              ))}
              {projects.length === 0 && (
                <div className="text-xs text-zinc-500 text-center py-4">
                  No projects yet. Click + to create one.
                </div>
              )}
            </div>
          </div>

          {/* Chats */}
          <div className="p-4 border-b border-zinc-200 flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-zinc-600">Chats</span>
              <div className="flex items-center gap-3 text-zinc-500">
                <button 
                  onClick={() => alert('Chat search coming soon!')}
                  className="hover:text-zinc-700"
                  title="Search chats"
                >
                  <Search className="h-4 w-4" />
                </button>
                <button 
                  onClick={createNewChat}
                  className="hover:text-zinc-700"
                  title="Create new chat"
                  disabled={!currentProject}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {chats.map((chat: any) => (
                <button
                  key={chat.id}
                  onClick={() => switchChat(chat)}
                  className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                    currentChat?.id === chat.id
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  {chat.title || `Chat ${chat.id}`}
                  <div className="text-xs text-zinc-500 mt-1">
                    {chat.model || 'gpt-4o'}
                  </div>
                </button>
              ))}
              {chats.length === 0 && currentProject && (
                <div className="text-xs text-zinc-500 text-center py-4">
                  No chats yet. Click + to create one.
                </div>
              )}
              {!currentProject && (
                <div className="text-xs text-zinc-500 text-center py-4">
                  Select a project first.
                </div>
              )}
            </div>
          </div>

          {/* Tools section (bottom) */}
          <div className="p-4 space-y-3">
            <button 
              onClick={() => setLocation('/deepagent')}
              className="w-full h-10 rounded-full bg-indigo-600 text-white font-medium shadow-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
            >
              <span className="text-lg">🤖</span> 
              <span>DeepAgent</span>
            </button>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert('Apps feature coming soon!')}
                className="px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm text-sm hover:bg-zinc-50 transition-colors"
              >
                Apps
              </button>
              <button 
                onClick={() => alert('Tasks feature coming soon!')}
                className="px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm text-sm hover:bg-zinc-50 transition-colors"
              >
                Tasks
              </button>
              <button 
                onClick={() => alert('CodeLLM feature coming soon!')}
                className="px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm text-sm hover:bg-zinc-50 transition-colors"
              >
                CodeLLM
              </button>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { emoji: "⚙️" },
                { emoji: "🧩" },
                { emoji: "📎" },
                { emoji: "🔒" },
                { emoji: "⌚" },
                { emoji: "🧭" }
              ].map((item, i) => (
                <button 
                  key={i}
                  onClick={() => alert(`${item.emoji} feature coming soon!`)}
                  className="h-9 w-9 rounded-full bg-white border border-zinc-200 grid place-items-center shadow-sm hover:bg-zinc-50 transition-colors"
                >
                  <span className="text-sm">{item.emoji}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => window.open('https://apps.apple.com/search?term=advanta+ai', '_blank')}
                className="h-8 w-28 rounded-xl bg-black text-white grid place-items-center text-xs font-medium hover:bg-gray-800 transition-colors"
              >
                App Store
              </button>
              <button 
                onClick={() => window.open('https://play.google.com/store/search?q=advanta+ai', '_blank')}
                className="h-8 w-28 rounded-xl bg-black text-white grid place-items-center text-xs font-medium hover:bg-gray-800 transition-colors"
              >
                Google Play
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className={`flex-1 bg-zinc-50 flex flex-col min-h-full transition-all duration-300 ${sidebarOpen ? 'sm:ml-[280px]' : 'sm:ml-0'}`}>
          {messages.length > 1 ? (
            // Chat view
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-[800px] mx-auto space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-2xl p-4 ${
                      msg.role === "user" 
                        ? "bg-indigo-600 text-white" 
                        : "bg-white border border-zinc-200 text-zinc-900"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-zinc-200 text-zinc-900 rounded-2xl p-4">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                        Thinking...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Welcome view
            <div className="flex-1 flex flex-col justify-center">
              <div className="max-w-[1100px] mx-auto p-8 text-center">
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                  Hello {profile.firstName || 'there'}!
                </h1>
                <p className="text-zinc-600 mb-8">
                  What can I help you with today?
                </p>
                {/* Suggestion chips row */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <button onClick={() => setMessage("💡 Tell me a fun fact about Rome")} className="px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors">
                    💡 Fun fact about Rome
                  </button>
                  <button onClick={() => setMessage("🧾 Create an HTML landing page")} className="px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors">
                    🧾 HTML landing page
                  </button>
                  <button onClick={() => setMessage("🧮 Write Python code for fibonacci series")} className="px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors">
                    🧮 Python for fibonacci series
                  </button>
                  <button onClick={() => setMessage("🖼️ Draw a dragon")} className="px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors">
                    🖼️ Draw a dragon
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active tool indicator above input - positioned above the input card */}
          {activeTool && (
            <div className="p-4 pb-0">
              <div className="mx-auto max-w-[820px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-full">
                    <span className="text-sm">
                      {activeTool === 'image' && '🖼️'}
                      {activeTool === 'code' && '💻'}
                      {activeTool === 'playground' && '🧪'}
                      {activeTool === 'powerpoint' && '📊'}
                      {activeTool === 'research' && '🔍'}
                      {activeTool === 'data' && '📈'}
                    </span>
                    <span className="text-sm font-medium text-indigo-700">
                      {activeTool === 'image' && 'Image'}
                      {activeTool === 'code' && 'Code'}
                      {activeTool === 'playground' && 'Playground'}
                      {activeTool === 'powerpoint' && 'PowerPoint'}
                      {activeTool === 'research' && 'Deep Research'}
                      {activeTool === 'data' && 'Data Analysis'}
                    </span>
                    <button
                      onClick={() => {
                        setActiveTool(null);
                        setSelectedTool(null);
                        // Reset all tool states
                        setShowImageGen(false);
                        setShowCodeRunner(false);
                        setShowPlayground(false);
                        setShowPowerPoint(false);
                        setShowResearch(false);
                        setShowDataAnalysis(false);
                      }}
                      className="text-indigo-400 hover:text-indigo-600 ml-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Input card - hidden on mobile */}
          <div className="hidden sm:block p-4 border-t border-zinc-200 bg-white">
            <div className="mx-auto rounded-3xl bg-white border border-zinc-200 shadow-sm max-w-[820px]">
              <div className="p-6">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    activeTool === 'image' ? 'Describe the image to generate...' :
                    activeTool === 'code' ? 'Describe the code to generate...' :
                    activeTool === 'playground' ? 'Create a playground of...' :
                    activeTool === 'powerpoint' ? 'Describe the Powerpoint to generate...' :
                    activeTool === 'research' ? 'Write a task or topic to research on...' :
                    activeTool === 'data' ? 'Upload data or describe analysis to perform...' :
                    'Write something…'
                  }
                  className="h-12 rounded-xl bg-zinc-50 border-dashed border-zinc-200 mb-4 text-zinc-600 placeholder:text-zinc-400"
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={loading}
                />
                
                {/* Quick Action Tools */}
                <div className="flex items-center gap-3 flex-wrap justify-center mb-4">
                  <button 
                    onClick={() => { 
                      setShowImageGen(true);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm transition-colors ${
                      showImageGen 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <span className="text-sm">🖼️</span>
                    <span className="text-sm font-medium">Image</span>
                  </button>
                  <button 
                    onClick={() => { 
                      const isActive = activeTool === 'code';
                      setActiveTool(isActive ? null : 'code');
                      setSelectedTool(isActive ? null : 'code');
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm transition-colors ${
                      activeTool === 'code' 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <span className="text-sm">💻</span>
                    <span className="text-sm font-medium">Code</span>
                  </button>
                  <button 
                    onClick={() => { 
                      const isActive = activeTool === 'playground';
                      setActiveTool(isActive ? null : 'playground');
                      setSelectedTool(isActive ? null : 'playground');
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm transition-colors ${
                      activeTool === 'playground' 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <span className="text-sm">🧪</span>
                    <span className="text-sm font-medium">Playground</span>
                  </button>
                  <button 
                    onClick={() => { 
                      const isActive = activeTool === 'powerpoint';
                      setActiveTool(isActive ? null : 'powerpoint');
                      setSelectedTool(isActive ? null : 'powerpoint');
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm transition-colors ${
                      activeTool === 'powerpoint' 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <span className="text-sm">📊</span>
                    <span className="text-sm font-medium">PowerPoint</span>
                  </button>
                  <button 
                    onClick={() => { 
                      const isActive = activeTool === 'research';
                      setActiveTool(isActive ? null : 'research');
                      setSelectedTool(isActive ? null : 'research');
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm transition-colors ${
                      activeTool === 'research' 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <span className="text-sm">🔍</span>
                    <span className="text-sm font-medium">Deep Research</span>
                  </button>
                  <button 
                    onClick={() => { 
                      const isActive = activeTool === 'data';
                      setActiveTool(isActive ? null : 'data');
                      setSelectedTool(isActive ? null : 'data');
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm transition-colors ${
                      activeTool === 'data' 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <span className="text-sm">📈</span>
                    <span className="text-sm font-medium">Data Analysis</span>
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => alert('More tools coming soon!')}
                      className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors"
                    >
                      <span className="text-sm">⋯</span>
                      <span className="text-sm font-medium">More</span>
                    </button>
                    
                    {showMoreMenu && (
                      <div className="absolute bottom-full mb-2 right-0 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg py-2 z-50">
                        <button onClick={() => { alert('Video-Gen coming soon!'); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
                          <span>🎥</span> Video-Gen
                        </button>
                        <button onClick={() => { alert('Lip Sync coming soon!'); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
                          <span>👄</span> Lip Sync
                        </button>
                        <button onClick={() => { alert('Humanize coming soon!'); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
                          <span>🤖</span> Humanize
                        </button>
                        <button onClick={() => { alert('Doc-Gen coming soon!'); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
                          <span>📄</span> Doc-Gen
                        </button>
                        <button onClick={() => { alert('Editor coming soon!'); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
                          <img src={editIcon} alt="Edit" className="h-4 w-4" /> Editor
                        </button>
                        <button onClick={() => { alert('Scrape URL coming soon!'); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
                          <span>🕷️</span> Scrape URL
                        </button>
                        <button onClick={() => { alert('Screenshot coming soon!'); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
                          <span>📸</span> Screenshot
                        </button>
                        <button onClick={() => { alert('Video Analysis coming soon!'); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
                          <span>🎬</span> Video Analysis
                        </button>
                        <button onClick={() => { alert('Task coming soon!'); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
                          <span>📋</span> Task
                        </button>
                        <button onClick={() => { alert('Text-to-Speech coming soon!'); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
                          <span>🔊</span> Text-to-Speech
                        </button>
                        <button onClick={() => { alert('Speech-to-text coming soon!'); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
                          <span>🎙️</span> Speech-to-text
                        </button>
                        <button onClick={() => { alert('Speech-to-Speech coming soon!'); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
                          <span>🗣️</span> Speech-to-Speech
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls row */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button 
                      onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                      className="h-10 w-10 grid place-items-center rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors"
                      title="Attach file"
                    >
                      <Paperclip className="h-4 w-4 text-zinc-600" />
                    </button>
                    
                    {showAttachmentMenu && (
                      <div className="absolute bottom-full mb-2 right-0 w-52 bg-white border border-zinc-200 rounded-lg shadow-lg py-2 z-50">
                        <button 
                          onClick={() => { alert('Connect Apps coming soon!'); setShowAttachmentMenu(false); }}
                          className="w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors border-b border-zinc-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-zinc-100 rounded grid place-items-center">
                              <span className="text-sm">🔗</span>
                            </div>
                            <span className="text-sm font-medium">Connect Apps</span>
                          </div>
                        </button>
                        
                        <div className="px-4 py-2">
                          <button 
                            onClick={() => { alert('Add from files coming soon!'); setShowAttachmentMenu(false); }}
                            className="w-full text-left py-2 hover:bg-zinc-50 transition-colors rounded flex items-center gap-3"
                          >
                            <div className="h-6 w-6 bg-purple-100 rounded grid place-items-center">
                              <span className="text-xs">📁</span>
                            </div>
                            <span className="text-sm">Add from files</span>
                          </button>
                          
                          <button 
                            onClick={() => { alert('Upload from computer coming soon!'); setShowAttachmentMenu(false); }}
                            className="w-full text-left py-2 hover:bg-zinc-50 transition-colors rounded flex items-center gap-3"
                          >
                            <div className="h-6 w-6 bg-zinc-100 rounded grid place-items-center">
                              <span className="text-xs">💻</span>
                            </div>
                            <span className="text-sm">Upload from computer</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => alert('Web browsing coming soon!')}
                    className="h-10 w-10 grid place-items-center rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors"
                    title="Web search"
                  >
                    <Globe className="h-4 w-4 text-zinc-600" />
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    <div className="relative">
                      <button 
                        onClick={() => setShowChatModeDropdown(!showChatModeDropdown)}
                        className="px-3 py-2 rounded-xl bg-white border border-zinc-200 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-1"
                      >
                        {chatMode} <ChevronDown className="h-3 w-3" />
                      </button>
                      
                      {showChatModeDropdown && (
                        <div className="absolute bottom-full mb-2 right-0 w-36 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-50">
                          <button 
                            onClick={() => { setChatMode('Chat Mode'); setShowChatModeDropdown(false); }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors"
                          >
                            Chat Mode
                          </button>
                          <button 
                            onClick={() => { setChatMode('DeepAgent'); setShowChatModeDropdown(false); }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors"
                          >
                            DeepAgent
                          </button>
                          <button 
                            onClick={() => { setChatMode('Study Mode'); setShowChatModeDropdown(false); }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors"
                          >
                            Study Mode
                          </button>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => alert('Voice input coming soon!')}
                      className="h-10 w-10 grid place-items-center rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors"
                      title="Voice input"
                    >
                      <Mic className="h-4 w-4 text-zinc-600" />
                    </button>
                    <button 
                      onClick={handleSendMessage}
                      disabled={loading || !message.trim()}
                      className="h-10 w-10 grid place-items-center rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Composer - only visible on mobile */}
          <div className="sm:hidden">
            <MobileComposer
              value={message}
              setValue={setMessage}
              onSend={handleSendMessage}
              disabled={loading}
            />
          </div>

        </main>

        {/* Quick Action Tools integrated into main panel */}
        <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-120px)] overflow-auto">
          <QuickActionTools 
            showImageGen={false}
            setShowImageGen={setShowImageGen}
            showCodeRunner={showCodeRunner}
            setShowCodeRunner={setShowCodeRunner}
            showResearch={showResearch}
            setShowResearch={setShowResearch}
            showDataAnalysis={showDataAnalysis}
            setShowDataAnalysis={setShowDataAnalysis}
            showPlayground={showPlayground}
            setShowPlayground={setShowPlayground}
            showPowerPoint={showPowerPoint}
            setShowPowerPoint={setShowPowerPoint}
          />
        </div>
      </div>
      <div ref={messagesEndRef} />

      {/* Image Generation Modal - ONLY tool that opens as popup */}
      {showImageGen && (
        <ImageGenerationPanel onClose={() => setShowImageGen(false)} />
      )}

    </div>
  );
}

// Image Generation Panel  
function ImageGenerationPanel({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai-portal/tools/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size })
      });
      const data = await response.json();
      if (data.ok) {
        setGeneratedImages(prev => [...prev, data.imageUrl]);
      }
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed z-50 inset-0 ${isMobile ? 'bg-white' : 'bg-black/50'} flex ${isMobile ? 'items-stretch' : 'items-center'} justify-center`}>
      <div className={`${isMobile ? 'w-full h-full rounded-none safe-top safe-bottom' : 'bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto'}`}>
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">🖼️ Image Generation</h2>
            <button onClick={onClose} className="touch-target text-gray-500 hover:text-gray-700">✕</button>
          </div>
        )}
        <div className={`${isMobile ? 'p-4 flex-1 overflow-y-auto' : ''}`}>
          {!isMobile && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">🖼️ Image Generation</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
          )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg"
            >
              <option value="1024x1024">1024×1024 (Square)</option>
              <option value="1024x1792">1024×1792 (Portrait)</option>
              <option value="1792x1024">1792×1024 (Landscape)</option>
            </select>
          </div>
          
          <button
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
          
          {generatedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              {generatedImages.map((url, idx) => (
                <div key={idx} className="relative">
                  <img src={url} alt={`Generated ${idx + 1}`} className="w-full rounded-lg" />
                  <button
                    onClick={() => window.open(url, '_blank')}
                    className="absolute top-2 right-2 bg-white/90 p-2 rounded-lg text-sm hover:bg-white"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

// Code Runner Panel
function CodeRunnerPanel({ onClose }: { onClose: () => void }) {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("console.log('Hello World!');");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-portal/tools/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code })
      });
      const data = await response.json();
      if (data.ok) {
        setOutput(data.output);
      }
    } catch (error) {
      setOutput('Error: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">💻 Code Runner</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-2 border border-gray-200 rounded"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
                <option value="bash">Bash</option>
              </select>
              <button
                onClick={runCode}
                disabled={loading}
                className="ml-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                <Play className="h-4 w-4 inline mr-1" />
                {loading ? 'Running...' : 'Run'}
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 p-3 border border-gray-200 rounded-lg font-mono text-sm"
              placeholder="Write your code here..."
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Output:</h3>
            <div className="h-64 p-3 bg-gray-900 text-green-400 rounded-lg font-mono text-sm overflow-y-auto whitespace-pre-wrap">
              {output || 'Run code to see output...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Deep Research Panel
function DeepResearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [depth, setDepth] = useState("fast");
  const [results, setResults] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runResearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai-portal/tools/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, depth })
      });
      const data = await response.json();
      if (data.ok) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Research failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">🔍 Deep Research</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Research Query</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to research?"
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Depth</label>
              <select
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                className="p-3 border border-gray-200 rounded-lg"
              >
                <option value="fast">Fast (5 sources)</option>
                <option value="deep">Deep (15+ sources)</option>
              </select>
            </div>
            
            <button
              onClick={runResearch}
              disabled={loading || !query.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
            >
              {loading ? 'Researching...' : 'Start Research'}
            </button>
          </div>
          
          {results && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Research Results:</h3>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: results.summary || '' }} />
              
              {results.sources && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Sources:</h4>
                  <div className="space-y-2">
                    {results.sources.map((source, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">[{idx + 1}]</span>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {source.title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Data Analysis Panel
function DataAnalysisPanel({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [analysisPrompt, setAnalysisPrompt] = useState("");
  const [results, setResults] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeData = async () => {
    if (!file || !analysisPrompt.trim()) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', analysisPrompt);
    
    try {
      const response = await fetch('/api/ai-portal/tools/data/analyze', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.ok) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Data analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">📈 Data Analysis</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Upload CSV/Excel File</label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Analysis Request</label>
            <textarea
              value={analysisPrompt}
              onChange={(e) => setAnalysisPrompt(e.target.value)}
              placeholder="What would you like to analyze? (e.g., 'Create a bar chart of sales by month')"
              className="w-full p-3 border border-gray-200 rounded-lg h-24 resize-none"
            />
          </div>
          
          <button
            onClick={analyzeData}
            disabled={loading || !file || !analysisPrompt.trim()}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze Data'}
          </button>
          
          {results && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Analysis Results:</h3>
              {results.chart && (
                <img src={results.chart} alt="Generated Chart" className="w-full rounded-lg mb-4" />
              )}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: results.summary || '' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}