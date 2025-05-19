import React, { useEffect, useRef } from 'react';

interface GradientMeshProps {
  className?: string;
  colorSet?: string[];
  speed?: number;
  density?: number;
}

export function GradientMesh({
  className = '',
  colorSet = ['#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#db2777'],
  speed = 0.005,
  density = 40
}: GradientMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize canvas to match container dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create control points for the mesh
    const numPointsX = Math.ceil(canvas.width / density) + 2;
    const numPointsY = Math.ceil(canvas.height / density) + 2;
    const points: Point[][] = [];
    
    // Initialize points array
    for (let y = 0; y < numPointsY; y++) {
      points[y] = [];
      for (let x = 0; x < numPointsX; x++) {
        points[y][x] = {
          x: x * density,
          y: y * density,
          originX: x * density,
          originY: y * density,
          color: colorSet[Math.floor(Math.random() * colorSet.length)],
          vx: Math.random() * 2 - 1,
          vy: Math.random() * 2 - 1
        };
      }
    }
    
    // Animation variables
    let animationId: number;
    let frameCount = 0;
    
    // Draw gradient mesh
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Move points based on velocity
      for (let y = 0; y < numPointsY; y++) {
        for (let x = 0; x < numPointsX; x++) {
          const point = points[y][x];
          
          // Oscillation around origin point
          point.x = point.originX + Math.sin(frameCount * speed + (x + y) * 0.3) * 20;
          point.y = point.originY + Math.cos(frameCount * speed + (x + y) * 0.3) * 20;
        }
      }
      
      // Draw cells (quads) between points
      for (let y = 0; y < numPointsY - 1; y++) {
        for (let x = 0; x < numPointsX - 1; x++) {
          // Get the four corner points
          const p1 = points[y][x];
          const p2 = points[y][x + 1];
          const p3 = points[y + 1][x + 1];
          const p4 = points[y + 1][x];
          
          // Get corner colors
          const c1 = p1.color;
          const c2 = p2.color;
          const c3 = p3.color;
          const c4 = p4.color;
          
          // Create gradient for the cell
          const gradient = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
          gradient.addColorStop(0, c1 + '33');  // Add alpha transparency
          gradient.addColorStop(0.33, c2 + '33');
          gradient.addColorStop(0.66, c3 + '33');
          gradient.addColorStop(1, c4 + '33');
          
          // Draw the cell
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();
          
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }
      
      frameCount++;
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [colorSet, speed, density]);
  
  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full ${className}`}
      style={{ zIndex: 0, opacity: 0.7 }}
    />
  );
}

// Type definition for a mesh point
interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: string;
  vx: number;
  vy: number;
}