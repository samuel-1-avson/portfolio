"use client";

import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  activation: number; // 0-1, how "activated" the neuron is
  pulsePhase: number;
  layer: number;
}

interface Connection {
  from: number;
  to: number;
  weight: number; // -1 to 1
}

const NeuralBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Create nodes in layers (like a neural network)
    const layerCount = 4;
    const nodesPerLayer = 12;
    const nodes: Node[] = [];

    for (let layer = 0; layer < layerCount; layer++) {
      for (let i = 0; i < nodesPerLayer; i++) {
        const layerWidth = width / (layerCount + 1);
        const layerHeight = height / (nodesPerLayer + 1);
        
        nodes.push({
          x: layerWidth * (layer + 1) + (Math.random() - 0.5) * 100,
          y: layerHeight * (i + 1) + (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          activation: Math.random(),
          pulsePhase: Math.random() * Math.PI * 2,
          layer,
        });
      }
    }

    // Create connections between adjacent layers
    const connections: Connection[] = [];
    nodes.forEach((node, i) => {
      nodes.forEach((targetNode, j) => {
        if (targetNode.layer === node.layer + 1) {
          // Only connect to some nodes in next layer based on distance
          const dx = node.x - targetNode.x;
          const dy = node.y - targetNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 400 && Math.random() > 0.4) {
            connections.push({
              from: i,
              to: j,
              weight: (Math.random() - 0.5) * 2,
            });
          }
        }
      });
    });

    nodesRef.current = nodes;
    connectionsRef.current = connections;

    // Get theme colors
    const getColor = (alpha: number, intensity: number = 1) => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        return `rgba(34, 197, 94, ${alpha * intensity})`; // Green for dark mode
      }
      return `rgba(22, 101, 52, ${alpha * intensity})`; // Darker green for light mode
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      
      timeRef.current += 0.016; // ~60fps
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const connections = connectionsRef.current;

      // Update and draw connections
      connections.forEach(conn => {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        
        // Calculate connection strength based on node activations
        const strength = (fromNode.activation + toNode.activation) / 2;
        const weightVisual = Math.abs(conn.weight);
        
        // Animate data flow along connection
        const flowProgress = (timeRef.current * 0.5 + conn.from * 0.1) % 1;
        
        // Draw main connection line
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = getColor(0.1 + strength * 0.15, weightVisual);
        ctx.lineWidth = 0.5 + weightVisual * 1.5;
        ctx.stroke();

        // Draw flowing data particle
        const particleX = fromNode.x + (toNode.x - fromNode.x) * flowProgress;
        const particleY = fromNode.y + (toNode.y - fromNode.y) * flowProgress;
        
        ctx.beginPath();
        ctx.arc(particleX, particleY, 2 + strength * 2, 0, Math.PI * 2);
        ctx.fillStyle = getColor(0.6 + strength * 0.4);
        ctx.fill();
      });

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Gentle floating motion
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges with padding
        const padding = 50;
        if (node.x < padding || node.x > width - padding) node.vx *= -1;
        if (node.y < padding || node.y > height - padding) node.vy *= -1;

        // Update activation (pulsing effect)
        node.activation = 0.5 + 0.5 * Math.sin(timeRef.current * 2 + node.pulsePhase);

        // Draw node glow
        const glowRadius = 20 + node.activation * 15;
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowRadius
        );
        gradient.addColorStop(0, getColor(0.3 * node.activation));
        gradient.addColorStop(1, getColor(0));
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw node core
        const nodeRadius = 3 + node.activation * 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = getColor(0.4 + node.activation * 0.4);
        ctx.fill();

        // Draw outer ring for high activation
        if (node.activation > 0.7) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeRadius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = getColor(0.3);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw "training progress" indicator in corner
      const progress = (Math.sin(timeRef.current * 0.5) + 1) / 2;
      const barWidth = 120;
      const barHeight = 4;
      const barX = 20;
      const barY = height - 30;

      // Background bar
      ctx.fillStyle = getColor(0.1);
      ctx.fillRect(barX, barY, barWidth, barHeight);

      // Progress bar
      ctx.fillStyle = getColor(0.5);
      ctx.fillRect(barX, barY, barWidth * progress, barHeight);

      // Label
      ctx.font = '10px monospace';
      ctx.fillStyle = getColor(0.4);
      ctx.fillText(`TRAINING: ${Math.floor(progress * 100)}%`, barX, barY - 6);

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none opacity-60"
    />
  );
};

export default NeuralBackground;
