"use client";

import React, { useEffect, useRef } from 'react';

interface DataParticle {
  x: number;
  y: number;
  progress: number;
  speed: number;
  size: number;
  stage: number;
  color: string;
}

const stages = [
  { label: 'INPUT', x: 0.1 },
  { label: 'PREPROCESS', x: 0.3 },
  { label: 'MODEL', x: 0.5 },
  { label: 'INFERENCE', x: 0.7 },
  { label: 'OUTPUT', x: 0.9 },
];

const DataFlowPipeline: React.FC<{ className?: string; height?: number }> = ({
  className = '',
  height = 120,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<DataParticle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = height;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Initialize particles
    const colors = [
      'rgba(34, 197, 94, ',  // Green
      'rgba(6, 182, 212, ',  // Cyan
      'rgba(168, 85, 247, ', // Purple
      'rgba(245, 158, 11, ', // Amber
    ];

    const createParticle = (): DataParticle => ({
      x: 0,
      y: height / 2 + (Math.random() - 0.5) * 40,
      progress: 0,
      speed: 0.002 + Math.random() * 0.003,
      size: 3 + Math.random() * 4,
      stage: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    // Start with some particles
    for (let i = 0; i < 15; i++) {
      const particle = createParticle();
      particle.progress = Math.random();
      particle.stage = Math.floor(particle.progress * stages.length);
      particlesRef.current.push(particle);
    }

    const animate = () => {
      if (!canvas || !ctx) return;

      const width = canvas.width;
      const isDark = document.documentElement.classList.contains('dark');

      // Clear with slight trail
      ctx.fillStyle = isDark ? 'rgba(5, 5, 5, 0.1)' : 'rgba(253, 251, 247, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw pipeline stages
      const pipelineY = height / 2;
      
      // Main pipeline line
      ctx.beginPath();
      ctx.moveTo(width * 0.05, pipelineY);
      ctx.lineTo(width * 0.95, pipelineY);
      ctx.strokeStyle = isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(22, 101, 52, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Stage nodes and labels
      stages.forEach((stage, i) => {
        const x = width * stage.x;
        
        // Node glow
        const gradient = ctx.createRadialGradient(x, pipelineY, 0, x, pipelineY, 25);
        gradient.addColorStop(0, isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(22, 101, 52, 0.2)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, pipelineY, 25, 0, Math.PI * 2);
        ctx.fill();

        // Node
        ctx.beginPath();
        ctx.arc(x, pipelineY, 8, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(34, 197, 94, 0.8)' : 'rgba(22, 101, 52, 0.7)';
        ctx.fill();

        // Inner dot
        ctx.beginPath();
        ctx.arc(x, pipelineY, 3, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#22c55e' : '#166534';
        ctx.fill();

        // Label
        ctx.font = '9px monospace';
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
        ctx.textAlign = 'center';
        ctx.fillText(stage.label, x, pipelineY + 25);

        // Connecting arrows
        if (i < stages.length - 1) {
          const nextX = width * stages[i + 1].x;
          const arrowX = x + (nextX - x) * 0.5;
          
          ctx.beginPath();
          ctx.moveTo(arrowX - 5, pipelineY - 3);
          ctx.lineTo(arrowX + 3, pipelineY);
          ctx.lineTo(arrowX - 5, pipelineY + 3);
          ctx.strokeStyle = isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(22, 101, 52, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update progress
        particle.progress += particle.speed;
        
        // Calculate position with slight wave
        const startX = width * 0.05;
        const endX = width * 0.95;
        particle.x = startX + (endX - startX) * particle.progress;
        particle.y = height / 2 + Math.sin(particle.progress * Math.PI * 4) * 15;

        // Update stage
        particle.stage = Math.min(
          Math.floor(particle.progress * stages.length),
          stages.length - 1
        );

        // Draw particle trail
        const trailLength = 8;
        for (let t = 0; t < trailLength; t++) {
          const trailProgress = particle.progress - t * 0.01;
          if (trailProgress < 0) continue;
          
          const trailX = startX + (endX - startX) * trailProgress;
          const trailY = height / 2 + Math.sin(trailProgress * Math.PI * 4) * 15;
          const trailAlpha = (1 - t / trailLength) * 0.6;
          const trailSize = particle.size * (1 - t / trailLength * 0.5);
          
          ctx.beginPath();
          ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
          ctx.fillStyle = particle.color + trailAlpha + ')';
          ctx.fill();
        }

        // Draw main particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + '0.9)';
        ctx.fill();

        // Glow effect
        const glow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        glow.addColorStop(0, particle.color + '0.4)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Reset particle when complete
        if (particle.progress >= 1) {
          particlesRef.current[index] = createParticle();
        }
      });

      // Spawn new particles occasionally
      if (Math.random() > 0.97 && particlesRef.current.length < 25) {
        particlesRef.current.push(createParticle());
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [height]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full ${className}`}
      style={{ height }}
    />
  );
};

export default DataFlowPipeline;
