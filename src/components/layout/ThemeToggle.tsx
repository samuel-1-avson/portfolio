"use client";

import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check local storage or preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="w-8 h-8 flex items-center justify-center border border-[var(--retro-border)] bg-transparent hover:border-green-500 transition-colors"
      aria-label="Toggle Theme"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {/* Simple contrast/theme icon */}
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        className="text-[var(--retro-fg)]"
      >
        <circle 
          cx="8" 
          cy="8" 
          r="6" 
          stroke="currentColor" 
          strokeWidth="1.5"
          fill="none"
        />
        <path 
          d="M8 2 L8 14 A6 6 0 0 1 8 2" 
          fill="currentColor"
        />
      </svg>
    </button>
  );
};

export default ThemeToggle;
