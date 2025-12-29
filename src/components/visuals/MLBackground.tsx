"use client";

import { useEffect, useRef } from "react";

const MLBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Data storage
    const lineData: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      time += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains('dark');
      const lineColor = isDark ? 'rgba(34, 197, 94, 0.25)' : 'rgba(22, 101, 52, 0.15)';
      const dotColor = isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(22, 101, 52, 0.2)';

      // === SINGLE FLOWING LINE (bottom) ===
      const lineY = canvas.height * 0.88;
      const lineX = canvas.width * 0.1;
      const lineWidth = canvas.width * 0.8;
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
        const x = (Math.sin(time * 0.2 + i * 3) + 1) * 0.4 * canvas.width + canvas.width * 0.1;
        const y = (Math.cos(time * 0.15 + i * 2) + 1) * 0.3 * canvas.height + canvas.height * 0.2;
        
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      }

      // === SUBTLE VERTICAL PULSE (right edge) ===
      const pulseX = canvas.width - 20;
      const pulseHeight = 60;
      const pulseY = canvas.height * 0.5;
      const pulseVal = Math.sin(time * 4) * 0.5 + 0.5;
      
      ctx.fillStyle = dotColor;
      ctx.fillRect(pulseX, pulseY - pulseHeight * pulseVal / 2, 3, pulseHeight * pulseVal);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};

export default MLBackground;
