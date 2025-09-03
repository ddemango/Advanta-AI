import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickActionTools } from "./QuickActionTools";
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
    <button className="px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors">
      {children}
    </button>
  );
}

function ToolChip({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors">
      <span className="text-sm">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default function ChatLLMHome() {
  const [model, setModel] = useState("gpt-4o");
  const [availableModels, setAvailableModels] = useState([
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { id: 'gemini-2.5', name: 'Gemini 2.5', provider: 'Google' },
    { id: 'grok', name: 'Grok', provider: 'xAI' },
    { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic' },
    { id: 'cohere', name: 'Cohere', provider: 'Cohere' }
  ]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [showImageGen, setShowImageGen] = useState(false);
  const [showCodeRunner, setShowCodeRunner] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  const [showDataAnalysis, setShowDataAnalysis] = useState(false);
  const [showPlayground, setShowPlayground] = useState(false);
  const [showPowerPoint, setShowPowerPoint] = useState(false);
  const messagesEndRef = useRef(null);

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
      const response = await fetch('/api/ai-portal/projects');
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
      const response = await fetch(`/api/ai-portal/projects/${projectId}/chats`);
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
      const response = await fetch(`/api/ai-portal/chats/${chatId}/messages`);
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
                setMessages(prev => prev.map((msg, index) => 
                  index === prev.length - 1 ? { ...msg, streaming: false } : msg
                ));
                setLoading(false);
                return;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantResponse += parsed.content;
                  setMessages(prev => prev.map((msg, index) => 
                    index === prev.length - 1 ? { ...msg, content: assistantResponse } : msg
                  ));
                }
              } catch (e) {
                // Ignore JSON parse errors
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
      <header className="h-14 border-b border-zinc-200 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-sm bg-gradient-to-br from-fuchsia-500 to-cyan-500" />
            <span className="text-zinc-800 font-semibold tracking-tight">ABACUS.AI</span>
          </div>
          <button className="ml-3 text-zinc-400 hover:text-zinc-600 text-lg">📄</button>
          <button className="text-zinc-400 hover:text-zinc-600 text-lg">✏️</button>
        </div>

        {/* Model dropdown centered */}
        <div className="flex-1 flex items-center justify-center">
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
        <div className="flex items-center gap-3">
          <button className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            Refer ($) / Invite 
            <ChevronDown className="h-3 w-3" />
          </button>
          <div className="h-8 w-8 rounded-full bg-emerald-200 text-emerald-800 grid place-items-center font-semibold text-sm">
            D
          </div>
        </div>
      </header>

      {/* Body: Sidebar + Main */}
      <div className="grid grid-cols-[280px_1fr] gap-0 min-h-[calc(100vh-56px)]">
        {/* Left Sidebar */}
        <aside className="border-r border-zinc-200 bg-white flex flex-col">
          {/* Projects */}
          <div className="p-4 border-b border-zinc-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-zinc-600">Projects</span>
              <div className="flex items-center gap-3 text-zinc-500">
                <button className="hover:text-zinc-700">
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
                <button className="hover:text-zinc-700">
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
            <button className="w-full h-10 rounded-full bg-indigo-600 text-white font-medium shadow-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
              <span className="text-lg">🤖</span> 
              <span>DeepAgent</span>
            </button>
            
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm text-sm hover:bg-zinc-50 transition-colors">
                Apps
              </button>
              <button className="px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm text-sm hover:bg-zinc-50 transition-colors">
                Tasks
              </button>
              <button className="px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm text-sm hover:bg-zinc-50 transition-colors">
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
                  className="h-9 w-9 rounded-full bg-white border border-zinc-200 grid place-items-center shadow-sm hover:bg-zinc-50 transition-colors"
                >
                  <span className="text-sm">{item.emoji}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3 mt-3">
              <div className="h-8 w-28 rounded-xl bg-black text-white grid place-items-center text-xs font-medium">
                App Store
              </div>
              <div className="h-8 w-28 rounded-xl bg-black text-white grid place-items-center text-xs font-medium">
                Google Play
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="bg-zinc-50 flex flex-col h-full">
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
              <div className="max-w-[1100px] mx-auto p-8">
                {/* Suggestion chips row */}
                <div className="flex flex-wrap gap-3 justify-center mt-8">
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

          {/* Input card - always at bottom */}
          <div className="p-4 border-t border-zinc-200 bg-white">
            <div className="mx-auto rounded-3xl bg-white border border-zinc-200 shadow-sm max-w-[820px]">
              <div className="p-6">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write something…"
                  className="h-12 rounded-xl bg-zinc-50 border-dashed border-zinc-200 mb-4 text-zinc-600 placeholder:text-zinc-400"
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={loading}
                />
                
                {/* Quick Action Tools */}
                <div className="flex items-center gap-3 flex-wrap justify-center mb-4">
                  <button 
                    onClick={() => setShowImageGen(!showImageGen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors"
                  >
                    <span className="text-sm">🖼️</span>
                    <span className="text-sm font-medium">Image</span>
                  </button>
                  <button 
                    onClick={() => setShowCodeRunner(!showCodeRunner)}
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors"
                  >
                    <span className="text-sm">💻</span>
                    <span className="text-sm font-medium">Code</span>
                  </button>
                  <ToolChip icon="🧪" label="Playground" />
                  <ToolChip icon="📊" label="PowerPoint" />
                  <button 
                    onClick={() => setShowResearch(!showResearch)}
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors"
                  >
                    <span className="text-sm">🔍</span>
                    <span className="text-sm font-medium">Deep Research</span>
                  </button>
                  <button 
                    onClick={() => setShowDataAnalysis(!showDataAnalysis)}
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors"
                  >
                    <span className="text-sm">📈</span>
                    <span className="text-sm font-medium">Data Analysis</span>
                  </button>
                  <ToolChip icon="⋯" label="More" />
                </div>

                {/* Controls row */}
                <div className="flex items-center gap-3">
                  <button className="h-10 w-10 grid place-items-center rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors">
                    <Paperclip className="h-4 w-4 text-zinc-600" />
                  </button>
                  <button className="h-10 w-10 grid place-items-center rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors">
                    <Globe className="h-4 w-4 text-zinc-600" />
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    <button className="px-3 py-2 rounded-xl bg-white border border-zinc-200 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-1">
                      Chat <ChevronDown className="h-3 w-3" />
                    </button>
                    <button className="h-10 w-10 grid place-items-center rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors">
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

        </main>

        {/* Quick Action Tools integrated into main panel */}
        <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-120px)] overflow-auto">
          <QuickActionTools 
            showImageGen={showImageGen}
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
    </div>
  );
}

// Image Generation Panel
function ImageGenerationPanel({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">🖼️ Image Generation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
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
      setOutput('Error: ' + error.message);
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
  const [results, setResults] = useState(null);
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
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: results.summary }} />
              
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
  const [results, setResults] = useState(null);
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
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: results.summary }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}