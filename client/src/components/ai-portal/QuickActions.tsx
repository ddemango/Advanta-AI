"use client";

const Chip = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href} 
    className="px-3 py-1.5 rounded-full border border-zinc-700 hover:bg-zinc-800 text-sm text-zinc-200 transition-colors whitespace-nowrap"
  >
    {children}
  </a>
);

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-zinc-800">
      <Chip href="#data">Data Analysis Code</Chip>
      <Chip href="#data">CSV Report</Chip>
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