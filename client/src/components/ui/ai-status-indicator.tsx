import React, { useState, useEffect } from 'react';

interface AiStatusIndicatorProps {
  className?: string;
}

export function AiStatusIndicator({ className = '' }: AiStatusIndicatorProps) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [dots, setDots] = useState('');

  const statuses = [
    'AI Active',
    'Processing',
    'Learning',
    'Optimizing',
    'Analyzing'
  ];

  // Animate dots
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(dotInterval);
  }, []);

  // Rotate through statuses
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIndex(prev => (prev + 1) % statuses.length);
    }, 3000);
    
    return () => clearInterval(statusInterval);
  }, [statuses.length]);

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-2 bg-black/50 px-4 py-2 rounded-full border-2 border-primary shadow-lg shadow-primary/20">
        <div className="relative">
          <div className="h-4 w-4 rounded-full bg-primary"></div>
          <div className="absolute top-0 left-0 h-4 w-4 rounded-full bg-primary animate-ping opacity-50"></div>
        </div>
        <div className="font-medium text-white whitespace-nowrap">
          {statuses[statusIndex]}
          <span className="text-primary">{dots}</span>
        </div>
      </div>
    </div>
  );
}