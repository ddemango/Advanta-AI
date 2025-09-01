import { useState, useEffect } from 'react';
import { MessageSquare, Plus, ChevronDown, Search, Terminal, Wand2, Database, Users2, FolderPlus, ListStart, Code2, UserRound, MoreHorizontal, Workflow, Globe, BookOpen } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  chats: Chat[];
}

interface Chat {
  id: string;
  title: string;
  messages: any[];
  createdAt: Date;
}

interface LeftRailProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentProject: string;
  setCurrentProject: (id: string) => void;
  currentChat: string;
  setCurrentChat: (id: string) => void;
  createNewProject: () => void;
  createNewChat: () => void;
}

function RailLink({ 
  active, 
  icon: Icon, 
  label, 
  onClick 
}: { 
  active: boolean;
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2 ${
        active ? 'bg-gray-100' : 'hover:bg-gray-50'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export function LeftRail({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  currentProject,
  setCurrentProject,
  currentChat,
  setCurrentChat,
  createNewProject,
  createNewChat
}: LeftRailProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/ai-portal/projects');
        const data = await response.json();
        if (data.ok) {
          setProjects(data.projects);
          if (data.projects.length > 0 && !currentProject) {
            setCurrentProject(data.projects[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };

    loadProjects();
  }, [currentProject, setCurrentProject]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Close mobile sidebar when tab changes
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
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
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50" 
              title="Add Project"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button 
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50" 
              title="Project Options"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search projects */}
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
          <Search className="h-4 w-4 text-gray-500" />
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
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50" 
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button 
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50" 
              title="Collapse"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Chats list */}
        <nav className="space-y-1 mb-6">
          {projects.find(p => p.id === currentProject)?.chats?.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                setCurrentChat(chat.id);
                handleTabChange('chat');
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                currentChat === chat.id && activeTab === 'chat' ? 'bg-gray-100' : ''
              }`}
            >
              <span className="line-clamp-1 pr-3">{chat.title}</span>
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </button>
          )) || (
            <div className="text-sm text-gray-500 px-3 py-2">No chats yet</div>
          )}
        </nav>

        {/* Tool Tabs */}
        <div className="space-y-2">
          <RailLink
            active={activeTab === 'chat'}
            icon={MessageSquare}
            label="Chat"
            onClick={() => handleTabChange('chat')}
          />
          <RailLink
            active={activeTab === 'operator'}
            icon={Terminal}
            label="Virtual Computer"
            onClick={() => handleTabChange('operator')}
          />
          <RailLink
            active={activeTab === 'humanize'}
            icon={Wand2}
            label="Text Humanization"
            onClick={() => handleTabChange('humanize')}
          />
          <RailLink
            active={activeTab === 'data'}
            icon={Database}
            label="Data Analysis"
            onClick={() => handleTabChange('data')}
          />
          <RailLink
            active={activeTab === 'agents'}
            icon={Workflow}
            label="DeepAgent Studio"
            onClick={() => handleTabChange('agents')}
          />
          <RailLink
            active={activeTab === 'search'}
            icon={Globe}
            label="Web Search"
            onClick={() => handleTabChange('search')}
          />
          <RailLink
            active={activeTab === 'notebook'}
            icon={BookOpen}
            label="Code Notebook"
            onClick={() => handleTabChange('notebook')}
          />
        </div>

        {/* Sidebar footer */}
        <div className="mt-auto border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Users2 className="h-5 w-5" />
              <span className="text-sm">AI Portal</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
          <div className="grid grid-cols-6 gap-2 text-gray-600">
            <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2 hover:bg-gray-50" title="Apps">
              <FolderPlus className="h-4 w-4" />
            </button>
            <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2 hover:bg-gray-50" title="Tasks">
              <ListStart className="h-4 w-4" />
            </button>
            <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2 hover:bg-gray-50" title="Code">
              <Code2 className="h-4 w-4" />
            </button>
            <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2 hover:bg-gray-50" title="User">
              <UserRound className="h-4 w-4" />
            </button>
            <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2 hover:bg-gray-50" title="Search">
              <Search className="h-4 w-4" />
            </button>
            <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2 hover:bg-gray-50" title="More">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}