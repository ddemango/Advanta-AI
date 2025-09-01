import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { PlanBadge } from './PlanGate';

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
}

function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const models = [
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable model' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and efficient' },
    { id: 'gpt-4', name: 'GPT-4', description: 'Previous generation' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' }
  ];

  const currentModel = models.find(m => m.id === value) || models[0];

  const handleModelChange = async (modelId: string) => {
    try {
      await fetch('/api/ai-portal/model', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelId })
      });
      onChange(modelId);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update model:', error);
    }
  };

  return (
    <div className="relative">
      <button
        className="hidden min-w-[160px] items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium md:flex hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#5b46f3]/10">
          <span className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-[#5b46f3]" />
        </span>
        <span>{currentModel.name}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-1 z-20 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-2">
                SELECT MODEL
              </div>
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelChange(model.id)}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 ${
                    model.id === value ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="font-medium text-gray-900">{model.name}</div>
                  <div className="text-sm text-gray-500">{model.description}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface TopNavProps {
  model: string;
  onModelChange: (model: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function TopNav({ model, onModelChange, sidebarOpen, setSidebarOpen }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-3 py-3 md:px-5">
        {/* Left cluster: hamburger (mobile) + logo */}
        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-[28px] rounded-sm bg-gradient-to-b from-[#6a6cf6] to-[#8b7bff]" />
            <span className="text-lg font-semibold tracking-tight">ADVANTA.AI</span>
          </div>
        </div>

        {/* Center: Model selector */}
        <ModelSelector value={model} onChange={onModelChange} />

        {/* Right cluster: plan badge + portal info + avatar */}
        <div className="flex items-center gap-3">
          <PlanBadge />
          <button className="hidden rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium md:inline-flex">
            AI Portal / Team
          </button>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-bold">
            A
          </button>
        </div>
      </div>
    </header>
  );
}