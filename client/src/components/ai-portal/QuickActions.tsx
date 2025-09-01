import { Code2, FileBarChart2, ImageIcon, FlaskConical, Search, MoreHorizontal } from 'lucide-react';

interface ChipProps {
  children: React.ReactNode;
  iconLeft?: React.ReactNode;
  onClick?: () => void;
}

function Chip({ children, iconLeft, onClick }: ChipProps) {
  return (
    <button 
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition-colors"
    >
      {iconLeft && <span className="text-gray-700">{iconLeft}</span>}
      <span>{children}</span>
    </button>
  );
}

interface QuickActionsProps {
  onQuickPrompt: (prompt: string) => void;
  setActiveTab: (tab: string) => void;
}

export function QuickActions({ onQuickPrompt, setActiveTab }: QuickActionsProps) {
  return (
    <div className="mx-auto mt-8 hidden w-full max-w-5xl flex-wrap items-center justify-center gap-3 md:flex">
      <Chip onClick={() => onQuickPrompt('Generate Python code for data analysis')}>
        Data Analysis Code
      </Chip>
      <Chip 
        iconLeft={<FileBarChart2 className="h-4 w-4" />}
        onClick={() => onQuickPrompt('Create a CSV report from this data')}
      >
        CSV Report
      </Chip>
      <Chip 
        iconLeft={<Code2 className="h-4 w-4" />}
        onClick={() => onQuickPrompt('Execute Python script in virtual computer')}
      >
        Python Execution
      </Chip>
      <Chip 
        iconLeft={<ImageIcon className="h-4 w-4" />}
        onClick={() => onQuickPrompt('Humanize this text for professional tone')}
      >
        Text Humanization
      </Chip>
    </div>
  );
}

export function QuickActionsMobile({ onQuickPrompt }: { onQuickPrompt: (prompt: string) => void }) {
  return (
    <div className="mx-auto mt-8 flex w-full max-w-xl flex-wrap items-center justify-center gap-3 md:hidden">
      <Chip onClick={() => onQuickPrompt('Generate Python code')}>Python Code</Chip>
      <Chip 
        iconLeft={<FileBarChart2 className="h-4 w-4" />}
        onClick={() => onQuickPrompt('Create CSV report')}
      >
        CSV Report
      </Chip>
      <Chip 
        iconLeft={<Code2 className="h-4 w-4" />}
        onClick={() => onQuickPrompt('Execute Python')}
      >
        Execute
      </Chip>
    </div>
  );
}

interface ToolButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}

function ToolButton({ children, icon, onClick }: ToolButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition-colors"
    >
      {icon && <span className="text-gray-700">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

interface QuickActionsLowerProps {
  onQuickPrompt: (prompt: string) => void;
  setActiveTab: (tab: string) => void;
}

export function QuickActionsLower({ onQuickPrompt, setActiveTab }: QuickActionsLowerProps) {
  return (
    <div className="mx-auto mt-4 flex w-full max-w-5xl flex-wrap items-center justify-center gap-3">
      <ToolButton 
        icon={<ImageIcon className="h-4 w-4" />}
        onClick={() => setActiveTab('humanize')}
      >
        Humanize
      </ToolButton>
      <ToolButton 
        icon={<Code2 className="h-4 w-4" />}
        onClick={() => onQuickPrompt('Execute this Python code:\n\nprint("Hello, World!")')}
      >
        Code
      </ToolButton>
      <ToolButton 
        icon={<FlaskConical className="h-4 w-4" />}
        onClick={() => setActiveTab('operator')}
      >
        Virtual Computer
      </ToolButton>
      <ToolButton 
        icon={<FileBarChart2 className="h-4 w-4" />}
        onClick={() => setActiveTab('data')}
      >
        Data Analysis
      </ToolButton>
      <ToolButton 
        icon={<Search className="h-4 w-4" />}
        onClick={() => onQuickPrompt('Search the web for information about: ')}
      >
        Web Search
      </ToolButton>
      <ToolButton 
        icon={<MoreHorizontal className="h-4 w-4" />}
        onClick={() => {}}
      >
        More
      </ToolButton>
    </div>
  );
}