import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, User, Tag } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './calendar-custom.css'; 

const AddNewTask = ({ editingTask, closeModal, handleSaveTask, formData, setFormData, team }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const currentAssignee = team?.find(m => m.id === formData.assignedTo);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCalendarValue = () => {
    if (!formData.date) return new Date();
    // Assuming date format is "Mar 31" or "YYYY-MM-DD"
    const parsed = new Date(formData.date);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const handleDateChange = (date) => {
    // Storing as ISO for better logic, though we can display it formatted
    const dateString = date.toISOString().split('T')[0];
    setFormData({ ...formData, date: dateString });
    setShowCalendar(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSaveTask({
      ...formData,
      id: editingTask?.id || `t${Date.now()}`,
      completed: editingTask?.completed || false,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-110 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {editingTask ? 'Update Action' : 'New Engagement'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Networking Task</p>
          </div>
          <button type="button" onClick={closeModal} className="text-slate-400 hover:bg-slate-50 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Action Description */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">What's the next step?</label>
            <input 
              required 
              placeholder="e.g. Send thank you email"
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Date Picker */}
          <div className="relative" ref={calendarRef}>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">Target Date</label>
            <button 
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className={`w-full px-6 py-4 rounded-2xl text-sm font-bold flex items-center justify-between transition-all ${
                showCalendar ? 'ring-2 ring-indigo-500 bg-white shadow-lg' : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <span className={formData.date ? 'text-slate-700' : 'text-slate-300'}>
                {formData.date || 'Select Date'}
              </span>
              <CalendarIcon size={18} className="text-indigo-500" />
            </button>

            {showCalendar && (
              <div className="absolute top-[110%] left-0 z-120 shadow-2xl border border-slate-100 rounded-4xl overflow-hidden bg-white p-4 animate-in fade-in slide-in-from-top-2">
                <Calendar 
                  onChange={handleDateChange} 
                  value={getCalendarValue()} 
                  prevLabel={<ChevronLeft size={16} />}
                  nextLabel={<ChevronRight size={16} />}
                  className="border-none font-sans"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category/Tag */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">Action Type</label>
              <div className="relative">
                <select 
                  className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none appearance-none focus:ring-2 focus:ring-indigo-500 cursor-pointer" 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Follow-up">Follow-up</option>
                  <option value="Referral">Referral</option>
                  <option value="Interview">Interview</option>
                  <option value="Coffee Chat">Coffee Chat</option>
                  <option value="Resume">Resume</option>
                </select>
                <Tag size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Assignee (Read Only Context) */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">Contact</label>
              <div className="w-full px-5 py-4 bg-indigo-50 text-indigo-600 rounded-2xl text-sm font-bold flex items-center gap-2 border border-indigo-100">
                <User size={14}/>
                <span className="truncate">{currentAssignee?.name || 'Network'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-4xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all">
              {editingTask ? 'Save Updates' : 'Schedule Action'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNewTask;