import React, { useState, useMemo } from 'react';
import {
  RotateCcw, Maximize2, Calendar, Clock, CheckCircle2, 
  PlayCircle, Timer, AlertCircle
} from 'lucide-react';
import { AnalyticsCard, TaskRow } from '../tasks/TaskComponent';

const Overview = ({ tasks, setTasks }) => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('Upcoming'); // Upcoming, In Progress, Completed
  const [calendarView, setCalendarView] = useState('Monthly');
  const [analyticsFilter, setAnalyticsFilter] = useState('Daily');

  // --- DYNAMIC FILTER LOGIC (Real World) ---
  const filteredTasksByTab = useMemo(() => {
    return tasks.filter(task => {
      if (activeTab === 'Upcoming') return !task.completed && (task.spentTime === 0 || !task.spentTime);
      if (activeTab === 'In Progress') return !task.completed && task.spentTime > 0;
      if (activeTab === 'Completed') return task.completed;
      return true;
    });
  }, [tasks, activeTab]);

  // --- ANALYTICS LOGIC (Synced with tasks.jsx style) ---
  const filteredTasksForAnalytics = useMemo(() => {
    const today = 'Mar 28'; // Should ideally be dynamic: new Date().toLocaleDateString(...)
    return tasks.filter(t => {
      if (analyticsFilter === 'Daily') return t.date === today;
      if (analyticsFilter === 'Monthly') return t.date.startsWith('Mar');
      if (analyticsFilter === 'Weekly') {
        const weeklyRange = ['Mar 24', 'Mar 25', 'Mar 26', 'Mar 27', 'Mar 28', 'Mar 29', 'Mar 30'];
        return weeklyRange.includes(t.date);
      }
      return true;
    });
  }, [tasks, analyticsFilter]);

  const categoryTotals = filteredTasksForAnalytics.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + (task.spentTime || 0);
    return acc;
  }, {});

  const totalSpentTime = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const pieData = Object.entries(categoryTotals).map(([label, value], index) => ({
    label,
    value,
    color: ['#6366F1', '#F59E0B', '#10B981', '#EC4899'][index % 4],
    percentage: totalSpentTime > 0 ? (value / totalSpentTime) * 100 : 0
  }));

  // --- HANDLERS ---
  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFF] p-4 lg:p-10 gap-10 font-sans text-slate-800">

      {/* LEFT COLUMN */}
      <div className="flex-1 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-8 border-b border-gray-100 w-full md:w-auto">
            {['Upcoming', 'In Progress', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold transition-all relative ${
                  activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 animate-in fade-in" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <RotateCcw size={20} className="cursor-pointer hover:rotate-180 transition-all duration-500 hover:text-indigo-600" />
            <Maximize2 size={20} className="cursor-pointer hover:scale-110 transition hover:text-indigo-600" />
          </div>
        </header>

        {/* Analytics Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-black text-slate-900">Productivity Analysis</h3>
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              {['Daily', 'Weekly', 'Monthly'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAnalyticsFilter(mode)}
                  className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                    analyticsFilter === mode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <AnalyticsCard pieData={pieData} totalSpentTime={totalSpentTime} viewMode={analyticsFilter} />
        </div>

        {/* Dynamic Cards Section (Based on Active Tab) */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black tracking-tight">{activeTab} Work</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {filteredTasksByTab.length > 0 ? (
              filteredTasksByTab.map((work) => (
                <div key={work.id} className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-xl transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-5">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                      work.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-900 text-white'
                    }`}>
                      {work.completed ? <CheckCircle2 size={12}/> : <Clock size={12} />} 
                      {work.completed ? 'Done' : (work.spentTime > 0 ? 'In Progress' : 'Upcoming')}
                    </div>
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg">
                      {work.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{work.title}</h3>
                  <div className="flex items-center gap-4 mt-6 pt-5 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                      <Calendar size={14} className="text-indigo-500" /> {work.date}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                      <Timer size={14} className="text-amber-500" /> {Math.floor(work.spentTime / 60)}m logged
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-12 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold">No tasks in "{activeTab}"</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN (Sidebar) */}
      <div className="w-full lg:w-96 space-y-10">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-indigo-100/20 border border-gray-50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900">Activity Calendar</h3>
            <div className="flex p-1 bg-gray-50 rounded-2xl">
              {['Monthly', 'Daily'].map(v => (
                <button key={v} onClick={() => setCalendarView(v)} className={`px-4 py-2 text-xs font-bold rounded-xl ${calendarView === v ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <span key={d} className="font-black text-gray-300">{d}</span>)}
            {Array.from({ length: 31 }).map((_, i) => (
              <span key={i} className={`py-2 rounded-xl font-bold ${i + 1 === 28 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600'}`}>
                {i + 1}
              </span>
            ))}
          </div>
        </div>

        {/* Simplified Sidebar List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-2xl font-black text-slate-900">Task List</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {tasks.filter(t => t.completed).length}/{tasks.length}
            </span>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden divide-y divide-slate-50">
            {tasks.slice(0, 5).map((task) => (
              <TaskRow key={task.id} task={task} onToggle={toggleTask} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;