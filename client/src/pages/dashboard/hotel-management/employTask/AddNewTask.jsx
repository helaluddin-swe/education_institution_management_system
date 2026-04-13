import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, User } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './calendar-custom.css'; 

const AddNewTask = ({ editingTask, closeModal, handleSaveTask, formData, setFormData, team }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const currentAssignee = team?.find(m => m.id === formData.assignedTo);

  // FIXED: More robust date parsing
  const getCalendarValue = () => {
    if (!formData.date) return new Date();
    const parsed = new Date(`${formData.date}, 2026`);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit' 
    });
    setFormData({ ...formData, date: formattedDate });
    setShowCalendar(false); // Close after selection
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSaveTask({
      ...formData,
      id: editingTask?.id || Date.now(),
      completed: editingTask?.completed || false,
    });
  };

  return (
    // Increased Z-index to ensure it's on top of all modals
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl relative overflow-visible">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">
            {editingTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button type="button" onClick={closeModal} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Task Description</label>
            <input 
              required 
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* DATE PICKER - POSITION FIXED */}
          <div className="relative">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Due Date</label>
            <button 
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className={`w-full px-6 py-4 rounded-2xl text-sm font-bold flex items-center justify-between transition-all ${
                showCalendar ? 'ring-2 ring-indigo-500 bg-white' : 'bg-slate-50'
              }`}
            >
              <span className={formData.date ? 'text-slate-700' : 'text-slate-300'}>
                {formData.date || 'Pick a date'}
              </span>
              <CalendarIcon size={18} className="text-indigo-500" />
            </button>

            {/* FIXED POPOVER: Used absolute top to avoid "bottom-full" clipping issues */}
            {showCalendar && (
              <div className="absolute top-[110%] left-0 z-120 shadow-2xl border border-slate-100 rounded-4xl overflow-hidden bg-white p-4 animate-in fade-in slide-in-from-top-2">
                <Calendar 
                  onChange={handleDateChange} 
                  value={getCalendarValue()} 
                  prevLabel={<ChevronLeft size={16} />}
                  nextLabel={<ChevronRight size={16} />}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Tag</label>
              <select 
                className="w-full px-4 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none appearance-none" 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Design</option>
                <option>Dev</option>
                <option>Marketing</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Assignee</label>
              <div className="w-full px-4 py-4 bg-indigo-50 text-indigo-600 rounded-2xl text-sm font-bold flex items-center gap-2">
                <User size={14}/>
                <span className="truncate">{currentAssignee?.name || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            {editingTask ? 'Save Changes' : 'Confirm Assignment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNewTask;