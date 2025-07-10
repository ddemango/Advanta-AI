import { useState, useRef, useEffect, ReactNode } from 'react';
import { useChatStore } from '@/stores/chatStore';

interface SwipeableTabContainerProps {
  children: ReactNode[];
}

export function SwipeableTabContainer({ children }: SwipeableTabContainerProps) {
  const { activeTab, setActiveTab } = useChatStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const tabs = ['chat', 'tasks', 'output', 'settings'] as const;
  const currentIndex = tabs.indexOf(activeTab);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Limit drag distance to prevent overscroll
    const maxDrag = window.innerWidth * 0.3;
    const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));
    
    setTranslateX(limitedDiff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const threshold = window.innerWidth * 0.15; // 15% of screen width
    
    if (translateX > threshold && currentIndex > 0) {
      // Swipe right - go to previous tab
      setActiveTab(tabs[currentIndex - 1]);
    } else if (translateX < -threshold && currentIndex < tabs.length - 1) {
      // Swipe left - go to next tab
      setActiveTab(tabs[currentIndex + 1]);
    }
    
    setTranslateX(0);
  };

  // Mouse event handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diff = currentX - startX;
    
    const maxDrag = window.innerWidth * 0.3;
    const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));
    
    setTranslateX(limitedDiff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const threshold = window.innerWidth * 0.15;
    
    if (translateX > threshold && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    } else if (translateX < -threshold && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
    
    setTranslateX(0);
  };

  // Handle mouse leave to end drag
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setTranslateX(0);
    }
  };

  // Calculate the transform for the current tab
  const baseTransform = `translateX(-${currentIndex * 100}%)`;
  const dragTransform = isDragging ? `translateX(calc(-${currentIndex * 100}% + ${translateX}px))` : baseTransform;

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-hidden relative select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={`h-full flex transition-transform ${isDragging ? 'duration-0' : 'duration-300 ease-out'}`}
        style={{
          width: `${children.length * 100}%`,
          transform: dragTransform
        }}
      >
        {children.map((child, index) => (
          <div 
            key={index}
            className="h-full flex-shrink-0"
            style={{ width: `${100 / children.length}%` }}
          >
            {child}
          </div>
        ))}
      </div>
      
      {/* Swipe indicator dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 pointer-events-none">
        {tabs.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}