import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientText } from './gradient-text';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
  loadingDuration?: number; // Duration in milliseconds
}

export function LoadingScreen({ 
  isLoading, 
  onLoadingComplete,
  loadingDuration = 3000
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const animationRef = useRef<number | null>(null);
  
  // Initialize and animate ML visualization
  useEffect(() => {
    if (!isLoading) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup canvas
    const resize = () => {
      if (!canvas) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Recreate nodes when canvas size changes
      initializeNodes();
    };
    
    // Create nodes for visualization
    const initializeNodes = () => {
      const nodeCount = Math.floor((canvas.width * canvas.height) / 20000); // Adjust node density
      const nodes: Node[] = [];
      
      // Create nodes
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 2,
          color: getRandomColor(),
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          type: Math.random() > 0.7 ? 'input' : Math.random() > 0.5 ? 'hidden' : 'output',
          activation: 0,
          activationTarget: 0,
          activationSpeed: Math.random() * 0.05 + 0.01,
          phase: Math.random() * Math.PI * 2
        });
      }
      
      nodesRef.current = nodes;
      
      // Create connections between nodes
      const connections: Connection[] = [];
      
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Connect input to hidden, hidden to hidden, and hidden to output
        if (node.type === 'input' || node.type === 'hidden') {
          // Each node connects to 1-3 other nodes
          const connectionCount = Math.floor(Math.random() * 3) + 1;
          
          for (let j = 0; j < connectionCount; j++) {
            // Find a random target node of the right type
            const targetType = node.type === 'input' ? 'hidden' : Math.random() > 0.5 ? 'hidden' : 'output';
            const potentialTargets = nodes.filter(n => n.type === targetType && n !== node);
            
            if (potentialTargets.length > 0) {
              const target = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
              
              // Create connection
              connections.push({
                source: i,
                target: nodes.indexOf(target),
                weight: Math.random() * 0.8 + 0.2,
                signal: 0,
                signalSpeed: Math.random() * 0.1 + 0.02,
                active: false,
                activationTime: 0
              });
            }
          }
        }
      }
      
      connectionsRef.current = connections;
    };
    
    // Get a random color in blue/purple/cyan range
    const getRandomColor = () => {
      const hue = Math.random() * 60 + 190; // 190-250: blue to purple
      const saturation = Math.random() * 30 + 70; // 70-100%
      const lightness = Math.random() * 20 + 60; // 60-80%
      
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };
    
    // Activate random input nodes to start signals flowing
    const activateRandomNodes = () => {
      const nodes = nodesRef.current;
      const inputNodes = nodes.filter(node => node.type === 'input');
      
      // Activate 1-3 random input nodes
      const count = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < count; i++) {
        if (inputNodes.length > 0) {
          const randomIndex = Math.floor(Math.random() * inputNodes.length);
          const node = inputNodes[randomIndex];
          
          node.activationTarget = 1; // Full activation
          
          // Remove this node so we don't activate it again
          inputNodes.splice(randomIndex, 1);
        }
      }
    };
    
    // Propagate signals through the network
    const propagateSignals = () => {
      const nodes = nodesRef.current;
      const connections = connectionsRef.current;
      
      // Update node activations
      for (const node of nodes) {
        if (Math.abs(node.activation - node.activationTarget) > 0.01) {
          node.activation += (node.activationTarget - node.activation) * node.activationSpeed;
        } else {
          node.activation = node.activationTarget;
          
          // Reset activation for non-output nodes after they fire
          if (node.type !== 'output' && node.activationTarget > 0.5) {
            node.activationTarget = 0;
          }
        }
      }
      
      // Propagate signals along connections
      for (const connection of connections) {
        const sourceNode = nodes[connection.source];
        const targetNode = nodes[connection.target];
        
        // If source node is active enough, start a signal
        if (sourceNode.activation > 0.7 && !connection.active) {
          connection.active = true;
          connection.signal = 0;
          connection.activationTime = performance.now();
          
          // Target node will activate when signal arrives
          targetNode.activationTarget = connection.weight;
        }
        
        // Progress existing signals
        if (connection.active) {
          connection.signal += connection.signalSpeed;
          
          // Signal reached end of connection
          if (connection.signal >= 1) {
            connection.active = false;
          }
        }
      }
    };
    
    // Draw the network
    const drawNetwork = () => {
      if (!ctx || !canvas) return;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const nodes = nodesRef.current;
      const connections = connectionsRef.current;
      
      // Draw connections first (underneath nodes)
      for (const connection of connections) {
        const sourceNode = nodes[connection.source];
        const targetNode = nodes[connection.target];
        
        // Draw connection line
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        
        // Style based on whether the connection is active
        if (connection.active) {
          // Gradient for active connection
          const gradient = ctx.createLinearGradient(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
          gradient.addColorStop(0, 'rgba(0, 200, 255, 0.8)');
          
          // Ensure signal value is within valid range (0-1)
          const safeSignal = Math.min(0.99, Math.max(0, connection.signal));
          gradient.addColorStop(safeSignal, 'rgba(0, 200, 255, 0.8)');
          
          // Ensure the next stop is also within range and greater than the previous
          const nextStop = Math.min(0.999, Math.max(safeSignal + 0.01, 0.01));
          gradient.addColorStop(nextStop, 'rgba(0, 120, 255, 0.2)');
          
          gradient.addColorStop(1, 'rgba(0, 120, 255, 0.2)');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
        } else {
          // Inactive connection
          ctx.strokeStyle = 'rgba(100, 120, 255, 0.15)';
          ctx.lineWidth = 0.5;
        }
        
        ctx.stroke();
      }
      
      // Draw nodes
      for (const node of nodes) {
        // Move node position slightly for dynamic effect
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < node.radius || node.x > canvas.width - node.radius) {
          node.vx *= -1;
        }
        
        if (node.y < node.radius || node.y > canvas.height - node.radius) {
          node.vy *= -1;
        }
        
        // Keep nodes within bounds
        node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(canvas.height - node.radius, node.y));
        
        // Draw glow for active nodes
        if (node.activation > 0.1) {
          const glow = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, node.radius * 5
          );
          
          const alpha = node.activation * 0.5;
          glow.addColorStop(0, `rgba(100, 200, 255, ${alpha})`);
          glow.addColorStop(1, 'rgba(100, 200, 255, 0)');
          
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * (1 + node.activation * 0.5), 0, Math.PI * 2);
        
        // Color based on node type and activation
        if (node.type === 'input') {
          ctx.fillStyle = `rgba(0, 200, 255, ${0.5 + node.activation * 0.5})`;
        } else if (node.type === 'hidden') {
          ctx.fillStyle = `rgba(100, 100, 255, ${0.5 + node.activation * 0.5})`;
        } else { // output
          ctx.fillStyle = `rgba(200, 100, 255, ${0.5 + node.activation * 0.5})`;
        }
        
        ctx.fill();
      }
    };
    
    // Main animation loop
    const animate = () => {
      // Occasionally activate random input nodes
      if (Math.random() < 0.03) {
        activateRandomNodes();
      }
      
      // Update network state
      propagateSignals();
      
      // Draw network
      drawNetwork();
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Initialize everything
    resize();
    window.addEventListener('resize', resize);
    animate();
    
    // Fake loading progress
    const startTime = performance.now();
    const updateProgress = () => {
      const elapsed = performance.now() - startTime;
      const newProgress = Math.min(100, (elapsed / loadingDuration) * 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        setTimeout(updateProgress, 50);
      } else {
        // Loading complete
        setTimeout(() => {
          setIsComplete(true);
          if (onLoadingComplete) {
            onLoadingComplete();
          }
        }, 500);
      }
    };
    
    updateProgress();
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLoading, loadingDuration, onLoadingComplete]);
  
  return (
    <AnimatePresence>
      {isLoading && !isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
          
          <div className="relative z-10 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-black">
                <GradientText>Advanta AI</GradientText>
              </h1>
              <p className="text-white/60 text-center mt-2">
                Loading Resources
              </p>
            </motion.div>
            
            {/* Progress indicator */}
            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Status text */}
            <div className="text-white/70 text-sm mt-4 font-mono">
              {progress < 30 ? "Loading assets..." :
               progress < 60 ? "Preparing resources..." :
               progress < 90 ? "Optimizing content..." :
               "Almost ready..."}
            </div>
            
            {/* Moving data points */}
            <div className="relative mt-12 w-64 h-16">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-blue-400"
                  animate={{
                    x: [0, 260],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "linear"
                  }}
                  style={{
                    top: `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Types for the neural network visualization
interface Node {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  type: 'input' | 'hidden' | 'output';
  activation: number;
  activationTarget: number;
  activationSpeed: number;
  phase: number;
}

interface Connection {
  source: number;
  target: number;
  weight: number;
  signal: number;
  signalSpeed: number;
  active: boolean;
  activationTime: number;
}