import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AIBrainProps {
  className?: string;
}

export function AIBrain({ className = '' }: AIBrainProps) {
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
    
    // AI Brain configuration
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.15;
    const neurons: Neuron[] = [];
    const synapses: Synapse[] = [];
    const neuronCount = 200;
    const pulses: Pulse[] = [];
    
    // Create neurons
    for (let i = 0; i < neuronCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * baseRadius * 1.8;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const size = Math.random() * 2 + 1;
      
      neurons.push({
        x,
        y,
        size,
        brightness: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
    
    // Create synapses (connections between neurons)
    for (let i = 0; i < neurons.length; i++) {
      const neuron = neurons[i];
      
      // Connect each neuron to a few nearby neurons
      for (let j = 0; j < 3; j++) {
        const targetIndex = (i + 1 + Math.floor(Math.random() * 10)) % neurons.length;
        const target = neurons[targetIndex];
        
        // Calculate distance between neurons
        const dx = target.x - neuron.x;
        const dy = target.y - neuron.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only connect if they're not too far apart
        if (distance < baseRadius * 0.8) {
          synapses.push({
            sourceIndex: i,
            targetIndex: targetIndex,
            activity: Math.random(),
            pulseFrequency: Math.random() * 0.01 + 0.005
          });
        }
      }
    }
    
    // Generate pulses periodically
    const generatePulse = () => {
      // Select a random synapse
      const synapseIndex = Math.floor(Math.random() * synapses.length);
      const synapse = synapses[synapseIndex];
      const source = neurons[synapse.sourceIndex];
      const target = neurons[synapse.targetIndex];
      
      pulses.push({
        x: source.x,
        y: source.y,
        targetX: target.x,
        targetY: target.y,
        progress: 0,
        speed: 0.02 + Math.random() * 0.03,
        color: getRandomColor()
      });
    };
    
    // Generate random pulse colors (blues and cyans)
    function getRandomColor() {
      const hue = 180 + Math.random() * 60; // 180-240: blues and cyans
      return `hsl(${hue}, 100%, 70%)`;
    }
    
    // Animation loop
    let animationId: number;
    let lastPulseTime = 0;
    let pulseInterval = 100; // ms
    
    const animate = (timestamp: number) => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Generate pulses periodically
      if (timestamp - lastPulseTime > pulseInterval) {
        generatePulse();
        lastPulseTime = timestamp;
        pulseInterval = 50 + Math.random() * 200; // Random interval
      }
      
      // Draw synapses
      ctx.lineWidth = 0.5;
      for (const synapse of synapses) {
        const source = neurons[synapse.sourceIndex];
        const target = neurons[synapse.targetIndex];
        
        // Synapse activity level (brightness)
        synapse.activity = 0.1 + 0.2 * Math.sin(timestamp * synapse.pulseFrequency);
        
        // Draw synapse
        ctx.strokeStyle = `rgba(100, 200, 255, ${synapse.activity * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
      
      // Draw neurons
      for (const neuron of neurons) {
        // Calculate neuron brightness using sin wave for pulsing effect
        const brightness = neuron.brightness * (0.6 + 0.4 * Math.sin(timestamp * neuron.pulseSpeed + neuron.pulseOffset));
        
        // Soft glow
        // Ensure we have valid coordinates and size
        if (!isFinite(neuron.x) || !isFinite(neuron.y) || !isFinite(neuron.size)) continue;
        
        try {
          const glow = ctx.createRadialGradient(
            neuron.x, neuron.y, 0,
            neuron.x, neuron.y, neuron.size * 4
          );
          glow.addColorStop(0, `rgba(100, 200, 255, ${Math.min(1, Math.max(0, brightness * 0.8))})`);
          glow.addColorStop(1, 'rgba(100, 200, 255, 0)');
          ctx.fillStyle = glow;
        } catch (e) {
          // Fallback if gradient creation fails
          ctx.fillStyle = `rgba(100, 200, 255, ${Math.min(1, Math.max(0, brightness * 0.5))})`;
        }
        
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, neuron.size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Neuron core
        ctx.fillStyle = `rgba(180, 230, 255, ${brightness})`;
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, neuron.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw and update pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        
        // Update pulse position
        pulse.progress += pulse.speed;
        
        if (pulse.progress >= 1) {
          // Remove completed pulses
          pulses.splice(i, 1);
          continue;
        }
        
        // Calculate current position
        const x = pulse.x + (pulse.targetX - pulse.x) * pulse.progress;
        const y = pulse.y + (pulse.targetY - pulse.y) * pulse.progress;
        
        // Draw pulse
        ctx.fillStyle = pulse.color;
        const size = 3 * (1 - Math.abs(pulse.progress - 0.5) * 2); // Grow and shrink
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Center brain core
      try {
        const coreGlow = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, baseRadius
        );
        coreGlow.addColorStop(0, 'rgba(60, 170, 255, 0.3)');
        coreGlow.addColorStop(0.5, 'rgba(100, 200, 255, 0.1)');
        coreGlow.addColorStop(1, 'rgba(100, 200, 255, 0)');
        ctx.fillStyle = coreGlow;
      } catch (e) {
        // Fallback if gradient creation fails
        ctx.fillStyle = 'rgba(80, 180, 255, 0.15)';
      }
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.fill();
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
    />
  );
}

// Types
interface Neuron {
  x: number;
  y: number;
  size: number;
  brightness: number;
  pulseSpeed: number;
  pulseOffset: number;
}

interface Synapse {
  sourceIndex: number;
  targetIndex: number;
  activity: number;
  pulseFrequency: number;
}

interface Pulse {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  color: string;
}