"use client";

import React, { useEffect, useState } from 'react';

const NeuralNetwork = () => {
  const [nodes, setNodes] = useState<{x: number, y: number}[]>([]);

  useEffect(() => {
    // Generate random nodes
    const newNodes = Array.from({ length: 15 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setNodes(newNodes);
  }, []);

  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden opacity-10 pointer-events-none">
      <svg className="w-full h-full">
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            <circle cx={`${node.x}%`} cy={`${node.y}%`} r="3" fill="currentColor" className="text-black" />
            {nodes.slice(i + 1).map((other, j) => {
              const dist = Math.hypot(node.x - other.x, node.y - other.y);
              if (dist < 30) {
                return (
                  <line 
                    key={`${i}-${j}`}
                    x1={`${node.x}%`} 
                    y1={`${node.y}%`} 
                    x2={`${other.x}%`} 
                    y2={`${other.y}%`} 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    className="text-gray-500 animate-pulse"
                    strokeOpacity={1 - dist / 30}
                  />
                );
              }
              return null;
            })}
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};

export default NeuralNetwork;
