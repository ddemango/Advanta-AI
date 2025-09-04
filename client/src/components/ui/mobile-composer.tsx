import React, { useState } from "react";

interface MobileComposerProps {
  value: string;
  setValue: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function MobileComposer({ value, setValue, onSend, disabled }: MobileComposerProps) {
  const [expanded, setExpanded] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t bg-white transition-all safe-bottom
      ${expanded ? 'pt-3' : ''}`}
    >
      <div className="mx-auto max-w-[800px] px-3">
        <div className={`flex items-end gap-2 ${expanded ? 'mb-2' : ''}`}>
          <button 
            className="hidden sm:inline-flex touch-target rounded-xl border grid place-items-center"
            aria-label="Attach file"
          >
            📎
          </button>
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            onFocus={() => setExpanded(true)}
            onBlur={() => setExpanded(false)}
            onKeyDown={handleKeyDown}
            placeholder="Message ChatLLM…"
            rows={expanded ? 4 : 1}
            className="flex-1 resize-none rounded-2xl border px-3 py-2 outline-none max-h-[40vh] text-[15px] sm:text-sm"
            style={{ WebkitOverflowScrolling: 'touch' }}
          />
          <button
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className="touch-target rounded-2xl bg-indigo-600 text-white px-4 disabled:opacity-50 transition-colors"
            aria-label="Send message"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}