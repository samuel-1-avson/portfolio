"use client";

import React, { useEffect, useRef, useState } from 'react';

const TrainingLog = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const epochRef = useRef(1);

  useEffect(() => {
    const interval = setInterval(() => {
      epochRef.current += 1;
      const loss = (1 / Math.log(epochRef.current + 2) + Math.random() * 0.05).toFixed(4);
      const acc = (1 - (0.5 / Math.log(epochRef.current + 2))).toFixed(4);

      setLogs((prevLogs) => {
        const newLog = `Epoch ${epochRef.current}/1000: loss=${loss} - acc=${acc} - val_loss=${(parseFloat(loss) + 0.02).toFixed(4)}`;
        return [...prevLogs, newLog].slice(-8);
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="retro-card p-4 bg-black text-xs font-mono text-green-500 h-48 overflow-hidden flex flex-col">
      <div className="border-b border-green-800 pb-2 mb-2 text-gray-400 flex justify-between">
        <span>TRAINING_LOGS</span>
        <span className="animate-pulse">● LIVE</span>
      </div>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="opacity-80 font-mono">{log}</div>
        ))}
        <div className="animate-pulse">_</div>
      </div>
    </div>
  );
};

export default TrainingLog;
