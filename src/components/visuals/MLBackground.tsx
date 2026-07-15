"use client";

import { useEffect, useRef } from "react";

const MLBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    let animationId: number;
    let time = 0;
    let lastFrame = 0;
    let isVisible = !document.hidden;

    // Data storage
    const lineData: number[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = (timestamp: number) => {
      if (!isVisible) { animationId = requestAnimationFrame(animate); return; }
      if (timestamp - lastFrame < 33) { animationId = requestAnimationFrame(animate); return; }
      lastFrame = timestamp;
      time += 0.015;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const isDark = document.documentElement.classList.contains('dark');
      const lineColor = isDark ? 'rgba(34, 197, 94, 0.25)' : 'rgba(22, 101, 52, 0.15)';
      const dotColor = isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(22, 101, 52, 0.2)';

      // === SINGLE FLOWING LINE (bottom) ===
      const width = window.innerWidth;
      const height = window.innerHeight;
      const lineY = height * 0.88;
      const lineX = width * 0.1;
      const lineWidth = width * 0.8;
      const lineHeight = 40;

      // Generate smooth data
      const newVal = Math.sin(time * 1.5) * 0.3 + Math.cos(time * 3) * 0.2 + 0.5 + Math.random() * 0.05;
      lineData.push(newVal);
      if (lineData.length > 80) lineData.shift();

      // Draw line
      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.5;
      lineData.forEach((val, i) => {
        const x = lineX + (i / 80) * lineWidth;
        const y = lineY - val * lineHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // === FLOATING DOTS (sparse) ===
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(time * 0.2 + i * 3) + 1) * 0.4 * width + width * 0.1;
        const y = (Math.cos(time * 0.15 + i * 2) + 1) * 0.3 * height + height * 0.2;
        
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      }

      // === SUBTLE VERTICAL PULSE (right edge) ===
      const pulseX = width - 20;
      const pulseHeight = 60;
      const pulseY = height * 0.5;
      const pulseVal = Math.sin(time * 4) * 0.5 + 0.5;
      
      ctx.fillStyle = dotColor;
      ctx.fillRect(pulseX, pulseY - pulseHeight * pulseVal / 2, 3, pulseHeight * pulseVal);

      animationId = requestAnimationFrame(animate);
    };

    const visibilityChange = () => { isVisible = !document.hidden; };
    document.addEventListener("visibilitychange", visibilityChange);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibilityChange);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};

export default MLBackground;
