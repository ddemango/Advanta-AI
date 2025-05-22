import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface CollapsibleContentProps {
  title: string;
  children: React.ReactNode;
  previewContent?: React.ReactNode;
  expanded?: boolean;
  className?: string;
  buttonText?: {
    show: string;
    hide: string;
  };
}

export default function CollapsibleContent({
  title,
  children,
  previewContent,
  expanded = false,
  className = '',
  buttonText = { show: 'Learn More', hide: 'Show Less' }
}: CollapsibleContentProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className={`border border-border/30 rounded-lg bg-background/50 backdrop-blur-sm ${className}`}>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        
        {/* Always visible preview content */}
        {previewContent && <div className="mb-4">{previewContent}</div>}
        
        {/* Expandable content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Toggle button */}
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="group"
          >
            <span>{isExpanded ? buttonText.hide : buttonText.show}</span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </Button>
        </div>
      </div>
    </div>
  );
}