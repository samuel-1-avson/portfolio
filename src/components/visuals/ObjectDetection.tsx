"use client";

import React, { useEffect, useState } from 'react';

interface Box {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  confidence: number;
}

const LABELS = ['person', 'keyboard', 'screen', 'code', 'bug', 'coffee'];

const ObjectDetection = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add/remove boxes
      if (Math.random() > 0.3) {
        const newBox: Box = {
          id: Date.now(),
          x: Math.random() * 80, // %
          y: Math.random() * 80, // %
          w: 10 + Math.random() * 20, // %
          h: 10 + Math.random() * 20, // %
          label: LABELS[Math.floor(Math.random() * LABELS.length)],
          confidence: 0.85 + Math.random() * 0.14
        };
        setBoxes(prev => [...prev.slice(-3), newBox]); // Keep max 4 boxes
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {boxes.map(box => (
        <div
          key={box.id}
          className="absolute border-2 border-green-500/50 bg-green-500/5 transition-all duration-500 animate-in fade-in zoom-in-95"
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: `${box.w}%`,
            height: `${box.h}%`,
          }}
        >
          <div className="absolute -top-6 left-0 bg-green-500 text-black text-[10px] font-mono px-1 py-0.5">
            {box.label} {(box.confidence * 100).toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  );
};

export default ObjectDetection;
