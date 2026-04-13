import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Trash2, X, Bell, GraduationCap, Users, Coffee, BookOpen } from 'lucide-react';

// School Specific Categories & Colors
const ACADEMIC_CATEGORIES = {
  Exam: { color: '#ef4444', icon: <BookOpen size={14}/>, label: 'Exam' },
  Holiday: { color: '#f59e0b', icon: <Coffee size={14}/>, label: 'Holiday' },
  Event: { color: '#3b82f6', icon: <Users size={14}/>, label: 'School Event' },
  Class: { color: '#10b981', icon: <GraduationCap size={14}/>, label: 'Special Class' }
};

const EventsCalendar = ({ userRole = 'admin' }) => {
  const [events, setEvents] = useState([
    { id: '1', title: 'Mid-Term Exam', start: '2026-04-10', category: 'Exam', backgroundColor: '#ef4444', borderColor: '#ef4444' },
    { id: '2', title: 'Pohela Boishakh Holiday', start: '2026-04-14', category: 'Holiday', backgroundColor: '#f59e0b', borderColor: '#f59e0b' }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({ id: '', title: '', start: '', category: 'Event', description: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  const isAdmin = userRole === 'admin';

  // --- HANDLERS ---
  const handleDateSelect = (selectInfo) => {
    if (!isAdmin) return;
    setSelectedEvent({
      id: String(Date.now()),
      title: '',
      start: selectInfo.startStr,
      category: 'Event',
      description: ''
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const { id, title, startStr, extendedProps } = clickInfo.event;
    setSelectedEvent({ 
      id, 
      title, 
      start: startStr, 
      category: extendedProps?.category || 'Event',
      description: extendedProps?.description || ''
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const saveEvent = (e) => {
    e.preventDefault();
    const eventData = {
      ...selectedEvent,
      backgroundColor: ACADEMIC_CATEGORIES[selectedEvent.category].color,
      borderColor: ACADEMIC_CATEGORIES[selectedEvent.category].color,
      extendedProps: { 
        category: selectedEvent.category,
        description: selectedEvent.description 
      }
    };

    if (isEditMode) {
      setEvents(events.map(ev => ev.id === selectedEvent.id ? eventData : ev));
    } else {
      setEvents([...events, eventData]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-white rounded-2xl text-zink-500 shadow-sm border border-slate-200 min-h-screen">
      {/* School Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="text-blue-600" /> Academic Calendar
          </h2>
          <p className="text-slate-500 text-sm">Manage exams, holidays, and campus events.</p>
        </div>
        
        <div className="flex flex-wrap text-gray-600 gap-2">
          {Object.entries(ACADEMIC_CATEGORIES).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border rounded-full text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: val.color }}></span>
              {val.label}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white text-gray-600 calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          editable={isAdmin}
          selectable={isAdmin}
          select={handleDateSelect}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
          }}
          height="75vh"
        />
      </div>

      {/* Event Modal (Unified for View/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-4">
          <form onSubmit={saveEvent} className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border text-zink-500 border-slate-100">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {isAdmin ? (isEditMode ? 'Edit Academic Event' : 'Schedule Event') : 'Event Details'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">
                <X className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Event Name</label>
                <input
                  disabled={!isAdmin}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-70 text-zink-500"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({...selectedEvent, title: e.target.value})}
                  placeholder="e.g., Final Term Physics"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Category</label>
                <select
                  disabled={!isAdmin}
                  className="w-full px-4 py-2 bg-slate-50 border text-zink-500 border-slate-200 rounded-xl outline-none"
                  value={selectedEvent.category}
                  onChange={(e) => setSelectedEvent({...selectedEvent, category: e.target.value})}
                >
                  {Object.keys(ACADEMIC_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Notes / Description</label>
                <textarea
                  disabled={!isAdmin}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none min-h-20 text-zink-500"
                  value={selectedEvent.description}
                  onChange={(e) => setSelectedEvent({...selectedEvent, description: e.target.value})}
                  placeholder="Add details about classroom or requirements..."
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex gap-2">
              {!isAdmin && (
                <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold">
                  <Bell size={18} /> Set Reminder
                </button>
              )}
              {isAdmin && (
                <>
                  <button 
                    type="button" 
                    onClick={() => {
                      setEvents(events.filter(e => e.id !== selectedEvent.id));
                      setIsModalOpen(false);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={22} />
                  </button>
                  <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 transition">
                    {isEditMode ? 'Update Schedule' : 'Confirm Event'}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .fc-theme-standard .fc-scrollgrid { border: none !important; }
        .fc-day-today { background: #f8fafc !important; }
        .fc-event { border-radius: 6px !important; padding: 2px 5px !important; font-size: 0.85rem !important; border: none !important; }
        .fc-toolbar-title { font-size: 1.2rem !important; font-weight: 800 !important; color: #1e293b; }
        .fc .fc-button-primary { background: #3b82f6; border: none; font-weight: 600; }
        .fc .fc-button-primary:hover { background: #2563eb; }
      `}} />
    </div>
  );
};

export default EventsCalendar;