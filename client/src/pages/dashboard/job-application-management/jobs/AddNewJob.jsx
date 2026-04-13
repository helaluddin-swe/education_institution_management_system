import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './calendar-custom.css'; 

const AddNewJob = ({ editingTask, closeModal, handleSaveTask, formData, setFormData }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const getCalendarValue = () => {
    if (!formData.date) return new Date();
    try {
      return new Date(`${formData.date}, 2026`);
    } catch {
      return new Date();
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit' 
    });
    setFormData({ ...formData, date: formattedDate });
    setShowCalendar(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 text-gray-600 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] text-gray-700 w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-visible border border-slate-100">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              {editingTask ? 'Update Listing' : 'Post New Job'}
            </h2>
            <p className="text-xs font-medium text-slate-400">Fill in the details for the position</p>
          </div>
          <button 
            type="button"
            onClick={closeModal} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSaveTask} className="space-y-5">
          {/* Job Title */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-2 mb-1.5 block">Job Title</label>
            <input 
              required 
              autoFocus
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
              placeholder="e.g. Senior MERN Stack Developer" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-2 mb-1.5 block">Category</label>
              <select 
                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors appearance-none" 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Web Development</option>
                <option>Web Design</option>
                <option>Marketing</option>
                <option>Business Planning</option>
                <option>Frontend Engineer</option>
                <option>Backend Developer</option>
                <option>Network Engineer</option>
              </select>
            </div>

            {/* Location/Type */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-2 mb-1.5 block">Job Type</label>
              <select 
                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors appearance-none" 
                value={formData.priority} 
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-Site</option>
              </select>
            </div>
          </div>

          {/* Salary & Date Row */}
          <div className="grid grid-cols-2 gap-4">
             {/* Salary Field */}
             <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-2 mb-1.5 block">Salary Range</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="$10k - $20k"
                  className="w-full pl-9 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none"
                  value={formData.salary || ''}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                />
                <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" />
              </div>
            </div>

            {/* Date Picker */}
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-2 mb-1.5 block">Application Deadline</label>
              <button 
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold flex items-center justify-between transition-all ${showCalendar ? 'ring-2 ring-indigo-400 bg-white' : 'hover:bg-slate-100'}`}
              >
                <span className={formData.date ? 'text-slate-700' : 'text-slate-300'}>
                  {formData.date || 'Set Date'}
                </span>
                <CalendarIcon size={16} className="text-indigo-500" />
              </button>

              {showCalendar && (
                <div className="absolute bottom-full mb-4 right-0 z-60 shadow-2xl border border-slate-100 rounded-3xl overflow-hidden bg-white p-2 animate-in slide-in-from-bottom-2">
                  <Calendar 
                    onChange={handleDateChange} 
                    value={getCalendarValue()} 
                    className="border-none font-sans"
                    prevLabel={<ChevronLeft size={16} className="mx-auto" />}
                    nextLabel={<ChevronRight size={16} className="mx-auto" />}
                  />
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-[0.98] mt-4"
          >
            {editingTask ? 'Update Job Details' : 'Publish Job Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNewJob;