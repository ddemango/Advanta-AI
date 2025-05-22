import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  particleColors?: string[];
  showConnections?: boolean;
  maxConnectionDistance?: number;
}

export default function ParticleBackground({
  className = '',
  particleCount = 50,
  particleColors = ['#6d28d9', '#9333ea', '#4f46e5', '#2563eb', '#7c3aed'],
  showConnections = true,
  maxConnectionDistance = 150
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationFrameId = useRef<number>(0);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Initialize particles
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const { width, height } = canvas.getBoundingClientRect();
        
        canvas.width = width;
        canvas.height = height;
        
        setDimensions({ width, height });
        
        // Create new particles when dimensions update
        const newParticles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
          newParticles.push(createParticle(width, height, particleColors));
        }
        setParticles(newParticles);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [particleCount, particleColors]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        mousePosition.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || particles.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Draw and update particles
      const updatedParticles = particles.map(particle => {
        // Update position
        let x = particle.x + particle.speedX;
        let y = particle.y + particle.speedY;
        
        // Boundary check
        if (x < 0 || x > dimensions.width) {
          particle.speedX *= -1;
          x = particle.x + particle.speedX;
        }
        
        if (y < 0 || y > dimensions.height) {
          particle.speedY *= -1;
          y = particle.y + particle.speedY;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // Return updated particle
        return {
          ...particle,
          x,
          y
        };
      });
      
      // Draw connections between particles
      if (showConnections) {
        for (let i = 0; i < updatedParticles.length; i++) {
          for (let j = i + 1; j < updatedParticles.length; j++) {
            const dx = updatedParticles[i].x - updatedParticles[j].x;
            const dy = updatedParticles[i].y - updatedParticles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxConnectionDistance) {
              const opacity = 1 - (distance / maxConnectionDistance);
              ctx.beginPath();
              ctx.moveTo(updatedParticles[i].x, updatedParticles[i].y);
              ctx.lineTo(updatedParticles[j].x, updatedParticles[j].y);
              ctx.strokeStyle = `rgba(125, 58, 237, ${opacity * 0.15})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        
        // Draw connections to mouse
        for (let i = 0; i < updatedParticles.length; i++) {
          const dx = updatedParticles[i].x - mousePosition.current.x;
          const dy = updatedParticles[i].y - mousePosition.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxConnectionDistance * 1.5) {
            const opacity = 1 - (distance / (maxConnectionDistance * 1.5));
            ctx.beginPath();
            ctx.moveTo(updatedParticles[i].x, updatedParticles[i].y);
            ctx.lineTo(mousePosition.current.x, mousePosition.current.y);
            ctx.strokeStyle = `rgba(125, 58, 237, ${opacity * 0.3})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      
      setParticles(updatedParticles);
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [particles, dimensions, showConnections, maxConnectionDistance]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-blue-900/20"
        animate={{
          background: [
            'linear-gradient(135deg, rgba(76, 29, 149, 0.15) 0%, rgba(91, 33, 182, 0.15) 50%, rgba(30, 64, 175, 0.15) 100%)',
            'linear-gradient(135deg, rgba(30, 64, 175, 0.15) 0%, rgba(76, 29, 149, 0.15) 50%, rgba(124, 58, 237, 0.15) 100%)',
            'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(30, 64, 175, 0.15) 50%, rgba(76, 29, 149, 0.15) 100%)',
            'linear-gradient(135deg, rgba(76, 29, 149, 0.15) 0%, rgba(91, 33, 182, 0.15) 50%, rgba(30, 64, 175, 0.15) 100%)',
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

// Helper function to create a particle
function createParticle(width: number, height: number, colors: string[]): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.5 + 0.2,
    color: colors[Math.floor(Math.random() * colors.length)]
  };
}