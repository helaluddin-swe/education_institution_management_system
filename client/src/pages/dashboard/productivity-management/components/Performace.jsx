import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Zap, TrendingUp, Calendar, CheckCircle2, ListTodo } from 'lucide-react';

const Performance = ({ tasks }) => {
  
  // --- LOGIC: GENERATE DYNAMIC 7-DAY RANGE (3 days before, today, 3 days after) ---
  const weekData = useMemo(() => {
    const data = [];
    const today = new Date(); // Current Real Date
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Format to match your task date format (e.g., "Mar 28")
      const month = date.toLocaleString('default', { month: 'short' });
      const dayNum = date.getDate().toString().padStart(2, '0');
      const dateString = `${month} ${dayNum}`;
      const dayName = date.toLocaleString('default', { weekday: 'short' });

      // Filter tasks from the main list that match this specific date
      const dayTasks = tasks.filter(t => t.date === dateString);
      const completed = dayTasks.filter(t => t.completed).length;
      const total = dayTasks.length;

      data.push({
        date: dateString,
        day: dayName,
        completed: completed,
        total: total,
        // For the chart goal line: use total tasks or a floor of 2 for better visuals
        goal: Math.max(total, 2) 
      });
    }
    return data;
  }, [tasks]);

  // --- TOTAL CALCULATIONS FOR THE WEEK ---
  const weeklyStats = useMemo(() => {
    const totalTasks = weekData.reduce((acc, curr) => acc + curr.total, 0);
    const completedTasks = weekData.reduce((acc, curr) => acc + curr.completed, 0);
    const rate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return { totalTasks, completedTasks, rate };
  }, [weekData]);

  // --- SVG Gauge Component ---
  const GoalGauge = ({ percentage }) => {
    const strokeDasharray = 339.29;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;
    return (
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle cx="88" cy="88" r="54" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
          <circle cx="88" cy="88" r="54" stroke="#6366F1" strokeWidth="12" fill="transparent" 
            strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-800">{percentage}%</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Done</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6 w-full max-w-6xl mx-auto">
      
      {/* 1. TOP SUMMARY BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-4xl border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Week Window</p>
            <p className="text-sm font-bold text-slate-800">{weekData[0].date} - {weekData[6].date}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-4xl border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
            <ListTodo size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Total Tasks Set</p>
            <p className="text-xl font-black text-slate-800">{weeklyStats.totalTasks}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-4xl border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Completed</p>
            <p className="text-xl font-black text-slate-800">{weeklyStats.completedTasks}</p>
          </div>
        </div>
      </div>

      {/* 2. AREA CHART SECTION */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Weekly Activity</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Completion Flow</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                <div className="w-2 h-2 rounded-full bg-indigo-500" /> Completed
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                <div className="w-2 h-2 rounded-full bg-slate-200" /> Goal
             </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekData} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 900, fill: '#94A3B8'}} 
              />
              <YAxis hide />
              <Tooltip 
                cursor={{stroke: '#6366F1', strokeWidth: 1}}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="completed" stroke="#6366F1" strokeWidth={4} fill="url(#colorPerf)" />
              <Area type="monotone" dataKey="goal" stroke="#E2E8F0" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. GAUGE & EFFICIENCY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col items-center justify-center">
          <GoalGauge percentage={weeklyStats.rate} />
          <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Weekly Goal Progress</p>
        </div>

        <div className="lg:col-span-2 bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-3xl font-black mb-2 flex items-center gap-3">
                Efficiency <Zap className="text-amber-400 fill-amber-400" size={24} />
              </h3>
              <p className="text-indigo-200 text-sm font-medium">Your productivity is {weeklyStats.rate}% based on this week's task set.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/5 p-6 rounded-4xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase text-indigo-300 mb-2">Completion Rate</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black">{weeklyStats.rate}%</span>
                  <TrendingUp size={18} className="text-emerald-400" />
                </div>
              </div>
              <div className="bg-white/5 p-6 rounded-4xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase text-indigo-300 mb-2">Weekly Load</p>
                <span className="text-3xl font-black">{weeklyStats.totalTasks} <span className="text-sm font-normal text-indigo-300">Tasks</span></span>
              </div>
            </div>
          </div>
          {/* Decorative Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default Performance;