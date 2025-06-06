import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  return (
    <>
      {/* Chat Interface */}
      <ChatInterface 
        isOpen={isOpen} 
        onToggle={() => setIsOpen(!isOpen)} 
        minimized={minimized}
        onMinimize={() => setMinimized(!minimized)}
      />
      
      {/* Chat Bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            className="fixed bottom-4 right-4 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={() => {
                setIsOpen(true);
                setMinimized(false);
              }}
              size="lg"
              className="rounded-full shadow-lg h-14 w-14 bg-gradient-to-r from-primary to-accent text-white hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <MessageCircle size={24} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}