import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PulseButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  pulseColor?: string;
  pulseSize?: number;
  pulseIntensity?: number;
  pulseSpeed?: number;
}

export function PulseButton({
  children,
  onClick,
  className = '',
  variant = 'default',
  size = 'default',
  disabled = false,
  pulseColor = 'rgba(var(--primary), 0.5)',
  pulseSize = 1.6,
  pulseIntensity = 0.8,
  pulseSpeed = 2
}: PulseButtonProps) {
  
  return (
    <div className="relative inline-block">
      <Button 
        onClick={onClick} 
        className={className}
        variant={variant}
        size={size}
        disabled={disabled}
      >
        {children}
      </Button>
      
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ 
            opacity: [0, pulseIntensity, 0],
            scale: [1, pulseSize]
          }}
          transition={{
            duration: pulseSpeed,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut'
          }}
          style={{
            background: pulseColor,
            zIndex: -1
          }}
        />
      )}
    </div>
  );
}