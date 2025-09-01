"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Folder, MessageSquare, Terminal, FileText, Database, Globe } from "lucide-react";

interface Project {
  id: string;
  name: string;
  lastActivity: string;
}

interface ProjectSidebarProps {
  activeProjectId?: string;
}

function ProjectSidebar({ activeProjectId }: ProjectSidebarProps) {
  const [projects] = useState<Project[]>([
    { id: "1", name: "AI Research Project", lastActivity: "2 hours ago" },
    { id: "2", name: "Data Analysis Pipeline", lastActivity: "1 day ago" },
    { id: "3", name: "Web Scraping Tool", lastActivity: "3 days ago" }
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-zinc-800 border-zinc-700 text-sm"
          />
        </div>
        <Button size="sm" variant="outline" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-1">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`p-2 rounded cursor-pointer transition-colors ${
                activeProjectId === project.id
                  ? "bg-zinc-700 text-white"
                  : "hover:bg-zinc-800 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-zinc-400" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {project.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {project.lastActivity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function RailLink({ href, label, icon: Icon }: { 
  href: string; 
  label: string; 
  icon: any;
}) {
  return (
    <a 
      href={href} 
      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-zinc-800 text-zinc-200 transition-colors"
    >
      <Icon className="h-4 w-4 text-zinc-400" />
      {label}
    </a>
  );
}

export default function LeftRail({ activeProjectId }: { activeProjectId?: string }) {
  return (
    <aside className="w-[280px] shrink-0 border-r border-zinc-900 bg-zinc-950 p-4 space-y-6">
      <div>
        <div className="text-xs text-zinc-400 px-1 mb-3 font-medium uppercase tracking-wider">
          PROJECTS
        </div>
        <ProjectSidebar activeProjectId={activeProjectId} />
      </div>
      
      <div>
        <div className="text-xs text-zinc-400 px-1 mb-3 font-medium uppercase tracking-wider">
          CHATS
        </div>
        <nav className="space-y-1">
          <RailLink href="#chat" label="Chat" icon={MessageSquare} />
          <RailLink href="#operator" label="Virtual Computer" icon={Terminal} />
          <RailLink href="#humanize" label="Text Humanization" icon={FileText} />
          <RailLink href="#data" label="Data Analysis" icon={Database} />
          <RailLink href="#search" label="Web Search" icon={Globe} />
        </nav>
      </div>
    </aside>
  );
}