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
  const [model, setModel] = useState("RouteLLM");
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // TODO: Implement message sending
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Header */}
      <header className="h-14 border-b border-zinc-200 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-sm bg-gradient-to-br from-fuchsia-500 to-cyan-500" />
            <span className="text-zinc-800 font-semibold tracking-tight">ADVANTA.AI</span>
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
              <option>RouteLLM</option>
              <option>GPT‑5</option>
              <option>GPT‑4o</option>
              <option>Gemini 2.5</option>
              <option>Claude 3.5</option>
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
        <main className="bg-zinc-50">
          <div className="max-w-[1100px] mx-auto p-8">
            {/* Suggestion chips row */}
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Chip>💡 Fun fact about Rome</Chip>
              <Chip>🧾 HTML landing page</Chip>
              <Chip>🧮 Python for fibonacci series</Chip>
              <Chip>🖼️ Draw a dragon</Chip>
            </div>

            {/* Big input card */}
            <div className="mx-auto mt-8 rounded-3xl bg-white border border-zinc-200 shadow-sm max-w-[820px]">
              <div className="p-6">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write something…"
                  className="h-10 rounded-xl bg-zinc-50 border-dashed border-zinc-200 mb-4 text-zinc-600 placeholder:text-zinc-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
                      className="h-10 w-10 grid place-items-center rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tool chips row */}
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <ToolChip icon="🖼️" label="Image" />
              <ToolChip icon="</>" label="Code" />
              <ToolChip icon=">_" label="Playground" />
              <ToolChip icon="📊" label="Powerpoint" />
              <ToolChip icon="🔎" label="Deep Research" />
              <ToolChip icon="⋯" label="More" />
            </div>

            {/* Tips link */}
            <div className="text-center mt-6">
              <a className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors" href="#">
                Prompting Tips and Tricks ↗
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}