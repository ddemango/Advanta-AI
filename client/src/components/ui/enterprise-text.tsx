import React from 'react';
import { motion } from 'framer-motion';
import { GradientText } from './gradient-text';

interface EnterpriseTextProps {
  text: string;
  className?: string;
  fontSize?: number;
  highlight?: boolean;
}

export function EnterpriseText({ 
  text, 
  className = '', 
  fontSize = 64,
  highlight = true
}: EnterpriseTextProps) {
  
  return (
    <div className={`${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        {highlight ? (
          <GradientText className="font-bold" style={{fontSize: `${fontSize}px`}}>
            {text}
          </GradientText>
        ) : (
          <span className="font-bold" style={{fontSize: `${fontSize}px`}}>
            {text}
          </span>
        )}
      </motion.div>
    </div>
  );
}