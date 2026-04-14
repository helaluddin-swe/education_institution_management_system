import { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  X, Bell, GraduationCap, Users, 
  Clock, BookOpen, Presentation, MapPin, AlignLeft, Loader2
} from 'lucide-react';
// Context Imports
import { useSchedule } from '../../../../context/ScheduleContext';
import { useAuth } from '../../../../context/AuthContext';

const SCHEDULE_CATEGORIES = {
  Lecture: { color: '#3b82f6', icon: <BookOpen size={14}/>, label: 'Lecture' },
  Lab: { color: '#10b981', icon: <Presentation size={14}/>, label: 'Lab Session' },
  Meeting: { color: '#8b5cf6', icon: <Users size={14}/>, label: 'Staff Meeting' },
  Duty: { color: '#f59e0b', icon: <Clock size={14}/>, label: 'Exam Duty' },
  Other: { color: '#64748b', icon: <GraduationCap size={14}/>, label: 'Other' }
};

const MyClass = () => {
  // 1. Context Hooks
  const { user } = useAuth(); // Assume user object contains className and section
  const { events, loading } = useSchedule();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 2. Student-Specific Filtering
  // Only show events that match the student's Grade and Section
  const studentEvents = useMemo(() => {
    return events.filter(event => 
      event.extendedProps.className === user?.className && 
      event.extendedProps.section === user?.section
    );
  }, [events, user]);

  const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEventClick = (clickInfo) => {
    const { title, start, end, extendedProps } = clickInfo.event;
    setSelectedEvent({ 
      title, 
      start: start.toISOString(), 
      end: end ? end.toISOString() : start.toISOString(),
      ...extendedProps 
    });
    setIsModalOpen(true);
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-gray-900">
      {/* Student Welcome Header */}
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-[40px] text-white shadow-lg">
        <h1 className="text-3xl font-black">Daily Schedule</h1>
        <p className="opacity-80 font-medium mt-1">
          {user?.className} — Section {user?.section} | {new Date().toDateString()}
        </p>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 calendar-wrapper">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            events={studentEvents}
            eventClick={handleEventClick}
            selectable={false} // Students cannot select/create slots
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'timeGridDay,timeGridWeek' }}
            height="auto"
            nowIndicator={true}
          />
        </div>
      </div>

      {/* View-Only Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-8 text-white flex justify-between items-start" 
                 style={{ backgroundColor: SCHEDULE_CATEGORIES[selectedEvent.category]?.color || '#64748b' }}>
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest opacity-80">
                  {selectedEvent.category}
                </span>
                <h3 className="text-2xl font-bold leading-tight">
                  {selectedEvent.subject || selectedEvent.title}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-6">
                {/* Time Slot */}
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time Slot</p>
                    <p className="font-bold text-slate-800">
                      {formatTime(selectedEvent.start)} — {formatTime(selectedEvent.end)}
                    </p>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-green-600">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instructor</p>
                    <p className="font-bold text-slate-800">{selectedEvent.instructorName || 'Academic Staff'}</p>
                  </div>
                </div>

                {/* Topics/Description */}
                <div className="flex gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-purple-600 shrink-0">
                    <AlignLeft size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lesson Focus</p>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedEvent.topics}</p>
                    <p className="text-slate-600 text-sm leading-relaxed mt-1">
                      {selectedEvent.description || "No specific instructions provided for this session."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                <Bell size={20} /> Set Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClass;