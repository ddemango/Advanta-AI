import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface NeuralNetworkProps {
  className?: string;
  nodeCount?: number;
  activeNodes?: number;
}

interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  connections: number[];
  speed: number;
  direction: [number, number];
}

export function NeuralNetwork({ 
  className = '',
  nodeCount = 30,
  activeNodes = 10
}: NeuralNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize nodes
  useEffect(() => {
    if (!containerRef.current || isInitialized) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    setDimensions({ width: rect.width, height: rect.height });
    
    // Create initial nodes
    const initialNodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const node: Node = {
        id: i,
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        size: Math.random() * 3 + 2,
        color: getRandomBlueColor(),
        connections: [],
        speed: Math.random() * 0.5 + 0.1,
        direction: [Math.random() * 2 - 1, Math.random() * 2 - 1]
      };
      initialNodes.push(node);
    }
    
    // Create connections between nodes
    initialNodes.forEach(node => {
      // Connect each node to 2-4 other random nodes
      const connectionCount = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < connectionCount; i++) {
        let targetId;
        do {
          targetId = Math.floor(Math.random() * nodeCount);
        } while (targetId === node.id || node.connections.includes(targetId));
        
        node.connections.push(targetId);
      }
    });
    
    setNodes(initialNodes);
    setIsInitialized(true);
  }, [nodeCount, isInitialized]);
  
  // Track mouse position
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Update nodes position
  useEffect(() => {
    if (nodes.length === 0) return;
    
    const interval = setInterval(() => {
      setNodes(prevNodes => {
        return prevNodes.map(node => {
          // Move nodes
          let newX = node.x + node.direction[0] * node.speed;
          let newY = node.y + node.direction[1] * node.speed;
          
          // Bounce off walls
          if (newX < 0 || newX > dimensions.width) {
            node.direction[0] *= -1;
            newX = node.x + node.direction[0] * node.speed;
          }
          
          if (newY < 0 || newY > dimensions.height) {
            node.direction[1] *= -1;
            newY = node.y + node.direction[1] * node.speed;
          }
          
          return {
            ...node,
            x: newX,
            y: newY
          };
        });
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, [nodes, dimensions]);
  
  // Helper function to generate random blue colors
  function getRandomBlueColor() {
    const hue = Math.random() * 40 + 180; // 180-220 - blue range
    const saturation = Math.random() * 20 + 80; // 80-100%
    const lightness = Math.random() * 20 + 50; // 50-70%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  
  // Find nodes close to mouse position
  const activeNodeIds = React.useMemo(() => {
    if (nodes.length === 0) return new Set<number>();
    
    // Calculate distances
    const distances = nodes.map(node => {
      const dx = node.x - mousePosition.x;
      const dy = node.y - mousePosition.y;
      return {
        id: node.id,
        distance: Math.sqrt(dx * dx + dy * dy)
      };
    });
    
    // Sort by distance and get the closest 'activeNodes' number of nodes
    const closest = distances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, activeNodes)
      .map(n => n.id);
    
    return new Set(closest);
  }, [nodes, mousePosition, activeNodes]);
  
  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <svg className="w-full h-full">
        {/* Connection lines */}
        {nodes.map(node => 
          node.connections.map(targetId => {
            const targetNode = nodes.find(n => n.id === targetId);
            if (!targetNode) return null;
            
            const isActive = 
              activeNodeIds.has(node.id) || 
              activeNodeIds.has(targetId);
            
            return (
              <motion.line
                key={`${node.id}-${targetId}`}
                x1={node.x}
                y1={node.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={isActive ? "rgba(100, 200, 255, 0.6)" : "rgba(100, 150, 200, 0.15)"}
                strokeWidth={isActive ? 1.5 : 0.5}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              />
            );
          })
        )}
        
        {/* Nodes */}
        {nodes.map(node => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={activeNodeIds.has(node.id) ? node.size * 2 : node.size}
            fill={activeNodeIds.has(node.id) ? "#60DFFF" : node.color}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: activeNodeIds.has(node.id) ? 1 : 0.7,
              scale: activeNodeIds.has(node.id) ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              duration: 1,
              repeat: activeNodeIds.has(node.id) ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
        ))}
      </svg>
    </div>
  );
}