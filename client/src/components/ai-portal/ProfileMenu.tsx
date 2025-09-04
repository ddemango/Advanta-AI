"use client";
import * as React from "react";

export interface ProfileMenuProps {
  user: { name: string; org?: string; avatarUrl?: string };
  onProfile?: () => void;
  onCustomize?: () => void; // Customize ChatLLM
  onMemories?: () => void;
  onRouteLLM?: () => void; // RouteLLM API
  onConnectors?: () => void;
  onHelp?: () => void;
  onCustomBot?: () => void;
  onInvite?: () => void; // Refer($)/Invite
  onSignOut?: () => void;
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
  const [open, setOpen] = React.useState(false);
  const [theme, setTheme] = React.useState("light");
  const isDark = theme === "dark";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    // Apply theme to document if needed
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen((o) => !o)} 
        className="h-8 w-8 rounded-full bg-emerald-200 text-emerald-800 grid place-items-center font-semibold text-sm hover:bg-emerald-300 transition-colors overflow-hidden"
        title="Profile"
      >
        {user.avatarUrl ? (
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          user.name?.[0]?.toUpperCase() || "U"
        )}
      </button>
      
      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setOpen(false)} 
          />
          
          {/* Menu */}
          <div className="absolute right-0 z-40 mt-2 w-72 rounded-2xl border bg-white shadow-2xl">
            {/* Header: Invite + Identity + Theme toggle */}
            <div className="flex items-center justify-between gap-2 border-b p-3">
              <button 
                onClick={() => { setOpen(false); onInvite?.(); }}
                className="rounded-full border px-2.5 py-1 text-xs hover:bg-gray-50 transition-colors"
              >
                Refer ($) / Invite ▾
              </button>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-emerald-200 text-emerald-800 grid place-items-center font-semibold text-sm overflow-hidden">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.[0]?.toUpperCase()
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold">{user.name}</div>
                  {user.org && <div className="text-xs text-gray-500">{user.org}</div>}
                </div>
                <button
                  aria-label="Toggle Theme"
                  onClick={toggleTheme}
                  className="ml-2 rounded-full border px-2.5 py-1 text-xs hover:bg-gray-50 transition-colors"
                >
                  {isDark ? "🌙" : "☀️"}
                </button>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-2">
              <MenuItem label="Profile" onClick={() => { setOpen(false); onProfile?.(); }} />
              <MenuItem label="Customize ChatLLM" onClick={() => { setOpen(false); onCustomize?.(); }} />
              <MenuItem label="Memories" onClick={() => { setOpen(false); onMemories?.(); }} />
              <MenuItem label="RouteLLM API" onClick={() => { setOpen(false); onRouteLLM?.(); }} />
              <MenuItem label="Connectors" onClick={() => { setOpen(false); onConnectors?.(); }} />
              <MenuItem label="Help" onClick={() => { setOpen(false); onHelp?.(); }} />
              <MenuItem label="Custom Bot Settings" onClick={() => { setOpen(false); onCustomBot?.(); }} />
            </div>

            <div className="border-t p-2">
              <button
                onClick={() => { setOpen(false); onSignOut?.(); }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
    >
      {label}
    </button>
  );
}