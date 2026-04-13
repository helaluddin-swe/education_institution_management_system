import React, { useState, useMemo } from 'react';
import { 
  EllipsisVertical, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  X, 
  User, 
  CreditCard, 
  Hash, 
  ArrowUpRight, 
  ArrowDownLeft 
} from 'lucide-react';

const Guests = () => {
  // 1. Initial State (Mock Data)
  const [guests, setGuests] = useState([
    { id: 'RES-9901', name: 'Helal Uddin', roomNumber: '304', totalAmount: 450, amountPaid: 450, status: 'Check In' },
    { id: 'RES-9902', name: 'Sarah Ahmed', roomNumber: '102', totalAmount: 300, amountPaid: 150, status: 'Check Out' },
    { id: 'RES-9903', name: 'John Doe', roomNumber: '205', totalAmount: 600, amountPaid: 600, status: 'Check In' },
  ]);

  // 2. UI State
  const [activeTab, setActiveTab] = useState('Check In');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  
  const [formData, setFormData] = useState({
    id: '', name: '', roomNumber: '', totalAmount: '', amountPaid: '', status: 'Check In'
  });

  // 3. Filter & Search Logic
  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      const matchesTab = guest.status === activeTab;
      const matchesSearch = 
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        guest.roomNumber.includes(searchTerm) ||
        guest.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [guests, activeTab, searchTerm]);

  // 4. CRUD Handlers
  const handleSave = (e) => {
    e.preventDefault();
    if (editingGuest) {
      setGuests(guests.map(g => g.id === editingGuest.id ? { ...formData } : g));
    } else {
      const newId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
      setGuests([...guests, { ...formData, id: newId }]);
    }
    closeModal();
  };

  const handleEdit = (guest) => {
    setEditingGuest(guest);
    setFormData(guest);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this guest record?")) {
      setGuests(guests.filter(g => g.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGuest(null);
    setFormData({ id: '', name: '', roomNumber: '', totalAmount: '', amountPaid: '', status: 'Check In' });
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-200 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full lg:w-auto">
          {['Check In', 'Check Out'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 lg:flex-none px-8 py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
                activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'Check In' ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, room, or ID..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition shadow-lg shadow-blue-100"
          >
            <Plus size={20} /> New Guest
          </button>
        </div>
      </div>

      {/* Guest Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <th className="px-6 py-2">Reservation ID</th>
              <th className="px-6 py-2">Guest Info</th>
              <th className="px-6 py-2">Room</th>
              <th className="px-6 py-2">Payment Status</th>
              <th className="px-6 py-2">Status</th>
              <th className="px-6 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.map((guest) => (
              <tr key={guest.id} className="bg-slate-50/40 hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-5 rounded-l-3xl font-mono text-xs font-bold text-blue-600">{guest.id}</td>
                <td className="px-6 py-5 font-black text-slate-800 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <User size={14} />
                    </div>
                    {guest.name}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
                    Room {guest.roomNumber}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between w-32 text-[10px] font-black">
                      <span className="text-slate-400">PAID</span>
                      <span className={guest.amountPaid < guest.totalAmount ? 'text-red-500' : 'text-emerald-500'}>
                        ${guest.amountPaid} / ${guest.totalAmount}
                      </span>
                    </div>
                    <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${guest.amountPaid < guest.totalAmount ? 'bg-amber-400' : 'bg-emerald-500'}`}
                        style={{ width: `${(guest.amountPaid / guest.totalAmount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                    guest.status === 'Check In' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {guest.status}
                  </span>
                </td>
                <td className="px-6 py-5 rounded-r-3xl text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(guest)} className="p-2 hover:bg-white text-slate-600 rounded-xl shadow-sm border border-transparent hover:border-slate-200"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(guest.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredGuests.length === 0 && (
          <div className="py-32 text-center">
            <div className="text-slate-300 font-medium mb-2 italic">No guest records found matching your criteria.</div>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-999 text-gray-600 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-4xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {editingGuest ? 'Edit Guest Profile' : 'New Registration'}
              </h3>
              <button type="button" onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X/></button>
            </div>

            <div className="p-8 grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[11px] font-black uppercase text-slate-400 mb-2 flex items-center gap-2 tracking-widest">
                  <User size={12}/> Guest Full Name
                </label>
                <input 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Helal Uddin" required
                />
              </div>

              <div className="col-span-1">
                <label className="text-[11px] font-black uppercase text-slate-400 mb-2 flex items-center gap-2 tracking-widest">
                  <Hash size={12}/> Room Number
                </label>
                <input 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                  placeholder="304" required
                />
              </div>

              <div className="col-span-1">
                <label className="text-[11px] font-black uppercase text-slate-400 mb-2 flex items-center gap-2 tracking-widest">
                   Current Status
                </label>
                <select 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-700"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Check In">Check In</option>
                  <option value="Check Out">Check Out</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="text-[11px] font-black uppercase text-slate-400 mb-2 flex items-center gap-2 tracking-widest">
                  <CreditCard size={12}/> Total Bill ($)
                </label>
                <input 
                  type="number"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                  placeholder="500" required
                />
              </div>

              <div className="col-span-1">
                <label className="text-[11px] font-black uppercase text-slate-400 mb-2 flex items-center gap-2 tracking-widest">
                  Amount Paid ($)
                </label>
                <input 
                  type="number"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                  value={formData.amountPaid}
                  onChange={(e) => setFormData({...formData, amountPaid: e.target.value})}
                  placeholder="500" required
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex gap-4">
              <button type="button" onClick={closeModal} className="flex-1 py-4 text-slate-500 font-black hover:bg-slate-200 rounded-[1.25rem] transition uppercase tracking-widest text-xs">Cancel</button>
              <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-[1.25rem] hover:bg-blue-700 shadow-xl shadow-blue-200 transition uppercase tracking-widest text-xs">
                {editingGuest ? 'Update Profile' : 'Confirm Registration'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Guests;