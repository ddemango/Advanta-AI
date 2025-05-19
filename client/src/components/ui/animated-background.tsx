import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  className?: string;
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  // Default z-index is -1, but we need to increase it to ensure it's visible on all pages
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      ctx.scale(1, 1);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Background elements configuration - increased count for more visible animation
    const particles: Particle[] = [];
    const flows: Flow[] = [];
    const particleCount = 120;
    const flowCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        color: getRandomColor(0.3),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        pulse: Math.random() * 0.05 + 0.01,
        offset: Math.random() * Math.PI * 2
      });
    }
    
    // Create flowing elements
    for (let i = 0; i < flowCount; i++) {
      const points: Point[] = [];
      const pointCount = Math.floor(Math.random() * 3) + 3;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      for (let j = 0; j < pointCount; j++) {
        points.push({
          x: x + (Math.random() * 300 - 150),
          y: y + (Math.random() * 300 - 150)
        });
      }
      
      flows.push({
        points,
        color: getRandomColor(0.15),
        width: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.002 + 0.001,
        progress: 0
      });
    }
    
    function getRandomColor(alpha: number): string {
      const hue = Math.random() * 60 + 210; // 210-270 range (blues and purples)
      return `hsla(${hue}, 80%, 60%, ${alpha})`;
    }
    
    // Animation loop
    let animationId: number;
    
    const animate = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw flowing elements
      for (const flow of flows) {
        flow.progress += flow.speed;
        if (flow.progress > 1) flow.progress = 0;
        
        drawFlowingLine(ctx, flow);
      }
      
      // Update and draw particles
      const timestamp = performance.now() / 1000;
      for (const particle of particles) {
        // Move particles
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary checks with wrap-around
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;
        
        // Pulsing effect
        const brightness = 0.5 + 0.5 * Math.sin(timestamp * particle.pulse + particle.offset);
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.3', (0.1 + brightness * 0.2).toString());
        ctx.fill();
      }
      
      // Draw gradient areas
      drawGradientAreas(ctx, canvas.width, canvas.height, timestamp);
      
      animationId = requestAnimationFrame(animate);
    };
    
    // Draw flowing curved lines
    function drawFlowingLine(ctx: CanvasRenderingContext2D, flow: Flow) {
      if (flow.points.length < 2) return;
      
      ctx.beginPath();
      
      const progressPoints = getProgressPoints(flow.points, flow.progress);
      ctx.moveTo(progressPoints[0].x, progressPoints[0].y);
      
      // Create a smooth curve through all points
      for (let i = 1; i < progressPoints.length; i++) {
        const xc = (progressPoints[i-1].x + progressPoints[i].x) / 2;
        const yc = (progressPoints[i-1].y + progressPoints[i].y) / 2;
        ctx.quadraticCurveTo(progressPoints[i-1].x, progressPoints[i-1].y, xc, yc);
      }
      
      // Style and draw
      ctx.strokeStyle = flow.color;
      ctx.lineWidth = flow.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    
    // Get points along the progress of the flow
    function getProgressPoints(points: Point[], progress: number): Point[] {
      // Create a circular path by connecting back to the start
      const fullPath = [...points];
      if (points.length > 0) {
        fullPath.push(points[0]);
      }
      
      const totalLength = calculatePathLength(fullPath);
      let currentLength = 0;
      const progressLength = totalLength * progress;
      
      const result: Point[] = [];
      result.push(fullPath[0]); // Always include the first point
      
      for (let i = 1; i < fullPath.length; i++) {
        const start = fullPath[i-1];
        const end = fullPath[i];
        
        const segmentLength = Math.sqrt(
          Math.pow(end.x - start.x, 2) + 
          Math.pow(end.y - start.y, 2)
        );
        
        if (currentLength + segmentLength >= progressLength) {
          const remainingLength = progressLength - currentLength;
          const ratio = remainingLength / segmentLength;
          
          const x = start.x + (end.x - start.x) * ratio;
          const y = start.y + (end.y - start.y) * ratio;
          
          result.push({ x, y });
          break;
        }
        
        result.push(end);
        currentLength += segmentLength;
      }
      
      return result;
    }
    
    // Calculate the total length of a path
    function calculatePathLength(points: Point[]): number {
      let totalLength = 0;
      
      for (let i = 1; i < points.length; i++) {
        const start = points[i-1];
        const end = points[i];
        
        totalLength += Math.sqrt(
          Math.pow(end.x - start.x, 2) + 
          Math.pow(end.y - start.y, 2)
        );
      }
      
      return totalLength;
    }
    
    // Draw subtle gradient areas
    function drawGradientAreas(ctx: CanvasRenderingContext2D, width: number, height: number, timestamp: number) {
      // Draw a few large gradient areas that slowly move
      const gradientAreas = [
        { 
          x: width * 0.2 + Math.sin(timestamp * 0.1) * width * 0.05, 
          y: height * 0.3 + Math.cos(timestamp * 0.08) * height * 0.05, 
          radius: width * 0.4,
          color1: 'rgba(30, 90, 180, 0.03)',
          color2: 'rgba(30, 90, 180, 0)'
        },
        { 
          x: width * 0.7 + Math.cos(timestamp * 0.12) * width * 0.05, 
          y: height * 0.6 + Math.sin(timestamp * 0.09) * height * 0.05, 
          radius: width * 0.35,
          color1: 'rgba(100, 70, 200, 0.02)',
          color2: 'rgba(100, 70, 200, 0)'
        },
        { 
          x: width * 0.5 + Math.sin(timestamp * 0.07) * width * 0.1, 
          y: height * 0.8 + Math.cos(timestamp * 0.06) * height * 0.05, 
          radius: width * 0.3,
          color1: 'rgba(60, 130, 200, 0.025)',
          color2: 'rgba(60, 130, 200, 0)'
        }
      ];
      
      for (const area of gradientAreas) {
        try {
          const gradient = ctx.createRadialGradient(
            area.x, area.y, 0,
            area.x, area.y, area.radius
          );
          
          // Ensure color stops are within valid range (0-1)
          gradient.addColorStop(0, area.color1);
          gradient.addColorStop(0.99, area.color2);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(area.x, area.y, area.radius, 0, Math.PI * 2);
          ctx.fill();
        } catch (e) {
          // Fallback if gradient fails
          ctx.fillStyle = 'rgba(60, 130, 200, 0.01)';
          ctx.beginPath();
          ctx.arc(area.x, area.y, area.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    // Start animation
    animate();
    
    // Check document height periodically and update canvas if needed
    const checkHeightInterval = setInterval(() => {
      const newHeight = document.documentElement.scrollHeight;
      if (canvas.height !== newHeight) {
        canvas.height = newHeight;
      }
    }, 1000);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
      clearInterval(checkHeightInterval);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}

// Types
interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  pulse: number;
  offset: number;
}

interface Point {
  x: number;
  y: number;
}

interface Flow {
  points: Point[];
  color: string;
  width: number;
  speed: number;
  progress: number;
}