import React, { useState, useMemo } from 'react';
import { 
  UserPlus, Mail, Trash2, Edit3, X, 
  CheckCircle2, Circle, TrendingUp, Plus, 
  MessageCircle, Send, Calendar, Tag, UserCheck, Users, Briefcase,Search
} from 'lucide-react';
import AddNewTask from '../teams/AddNewTask';

const Teams = ({ jobs }) => {
  // --- STATE: NETWORK MEMBERS ---
  const [team, setTeam] = useState([
    { id: 'm1', name: 'Alex Rivera', role: 'Technical Recruiter', company: 'Google', email: 'alex@google.com', phone: '123456789', status: 'High Priority' },
    { id: 'm2', name: 'Sarah Chen', role: 'Software Engineer (Mentor)', company: 'Netflix', email: 'sarah@netflix.com', phone: '987654321', status: 'Referrer' },
  ]);

  // --- STATE: ENGAGEMENT TASKS (FOLLOW-UPS) ---
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Send updated portfolio', category: 'Resume', assignedTo: 'm1', date: '2026-03-31', completed: false },
    { id: 't2', title: 'Schedule mock interview', category: 'Interview', assignedTo: 'm2', date: '2026-04-05', completed: true },
  ]);

  // --- UI STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [detailsMember, setDetailsMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({ name: '', role: '', email: '', company: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [taskFormData, setTaskFormData] = useState({ 
    title: '', category: 'Follow-up', assignedTo: '', date: new Date().toISOString().split('T')[0] 
  });

  // --- HELPERS ---
  const getMemberStats = (memberId) => {
    const assigned = tasks.filter(t => t.assignedTo === memberId);
    const completed = assigned.filter(t => t.completed).length;
    return { total: assigned.length, completed };
  };

  // --- TASK LOGIC ---
  const handleOpenTaskModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskFormData({ ...task });
    } else {
      setEditingTask(null);
      setTaskFormData({ 
        title: '', category: 'Follow-up', 
        assignedTo: detailsMember ? detailsMember.id : '', 
        date: new Date().toISOString().split('T')[0] 
      });
    }
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskPayload) => {
    const finalTask = { ...taskPayload, id: editingTask?.id || `t${Date.now()}` };
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? finalTask : t));
    } else {
      setTasks([finalTask, ...tasks]);
    }
    setIsTaskModalOpen(false);
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const deleteMember = (id) => {
    setTeam(team.filter(m => m.id !== id));
    setDetailsMember(null);
  };

  const filteredTeam = team.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-10 max-w-350 mx-auto bg-[#FAFBFF] min-h-screen text-slate-800">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
            <Users size={14}/> Network Intelligence
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Referral & Mentors</h1>
          <p className="text-slate-400 font-medium italic">Track key people helping you navigate your career move.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search network..." 
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-100 w-64 font-bold text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
            <UserPlus size={20} /> Add Contact
          </button>
        </div>
      </div>

      {/* NETWORK GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredTeam.map((member) => {
          const { total, completed } = getMemberStats(member.id);
          const progress = total > 0 ? (completed / total) * 100 : 0;
          return (
            <div 
              key={member.id} 
              onClick={() => setDetailsMember(member)} 
              className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-2xl cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="h-16 w-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-100">
                  {member.name.charAt(0)}
                </div>
                <div className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter ${
                  member.status === 'High Priority' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {member.status}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                  {member.name} <UserCheck size={16} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs font-black text-indigo-500 uppercase flex items-center gap-1">
                   <Briefcase size={12}/> {member.role} @ {member.company}
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex justify-between items-end text-[10px] font-black text-slate-400 uppercase">
                  <span>Engagement Strength</span>
                  <span className="text-indigo-600">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] font-bold text-slate-300 italic">{total - completed} pending actions</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- EXPANDED CONTACT DRAWER --- */}
      {detailsMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl transition-all">
          <div className="bg-white w-full max-w-6xl rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh] shadow-2xl animate-in slide-in-from-bottom-8">
            
            {/* Sidebar: Profile Info */}
            <div className="w-full md:w-96 bg-slate-50 p-10 flex flex-col border-r border-slate-100">
                <button onClick={() => setDetailsMember(null)} className="mb-8 p-3 w-fit bg-white hover:bg-rose-50 hover:text-rose-600 rounded-full transition shadow-sm"><X size={20}/></button>
                <div className="h-24 w-24 bg-white rounded-4xl flex items-center justify-center text-3xl font-black text-indigo-600 shadow-xl shadow-indigo-100/20 mb-6 mx-auto">{detailsMember.name.charAt(0)}</div>
                <h2 className="text-2xl font-black text-center text-slate-900">{detailsMember.name}</h2>
                <p className="text-indigo-500 font-black text-[10px] uppercase tracking-widest text-center mb-10">{detailsMember.role}</p>
                
                <div className="space-y-4 mb-10">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Direct Email</p>
                    <p className="text-sm font-bold truncate">{detailsMember.email}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleOpenTaskModal()}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition shadow-xl shadow-indigo-200"
                >
                  <Plus size={20}/> New Follow-up
                </button>
                <button onClick={() => deleteMember(detailsMember.id)} className="mt-4 text-[10px] font-black text-rose-300 hover:text-rose-600 uppercase transition">Remove from network</button>
            </div>

            {/* Content: Engagement Board */}
            <div className="flex-1 flex flex-col p-12 overflow-hidden bg-white">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black flex items-center gap-3 text-slate-800">
                    <Send size={24} className="text-indigo-600"/> Action Items
                  </h3>
                  <p className="text-sm font-medium text-slate-400">Keep this conversation warm by completing tasks</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-2xl text-center min-w-25">
                  <p className="text-[10px] font-black text-indigo-400 uppercase leading-none">Status</p>
                  <p className="text-lg font-black text-indigo-600">{detailsMember.status}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                {tasks.filter(t => t.assignedTo === detailsMember.id).map(task => (
                  <div key={task.id} className="group p-6 bg-slate-50/50 border border-transparent rounded-4xl flex items-center justify-between hover:bg-white hover:border-indigo-100 transition-all">
                    <div className="flex items-center gap-6">
                      <button onClick={() => toggleTaskStatus(task.id)} className="transition-transform active:scale-90">
                        {task.completed ? <CheckCircle2 className="text-emerald-500" size={28} /> : <Circle className="text-slate-200 hover:text-indigo-300 transition-colors" size={28} />}
                      </button>
                      <div>
                        <p className={`text-lg font-bold ${task.completed ? 'line-through text-slate-300' : 'text-slate-700'}`}>{task.title}</p>
                        <div className="flex gap-4 mt-1">
                          <span className="text-[10px] flex items-center gap-1 text-slate-400 font-black uppercase"><Calendar size={12}/> {task.date}</span>
                          <span className="text-[10px] flex items-center gap-1 text-indigo-400 font-black uppercase px-2 py-0.5 bg-indigo-50 rounded-md"><Tag size={10}/> {task.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => handleOpenTaskModal(task)} className="p-3 bg-white text-slate-400 rounded-2xl hover:text-indigo-600 transition shadow-sm border border-slate-100">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-3 bg-white text-slate-400 rounded-2xl hover:text-rose-600 transition shadow-sm border border-slate-100">
                        <Trash2 size={18} onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INVITE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black mb-8 text-slate-900 tracking-tighter">Add to Network</h2>
            <form onSubmit={(e) => {
               e.preventDefault();
               setTeam([...team, { id: `m${Date.now()}`, ...formData, status: 'New Contact' }]);
               setIsModalOpen(false);
               setFormData({ name: '', role: '', email: '', company: '' });
            }} className="space-y-4">
              <input required placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold placeholder:text-slate-300" />
              <input required placeholder="Role (e.g. Hiring Manager)" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold placeholder:text-slate-300" />
              <input required placeholder="Company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold placeholder:text-slate-300" />
              <input required placeholder="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold placeholder:text-slate-300" />
              
              <div className="pt-4 flex flex-col gap-2">
                <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Contact</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-3 text-slate-400 font-black text-xs uppercase">Dismiss</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TASK MODAL COMPONENT */}
      {isTaskModalOpen && (
        <AddNewTask
          editingTask={editingTask} 
          closeModal={() => setIsTaskModalOpen(false)} 
          handleSaveTask={handleSaveTask} 
          formData={taskFormData} 
          setFormData={setTaskFormData}
          team={team}
        />
      )}
    </div>
  );
};

export default Teams;