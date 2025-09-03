import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mic,
  Send,
  Settings,
  User,
  ChevronDown,
  Bot,
  Code,
  MessageSquare,
  FileText,
  Database,
  BarChart3,
  Globe,
  Zap,
  BookOpen,
  Music,
  Calendar
} from "lucide-react";

export default function AbacusDeepAgent() {
  const [input, setInput] = useState("");

  const featuredApps = [
    {
      title: "Interdisciplinary analogies",
      description: "DeepAgent performs interdisciplinary research across biological and engineering domains and generates...",
      color: "from-orange-400 to-red-500",
      image: "🧬",
      category: "Research"
    },
    {
      title: "Books RAG Chatbot",
      description: "DeepAgent creates RAG-powered chatbots from your PDF books Libraries, accessing your knowledge library thr...",
      color: "from-blue-400 to-blue-600", 
      image: "📚",
      category: "Chatbots"
    },
    {
      title: "Vibe code a CRM",
      description: "Vibe Code's CRM to do connect and deal management.",
      color: "from-purple-500 to-indigo-600",
      image: "📊", 
      category: "AI Workflows"
    },
    {
      title: "Weekly Dinner Dates",
      description: "DeepAgent plans your weekly dinner dates.",
      color: "from-orange-500 to-red-600",
      image: "🍽️",
      category: "AI Workflows"
    },
    {
      title: "App with Stripe Payments", 
      description: "DeepAgent will build a fully optimized websites with integrated Stripe payments—turning workflow...",
      color: "from-green-400 to-emerald-500",
      image: "💳",
      category: "Apps"
    },
    {
      title: "Influencer ROI Predictor",
      description: "DeepAgent runs Monte Carlo Simulation to solve Business problems, and creates Excel optimized dashboards",
      color: "from-blue-500 to-cyan-500", 
      image: "📈",
      category: "Apps"
    },
    {
      title: "AI Steve Jobs Podcast",
      description: "Create a podcast featuring AI versions with perfect lip-sync technology keeping some themes lip-sy...",
      color: "from-gray-400 to-gray-600",
      image: "🎙️",
      category: "Apps"
    },
    {
      title: "Blockchain PPT",
      description: "DeepAgent will turn blockchain into investment pitch.",
      color: "from-yellow-400 to-orange-500",
      image: "⛓️",
      category: "Apps"
    }
  ];

  const categories = [
    { name: "Featured", icon: "⭐", active: true },
    { name: "Apps", icon: "📱" },
    { name: "Short Videos", icon: "🎬" },
    { name: "Chatbots", icon: "🤖" },
    { name: "AI Workflows", icon: "⚡" },
    { name: "Deep Research", icon: "🔍" },
    { name: "Power Point", icon: "📊" },
    { name: "Data Analysis", icon: "📈" },
    { name: "Browser Use", icon: "🌐" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
              <span className="font-semibold text-gray-900">ABACUS.AI</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-blue-600 font-medium">ChatLLM</span>
              <span className="text-gray-400">|</span>
              <span className="text-orange-600 bg-orange-100 px-2 py-0.5 rounded text-xs font-medium">DeepAgent</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Better ($) / Invite</div>
            <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
              <span className="text-green-800 font-semibold text-sm">D</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Chats</h2>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Plus className="w-4 h-4 text-gray-400" />
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-1 mb-6">
              <div className="text-xs text-gray-500 py-2">2 days ago</div>
              <div className="text-sm text-gray-700 py-2 hover:bg-gray-50 rounded cursor-pointer">
                URL Scan for Rental Prices
              </div>
            </div>

            {/* Tools Section */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tools</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-50 p-2 rounded cursor-pointer">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <Bot className="w-3 h-3 text-blue-600" />
                  </div>
                  Apps
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-50 p-2 rounded cursor-pointer">
                  <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                    <Zap className="w-3 h-3 text-green-600" />
                  </div>
                  Tasks
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-50 p-2 rounded cursor-pointer">
                  <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                    <Code className="w-3 h-3 text-purple-600" />
                  </div>
                  CodeLLM
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Center Content */}
          <div className="flex-1 p-8">
            {/* Main Prompt */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">What do you want to do?</h1>
              <p className="text-gray-600">DeepAgent is capable of creating apps, documents and doing pretty much any task</p>
            </div>

            {/* Input Area */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you want to get done, be pretty detailed..."
                  className="w-full px-4 py-4 pr-20 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Plus className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Mic className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="text-purple-600 text-sm">🤖 DeepAgent Composition</span>
                <span className="text-blue-600 text-sm">📝 Help and How-To</span>
                <span className="text-gray-600 text-sm">⚙️ Configure MCP</span>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      category.active 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {featuredApps.map((app, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className={`h-32 bg-gradient-to-br ${app.color} flex items-center justify-center`}>
                    <div className="text-4xl">{app.image}</div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">{app.title}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-3">{app.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{app.category}</span>
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">Open</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}