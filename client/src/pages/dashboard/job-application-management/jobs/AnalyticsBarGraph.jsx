import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Info, Briefcase, Bookmark, Send } from 'lucide-react';

export const AnalyticsBarGraph = ({ jobs, viewMode }) => {
  const currentDay = 30; // Reference date: Mar 30

  const chartData = useMemo(() => {
    const daysToShow = viewMode === 'Weekly' ? 7 : 31;
    // For Weekly: Calculate Mar 24 to Mar 30
    // For Monthly: Calculate Mar 01 to Mar 31
    const startDay = viewMode === 'Weekly' ? (currentDay - 6) : 1;
    const endDay = viewMode === 'Weekly' ? currentDay : 31;

    const data = [];
    for (let i = startDay; i <= endDay; i++) {
      const dateStr = `Mar ${i.toString().padStart(2, '0')}`;
      const dayJobs = jobs.filter(j => j.date === dateStr);
      
      const applied = dayJobs.filter(j => j.completed).length;
      const saved = dayJobs.filter(j => j.isFavorite).length;
      const total = dayJobs.length;

      data.push({
        day: i,
        date: dateStr,
        ratio: total > 0 ? Math.round((applied / total) * 100) : 0,
        applied,
        saved,
        total
      });
    }
    return data;
  }, [jobs, viewMode]);

  // Aggregate stats for the current view
  const stats = useMemo(() => {
    return chartData.reduce((acc, curr) => ({
      total: acc.total + curr.total,
      applied: acc.applied + curr.applied,
      saved: acc.saved + curr.saved
    }), { total: 0, applied: 0, saved: 0 });
  }, [chartData]);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-50 flex flex-col gap-6 transition-all">
      
      {/* Header & Mode Info */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
            <TrendingUp size={14}/>
          </div>
          <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
            {viewMode} Metrics
          </span>
        </div>
        <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase">
          Mar {chartData[0]?.day} - Mar {chartData[chartData.length - 1]?.day}
        </span>
      </div>

      {/* Stats Grid - Easily Understandable Counts */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
          <div className="flex items-center gap-1.5 mb-1 text-slate-400">
            <Briefcase size={10} />
            <span className="text-[8px] font-black uppercase tracking-tighter">Openings</span>
          </div>
          <p className="text-lg font-black text-slate-800 leading-none">{stats.total}</p>
        </div>
        <div className="bg-indigo-50/30 p-3 rounded-2xl border border-indigo-100/20">
          <div className="flex items-center gap-1.5 mb-1 text-indigo-400">
            <Bookmark size={10} />
            <span className="text-[8px] font-black uppercase tracking-tighter">Saved</span>
          </div>
          <p className="text-lg font-black text-indigo-600 leading-none">{stats.saved}</p>
        </div>
        <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/20">
          <div className="flex items-center gap-1.5 mb-1 text-emerald-500">
            <Send size={10} />
            <span className="text-[8px] font-black uppercase tracking-tighter">Applied</span>
          </div>
          <p className="text-lg font-black text-emerald-600 leading-none">{stats.applied}</p>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
            <XAxis dataKey="day" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              cursor={{fill: '#f8fafc', radius: 4}}
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800 scale-90">
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-2 border-b border-white/10 pb-1">{d.date}</p>
                      <div className="space-y-1">
                        <p className="flex justify-between gap-4 text-[10px]">Applied: <span className="text-indigo-400">{d.applied}</span></p>
                        <p className="flex justify-between gap-4 text-[10px]">Saved: <span className="text-amber-400">{d.saved}</span></p>
                        <p className="flex justify-between gap-4 text-[10px]">Ratio: <span className="font-black">{d.ratio}%</span></p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="ratio" radius={[2, 2, 2, 2]} barSize={viewMode === 'Weekly' ? 24 : 6}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={index} 
                  fill={entry.ratio > 0 ? '#6366f1' : '#F1F5F9'} 
                  fillOpacity={entry.day === currentDay ? 1 : 0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-tight">
          <Info size={10} /> 
          {viewMode === 'Weekly' ? 'Last 7 Days activity' : 'Full month breakdown'}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-[9px] font-black text-indigo-600 uppercase">Live</span>
        </div>
      </div>
    </div>
  );
};