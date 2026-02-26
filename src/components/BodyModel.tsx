import React from 'react';
import { ItchRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BodyModelProps {
  side: 'front' | 'back';
  records: ItchRecord[];
  onTap: (x: number, y: number) => void;
  onPointClick: (id: string) => void;
}

export function BodyModel({ side, records, onTap, onPointClick }: BodyModelProps) {
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onTap(x, y);
  };

  // Cute "Blob" Character
  // A chubby, rounded figure.
  const bodyOutline = `
    M 50 15
    C 65 15, 70 25, 70 35
    C 70 40, 75 42, 85 40
    C 92 38, 95 45, 90 50
    C 85 55, 75 55, 72 52
    L 72 65
    C 72 75, 75 85, 80 90
    C 82 92, 78 95, 70 95
    L 65 95
    C 60 95, 60 80, 50 75
    C 40 80, 40 95, 35 95
    L 30 95
    C 22 95, 18 92, 20 90
    C 25 85, 28 75, 28 65
    L 28 52
    C 25 55, 15 55, 10 50
    C 5 45, 8 38, 15 40
    C 25 42, 30 40, 30 35
    C 30 25, 35 15, 50 15
    Z
  `;

  // Cute face for the front side
  const face = side === 'front' ? (
    <g className="opacity-60">
      {/* Eyes */}
      <circle cx="42" cy="32" r="3" fill="#334155" />
      <circle cx="58" cy="32" r="3" fill="#334155" />
      {/* Blush */}
      <circle cx="38" cy="36" r="4" fill="#fda4af" opacity="0.6" />
      <circle cx="62" cy="36" r="4" fill="#fda4af" opacity="0.6" />
      {/* Mouth */}
      <path d="M 45 38 Q 50 42 55 38" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
    </g>
  ) : null;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-yellow-50 rounded-[3rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] border-4 border-slate-900">
      <svg
        viewBox="0 0 100 100"
        className="h-[85%] w-auto drop-shadow-xl cursor-crosshair touch-none filter"
        onClick={handleClick}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Body Silhouette */}
        <path
          d={bodyOutline}
          fill={side === 'front' ? '#fde047' : '#fcd34d'} // Bright yellow
          stroke="#1e293b"
          strokeWidth="3"
          strokeLinejoin="round"
          className="transition-colors duration-500"
        />
        
        {face}
        
        {/* Render Points - using "X" marks or splats for a quirky look */}
        <AnimatePresence>
          {records
            .filter((r) => r.side === side)
            .map((record) => (
              <motion.g
                key={record.id}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 45 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onPointClick(record.id);
                }}
                className="cursor-pointer hover:opacity-80"
              >
                 {/* Cartoonish "Ouch" Star/Splat */}
                 <circle 
                    cx={record.x} 
                    cy={record.y} 
                    r={3 + record.severity * 1.5} 
                    fill="#ef4444" 
                    stroke="#fff" 
                    strokeWidth="2"
                 />
                 <text 
                    x={record.x} 
                    y={record.y} 
                    dy={1 + record.severity * 0.5}
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    fontSize={4 + record.severity}
                    className="pointer-events-none select-none"
                 >
                   {['', '😖', '😫', '😡', '🤬', '💀'][record.severity]}
                 </text>
              </motion.g>
            ))}
        </AnimatePresence>
      </svg>
      
      {/* Side Indicator - Fun Badge */}
      <div className="absolute top-4 right-4 bg-white border-2 border-slate-900 px-3 py-1 rounded-xl text-xs font-black text-slate-900 uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-3">
        {side}
      </div>
    </div>
  );
}
