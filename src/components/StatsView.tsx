import React from 'react';
import { ItchRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, startOfDay, subDays } from 'date-fns';

interface StatsViewProps {
  records: ItchRecord[];
}

export function StatsView({ records }: StatsViewProps) {
  // Process data for charts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      date: format(d, 'MM/dd'),
      fullDate: startOfDay(d).getTime(),
      count: 0,
      avgSeverity: 0
    };
  });

  records.forEach(r => {
    const dayStart = startOfDay(new Date(r.timestamp)).getTime();
    const dayStat = last7Days.find(d => d.fullDate === dayStart);
    if (dayStat) {
      dayStat.count++;
      dayStat.avgSeverity += r.severity;
    }
  });

  last7Days.forEach(d => {
    if (d.count > 0) {
      d.avgSeverity = parseFloat((d.avgSeverity / d.count).toFixed(1));
    }
  });

  const severityDistribution = [
    { name: 'Mild (1-2)', value: records.filter(r => r.severity <= 2).length, color: '#86efac' },
    { name: 'Moderate (3)', value: records.filter(r => r.severity === 3).length, color: '#fcd34d' },
    { name: 'Severe (4-5)', value: records.filter(r => r.severity >= 4).length, color: '#f87171' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-4 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-slate-900">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="text-xl">📅</span> Weekly Itches
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 12, fontFamily: 'Fredoka', fill: '#475569'}} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '2px solid #0f172a', 
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                  fontFamily: 'Fredoka'
                }}
                cursor={{ fill: '#fef08a' }}
              />
              <Bar dataKey="count" fill="#fb7185" radius={[8, 8, 8, 8]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-slate-900">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="text-xl">🍕</span> Severity Pizza
        </h3>
        <div className="h-48 w-full flex items-center justify-center">
          {records.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={3}
                >
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ 
                    borderRadius: '12px', 
                    border: '2px solid #0f172a', 
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                    fontFamily: 'Fredoka'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center">
              <p className="text-4xl mb-2">😴</p>
              <p className="text-slate-400 font-bold">No itches yet!</p>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {severityDistribution.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                    <div className="w-3 h-3 rounded-full border border-slate-900" style={{backgroundColor: d.color}} />
                    {d.name}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
