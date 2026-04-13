import React, { useState } from 'react';
import { 
  UserPlus, Mail, Trash2, Edit3, Search, X, 
  CheckCircle2, Circle, TrendingUp, Plus, 
  MessageCircle, Send, Calendar, Tag
} from 'lucide-react';
import AddNewTask from './AddNewTask';



const AssignTask = ({ tasks, setTasks }) => {
  // --- TEAM STATE ---
  const [team, setTeam] = useState([
    { id: 'm1', name: 'Alex Rivera', role: 'Lead Designer', email: 'alex@startup.com', phone: '+123456789', status: 'Active' },
    { id: 'm2', name: 'Sarah Chen', role: 'Senior Dev', email: 'sarah@startup.com', phone: '+198765432', status: 'Available' },
  ]);

  // --- UI STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false); // Team Member Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // Task Modal
  const [detailsMember, setDetailsMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form Data for New Team Member
  const [formData, setFormData] = useState({ name: '', role: 'Developer', email: '' });
  
  // Form Data for Tasks
  const [editingTask, setEditingTask] = useState(null);
  const [taskFormData, setTaskFormData] = useState({ 
    title: '', 
    category: 'Design', 
    assignedTo: '', 
    date: new Date().toISOString().split('T')[0] 
  });

  // --- HELPERS ---
  const getMemberStats = (memberId) => {
    const assigned = tasks.filter(t => t.assignedTo === memberId);
    const completed = assigned.filter(t => t.completed).length;
    return { total: assigned.length, completed };
  };

  // --- TASK CRUD LOGIC ---
  const handleOpenTaskModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskFormData({ 
        title: task.title, 
        category: task.category, 
        assignedTo: task.assignedTo, 
        date: task.date 
      });
    } else {
      setEditingTask(null);
      setTaskFormData({ 
        title: '', 
        category: 'Design', 
        assignedTo: detailsMember ? detailsMember.id : '', 
        date: new Date().toISOString().split('T')[0] 
      });
    }
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskPayload) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? taskPayload : t));
    } else {
      setTasks([taskPayload, ...tasks]);
    }
    setIsTaskModalOpen(false);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  // --- SHARING LOGIC ---
  const shareViaWhatsApp = (member, task) => {
    const message = `Hi ${member.name}, task updated: *${task.title}*. Status: ${task.completed ? 'Done' : 'Pending'}.`;
    window.open(`https://wa.me/${member.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaGmail = (member, task) => {
    const subject = `Task Assignment: ${task.title}`;
    const body = `Hello ${member.name},\n\nTask: ${task.title}\nCategory: ${task.category}\nDate: ${task.date}`;
    window.open(`mailto:${member.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // --- TEAM CRUD ---
  const handleAddMember = (e) => {
    e.preventDefault();
    setTeam([...team, { id: `m${Date.now()}`, ...formData, status: 'Available' }]);
    setIsModalOpen(false);
    setFormData({ name: '', role: 'Developer', email: '' });
  };

  const filteredTeam = team.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto bg-[#FDFDFF] min-h-screen text-slate-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Team Control</h1>
          <p className="text-slate-400 font-medium">Manage workloads and direct assignments</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          <UserPlus size={18} /> Add Member
        </button>
      </div>

      {/* TEAM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member) => {
          const stats = getMemberStats(member.id);
          const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
          return (
            <div key={member.id} onClick={() => setDetailsMember(member)} className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl cursor-pointer transition-all group">
              <div className="flex justify-between mb-4">
                <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg">{member.name.charAt(0)}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={12}/> {Math.round(progress)}% Efficiency
                </div>
              </div>
              <h3 className="text-lg font-black group-hover:text-indigo-600 transition-colors">{member.name}</h3>
              <p className="text-xs text-slate-400 mb-4 font-bold uppercase tracking-widest">{member.role}</p>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* --- DETAILS VIEW MODAL --- */}
      {detailsMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh] shadow-2xl animate-in zoom-in-95">
            
            {/* Left: Sidebar */}
            <div className="w-full md:w-80 bg-slate-50 p-8 flex flex-col border-r">
               <button onClick={() => setDetailsMember(null)} className="mb-6 p-2 w-fit hover:bg-white rounded-full transition"><X /></button>
               <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-2xl font-black text-indigo-600 shadow-sm mb-4 mx-auto">{detailsMember.name.charAt(0)}</div>
               <h2 className="text-xl font-black text-center">{detailsMember.name}</h2>
               <p className="text-slate-400 text-sm text-center mb-8">{detailsMember.role}</p>
               
               <button 
                onClick={() => handleOpenTaskModal()}
                className="w-full py-4 bg-white border-2 border-dashed border-indigo-200 rounded-2xl text-indigo-600 font-black flex items-center justify-center gap-2 hover:bg-indigo-50 transition"
               >
                 <Plus size={18}/> Assign New Task
               </button>
            </div>

            {/* Right: Task Board */}
            <div className="flex-1 flex flex-col p-8 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black flex items-center gap-2"><Send size={20} className="text-indigo-600"/> Personal Board</h3>
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">Admin View</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {tasks.filter(t => t.assignedTo === detailsMember.id).map(task => (
                  <div key={task.id} className="group p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between hover:border-indigo-200 transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleTaskStatus(task.id)}>
                        {task.completed ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-200" />}
                      </button>
                      <div>
                        <p className={`font-bold ${task.completed ? 'line-through text-slate-300' : 'text-slate-700'}`}>{task.title}</p>
                        <div className="flex gap-3 mt-1">
                          <span className="text-[10px] flex items-center gap-1 text-slate-400 font-bold uppercase"><Calendar size={10}/> {task.date}</span>
                          <span className="text-[10px] flex items-center gap-1 text-slate-400 font-bold uppercase"><Tag size={10}/> {task.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenTaskModal(task)} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => shareViaGmail(detailsMember, task)} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition">
                        <Mail size={16} />
                      </button>
                      <button onClick={() => shareViaWhatsApp(detailsMember, task)} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition">
                        <MessageCircle size={16} />
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT TASK MODAL --- */}
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

      {/* --- INVITE MEMBER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-black mb-6">Invite Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <input required placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold" />
              <input required placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold" />
              <input required placeholder="Role (e.g. Lead Dev)" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold" />
              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg">Create Profile</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-2 text-slate-400 font-bold">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignTask;