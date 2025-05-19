import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  className?: string;
}

export function TypingAnimation({ className = '' }: TypingAnimationProps) {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  
  const phrases = [
    'Analyzing data...',
    'Processing insights...',
    'Building models...',
    'Optimizing algorithms...',
    'Enhancing intelligence...'
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentPhrase = phrases[currentPhraseIndex];
    
    if (isTyping) {
      // Typing animation
      if (text.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setText(currentPhrase.substring(0, text.length + 1));
        }, 100 + Math.random() * 50);
      } else {
        // Pause at the end of typing
        timer = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    } else {
      // Deleting animation
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(text.substring(0, text.length - 1));
        }, 50);
      } else {
        // Move to next phrase
        setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
        setIsTyping(true);
      }
    }
    
    return () => clearTimeout(timer);
  }, [text, isTyping, currentPhraseIndex, phrases]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <div className="bg-gradient-to-r from-primary to-accent p-0.5 rounded">
          <div className="bg-background px-3 py-1 rounded">
            <span className="text-sm font-mono">
              {text}
              <span className="animate-pulse">_</span>
            </span>
          </div>
        </div>
        <div className="ml-2 h-2 w-2 rounded-full bg-primary animate-pulse"></div>
      </div>
    </div>
  );
}