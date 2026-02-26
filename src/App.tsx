/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BodyModel } from './components/BodyModel';
import { SeveritySelector } from './components/SeveritySelector';
import { StatsView } from './components/StatsView';
import { useWeather } from './hooks/useWeather';
import { ItchRecord, ViewMode } from './types';
import { RotateCcw, BarChart2, User, Trash2, Cloud, Droplets, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export default function App() {
  const [records, setRecords] = useState<ItchRecord[]>(() => {
    const saved = localStorage.getItem('itch_records');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>('record');
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const weather = useWeather();

  useEffect(() => {
    localStorage.setItem('itch_records', JSON.stringify(records));
  }, [records]);

  const handleTap = (x: number, y: number) => {
    if (navigator.vibrate) navigator.vibrate(10); // Haptic feedback
    setPendingPoint({ x, y });
    setSelectedRecordId(null);
  };

  const handleSeveritySelect = (severity: number) => {
    if (!pendingPoint) return;
    if (navigator.vibrate) navigator.vibrate(20); // Haptic feedback

    const newRecord: ItchRecord = {
      id: crypto.randomUUID(),
      x: pendingPoint.x,
      y: pendingPoint.y,
      side,
      severity,
      timestamp: Date.now(),
      weather: weather.loading || weather.error ? undefined : {
        temp: weather.temp,
        humidity: weather.humidity
      }
    };

    setRecords(prev => [...prev, newRecord]);
    setPendingPoint(null);
  };

  const handleDelete = () => {
    if (selectedRecordId) {
      setRecords(prev => prev.filter(r => r.id !== selectedRecordId));
      setSelectedRecordId(null);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 text-slate-900 font-sans overflow-hidden flex flex-col selection:bg-pink-200">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b-4 border-slate-900 z-10 flex justify-between items-center relative">
        <div className="absolute inset-0 bg-dots opacity-10 pointer-events-none"></div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight transform -rotate-1">
            Itch<span className="text-pink-500">Tracker</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{format(new Date(), 'EEEE, MMM do')}</p>
        </div>
        
        <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-blue-100 px-4 py-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {weather.loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : weather.error ? (
            <span className="text-red-500">No Weather</span>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <Cloud size={16} className="text-blue-500 fill-current" />
                <span>{weather.temp}°</span>
              </div>
              <div className="w-0.5 h-4 bg-slate-900/20" />
              <div className="flex items-center gap-1">
                <Droplets size={16} className="text-blue-500 fill-current" />
                <span>{weather.humidity}%</span>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-pattern">
        <AnimatePresence mode="wait">
          {viewMode === 'record' ? (
            <motion.div 
              key="record"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex-1 p-4 flex flex-col items-center justify-center relative"
            >
              <div className="w-full max-w-md aspect-[3/5] relative">
                <BodyModel 
                  side={side} 
                  records={records} 
                  onTap={handleTap}
                  onPointClick={setSelectedRecordId}
                />
                
                {/* Side Toggle */}
                <button
                  onClick={() => setSide(s => s === 'front' ? 'back' : 'front')}
                  className="absolute bottom-6 right-6 bg-white p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-slate-900 text-slate-900 hover:bg-yellow-100 active:translate-y-1 active:shadow-none transition-all"
                >
                  <RotateCcw size={24} strokeWidth={3} />
                </button>
              </div>

              <p className="mt-6 text-sm font-bold text-slate-400 text-center bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
                👆 Tap the blob to record!
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="stats"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 p-6 overflow-y-auto"
            >
              <StatsView records={records} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Point Modal */}
        <AnimatePresence>
          {selectedRecordId && (
            <motion.div
              initial={{ y: 200, rotate: 5 }}
              animate={{ y: 0, rotate: 0 }}
              exit={{ y: 200, rotate: 5 }}
              className="absolute bottom-4 left-4 right-4 bg-white p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-slate-900 z-20"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-xl text-slate-900">Itch Details</h3>
                <button 
                  onClick={() => setSelectedRecordId(null)}
                  className="p-2 bg-slate-100 rounded-xl border-2 border-slate-900 hover:bg-slate-200"
                >
                  <XIcon />
                </button>
              </div>
              
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-pink-50 p-4 rounded-2xl border-2 border-pink-200">
                  <span className="text-xs font-bold text-pink-400 uppercase block mb-1">Ouch Level</span>
                  <span className="text-3xl font-black text-pink-500">
                    {records.find(r => r.id === selectedRecordId)?.severity}
                    <span className="text-lg text-pink-300">/5</span>
                  </span>
                </div>
                <div className="flex-1 bg-blue-50 p-4 rounded-2xl border-2 border-blue-200">
                  <span className="text-xs font-bold text-blue-400 uppercase block mb-1">Time</span>
                  <span className="text-lg font-bold text-blue-500">
                    {format(records.find(r => r.id === selectedRecordId)?.timestamp || 0, 'h:mm a')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleDelete}
                className="w-full py-4 bg-red-500 text-white font-bold text-lg rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={20} />
                Delete This!
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="bg-white border-t-4 border-slate-900 px-6 py-4 pb-8 flex justify-around items-center z-10">
        <button
          onClick={() => setViewMode('record')}
          className={`group flex flex-col items-center gap-1 transition-all ${
            viewMode === 'record' ? 'scale-110' : 'opacity-50 hover:opacity-100'
          }`}
        >
          <div className={`p-3 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors ${viewMode === 'record' ? 'bg-yellow-400' : 'bg-white'}`}>
            <User size={24} strokeWidth={3} className="text-slate-900" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-900">Body</span>
        </button>
        
        <button
          onClick={() => setViewMode('stats')}
          className={`group flex flex-col items-center gap-1 transition-all ${
            viewMode === 'stats' ? 'scale-110' : 'opacity-50 hover:opacity-100'
          }`}
        >
          <div className={`p-3 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors ${viewMode === 'stats' ? 'bg-pink-400' : 'bg-white'}`}>
            <BarChart2 size={24} strokeWidth={3} className="text-slate-900" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-900">Stats</span>
        </button>
      </nav>

      {/* Severity Selector Modal */}
      <AnimatePresence>
        {pendingPoint && (
          <SeveritySelector
            onSelect={handleSeveritySelect}
            onCancel={() => setPendingPoint(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

