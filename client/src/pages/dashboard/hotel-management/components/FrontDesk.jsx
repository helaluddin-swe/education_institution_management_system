import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Trash2, X, Bed, Info } from 'lucide-react';
import CategoryFilter, { HOTEL_CATEGORIES } from '../front-desk/FilterCategory';

// Import the shared component and categories


const FrontDesk = ({ userRole = 'admin' }) => {
  const [events, setEvents] = useState([
    { 
      id: '1', 
      title: 'Room 304 - Mr. Helal', 
      start: '2026-03-27', 
      category: 'CheckIn', 
      backgroundColor: HOTEL_CATEGORIES.CheckIn.color, 
      borderColor: HOTEL_CATEGORIES.CheckIn.color,
      extendedProps: { category: 'CheckIn', roomNumber: '304' }
    },
    { 
      id: '2', 
      title: 'Suite 101 - Maintenance', 
      start: '2026-03-28', 
      category: 'Maintenance', 
      backgroundColor: HOTEL_CATEGORIES.Maintenance.color, 
      borderColor: HOTEL_CATEGORIES.Maintenance.color,
      extendedProps: { category: 'Maintenance', roomNumber: '101' }
    }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({ id: '', title: '', start: '', category: 'Reserved', description: '', roomNumber: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  
  // FILTER STATE
  const [activeFilters, setActiveFilters] = useState(Object.keys(HOTEL_CATEGORIES));

  const isAdmin = userRole === 'admin';

  // --- FILTER LOGIC ---
  const toggleFilter = (category) => {
    if (category === 'ALL') {
      setActiveFilters(Object.keys(HOTEL_CATEGORIES));
      return;
    }
    setActiveFilters(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
        // Ensure we check category from top level or extendedProps
        const cat = event.category || event.extendedProps?.category;
        return activeFilters.includes(cat);
    });
  }, [events, activeFilters]);

  // --- CALENDAR HANDLERS ---
  const handleDateSelect = (selectInfo) => {
    if (!isAdmin) return;
    setSelectedEvent({
      id: String(Date.now()),
      title: '',
      start: selectInfo.startStr,
      category: 'Reserved',
      description: '',
      roomNumber: ''
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
      category: extendedProps?.category || 'Reserved',
      description: extendedProps?.description || '',
      roomNumber: extendedProps?.roomNumber || ''
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const saveEvent = (e) => {
    e.preventDefault();
    const eventData = {
      ...selectedEvent,
      backgroundColor: HOTEL_CATEGORIES[selectedEvent.category].color,
      borderColor: HOTEL_CATEGORIES[selectedEvent.category].color,
      extendedProps: { 
        category: selectedEvent.category,
        description: selectedEvent.description,
        roomNumber: selectedEvent.roomNumber
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
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Dashboard Header */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
              <Bed className="text-blue-600" size={28} /> Front-Desk Ops
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Property Management Control Center</p>
          </div>
          
          <CategoryFilter activeFilters={activeFilters} toggleFilter={toggleFilter}/>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white text-gray-600 p-4 rounded-3xl shadow-sm border border-slate-200 calendar-wrapper overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={filteredEvents} // Uses the filtered list
            editable={isAdmin}
            selectable={isAdmin}
            select={handleDateSelect}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            }}
            height="70vh"
          />
        </div>
      </div>

      {/* Unified Modal (remains same as your updated version) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-999 flex items-center justify-center p-4">
          <form onSubmit={saveEvent} className="bg-white text-gray-600 border-gray-500 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="p-6 border-b flex justify-between items-center bg-slate-50/80">
              <h3 className="text-lg font-bold text-slate-800">
                {isAdmin ? (isEditMode ? 'Update Log' : 'New Entry') : 'Booking Details'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)}><X className="text-slate-400" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Guest / Task Name</label>
                <input
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({...selectedEvent, title: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Room</label>
                  <input
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    value={selectedEvent.roomNumber}
                    onChange={(e) => setSelectedEvent({...selectedEvent, roomNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Status</label>
                  <select
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    value={selectedEvent.category}
                    onChange={(e) => setSelectedEvent({...selectedEvent, category: e.target.value})}
                  >
                    {Object.keys(HOTEL_CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{HOTEL_CATEGORIES[cat].label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex gap-2">
                {isAdmin && (
                    <>
                    <button type="button" onClick={() => { setEvents(events.filter(e => e.id !== selectedEvent.id)); setIsModalOpen(false); }} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2/></button>
                    <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold">Save Changes</button>
                    </>
                )}
            </div>
          </form>
        </div>
      )}

      {/* Calendar Styling Customization */}
      <style dangerouslySetInnerHTML={{ __html: `
        .fc { --fc-border-color: #f1f5f9; --fc-daygrid-event-dot-width: 8px; }
        .fc-theme-standard .fc-scrollgrid { border: none !important; }
        .fc-day-today { background: #f8fafc !important; }
        .fc-event { border-radius: 6px !important; padding: 3px 6px !important; font-weight: 600 !important; font-size: 0.75rem !important; border: none !important; }
        .fc-toolbar-title { font-weight: 800 !important; color: #1e293b; letter-spacing: -0.025em; }
        .fc .fc-button-primary { background: #fff !important; border: 1px solid #e2e8f0 !important; color: #64748b !important; font-size: 0.8rem !important; font-weight: 700 !important; }
        .fc .fc-button-active { background: #3b82f6 !important; color: #fff !important; border-color: #3b82f6 !important; }
      `}} />
    </div>
  );
};

export default FrontDesk;