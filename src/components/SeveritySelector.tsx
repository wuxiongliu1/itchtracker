import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface SeveritySelectorProps {
  onSelect: (severity: number) => void;
  onCancel: () => void;
}

export function SeveritySelector({ onSelect, onCancel }: SeveritySelectorProps) {
  const emojis = ['😊', '😖', '😫', '😡', '🤬'];
  const labels = ['Meh', 'Ouch', 'Itchy!', 'Argh!', 'HELP'];
  const colors = ['bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400', 'bg-purple-500'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.5, rotate: 10, opacity: 0 }}
        className="bg-white rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-slate-900 w-full max-w-sm relative overflow-hidden"
      >
        {/* Decorative background blobs */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-50" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-200 rounded-full opacity-50" />

        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full border-2 border-slate-900 hover:bg-slate-200 transition-colors z-10"
        >
          <X size={16} className="text-slate-900" />
        </button>
        
        <h3 className="text-center text-2xl font-black text-slate-900 mb-2 relative z-10">
          Ouchie Level?
        </h3>
        <p className="text-center text-slate-500 mb-8 font-medium relative z-10">
          How bad is the itch?
        </p>
        
        <div className="grid grid-cols-5 gap-2 relative z-10">
          {[1, 2, 3, 4, 5].map((level, i) => (
            <button
              key={level}
              onClick={() => onSelect(level)}
              className="flex flex-col items-center gap-2 group transition-transform active:scale-90"
            >
              <div 
                className={`w-12 h-12 ${colors[i]} rounded-2xl border-2 border-slate-900 flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 transition-all`}
              >
                {emojis[i]}
              </div>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">
                {labels[i]}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
