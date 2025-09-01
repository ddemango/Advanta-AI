"use client";
import { useState } from "react";
import TopNav from "./TopNav";
import LeftRail from "./LeftRail";
import QuickActions, { QuickActionsLower } from "./QuickActions";
import AgentDagEditor from "./AgentDagEditor";
import OperatorNotebook from "./OperatorNotebook";
import WebSearchPanel from "./WebSearchPanel";
import CriticalTierSuite from "./CriticalTierSuite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, Code, Search, Terminal, FileText, Database } from "lucide-react";

interface MainLayoutProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function MainLayout({ activeTab = 'chat', setActiveTab }: MainLayoutProps) {
  const [activeProjectId, setActiveProjectId] = useState("1");

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top Navigation */}
      <TopNav />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Rail */}
        <LeftRail activeProjectId={activeProjectId} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Quick Actions */}
          <QuickActions activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Main Content Area - Chat or Critical Tier */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'critical-tier' ? (
              <CriticalTierSuite />
            ) : (
              <div className="h-full p-4">
                <Card className="h-full bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">Chat Interface</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full flex flex-col">
                    <div className="flex-1 p-4 text-zinc-400">
                      Chat interface will be implemented here
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          {/* Lower Quick Actions */}
          <QuickActionsLower />
        </div>
      </div>
    </div>
  );
}