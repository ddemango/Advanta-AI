"use client";
import React, { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  FileText, 
  Bot, 
  Code, 
  Search, 
  BarChart3,
  Settings,
  Plus,
  Send,
  Mic,
  Paperclip,
  MoreHorizontal,
  ChevronDown,
  Eye,
  Palette,
  Zap,
  Database
} from "lucide-react";

// ChatLLM-style portal wireframe
// - Left Sidebar: Conversations, Documents, Agents, Data, Integrations
// - Top Toolbar: Model selector, Temperature, Tool toggles, New Chat
// - Main Area: switches between Chat, Documents, Agents, Code, Search, Data Analysis
// - Quick Actions: floating buttons

const models = [
  { id: "gpt-5", name: "GPT‑5 (Default)" },
  { id: "gpt-4o", name: "GPT‑4o" },
  { id: "gemini", name: "Gemini 2.5" },
  { id: "grok", name: "Grok" },
  { id: "qwen", name: "Qwen 3" },
];

const sidebarSections = [
  {
    key: "conversations",
    title: "Conversations",
    items: ["Welcome Chat", "Product Ideas", "Spec Draft", "Marketing Plan"],
  },
  {
    key: "documents",
    title: "Documents",
    items: ["pricing.pdf", "sales.csv", "roadmap.docx"],
  },
  {
    key: "agents",
    title: "Agents",
    items: ["Lead Qualifier", "Summarizer", "Data Cleaner"],
  },
  {
    key: "data",
    title: "Data",
    items: ["KPI Dashboard", "Weekly Report"],
  },
  {
    key: "integrations",
    title: "Integrations",
    items: ["Slack", "G‑Drive", "Gmail", "Calendar"],
  },
];

const centerViews = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "code", label: "Code", icon: Code },
  { id: "search", label: "Search", icon: Search },
  { id: "data", label: "Data Analysis", icon: BarChart3 },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function SidebarItem({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
      active 
        ? "bg-blue-600 text-white" 
        : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
    }`}>
      {children}
    </div>
  );
}

function QuickActionButton({ icon: Icon, label, onClick }: { 
  icon: any; 
  label: string; 
  onClick?: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="outline"
      className="bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}

export default function ChatLLMLayout() {
  const [selectedModel, setSelectedModel] = useState("gpt-5");
  const [temperature, setTemperature] = useState([0.7]);
  const [activeView, setActiveView] = useState("chat");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [
      ...prev,
      { role: "user", content: message },
      { role: "assistant", content: "I'm processing your request..." }
    ]);
    setMessage("");
  };

  const renderCenterView = () => {
    switch (activeView) {
      case "chat":
        return (
          <div className="flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white" 
                      : "bg-zinc-800 text-zinc-100"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="border-t border-zinc-800 p-4">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case "documents":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["pricing.pdf", "sales.csv", "roadmap.docx"].map((doc) => (
                <Card key={doc} className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">{doc}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400 text-sm">Document preview and management</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "agents":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">AI Agents</h2>
            <div className="space-y-4">
              {["Lead Qualifier", "Summarizer", "Data Cleaner"].map((agent) => (
                <Card key={agent} className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Bot className="w-5 h-5 mr-2" />
                      {agent}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400 text-sm">AI agent configuration and execution</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "code":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Code Editor</h2>
            <Card className="bg-zinc-900 border-zinc-700">
              <CardContent className="p-0">
                <div className="bg-zinc-800 p-4 border-b border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-zinc-400 text-sm">main.py</span>
                  </div>
                </div>
                <div className="p-4 font-mono text-sm text-zinc-300 bg-zinc-900 min-h-[300px]">
                  <div className="text-blue-400"># Python code editor</div>
                  <div className="text-green-400">print("Hello, World!")</div>
                  <div className="text-zinc-500"># Write your code here...</div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "search":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Web Search</h2>
            <div className="space-y-4">
              <Input
                placeholder="Search the web..."
                className="bg-zinc-800 border-zinc-700 text-white"
              />
              <div className="text-zinc-400">Search results will appear here</div>
            </div>
          </div>
        );

      case "data":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Data Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white">KPI Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400">Interactive data visualization</p>
                </CardContent>
              </Card>
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white">Weekly Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400">Automated report generation</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return <div className="p-6 text-white">Select a view from the tabs above</div>;
    }
  };

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top Toolbar */}
      <div className="border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          {/* Left: Model and Settings */}
          <div className="flex items-center space-x-4">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-zinc-400">Temperature:</span>
              <div className="w-20">
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={1}
                  min={0}
                  step={0.1}
                  className="cursor-pointer"
                />
              </div>
              <span className="text-sm text-zinc-300 w-8">{temperature[0]}</span>
            </div>

            {/* Tool Toggles */}
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" className="bg-zinc-800 border-zinc-700">
                <Eye className="w-4 h-4 mr-1" />
                Vision
              </Button>
              <Button size="sm" variant="outline" className="bg-zinc-800 border-zinc-700">
                <Palette className="w-4 h-4 mr-1" />
                DALL-E
              </Button>
              <Button size="sm" variant="outline" className="bg-zinc-800 border-zinc-700">
                <Database className="w-4 h-4 mr-1" />
                Data
              </Button>
            </div>
          </div>

          {/* Right: New Chat and Settings */}
          <div className="flex items-center space-x-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
            <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-4 overflow-y-auto">
          {sidebarSections.map((section) => (
            <Section key={section.key} title={section.title}>
              {section.items.map((item, idx) => (
                <SidebarItem key={idx} active={idx === 0 && section.key === "conversations"}>
                  {item}
                </SidebarItem>
              ))}
            </Section>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Center View Tabs */}
          <div className="border-b border-zinc-800">
            <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b-0 h-12 px-4">
                {centerViews.map((view) => (
                  <TabsTrigger
                    key={view.id}
                    value={view.id}
                    className="flex items-center space-x-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                  >
                    <view.icon className="w-4 h-4" />
                    <span>{view.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {renderCenterView()}
          </div>

          {/* Quick Actions */}
          <div className="border-t border-zinc-800 p-4">
            <div className="flex flex-wrap gap-2">
              <QuickActionButton icon={Zap} label="Summarize" />
              <QuickActionButton icon={Code} label="Code Review" />
              <QuickActionButton icon={FileText} label="Generate Doc" />
              <QuickActionButton icon={BarChart3} label="Analyze Data" />
              <QuickActionButton icon={Search} label="Web Search" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}