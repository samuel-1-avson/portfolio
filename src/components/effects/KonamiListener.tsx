"use client";

import { useEffect, useState, useCallback } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 
  'ArrowDown', 'ArrowDown', 
  'ArrowLeft', 'ArrowRight', 
  'ArrowLeft', 'ArrowRight', 
  'KeyB', 'KeyA'
];

interface KonamiListenerProps {
  onActivate?: () => void;
}

const KonamiListener: React.FC<KonamiListenerProps> = ({ onActivate }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const triggerUltraMode = useCallback(() => {
    setActivated(true);
    setShowNotification(true);
    
    // Add ultra mode class to body
    document.body.classList.add('ultra-mode');
    
    // Create rainbow matrix effect
    const canvas = document.createElement('canvas');
    canvas.id = 'konami-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const chars = '01アイウエオカキクケコ';
      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);
      const drops: number[] = Array(columns).fill(1);
      
      let animationId: number;
      let startTime = Date.now();
      
      const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const elapsed = (Date.now() - startTime) / 1000;
        
        drops.forEach((y, i) => {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const hue = (elapsed * 50 + i * 10) % 360;
          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(char, i * fontSize, y * fontSize);
          
          if (y * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        });
        
        // Stop after 10 seconds
        if (elapsed < 10) {
          animationId = requestAnimationFrame(draw);
        } else {
          canvas.remove();
          document.body.classList.remove('ultra-mode');
          setActivated(false);
        }
      };
      
      draw();
    }
    
    // Hide notification after 3 seconds
    setTimeout(() => setShowNotification(false), 3000);
    
    onActivate?.();
  }, [onActivate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.code;
      
      setSequence(prev => {
        const newSequence = [...prev, key].slice(-KONAMI_CODE.length);
        
        // Check if sequence matches
        if (newSequence.join(',') === KONAMI_CODE.join(',') && !activated) {
          triggerUltraMode();
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activated, triggerUltraMode]);

  if (!showNotification) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] pointer-events-none">
      <div className="bg-black/90 border-2 border-[var(--terminal-green)] px-8 py-6 font-mono text-center animate-pulse">
        <div className="text-2xl text-[var(--terminal-green)] mb-2">
          🎮 ULTRA MODE ACTIVATED 🎮
        </div>
        <div className="text-sm text-[var(--terminal-cyan)]">
          ↑↑↓↓←→←→BA
        </div>
        <div className="text-xs text-[var(--retro-fg)]/50 mt-2">
          +100 XP | ACHIEVEMENT_UNLOCKED
        </div>
      </div>
    </div>
  );
};

export default KonamiListener;
