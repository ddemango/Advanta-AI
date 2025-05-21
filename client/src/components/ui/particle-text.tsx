import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface ParticleTextProps {
  text: string;
  className?: string;
  fontSize?: number;
  color?: string;
}

interface Particle {
  x: number;
  y: number;
  destX: number;
  destY: number;
  size: number;
  color: string;
}

export function ParticleText({ 
  text, 
  className = '', 
  fontSize = 40, 
  color = '#ffffff'
}: ParticleTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(containerRef, { once: false, amount: 0.3 });
  const controls = useAnimation();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Generate particles from text
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const container = containerRef.current;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    // Set up text
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text to extract pixels
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.fillText(text, centerX, centerY);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Sample pixels to create particles
    const particlesArray: Particle[] = [];
    const gap = 4; // Sample every 4 pixels
    
    for (let y = 0; y < canvas.height; y += gap) {
      for (let x = 0; x < canvas.width; x += gap) {
        const index = (y * canvas.width + x) * 4;
        if (data[index + 3] > 128) { // If pixel is not fully transparent
          const size = Math.random() * 2 + 1;
          
          // Random starting position
          const startX = Math.random() * canvas.width;
          const startY = Math.random() * canvas.height;
          
          // Destination position (where the particle forms the text)
          const destX = x;
          const destY = y;
          
          particlesArray.push({
            x: startX,
            y: startY,
            destX,
            destY,
            size,
            color
          });
        }
      }
    }
    
    setParticles(particlesArray);
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [text, fontSize, color]);
  
  // Animate particles
  useEffect(() => {
    if (!canvasRef.current || particles.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let progress = 0;
    const duration = 60; // Number of frames for animation
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const particle of particles) {
        // During formation animation
        if (inView && progress < duration) {
          // Ease particles to their destination
          particle.x += (particle.destX - particle.x) * 0.08;
          particle.y += (particle.destY - particle.y) * 0.08;
        }
        // During scatter animation
        else if (!inView && progress < duration) {
          // Scatter particles randomly
          particle.x += (Math.random() * 10 - 5);
          particle.y += (Math.random() * 10 - 5);
          
          // Keep particles within canvas
          if (particle.x < 0 || particle.x > canvas.width) particle.x = Math.random() * canvas.width;
          if (particle.y < 0 || particle.y > canvas.height) particle.y = Math.random() * canvas.height;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      }
      
      if (progress < duration) {
        progress++;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    // Trigger animation when inView changes
    if (inView !== isAnimating) {
      progress = 0;
      setIsAnimating(inView);
    }
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [particles, inView, isAnimating]);
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full" 
        style={{ zIndex: 1 }}
      />
      <motion.div 
        className="opacity-0"
        animate={{ opacity: inView ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`invisible text-center`} style={{ fontSize: `${fontSize}px` }}>
          {text}
        </div>
      </motion.div>
    </div>
  );
}