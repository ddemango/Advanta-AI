import { useState, useRef, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glareColor?: string;
  tiltAmount?: number;
  glareAmount?: number;
  scale?: number;
  speed?: number;
}

export function TiltCard({
  children,
  className = '',
  glareColor = 'rgba(255, 255, 255, 0.4)',
  tiltAmount = 10, // Max tilt rotation in degrees
  glareAmount = 0.5, // Max glare opacity
  scale = 1.03, // Scale on hover
  speed = 500, // Transition speed
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Motion values for tracking mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring physics for smooth animation
  const springConfig = { damping: 15, stiffness: 150 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  
  // Glare effect
  const glareX = useSpring(useMotionValue(0), springConfig);
  const glareY = useSpring(useMotionValue(0), springConfig);
  const glareOpacity = useTransform(
    mouseY,
    [-tiltAmount, 0, tiltAmount],
    [0, glareAmount, 0]
  );
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card center (in -1 to 1 range)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);
    
    // Set rotation values (inverted for natural tilt feel)
    rotateX.set(-percentY * tiltAmount);
    rotateY.set(percentX * tiltAmount);
    
    // Set glare position
    glareX.set(e.clientX - rect.left);
    glareY.set(e.clientY - rect.top);
  };
  
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      animate={{
        scale: isHovering ? scale : 1,
      }}
      transition={{
        duration: speed / 1000,
      }}
    >
      {/* Animated glare effect */}
      {isHovering && (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glareX}px ${glareY}px, ${glareColor}, transparent 40%)`,
            opacity: glareOpacity,
          }}
        />
      )}
      
      {/* Main content with 3D effect */}
      <motion.div
        style={{
          transform: 'translateZ(20px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}