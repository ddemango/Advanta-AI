import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface HoverCardEffectProps {
  children: ReactNode;
  className?: string;
  glareEffectSize?: number;
}

export function HoverCardEffect({ 
  children, 
  className = '',
  glareEffectSize = 80
}: HoverCardEffectProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cardRef.current) {
      const { width, height } = cardRef.current.getBoundingClientRect();
      setCardDimensions({ width, height });
    }
  }, []);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const { width, height, left, top } = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    setMousePosition({ x, y });
    setCardDimensions({ width, height });
  };
  
  // Calculate rotation based on mouse position
  const rotateX = isHovered ? (mousePosition.y / cardDimensions.height - 0.5) * -10 : 0;
  const rotateY = isHovered ? (mousePosition.x / cardDimensions.width - 0.5) * 10 : 0;
  
  // Calculate glare position
  const glareX = (mousePosition.x / cardDimensions.width) * 100;
  const glareY = (mousePosition.y / cardDimensions.height) * 100;
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden will-change-transform ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX,
        rotateY,
        transition: { type: 'spring', stiffness: 500, damping: 30 }
      }}
    >
      {/* Glare effect */}
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none rounded-[inherit] z-10"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            width: `${glareEffectSize}%`,
            height: `${glareEffectSize}%`,
            left: `${glareX}%`,
            top: `${glareY}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Child content */}
      <motion.div
        className="relative z-0 h-full"
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}