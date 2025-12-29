"use client";

import React, { useEffect, useState } from 'react';

const SystemMonitor = () => {
  const [metrics, setMetrics] = useState({
    gpuLoad: 0,
    vram: 0,
    temp: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        gpuLoad: Math.floor(Math.random() * 40) + 50, // 50-90%
        vram: Math.floor(Math.random() * 20) + 70,    // 70-90%
        temp: Math.floor(Math.random() * 10) + 65,     // 65-75C
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const Bar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex items-center gap-2 text-xs font-mono mb-2">
      <span className="w-16 text-gray-600">{label}</span>
      <div className="flex-1 h-3 bg-gray-200 border border-black relative">
        <div 
          className={`h-full ${color} transition-all duration-500`} 
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-8 text-right">{value}%</span>
    </div>
  );

  return (
    <div className="retro-card p-4">
      <h4 className="border-b-2 border-black pb-2 mb-4 font-mono font-bold text-sm">SYSTEM_MONITOR</h4>
      <Bar label="GPU_LOAD" value={metrics.gpuLoad} color="bg-black" />
      <Bar label="VRAM_USE" value={metrics.vram} color="bg-gray-600" />
      <div className="flex items-center gap-2 text-xs font-mono mt-4">
        <span className="w-16 text-gray-600">TEMP</span>
        <span className="border border-black px-2 py-0.5">{metrics.temp}°C</span>
      </div>
    </div>
  );
};

export default SystemMonitor;
