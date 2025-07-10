import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useChatStore } from "@/stores/chatStore";
import { MobileChatInterface } from "@/components/mobile/MobileChatInterface";
import { MobileTaskHistory } from "@/components/mobile/MobileTaskHistory";
import { MobileOutputViewer } from "@/components/mobile/MobileOutputViewer";
import { MobileSettings } from "@/components/mobile/MobileSettings";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function ChatbotBuilder() {
  const [, setLocation] = useLocation();
  const { activeTab, setMobile } = useChatStore();

  // Detect mobile and update store
  useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setMobile]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return <MobileChatInterface />;
      case 'tasks':
        return <MobileTaskHistory />;
      case 'output':
        return <MobileOutputViewer />;
      case 'settings':
        return <MobileSettings />;
      default:
        return <MobileChatInterface />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Helmet>
        <title>AI Automation Workspace - Advanta AI</title>
        <meta name="description" content="Mobile-optimized AI chatbot and automation builder" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/dashboard')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-900">AI Workspace</h1>
        </div>
        
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        {renderActiveTab()}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '14px',
            maxWidth: '90%',
          },
        }}
      />
    </div>
  );
}