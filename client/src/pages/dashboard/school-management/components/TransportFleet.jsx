import React, { useState } from 'react';
import { 
  Bus, MapPin, Clock, Navigation, Users, Phone, 
  Plus, Edit2, Trash2, X, Save, AlertTriangle, MoreHorizontal 
} from 'lucide-react';

const TransportFleet = () => {
  // State for the Fleet List
  const [buses, setBuses] = useState([
    { id: 1, busNo: "B-101", route: "North Campus", driver: "Robert Wilson", status: "On Time", nextStop: "Main Gate", eta: "4 mins", capacity: 85 },
    { id: 2, busNo: "B-205", route: "Faculty Wing", driver: "Maria Garcia", status: "Delayed", nextStop: "Library", eta: "12 mins", capacity: 40 },
  ]);

  // UI States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({ busNo: '', route: '', driver: '', status: 'On Time', capacity: 0 });

  // --- Handlers ---
  const handleOpenEditor = (bus = null) => {
    if (bus) {
      setEditingBus(bus);
      setFormData(bus);
    } else {
      setEditingBus(null);
      setFormData({ busNo: '', route: '', driver: '', status: 'On Time', capacity: 0 });
    }
    setIsEditorOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingBus) {
      setBuses(buses.map(b => b.id === editingBus.id ? { ...formData, id: b.id } : b));
    } else {
      setBuses([...buses, { ...formData, id: Date.now(), nextStop: 'Depot', eta: 'Calculating...' }]);
    }
    setIsEditorOpen(false);
  };

  const deleteBus = (id) => {
    if(window.confirm("Remove this vehicle from the active fleet?")) {
      setBuses(buses.filter(b => b.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-indigo-950 flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white"><Bus size={24} /></div>
              Fleet Command Center
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Monitoring {buses.length} active units across campus.</p>
          </div>
          <button 
            onClick={() => handleOpenEditor()}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-indigo-200 active:scale-95"
          >
            <Plus size={20} />
            Add New Vehicle
          </button>
        </div>

        {/* Live Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buses.map((bus) => (
            <div key={bus.id} className="group bg-white rounded-3xl border border-slate-200 p-2 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="p-4">
                {/* Status Bar */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">{bus.busNo}</span>
                    <div className={`size-2 rounded-full animate-pulse ${bus.status === 'On Time' ? 'bg-green-500' : 'bg-amber-500'}`} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEditor(bus)} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-full transition"><Edit2 size={16}/></button>
                    <button onClick={() => deleteBus(bus.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-full transition"><Trash2 size={16}/></button>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-1">{bus.route}</h3>
                <p className="text-sm text-slate-500 mb-4 flex items-center gap-1"><Navigation size={14}/> Heading to: <span className="text-slate-900 font-semibold">{bus.nextStop || 'Main Depot'}</span></p>

                {/* Capacity Visualizer (Interactive Feature) */}
                <div className="bg-slate-50 rounded-2xl p-3 mb-4">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-2">
                    <span>Live Occupancy</span>
                    <span>{bus.capacity}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${bus.capacity > 80 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${bus.capacity}%` }} 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-1"><Clock size={14}/> {bus.eta}</div>
                  <div className="flex items-center gap-1"><Users size={14}/> {bus.driver}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- ADMIN MANAGEMENT MODAL (DRAWER) --- */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsEditorOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{editingBus ? 'Update Vehicle' : 'Register Vehicle'}</h2>
              <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24}/></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Bus Identification Number</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={formData.busNo}
                  onChange={(e) => setFormData({...formData, busNo: e.target.value})}
                  placeholder="e.g. B-909"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Assigned Route</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={formData.route}
                  onChange={(e) => setFormData({...formData, route: e.target.value})}
                  placeholder="e.g. West Campus Express"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Current Status</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option>On Time</option>
                    <option>Delayed</option>
                    <option>Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Live Capacity (%)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-800 text-sm">
                <AlertTriangle className="shrink-0" />
                <p>Changes will be reflected instantly on student and faculty mobile portals.</p>
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition active:scale-[0.98]"
              >
                {editingBus ? 'Save Fleet Changes' : 'Launch Vehicle'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportFleet;