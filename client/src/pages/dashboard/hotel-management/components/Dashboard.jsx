import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  EllipsisVertical, Plus, ArrowDownLeft, ArrowUpRight, Users, DoorOpen, 
  BedDouble, Star, LayoutGrid, TrendingUp, X, CheckSquare, DollarSign, Bell, Trash2, Edit3
} from 'lucide-react';

const Overview = () => {
  // 1. Revenue Data (Mock)
  const revenueData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 6390 },
    { name: 'Sun', revenue: 5490 },
  ];

  // 2. CRUD State for Tasks (Operations Checklist)
  const [tasks, setTasks] = useState([
    { id: 1, task: 'Clean Room 304', priority: 'High', status: 'Pending' },
    { id: 2, task: 'Restock Mini Bar (Floor 2)', priority: 'Low', status: 'Pending' },
    { id: 3, task: 'Fix AC in Suite 101', priority: 'Emergency', status: 'In Progress' },
  ]);

  // 3. UI Control States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFormData, setTaskFormData] = useState({ task: '', priority: 'Low', status: 'Pending' });

  // 4. CRUD Handlers for Tasks
  const handleTaskSave = (e) => {
    e.preventDefault();
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...taskFormData, id: t.id } : t));
    } else {
      setTasks([...tasks, { ...taskFormData, id: Date.now() }]);
    }
    closeTaskModal();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskFormData(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Delete this operational task?")) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setTaskFormData({ task: '', priority: 'Low', status: 'Pending' });
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-4xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-600 tracking-tight ">Operations Overview</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl relative"><Bell size={20} /></button>
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition shadow-lg shadow-blue-100"
          >
            <Plus size={20} /> Create Booking
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE CHART */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-black text-slate-800 mb-6">Revenue Performance</h2>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={4} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TASK CRUD LIST */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <CheckSquare size={20} className="text-blue-600"/> Ops Checklist
            </h2>
          </div>
          <div className="space-y-4 max-h-87.5 overflow-y-auto pr-2 custom-scrollbar">
            {tasks.map((task) => (
              <div key={task.id} className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    task.priority === 'Emergency' ? 'bg-red-500 animate-pulse' : 
                    task.priority === 'High' ? 'bg-orange-400' : 'bg-blue-400'
                  }`} />
                  <div>
                    <p className="text-xs font-black text-slate-700">{task.task}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{task.status}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditTask(task)} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit3 size={14}/></button>
                  <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setIsTaskModalOpen(true)}
            className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-black hover:border-blue-400 hover:text-blue-600 transition-all uppercase tracking-widest"
          >
            + Assign New Task
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Occupancy Rate', value: '82%', icon: <BedDouble size={18}/>, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Active Guests', value: '124', icon: <Users size={18}/>, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Daily Revenue', value: '$4,200', icon: <DollarSign size={18}/>, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Satisfication', value: '4.9', icon: <Star size={18}/>, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-4xl border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>{kpi.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <h3 className="text-xl font-black text-slate-800">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* TASK CRUD MODAL */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-1000 text-gray-600 flex items-center justify-center p-4">
          <form onSubmit={handleTaskSave} className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-black text-slate-800 mb-6">{editingTask ? 'Update Task' : 'New Assignment'}</h2>
            <div className="space-y-4">
              <input 
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                placeholder="What needs to be done?"
                value={taskFormData.task}
                onChange={(e) => setTaskFormData({...taskFormData, task: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  value={taskFormData.priority}
                  onChange={(e) => setTaskFormData({...taskFormData, priority: e.target.value})}
                >
                  <option value="Low">Low Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Emergency">Emergency</option>
                </select>
                <select 
                  className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  value={taskFormData.status}
                  onChange={(e) => setTaskFormData({...taskFormData, status: e.target.value})}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeTaskModal} className="flex-1 py-3 text-slate-400 font-black">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg">Save Task</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* QUICK BOOKING MODAL */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-1000 text-gray-600 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">Quick Booking</h2>
              <button onClick={() => setIsBookingOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X/></button>
            </div>
            <div className="space-y-4">
                <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Guest Full Name" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-400" />
                  <input placeholder="Room #" className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>
                <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition">
                  Confirm Reservation
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Overview;