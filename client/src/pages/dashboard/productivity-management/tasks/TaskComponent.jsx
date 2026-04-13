import React from 'react';
import { Clock, Square, Play, CheckCircle2, Circle, Edit3, Trash2, Calendar } from 'lucide-react';
import { formatTime } from './tasksUtils';

// --- STAT CARD: TIMER ---
export const TimerCard = ({ activeTask, timerSeconds, onStop }) => (
  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-slate-200">
    <div className="flex justify-between items-center opacity-60">
      <span className="text-xs font-black uppercase tracking-widest">Active Session</span>
      <Clock size={20} />
    </div>
    <div className="my-6">
      <h2 className="text-5xl font-black tabular-nums">{formatTime(timerSeconds)}</h2>
      <p className="text-slate-400 text-sm mt-2 font-medium truncate">
        {activeTask ? activeTask.title : "No Active Task"}
      </p>
    </div>
    {activeTask && (
      <button onClick={onStop} className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
        <Square size={16} fill="white" /> Stop Tracking
      </button>
    )}
  </div>
);

// --- STAT CARD: ANALYTICS (Updated with viewMode Context) ---
export const AnalyticsCard = ({ pieData, totalSpentTime, viewMode }) => (
  <div className="lg:col-span-2 bg-white text-gray-600 rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col md:flex-row items-center gap-10">
    <div className="relative w-40 h-40 shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        {pieData.length === 0 && <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />}
        {pieData.map((seg, i) => {
          const offset = pieData.slice(0, i).reduce((a, b) => a + b.percentage, 0);
          return (
            <circle key={seg.label} cx="18" cy="18" r="16" fill="transparent" stroke={seg.color} strokeWidth="4"
              strokeDasharray={`${seg.percentage} ${100 - seg.percentage}`} strokeDashoffset={-offset} className="transition-all duration-1000"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{viewMode} Total</span>
        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-black text-slate-800">{Math.floor(totalSpentTime / 3600)}</span>
          <span className="text-[10px] font-bold text-slate-400 mr-1">h</span>
          <span className="text-xl font-black text-slate-800">{Math.floor((totalSpentTime % 3600) / 60)}</span>
          <span className="text-[10px] font-bold text-slate-400">m</span>
        </div>
      </div>
    </div>
    <div className="flex-1 grid grid-cols-2 gap-4 w-full">
      {pieData.map(item => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <div className="min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase truncate">{item.label}</p>
            <p className="text-sm font-bold text-slate-700">{formatTime(item.value)}</p>
          </div>
        </div>
      ))}
      {pieData.length === 0 && <p className="col-span-2 text-xs text-slate-400 italic">No data for this period</p>}
    </div>
  </div>
);

// --- LIST ITEM: TASK ROW (Updated with Date Badge) ---
export const TaskRow = ({ task, isActive, showDate, onToggle, onStart, onEdit, onDelete }) => (
  <div className="group grid grid-cols-12 items-center px-6 py-5 hover:bg-slate-50/50 transition-colors">
    <div className="col-span-7 md:col-span-6 flex items-center gap-4">
      <button onClick={() => onToggle(task.id)} className={task.completed ? 'text-indigo-600' : 'text-slate-200'}>
        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-bold text-sm truncate ${task.completed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>{task.title}</p>
          {showDate && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">{task.date}</span>}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] font-black text-indigo-500 uppercase">{task.category}</span>
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><Clock size={10} /> {formatTime(task.spentTime)}</span>
        </div>
      </div>
    </div>
    <div className="col-span-3 flex justify-center">
      {isActive ? (
        <div className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-xl font-black text-[10px] animate-pulse">TRACKING...</div>
      ) : (
        <button onClick={() => onStart(task.id)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-black text-[10px] uppercase tracking-widest">
          <Play size={14} fill="currentColor" /> Start
        </button>
      )}
    </div>
    <div className="col-span-5 md:col-span-3 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={() => onEdit(task)} className="p-2 text-slate-300 hover:text-indigo-600"><Edit3 size={18} /></button>
      <button onClick={() => onDelete(task.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
    </div>
  </div>
);