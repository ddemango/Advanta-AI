import React, { useEffect, useRef } from 'react';

interface DigitalRainProps {
  className?: string;
}

export function DigitalRain({ className = '' }: DigitalRainProps) {
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
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Digital rain configuration
    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = [];
    
    // Initialize drop positions
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height);
    }
    
    // Characters to display
    const getRandomChar = () => {
      const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
      return chars.charAt(Math.floor(Math.random() * chars.length));
    };
    
    // Animation function
    const draw = () => {
      // Add semi-transparent black to give trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < drops.length; i++) {
        // Get random character
        const text = getRandomChar();
        
        // Generate different green hues for variety
        const green = Math.floor(Math.random() * 100) + 155;
        ctx.fillStyle = `rgba(0, ${green}, ${green/2}, 0.8)`;
        ctx.font = '16px monospace';
        
        // Draw character
        ctx.fillText(text, i * 20, drops[i] * 20);
        
        // Move drop down
        drops[i]++;
        
        // Reset drop if it's off screen or randomly
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    };
    
    // Run animation
    const interval = setInterval(draw, 80);
    
    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full absolute top-0 left-0 ${className}`}
      style={{ zIndex: 5, opacity: 0.4 }}
    />
  );
}