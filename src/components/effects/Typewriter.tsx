"use client";

import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  delay?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 50, className = '', delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, speed);

    return () => clearInterval(typing);
  }, [text, speed, started]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-cursor-blink border-r-2 border-current ml-1"></span>
    </span>
  );
};

export default Typewriter;
