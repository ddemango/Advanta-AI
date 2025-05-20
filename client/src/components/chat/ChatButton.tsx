import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showDelay, setShowDelay] = useState(false);
  
  // Auto-show chat prompt after 5 seconds of page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDelay(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

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
            
            {/* Prompt bubble */}
            <AnimatePresence>
              {showDelay && !isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-16 right-0 bg-black border border-white/10 rounded-lg p-3 shadow-xl w-60"
                  style={{ backdropFilter: 'blur(16px)', backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-sm">Need help with AI solutions?</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 -mr-1 -mt-1" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDelay(false);
                      }}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">I can answer questions about our services, pricing, and implementation.</p>
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="w-full mt-1 bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setIsOpen(true);
                      setMinimized(false);
                      setShowDelay(false);
                    }}
                  >
                    Chat with AI Consultant
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}