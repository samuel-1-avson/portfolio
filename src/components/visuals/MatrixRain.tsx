"use client";

import React, { useEffect, useRef, useState } from 'react';

const codeSnippets = [
  'model.fit()',
  'loss: 0.042',
  'accuracy: 99.2%',
  'torch.tensor',
  'optimizer.step',
  'gradient.backward',
  'nn.Linear(512)',
  'ReLU()',
  'Softmax()',
  'batch_size=32',
  'epochs: 100',
  'lr: 0.001',
  'Adam()',
  'CrossEntropy',
  'dropout(0.5)',
  'conv2d(64)',
  'MaxPool2d',
  'BatchNorm',
  'embedding',
  'attention',
  'transformer',
  'GPT-4',
  'BERT',
  'ResNet',
  'YOLO',
  'GAN',
  'VAE',
  'RL.train()',
  'reward: +1',
  'state.next()',
  'π(a|s)',
  'Q(s,a)',
  'blockchain',
  'hash: 0x7f',
  'block: 1024',
  'miner.run()',
  'consensus',
  'smart_contract',
  'web3.eth',
  'solidity',
];

interface MatrixColumn {
  x: number;
  chars: string[];
  speed: number;
  y: number;
  opacity: number;
  fontSize: number;
}

const MatrixRain: React.FC<{ className?: string; density?: number }> = ({ 
  className = '',
  density = 30,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<MatrixColumn[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Initialize columns
    const columnCount = Math.floor(dimensions.width / 25);
    columnsRef.current = [];

    for (let i = 0; i < Math.min(columnCount, density); i++) {
      const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      columnsRef.current.push({
        x: Math.random() * dimensions.width,
        chars: snippet.split(''),
        speed: 0.5 + Math.random() * 2,
        y: Math.random() * -dimensions.height,
        opacity: 0.1 + Math.random() * 0.5,
        fontSize: 10 + Math.floor(Math.random() * 6),
      });
    }

    const animate = () => {
      // Fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      columnsRef.current.forEach((column, index) => {
        ctx.font = `${column.fontSize}px monospace`;
        
        column.chars.forEach((char, charIndex) => {
          const charY = column.y + charIndex * (column.fontSize + 2);
          
          // Skip if off screen
          if (charY < -20 || charY > dimensions.height + 20) return;

          // Calculate opacity based on position (fade at top and bottom)
          let charOpacity = column.opacity;
          if (charIndex === column.chars.length - 1) {
            charOpacity = Math.min(1, column.opacity + 0.5); // Brightest at the head
          } else if (charIndex < 3) {
            charOpacity = column.opacity * (charIndex / 3); // Fade at start
          }

          // Set color with computed opacity
          const green = Math.floor(180 + Math.random() * 75);
          ctx.fillStyle = `rgba(34, ${green}, 94, ${charOpacity})`;
          
          // Occasional glitch - random character change
          const displayChar = Math.random() > 0.99 
            ? String.fromCharCode(33 + Math.floor(Math.random() * 94))
            : char;
          
          ctx.fillText(displayChar, column.x, charY);
        });

        // Update position
        column.y += column.speed;

        // Reset when off screen
        if (column.y > dimensions.height + 50) {
          const newSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
          columnsRef.current[index] = {
            x: Math.random() * dimensions.width,
            chars: newSnippet.split(''),
            speed: 0.5 + Math.random() * 2,
            y: Math.random() * -100 - 50,
            opacity: 0.1 + Math.random() * 0.5,
            fontSize: 10 + Math.floor(Math.random() * 6),
          };
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default MatrixRain;
