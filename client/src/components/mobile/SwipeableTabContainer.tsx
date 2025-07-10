import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/stores/chatStore';

interface SwipeableTabContainerProps {
  children: React.ReactNode[];
}

export function SwipeableTabContainer({ children }: SwipeableTabContainerProps) {
  const { activeTab, setActiveTab } = useChatStore();
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const tabs = ['chat', 'tasks', 'output', 'settings'];
  const activeIndex = tabs.indexOf(activeTab);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diffX = startX - currentX;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && activeIndex < tabs.length - 1) {
        // Swipe left - next tab
        setActiveTab(tabs[activeIndex + 1] as any);
      } else if (diffX < 0 && activeIndex > 0) {
        // Swipe right - previous tab
        setActiveTab(tabs[activeIndex - 1] as any);
      }
    }
    
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  // Add momentum scrolling feel
  const transform = isDragging 
    ? `translateX(${-activeIndex * 100 + ((currentX - startX) / window.innerWidth) * 100}%)`
    : `translateX(${-activeIndex * 100}%)`;

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ 
          transform,
          width: `${tabs.length * 100}%`
        }}
      >
        {children.map((child, index) => (
          <div 
            key={index} 
            className="w-full h-full flex-shrink-0"
            style={{ width: `${100 / tabs.length}%` }}
          >
            {child}
          </div>
        ))}
      </div>
      
      {/* Swipe indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2 bg-black/20 rounded-full px-3 py-1 backdrop-blur-sm">
          {tabs.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}