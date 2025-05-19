import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  className?: string;
  children: React.ReactNode;
  hoverEffect?: boolean;
  depth?: number;
  borderColor?: string;
}

export function GlassCard({
  children,
  className = '',
  hoverEffect = true,
  depth = 20,
  borderColor = 'rgba(255, 255, 255, 0.1)'
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverEffect || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    
    // Calculate rotation based on mouse position
    const rotateYValue = ((e.clientX - cardCenterX) / (rect.width / 2)) * (depth / 2);
    const rotateXValue = ((e.clientY - cardCenterY) / (rect.height / 2)) * (depth / 2) * -1;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setScale(1.02);
  };
  
  const handleMouseLeave = () => {
    if (!hoverEffect) return;
    
    // Reset card rotation and scale
    setRotateX(0);
    setRotateY(0);
    setScale(1);
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-xl backdrop-blur-md overflow-hidden ${className}`}
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        border: `1px solid ${borderColor}`,
        transformStyle: 'preserve-3d',
        transition: 'box-shadow 0.3s ease',
        boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 200, 255, 0.1) inset'
      }}
      animate={{
        rotateX,
        rotateY,
        scale
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glare effect */}
      <motion.div
        className="absolute inset-0 w-full h-full z-[1]"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.05) 45%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 55%, transparent 60%)',
          backgroundSize: '200% 100%',
          backgroundPosition: 'right',
          mixBlendMode: 'overlay'
        }}
        animate={{
          backgroundPosition: rotateY > 0 ? 'right' : 'left'
        }}
        transition={{
          duration: 0.5
        }}
      />
      
      {/* Inner border glow */}
      <div 
        className="absolute inset-0 rounded-xl opacity-30"
        style={{
          boxShadow: '0 0 15px 1px rgba(0, 180, 230, 0.4) inset',
          pointerEvents: 'none'
        }}
      />
      
      {/* Content container with 3D transform */}
      <div className="relative z-10 h-full" style={{ transform: 'translateZ(10px)' }}>
        {children}
      </div>
    </motion.div>
  );
}