import React, { useMemo, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Calendar, Award, ArrowUpRight } from 'lucide-react';
// Ensure this path is correct for your file structure
import { AnalyticsBarGraph } from '../jobs/AnalyticsBarGraph'; 

const Performance = ({ jobs }) => {
  const [chartView, setChartView] = useState('Weekly'); 

  // --- 1. LOGIC: CALENDAR-WISE MONTHLY ANALYSIS ---
  const monthlyStats = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const stats = months.map(m => {
      const monthJobs = jobs.filter(j => j.date.startsWith(m));
      const applied = monthJobs.filter(j => j.completed).length;
      return { month: m, applied, total: monthJobs.length };
    });

    const peakMonth = [...stats].sort((a, b) => b.applied - a.applied)[0] || { month: 'N/A', applied: 0 };
    const totalAppliedAllTime = stats.reduce((acc, curr) => acc + curr.applied, 0);

    return { stats, peakMonth, totalAppliedAllTime };
  }, [jobs]);

  // --- 2. LOGIC: WEEKLY PERFORMANCE TARGETS ---
  const weeklyTotals = useMemo(() => {
    const today = 30; // Reference Mar 30
    const weekJobs = jobs.filter(j => {
      const day = parseInt(j.date.split(' ')[1]);
      return j.date.startsWith('Mar') && day > (today - 7) && day <= today;
    });
    const applied = weekJobs.filter(j => j.completed).length;
    // Goal: 3 apps per day * 7 days = 21
    return { applied, rate: Math.round((applied / 21) * 100) };
  }, [jobs]);

  const GoalGauge = ({ percentage }) => (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle cx="80" cy="80" r="60" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
        <circle cx="80" cy="80" r="60" stroke="#6366F1" strokeWidth="12" fill="transparent" 
          strokeDasharray="377" strokeDashoffset={377 - (377 * Math.min(percentage, 100)) / 100}
          strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-slate-800">{percentage}%</span>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Daily Target</span>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-8 space-y-8 w-full max-w-350 mx-auto bg-[#FAFBFF]">
      
      {/* SECTION 1: TOP INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col justify-between">
          <div>
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 w-fit mb-4">
              <Award size={24} />
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Most Active</h3>
            <p className="text-3xl font-black text-slate-800">{monthlyStats.peakMonth.month}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <p className="text-xs font-bold text-slate-500">{monthlyStats.peakMonth.applied} Sent</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{width: '70%'}} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
              <Calendar size={18} className="text-indigo-500" /> Monthly Breakdown
            </h3>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {monthlyStats.totalAppliedAllTime} Total Applications
            </span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats.stats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '15px', border: 'none'}} />
                <Bar dataKey="applied" radius={[4, 4, 0, 0]} barSize={30}>
                  {monthlyStats.stats.map((entry, index) => (
                    <Cell key={index} fill={entry.month === monthlyStats.peakMonth.month ? '#6366F1' : '#E2E8F0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 2: FULL WIDTH ANALYTICS GRAPH */}
      <div className="bg-indigo-900 rounded-[3.5rem] p-6 lg:p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-4xl font-black tracking-tighter">Application Velocity</h2>
              <p className="text-indigo-300 font-medium">Real-time daily submission tracking</p>
            </div>
            <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10">
              {['Weekly', 'Monthly'].map(m => (
                <button key={m} onClick={() => setChartView(m)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${chartView === m ? 'bg-white text-indigo-900' : 'text-indigo-200'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Integrating your custom AnalyticsBarGraph here */}
          <div className="bg-white/5 rounded-[2.5rem] p-2 backdrop-blur-sm border border-white/5">
             <AnalyticsBarGraph jobs={jobs} viewMode={chartView} />
          </div>
        </div>
        <Zap className="absolute -bottom-10 -right-10 text-white/5 w-80 h-80 rotate-12" />
      </div>

      {/* SECTION 3: EFFICIENCY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col items-center">
          <GoalGauge percentage={weeklyTotals.rate} />
          <h4 className="mt-4 font-black text-slate-800 uppercase text-xs tracking-widest">Weekly Momentum</h4>
        </div>

        <div className="md:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col justify-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase">Success Rate</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-800">88%</span>
                <ArrowUpRight size={16} className="text-emerald-500" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase">Active Days</p>
              <span className="text-2xl font-black text-slate-800">22/30</span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase">Avg Daily</p>
              <span className="text-2xl font-black text-slate-800">4.2</span>
            </div>
            <button className="bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-indigo-100">
              Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;