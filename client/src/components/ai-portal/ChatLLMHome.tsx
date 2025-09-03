import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Plus,
  Paperclip,
  Globe,
  Mic,
  Send,
  ChevronDown,
  Settings,
  Puzzle,
  Briefcase,
  Lock,
  Clock,
  Compass
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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;
    
    const userMessage = { role: "user", content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch('/api/ai-portal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: model,
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        const assistantMessage = {
          role: "assistant",
          content: data.response || data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage = {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
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
              <option value="gpt-4o">GPT‑4o</option>
              <option value="gpt-4o-mini">GPT‑4o Mini</option>
              <option value="gpt-4">GPT‑4</option>
              <option value="gpt-3.5-turbo">GPT‑3.5 Turbo</option>
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
                <button className="hover:text-zinc-700">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="h-8 rounded-lg bg-zinc-100" />
          </div>

          {/* Chats */}
          <div className="p-4 border-b border-zinc-200 flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-zinc-600">Chats</span>
              <div className="flex items-center gap-3 text-zinc-500">
                <button className="hover:text-zinc-700">
                  <Search className="h-4 w-4" />
                </button>
                <button className="hover:text-zinc-700">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 rounded-lg bg-zinc-100" />
              ))}
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
                { icon: Settings, emoji: "⚙️" },
                { icon: Puzzle, emoji: "🧩" },
                { icon: Paperclip, emoji: "📎" },
                { icon: Lock, emoji: "🔒" },
                { icon: Clock, emoji: "⌚" },
                { icon: Compass, emoji: "🧭" }
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
      </div>
    </div>
  );
}