import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  Brain, 
  Route, 
  Link2, 
  HelpCircle, 
  Bot, 
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  UserPlus
} from "lucide-react";

interface ProfileMenuProps {
  user: {
    name: string;
    org: string;
  };
  onProfile: () => void;
  onCustomize: () => void;
  onMemories: () => void;
  onRouteLLM: () => void;
  onConnectors: () => void;
  onHelp: () => void;
  onCustomBot: () => void;
  onInvite: () => void;
  onSignOut: () => void;
}

export default function ProfileMenu({
  user,
  onProfile,
  onCustomize,
  onMemories,
  onRouteLLM,
  onConnectors,
  onHelp,
  onCustomBot,
  onInvite,
  onSignOut
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const menuItems = [
    { icon: User, label: "Profile", onClick: onProfile },
    { icon: Settings, label: "Customize ChatLLM", onClick: onCustomize },
    { icon: Brain, label: "Memories", onClick: onMemories },
    { icon: Route, label: "RouteLLM API", onClick: onRouteLLM },
    { icon: Link2, label: "Connectors", onClick: onConnectors },
    { icon: HelpCircle, label: "Help", onClick: onHelp },
    { icon: Bot, label: "Custom Bot Settings", onClick: onCustomBot }
  ];

  return (
    <div className="relative">
      {/* Refer/Invite Button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={onInvite}
          variant="outline"
          size="sm"
          className="text-xs bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
        >
          <UserPlus className="h-3 w-3 mr-1" />
          Refer ($) / Invite
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
              {user.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-zinc-400">{user.org}</div>
            </div>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsOpen(false)}
              />
              
              {/* Menu */}
              <div className="absolute right-0 top-12 z-20 w-64 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-2">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">{user.org}</div>
                    </div>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 w-full text-left px-2 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  >
                    {theme === "light" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                    <span className="text-sm">
                      {theme === "light" ? "Dark" : "Light"} theme
                    </span>
                  </button>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.onClick();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Sign Out */}
                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-2">
                  <button
                    onClick={() => {
                      onSignOut();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}