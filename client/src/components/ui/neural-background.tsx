import { motion } from 'framer-motion';

interface NeuralBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function NeuralBackground({ children, className = '' }: NeuralBackgroundProps) {
  return (
    <div className={`relative overflow-hidden neural-bg ${className}`}>
      <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/40 blur-[80px]"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/40 blur-[80px]"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 5,
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
