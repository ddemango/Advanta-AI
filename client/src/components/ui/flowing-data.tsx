import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FlowingDataProps {
  className?: string;
}

export function FlowingData({ className = '' }: FlowingDataProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full size
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      // Reset transformation
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Flow lines configuration
    const flowLines: FlowLine[] = [];
    const flowLineCount = 25;
    
    // Create flow lines
    for (let i = 0; i < flowLineCount; i++) {
      flowLines.push(createFlowLine(canvas.width, canvas.height));
    }
    
    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw each flow line
      flowLines.forEach(line => {
        updateFlowLine(line, canvas.width, canvas.height);
        drawFlowLine(ctx, line);
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-60"
        style={{ background: 'transparent' }}
      />
    </div>
  );
}

// Types and utility functions
interface Point {
  x: number;
  y: number;
}

interface FlowLine {
  points: Point[];
  color: string;
  speed: number;
  width: number;
  length: number;
  direction: number;
  opacity: number;
}

function createFlowLine(width: number, height: number): FlowLine {
  // Random starting position
  const x = Math.random() * width;
  const y = Math.random() * height;
  
  // Generate points
  const pointCount = Math.floor(Math.random() * 3) + 3;
  const points: Point[] = [];
  
  for (let i = 0; i < pointCount; i++) {
    points.push({
      x: x + (Math.random() * 400 - 200),
      y: y + (Math.random() * 400 - 200)
    });
  }
  
  // Random color - blues, cyans, purples
  const hue = Math.random() * 60 + 210; // 210-270 range
  const color = `hsla(${hue}, 100%, 65%, 0.6)`;
  
  return {
    points,
    color,
    speed: Math.random() * 0.5 + 0.1,
    width: Math.random() * 2 + 0.5,
    length: Math.random() * 40 + 20,
    direction: Math.random() > 0.5 ? 1 : -1,
    opacity: Math.random() * 0.5 + 0.3
  };
}

function updateFlowLine(line: FlowLine, width: number, height: number) {
  // Move points
  line.points.forEach(point => {
    // Apply some random movement
    point.x += (Math.random() * 2 - 1) + (line.speed * line.direction);
    point.y += (Math.random() * 2 - 1);
    
    // Boundary check with some padding
    const padding = 100;
    if (point.x < -padding || point.x > width + padding || 
        point.y < -padding || point.y > height + padding) {
      // Reset this point to a new random location
      point.x = Math.random() * width;
      point.y = Math.random() * height;
    }
  });
  
  // Randomly change opacity for pulsing effect with safety bounds
  const opacityDelta = (Math.random() * 0.1 - 0.05);
  const newOpacity = line.opacity + opacityDelta;
  line.opacity = Math.max(0.2, Math.min(0.8, newOpacity));
}

function drawFlowLine(ctx: CanvasRenderingContext2D, line: FlowLine) {
  if (line.points.length < 2) return;
  
  // Start a new path
  ctx.beginPath();
  ctx.moveTo(line.points[0].x, line.points[0].y);
  
  // Create a smooth curve through all points
  for (let i = 1; i < line.points.length; i++) {
    const xc = (line.points[i-1].x + line.points[i].x) / 2;
    const yc = (line.points[i-1].y + line.points[i].y) / 2;
    ctx.quadraticCurveTo(line.points[i-1].x, line.points[i-1].y, xc, yc);
  }
  
  // Style the line
  // Ensure opacity is valid (between 0 and 1)
  const safeOpacity = Math.max(0, Math.min(1, line.opacity));
  ctx.strokeStyle = line.color.replace('0.6', safeOpacity.toString());
  ctx.lineWidth = line.width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // Draw the line
  ctx.stroke();
}