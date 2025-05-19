import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  className?: string;
}

export function AiTypingAnimation({ className = '' }: TypingAnimationProps) {
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
        <div className="bg-gradient-to-r from-primary to-accent p-1 rounded shadow-lg shadow-primary/20">
          <div className="bg-background px-4 py-2 rounded">
            <span className="text-base font-mono font-medium text-white flex items-center">
              <span className="text-primary mr-2 text-lg">AI:</span>
              {text}
              <span className="animate-pulse ml-1 text-primary">_</span>
            </span>
          </div>
        </div>
        <div className="ml-2 h-3 w-3 rounded-full bg-primary animate-ping"></div>
      </div>
    </div>
  );
}