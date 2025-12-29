"use client";

import React, { useEffect, useState, useRef } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: 'fade' | 'slide' | 'glitch' | 'terminal';
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ 
  children, 
  delay = 0, 
  className = '',
  variant = 'slide',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const variants = {
    fade: {
      hidden: 'opacity-0',
      visible: 'opacity-100',
    },
    slide: {
      hidden: 'opacity-0 translate-y-8',
      visible: 'opacity-100 translate-y-0',
    },
    glitch: {
      hidden: 'opacity-0 scale-95',
      visible: 'opacity-100 scale-100',
    },
    terminal: {
      hidden: 'opacity-0 -translate-x-4',
      visible: 'opacity-100 translate-x-0',
    },
  };

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${isVisible ? variants[variant].visible : variants[variant].hidden}
        ${className}
      `}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
