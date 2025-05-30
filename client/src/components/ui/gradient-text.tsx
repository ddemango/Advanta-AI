import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function GradientText({ children, className = '', style }: GradientTextProps) {
  return (
    <span 
      className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-primary to-indigo-600 font-bold uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[65px] animate-gradient-x bg-[length:200%_200%]"
      style={style}
    >
      {children}
    </span>
  );
}
