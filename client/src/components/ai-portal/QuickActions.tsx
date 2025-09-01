"use client";

const Chip = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href} 
    className="px-3 py-1.5 rounded-full border border-zinc-700 hover:bg-zinc-800 text-sm text-zinc-200 transition-colors whitespace-nowrap"
  >
    {children}
  </a>
);

interface QuickActionsProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function QuickActions({ activeTab, setActiveTab }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-zinc-800">
      <button
        onClick={() => setActiveTab?.('chat')}
        className={`px-3 py-1.5 rounded-full border text-sm transition-colors whitespace-nowrap ${
          activeTab === 'chat' 
            ? 'bg-blue-600 border-blue-500 text-white' 
            : 'border-zinc-700 hover:bg-zinc-800 text-zinc-200'
        }`}
      >
        Chat Interface
      </button>
      <button
        onClick={() => setActiveTab?.('critical-tier')}
        className={`px-3 py-1.5 rounded-full border text-sm transition-colors whitespace-nowrap ${
          activeTab === 'critical-tier' 
            ? 'bg-purple-600 border-purple-500 text-white' 
            : 'border-zinc-700 hover:bg-zinc-800 text-zinc-200'
        }`}
      >
        Critical Tier Suite
      </button>
      <Chip href="#data">Data Analysis Code</Chip>
      <Chip href="#operator">Python Execution</Chip>
      <Chip href="#humanize">Text Humanization</Chip>
    </div>
  );
}

export function QuickActionsLower() {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      <Chip href="#humanize">Humanize</Chip>
      <Chip href="#operator">Code</Chip>
      <Chip href="#operator">Virtual Computer</Chip>
      <Chip href="#data">Data Analysis</Chip>
      <Chip href="#search">Web Search</Chip>
      <Chip href="#deepagent">DeepAgent</Chip>
    </div>
  );
}