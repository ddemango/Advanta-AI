import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  x: number;
  y: number;
  id: number;
  size: number;
}

interface ClickRippleProps {
  children: ReactNode;
  className?: string;
  color?: string;
  duration?: number;
  size?: number;
}

export function ClickRipple({
  children,
  className = '',
  color = 'rgba(var(--primary), 0.5)',
  duration = 0.7,
  size = 150
}: ClickRippleProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate a unique ID for each ripple
  const nextId = useRef(0);
  
  const addRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const rippleSize = size || Math.max(container.width, container.height);
    
    const x = e.clientX - container.left - rippleSize / 2;
    const y = e.clientY - container.top - rippleSize / 2;
    
    const id = nextId.current;
    nextId.current += 1;
    
    setRipples([...ripples, { x, y, id, size: rippleSize }]);
  };
  
  // Remove ripple after animation completes
  useEffect(() => {
    if (ripples.length === 0) return;
    
    const timeoutId = setTimeout(() => {
      setRipples(ripples => ripples.slice(1));
    }, duration * 1000);
    
    return () => clearTimeout(timeoutId);
  }, [ripples, duration]);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`} 
      onClick={addRipple}
    >
      {children}
      
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              background: color
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}