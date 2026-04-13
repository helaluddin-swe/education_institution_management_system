import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './calendar-custom.css'; 

const AddNewTask = ({ editingTask, closeModal, handleSaveTask, formData, setFormData }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  // Helper to turn your "MMM DD" string back into a Date object for the calendar
  const getCalendarValue = () => {
    if (!formData.date) return new Date();
    try {
      // Assuming year 2026 based on your dashboard context
      return new Date(`${formData.date}, 2026`);
    } catch {
      return new Date();
    }
  };

  const handleDateChange = (date) => {
    // Format: "Mar 28"
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit' 
    });
    setFormData({ ...formData, date: formattedDate });
    setShowCalendar(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 text-gray-600 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] text-gray-700 w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-visible">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">
            {editingTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button 
            type="button"
            onClick={closeModal} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSaveTask} className="space-y-6">
          {/* Task Title */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Task Name</label>
            <input 
              required 
              autoFocus
              className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              placeholder="e.g. Design System Update" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* DATE PICKER SECTION */}
          <div className="relative">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Scheduled Date</label>
            <button 
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className={`w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold flex items-center justify-between transition-all ${showCalendar ? 'ring-2 ring-indigo-400 bg-white' : 'hover:bg-slate-100'}`}
            >
              <span className={formData.date ? 'text-slate-700' : 'text-slate-300'}>
                {formData.date || 'Select a date'}
              </span>
              <CalendarIcon size={18} className="text-indigo-500" />
            </button>

            {/* Calendar Popover */}
            {showCalendar && (
              <div className="absolute bottom-full mb-2 left-0 z-60 shadow-2xl border border-slate-100 rounded-3xl overflow-hidden bg-white p-2 animate-in slide-in-from-bottom-2">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Category</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors" 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Design</option>
                <option>Development</option>
                <option>Marketing</option>
                <option>Planning</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Priority</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors" 
                value={formData.priority} 
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-[0.98] mt-4"
          >
            {editingTask ? 'Save Changes' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNewTask;