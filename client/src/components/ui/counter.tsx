import { useState, useEffect, useRef } from 'react';

interface CounterProps {
  value: number;
  start?: number;
  duration?: number;
  suffix?: string;
  inView: boolean;
  className?: string;
}

export function Counter({ 
  value, 
  start = 0, 
  duration = 2000, 
  suffix = '', 
  inView, 
  className = '' 
}: CounterProps) {
  const [count, setCount] = useState(start);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  
  useEffect(() => {
    if (!inView) return;
    
    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      setCount(Math.floor(start + progress * (value - start)));
      
      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [value, start, duration, inView]);
  
  return (
    <span className={className}>
      {count}{suffix}
    </span>
  );
}
