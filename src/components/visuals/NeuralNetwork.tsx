"use client";

import React from 'react';

const nodes = Array.from({ length: 15 }, (_, index) => ({
  x: (index * 37 + 11) % 100,
  y: (index * 53 + 17) % 100,
}));

const NeuralNetwork = () => {
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
