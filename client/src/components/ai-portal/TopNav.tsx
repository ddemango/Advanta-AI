"use client";
import { useState } from "react";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProfileMenu from "./ProfileMenu";
import { ROUTES } from "@/lib/routes";
import { useProfile } from "@/contexts/ProfileContext";

interface ModelSelectorProps {
  value?: string;
  onChange?: (model: string) => void;
}

function ModelSelector({ value = "gpt-5", onChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px] border-zinc-700 bg-zinc-800">
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gpt-5">GPT-5</SelectItem>
        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
        <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
        <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
      </SelectContent>
    </Select>
  );
}

function PlanBadge({ plan = "Enterprise" }: { plan?: string }) {
  const colors = {
    Free: "bg-gray-600",
    Pro: "bg-blue-600", 
    Enterprise: "bg-purple-600"
  };
  
  return (
    <Badge className={`${colors[plan as keyof typeof colors] || colors.Free} text-white`}>
      {plan}
    </Badge>
  );
}

export default function TopNav() {
  const [selectedModel, setSelectedModel] = useState("gpt-5");
  const [, setLocation] = useLocation();
  const { profile } = useProfile();
  
  const handleSignOut = () => {
    // Clear any stored auth tokens/session data
    localStorage.removeItem('authToken');
    // Redirect to home page
    setLocation('/');
  };
  
  return (
    <header className="sticky top-0 z-40 bg-black/70 backdrop-blur border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-indigo-500" />
          <a href="/" className="font-semibold tracking-wide text-white">
            ADVANTA.AI
          </a>
        </div>
        <div className="flex items-center gap-4">
          <ModelSelector value={selectedModel} onChange={setSelectedModel} />
          <PlanBadge />
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
            onSignOut={handleSignOut}
          />
        </div>
      </div>
    </header>
  );
}