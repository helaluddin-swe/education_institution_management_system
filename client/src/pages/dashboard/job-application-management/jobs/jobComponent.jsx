import React, { useMemo } from 'react';
import { 
  Briefcase, CheckCircle2, Calendar, Heart, 
  Edit3, Trash2, DollarSign, TrendingUp, 
  Info, Clock, ShieldCheck 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

// --- STAT CARD: JOB SUMMARY (Replaces TimerCard) ---
export const TimerCard = ({ totalJobs, appliedCount, savedCount }) => (
  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-slate-200">
    <div className="flex justify-between items-center opacity-60">
      <span className="text-xs font-black uppercase tracking-widest">Pipeline Overview</span>
      <TrendingUp size={20} className="text-indigo-400" />
    </div>
    <div className="my-6">
      <h2 className="text-5xl font-black tabular-nums">{totalJobs}</h2>
      <p className="text-slate-400 text-sm mt-2 font-medium"> Total Active Listings</p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
        <p className="text-[10px] font-black text-indigo-400 uppercase">Applied</p>
        <p className="text-lg font-bold">{appliedCount}</p>
      </div>
      <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
        <p className="text-[10px] font-black text-emerald-400 uppercase">Saved</p>
        <p className="text-lg font-bold">{savedCount}</p>
      </div>
    </div>
  </div>
);

// --- STAT CARD: ANALYTICS (Updated for Job Counting) ---
export const AnalyticsCard = ({ pieData, totalJobs, viewMode }) => (
  <div className="lg:col-span-2 bg-white text-gray-600 rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col md:flex-row items-center gap-10">
    <div className="relative w-40 h-40 shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        {pieData.length === 0 && (
          <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
        )}
        {pieData.map((seg, i) => {
          const offset = pieData.slice(0, i).reduce((a, b) => a + b.percentage, 0);
          return (
            <circle 
              key={seg.label} 
              cx="18" cy="18" r="16" 
              fill="transparent" 
              stroke={seg.color} 
              strokeWidth="4"
              strokeDasharray={`${seg.percentage} ${100 - seg.percentage}`} 
              strokeDashoffset={-offset} 
              className="transition-all duration-1000"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{viewMode}</span>
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl font-black text-slate-800">{totalJobs}</span>
          <span className="text-[10px] font-bold text-slate-400 ml-1">Jobs</span>
        </div>
      </div>
    </div>
    
    <div className="flex-1 grid grid-cols-2 gap-4 w-full">
      {pieData.map(item => (
        <div key={item.label} className="flex items-center gap-3 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <div className="min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase truncate">{item.label}</p>
            <p className="text-sm font-bold text-slate-700">{item.value} Listings</p>
          </div>
        </div>
      ))}
      {pieData.length === 0 && <p className="col-span-2 text-xs text-slate-400 italic text-center">No categories to display</p>}
    </div>
  </div>
);

// --- LIST ITEM: TASK ROW (Updated with isApplied Check) ---
export const JobsRow = ({ task, onToggle: onToggleFavorite, onEdit, onDelete }) => (
  <div className="group grid grid-cols-12 items-center px-6 py-5 hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0">
    {/* Job Title & Info */}
    <div className="col-span-7 md:col-span-6 flex items-center gap-4">
      <button
        onClick={() => onToggleFavorite(task.id)}
        className="transition-transform active:scale-125"
      >
        <Heart
          size={20}
          className={task.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300 hover:text-slate-400'}
        />
      </button>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-bold text-sm text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
            {task.title}
          </p>
          {task.completed && (
            <span className="flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-emerald-100">
              <CheckCircle2 size={10} /> Applied
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[10px] font-black text-indigo-500/80 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-tight">
            {task.category}
          </span>
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <Calendar size={12} /> {task.date}
          </span>
          <span className="text-[10px] text-slate-400 font-bold italic">
            • {task.locationType}
          </span>
        </div>
      </div>
    </div>

    {/* Salary Section */}
    <div className="col-span-3 flex justify-center">
      <div className="flex items-center gap-1 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-100 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
        <DollarSign size={12} className="text-emerald-500" />
        <span className="font-black text-[11px] whitespace-nowrap">{task.salary}</span>
      </div>
    </div>

    {/* Actions */}
    <div className="col-span-2 md:col-span-3 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={() => onEdit(task)}
        className="p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
      >
        <Edit3 size={18} />
      </button>
      <button
        onClick={() => onDelete(task.id)}
        className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);


export const AnalyticsBarCard = ({ jobs, viewMode }) => {
  // --- LOGIC: PROCESS FULL MONTH DATA (Mar 01 - Mar 31) ---
  const monthlyData = useMemo(() => {
    // 1. Create an array for all days in March
    const days = Array.from({ length: 31 }, (_, i) => {
      const dayNum = (i + 1).toString().padStart(2, '0');
      const dateStr = `Mar ${dayNum}`;
      
      // 2. Filter jobs for this specific date
      const dayJobs = jobs.filter(j => j.date === dateStr);
      const applied = dayJobs.filter(j => j.completed).length;
      const total = dayJobs.length;
      
      return {
        date: dateStr,
        day: i + 1,
        applied: applied,
        total: total,
        // Ratio percentage for the bar height
        ratio: total > 0 ? Math.round((applied / total) * 100) : 0
      };
    });
    return days;
  }, [jobs]);

  const totalMonthlyApplied = jobs.filter(j => j.completed && j.date.startsWith('Mar')).length;

  return (
    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col gap-6">
      
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Monthly Analytics</span>
            <div className="bg-indigo-50 p-1 rounded-md">
               <TrendingUp size={12} className="text-indigo-600" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800">Application Ratio</h3>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase">Total Applied</p>
          <p className="text-2xl font-black text-slate-800">{totalMonthlyApplied}</p>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="h-48 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -35, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 9, fontWeight: 700, fill: '#cbd5e1'}}
              interval={2} // Shows every 2nd day to keep it clean
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 9, fontWeight: 700, fill: '#cbd5e1'}}
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{data.date}</p>
                      <p className="text-xs font-bold">Ratio: <span className="text-indigo-400">{data.ratio}%</span></p>
                      <p className="text-[9px] text-slate-500">{data.applied} Applied / {data.total} Total</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="ratio" radius={[4, 4, 4, 4]} barSize={8}>
              {monthlyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.ratio > 0 ? '#6366f1' : '#f1f5f9'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend / Footer Info */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase">Apply %</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-100" />
            <span className="text-[10px] font-black text-slate-400 uppercase">No Activity</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <Info size={12} />
          <span className="text-[9px] font-bold italic">Calculated based on daily job listings vs. status</span>
        </div>
      </div>
    </div>
  );
};