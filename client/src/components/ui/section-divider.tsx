import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SectionDividerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'wave' | 'angle' | 'curve' | 'triangle';
  flip?: boolean;
  color?: string;
  height?: number;
}

export function SectionDivider({ 
  variant = 'wave', 
  flip = false, 
  color = 'currentColor',
  height = 80,
  className,
  ...props 
}: SectionDividerProps) {
  
  const getPath = () => {
    switch (variant) {
      case 'wave':
        return (
          <path 
            d="M0,32L48,48C96,64,192,96,288,96C384,96,480,64,576,80C672,96,768,160,864,176C960,192,1056,160,1152,128C1248,96,1344,64,1392,48L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill={color}
            fillOpacity="0.3"
          />
        );
      case 'angle':
        return (
          <path 
            d="M0,0L1440,64L1440,0L0,0Z" 
            fill={color}
            fillOpacity="0.3"
          />
        );
      case 'curve':
        return (
          <path 
            d="M0,0C240,96,480,144,720,144C960,144,1200,96,1440,0L1440,0L0,0Z" 
            fill={color}
            fillOpacity="0.3"
          />
        );
      case 'triangle':
        return (
          <path 
            d="M720,100L1440,0L0,0Z" 
            fill={color}
            fillOpacity="0.3"
          />
        );
      default:
        return (
          <path 
            d="M0,32L48,48C96,64,192,96,288,96C384,96,480,64,576,80C672,96,768,160,864,176C960,192,1056,160,1152,128C1248,96,1344,64,1392,48L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill={color}
            fillOpacity="0.3"
          />
        );
    }
  };
  
  return (
    <div 
      className={cn("absolute left-0 right-0 overflow-hidden z-10", 
        flip ? "bottom-0 transform rotate-180" : "top-0", 
        className
      )}
      style={{ height: `${height}px` }}
      {...props}
    >
      <motion.svg 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        preserveAspectRatio="none" 
        width="100%" 
        height="100%" 
        viewBox="0 0 1440 320"
      >
        {getPath()}
      </motion.svg>
    </div>
  );
}