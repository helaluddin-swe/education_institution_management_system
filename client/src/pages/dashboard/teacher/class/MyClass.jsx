import { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  X, Users, Clock, BookOpen, Presentation, 
  AlignLeft, Loader2, MapPin, GraduationCap 
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
  const { user } = useAuth(); // Contains teacher's _id/employeeId
  const { events, loading } = useSchedule();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 1. Teacher-Specific Filtering
  // Filter events where the employeeId matches the logged-in teacher's ID
  const teacherSchedule = useMemo(() => {
    return events.filter(event => 
      event.extendedProps.employeeId === user?._id
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
      {/* Teacher Stats Header */}
      <div className="max-w-6xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase">My Teaching Load</h1>
            <p className="text-slate-500 font-medium">Hello, {user?.name || 'Professor'}. Here is your agenda.</p>
          </div>
          <div className="hidden sm:block p-4 bg-blue-50 text-blue-600 rounded-3xl">
            <Presentation size={32} />
          </div>
        </div>
        
        <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-lg flex flex-col justify-center">
          <span className="text-xs font-bold uppercase opacity-80">Today's Sessions</span>
          <span className="text-4xl font-black">{teacherSchedule.length}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 calendar-wrapper">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek" // Teachers often prefer a weekly overview
            allDaySlot={false}
            slotMinTime="07:00:00"
            slotMaxTime="19:00:00"
            events={teacherSchedule}
            eventClick={handleEventClick}
            selectable={false}
            headerToolbar={{ 
              left: 'prev,next today', 
              center: 'title', 
              right: 'timeGridDay,timeGridWeek' 
            }}
            height="auto"
            nowIndicator={true}
          />
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            
            <div className="p-8 text-white flex justify-between items-start" 
                 style={{ backgroundColor: SCHEDULE_CATEGORIES[selectedEvent.category]?.color || '#64748b' }}>
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest opacity-80">
                  {selectedEvent.category} — {selectedEvent.className}
                </span>
                <h3 className="text-2xl font-bold leading-tight">
                  {selectedEvent.subject}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-3xl">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Section</p>
                   <p className="font-bold text-slate-800 text-lg">{selectedEvent.section}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-3xl">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Room</p>
                   <p className="font-bold text-slate-800 text-lg">B-102</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Clock size={20} />
                  </div>
                  <p className="font-bold text-slate-800">
                    {formatTime(selectedEvent.start)} — {formatTime(selectedEvent.end)}
                  </p>
                </div>

                <div className="flex gap-4 text-slate-600 border-t pt-4">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <AlignLeft size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lesson Plan / Topics</p>
                    <p className="text-slate-800 font-bold mt-1">{selectedEvent.topics || "No topics listed"}</p>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                      {selectedEvent.description || "Review previous materials before session."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t flex gap-3">
              <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2">
                Mark Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClass;