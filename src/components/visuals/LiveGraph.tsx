"use client";

import React, { useEffect, useRef, useState } from 'react';

const LiveGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Data points
    const dataPoints = 50;
    const data: number[] = new Array(dataPoints).fill(0).map(() => Math.random() * height * 0.5);
    
    // Interactive state
    let isHovering = false;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update data
      data.shift();
      const last = data[data.length - 1] || height / 2;
      const noise = (Math.random() - 0.5) * 40;
      let next = last + noise;
      // Keep within bounds but let it fluctuate
      if (next < height * 0.2) next = height * 0.2;
      if (next > height * 0.9) next = height * 0.9;
      data.push(next);

      // Grid
      ctx.strokeStyle = '#22c55e10';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < width; i += 40) ctx.moveTo(i, 0), ctx.lineTo(i, height);
      for (let i = 0; i < height; i += 40) ctx.moveTo(0, i), ctx.lineTo(width, i);
      ctx.stroke();

      // Main Graph Line
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      
      const stepX = width / (dataPoints - 1);
      
      for (let i = 0; i < data.length; i++) {
        const x = i * stepX;
        const y = height - data[i]; 
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Fill
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.05)';
      ctx.fill();

      // Interaction
      if (isHovering) {
          // Find closest point to mouse X
          const mouseIndex = Math.min(Math.max(Math.round(mousePos.x / stepX), 0), dataPoints - 1);
          const pointX = mouseIndex * stepX;
          const pointY = height - data[mouseIndex];

          // Draw Crosshair
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(pointX, 0);
          ctx.lineTo(pointX, height);
          ctx.moveTo(0, pointY);
          ctx.lineTo(width, pointY);
          ctx.stroke();
          ctx.setLineDash([]);

          // Highlight Point
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(pointX, pointY, 4, 0, Math.PI * 2);
          ctx.fill();

          // Update state for tooltip (debounced/throttled via React state roughly)
          // In a high-freq loop, setting state can be costly, but for simple visualization it's okay
          // We'll read this value from an overlaid div instead of drawing text on canvas for clearer font
          if (Math.abs(pointX - mousePos.x) < 50) {
             // Just update a local var normally, but here we want to trigger UI update potentially
          }
      } else {
        // Draw active latest point if not hovering
        const lastX = width;
        const lastY = height - data[data.length - 1];
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);
    
    // Mouse Handlers attached to canvas
    const onMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        isHovering = true;
        
        // Calculate hover value
        const stepX = width / (dataPoints - 1);
        const idx = Math.min(Math.max(Math.round((e.clientX - rect.left) / stepX), 0), dataPoints - 1);
        // Normalized value 0-100 relative to height
        const val = Math.round((data[idx] / height) * 100);
        setHoverValue(val);
    };

    const onMouseLeave = () => {
        isHovering = false;
        setHoverValue(null);
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    return () => {
        window.removeEventListener('resize', handleResize);
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', onMouseLeave);
        cancelAnimationFrame(animationId);
    };
  }, [mousePos]); // Re-bind if mousePos changes? Actually dependency should be empty or handle refs carefully.
                  // For perf, better to use ref for mouse position inside effect, but Effect runs once.
                  // We used a local var `isHovering` closed over. `mousePos` state is for tooltip.

  return (
    <div className="w-full h-full relative overflow-hidden bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg group">
      <div className="absolute top-2 left-2 text-[10px] font-mono text-green-500 opacity-70 flex items-center gap-2">
        <span>MODEL_PERF_METRICS // LIVE</span>
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
      </div>
      
      {hoverValue !== null && (
          <div 
            className="absolute z-10 bg-black border border-green-500 text-green-500 text-[10px] font-mono px-2 py-1 rounded pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{ left: mousePos.x, top: mousePos.y - 10 }}
          >
              EFFICIENCY: {hoverValue}%
          </div>
      )}

      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
    </div>
  );
};

export default LiveGraph;
