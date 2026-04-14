import { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  Trash2, X, Clock, Filter, Tag, Loader2 
} from 'lucide-react';
import { useSchedule } from '../../../../context/ScheduleContext';
import { useAuth } from '../../../../context/AuthContext';


const SCHEDULE_CATEGORIES = {
  Lecture: { color: '#3b82f6', label: 'Lecture' },
  Lab: { color: '#10b981', label: 'Lab Session' },
  Meeting: { color: '#8b5cf6', label: 'Staff Meeting' },
  Duty: { color: '#f59e0b', label: 'Exam Duty' },
  Other: { color: '#64748b', label: 'Other' }
};

const CLASSES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const SECTIONS = ['A', 'B', 'C', 'Science', 'Arts'];
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Computer Science'];

const MyClass = () => {
  const { user } = useAuth();
  const { 
    events, teachers, loading, 
    addSchedule, updateSchedule, deleteSchedule 
  } = useSchedule();

  const [filterClass, setFilterClass] = useState('All');
  const [filterSection, setFilterSection] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin';

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchClass = filterClass === 'All' || event.extendedProps.className === filterClass;
      const matchSection = filterSection === 'All' || event.extendedProps.section === filterSection;
      return matchClass && matchSection;
    });
  }, [events, filterClass, filterSection]);

  const handleEventClick = (clickInfo) => {
    const { id, start, end, extendedProps } = clickInfo.event;
    setSelectedEvent({ 
      id, 
      start: start.toISOString(), 
      end: end ? end.toISOString() : start.toISOString(),
      ...extendedProps 
    });
    setIsEditMode(false); 
    setIsModalOpen(true);
  };

  const handleDateSelect = (selectInfo) => {
    if (!isAdmin) return;
    setSelectedEvent({
      id: null,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      category: 'Lecture',
      className: filterClass !== 'All' ? filterClass : CLASSES[0],
      section: filterSection !== 'All' ? filterSection : SECTIONS[0],
      subject: SUBJECTS[0],
      // UPDATE: Use employeeId instead of instructor
      employeeId: teachers[0]?._id || '', 
      topics: '',
      description: ''
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const updateTime = (isoString, timeValue) => {
    const date = isoString.split('T')[0];
    return `${date}T${timeValue}:00`;
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const payload = {
      ...selectedEvent,
      backgroundColor: SCHEDULE_CATEGORIES[selectedEvent.category].color,
      borderColor: SCHEDULE_CATEGORIES[selectedEvent.category].color,
    };

    let result;
    if (selectedEvent.id) {
      result = await updateSchedule(selectedEvent.id, payload);
    } else {
      result = await addSchedule(payload);
    }

    if (result.success) {
      setIsModalOpen(false);
    } else {
      alert(result.message);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this schedule?")) {
      setIsSubmitting(true);
      const result = await deleteSchedule(selectedEvent.id);
      if (result.success) setIsModalOpen(false);
      setIsSubmitting(false);
    }
  };

  if (loading && events.length === 0) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-sm px-2"><Filter size={18} /> Filters:</div>
          <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="All">All Classes</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={filterSection} onChange={(e) => setFilterSection(e.target.value)}>
            <option value="All">All Sections</option>
            {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 text-gray-900">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              allDaySlot={false}
              events={filteredEvents}
              eventClick={handleEventClick}
              selectable={isAdmin}
              select={handleDateSelect}
              headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
              height="75vh"
            />
          </div>
        </div>
      </div>

      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-9999 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-white" style={{ backgroundColor: SCHEDULE_CATEGORIES[selectedEvent.category].color }}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{selectedEvent.className} — Section {selectedEvent.section}</span>
                <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
              </div>
              <h3 className="text-2xl font-bold mt-1">{isEditMode ? 'Modify Schedule' : selectedEvent.subject}</h3>
            </div>

            <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {isEditMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Subject</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                      value={selectedEvent.subject} onChange={(e) => setSelectedEvent({...selectedEvent, subject: e.target.value})}>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Assigned Instructor</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                      // UPDATE: value is now employeeId
                      value={selectedEvent.employeeId} 
                      onChange={(e) => setSelectedEvent({...selectedEvent, employeeId: e.target.value})}>
                      <option value="">Select a Teacher</option>
                      {teachers.map(t => (
                        <option key={t._id} value={t._id}>
                          {t.fullName || t.name} {/* Adapt to your staff model naming */}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Start Time</label>
                    <input type="time" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                      value={selectedEvent.start.split('T')[1].substring(0,5)} 
                      onChange={(e) => setSelectedEvent({...selectedEvent, start: updateTime(selectedEvent.start, e.target.value)})}/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">End Time</label>
                    <input type="time" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                      value={selectedEvent.end.split('T')[1].substring(0,5)} 
                      onChange={(e) => setSelectedEvent({...selectedEvent, end: updateTime(selectedEvent.end, e.target.value)})}/>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Topics</label>
                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                      value={selectedEvent.topics} onChange={(e) => setSelectedEvent({...selectedEvent, topics: e.target.value})} />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Class</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                      value={selectedEvent.className} onChange={(e) => setSelectedEvent({...selectedEvent, className: e.target.value})}>
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Section</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                      value={selectedEvent.section} onChange={(e) => setSelectedEvent({...selectedEvent, section: e.target.value})}>
                      {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Clock size={20}/></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Time & Instructor</p>
                      <p className="font-bold text-slate-700">
                        {selectedEvent.start.split('T')[1].substring(0,5)} — {selectedEvent.end.split('T')[1].substring(0,5)}
                      </p>
                      <p className="text-xs text-slate-500">By {selectedEvent.instructorName || "Unassigned"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Tag size={20}/></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Topic</p>
                      <p className="font-bold text-slate-700">{selectedEvent.topics || "General Session"}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Notes</p>
                    <p className="text-sm text-slate-600">{selectedEvent.description || "No notes."}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t flex gap-3">
              {isAdmin && (
                isEditMode ? (
                  <button 
                    disabled={isSubmitting}
                    onClick={handleSave} 
                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                ) : (
                  <>
                    <button onClick={handleDelete} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100"><Trash2 size={20}/></button>
                    <button onClick={() => setIsEditMode(true)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold">Edit Details</button>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClass;