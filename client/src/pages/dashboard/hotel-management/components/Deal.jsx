import React, { useState, useMemo } from 'react';
import { EllipsisVertical, Plus, Trash2, Edit3, X, Tag, Calendar, Home, CheckCircle2, Clock } from 'lucide-react';

const Deal = () => {
  // 1. Initial State
  const [deals, setDeals] = useState([
    { id: 'D-8821', ref: 'REF-001', name: 'Summer Escape', totalReservations: 50, left: 12, endDate: '2026-06-30', roomType: 'Deluxe Sea View', status: 'Ongoing' },
    { id: 'D-9902', ref: 'REF-002', name: 'Winter Warmth', totalReservations: 30, left: 0, endDate: '2026-02-15', roomType: 'Standard Room', status: 'Finished' },
  ]);

  // 2. UI State
  const [filter, setFilter] = useState('Ongoing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({
    ref: '', name: '', totalReservations: '', left: '', endDate: '', roomType: 'Deluxe Sea View', status: 'Ongoing'
  });

  // 3. Filter Logic
  const filteredDeals = useMemo(() => {
    return deals.filter(d => d.status === filter);
  }, [deals, filter]);

  // 4. CRUD Handlers
  const handleSave = (e) => {
    e.preventDefault();
    if (editingDeal) {
      setDeals(deals.map(d => d.id === editingDeal.id ? { ...formData, id: editingDeal.id } : d));
    } else {
      setDeals([...deals, { ...formData, id: `D-${Math.floor(Math.random() * 9000) + 1000}` }]);
    }
    closeModal();
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setFormData(deal);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Permanent delete this deal?")) {
      setDeals(deals.filter(d => d.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
    setFormData({ ref: '', name: '', totalReservations: '', left: '', endDate: '', roomType: 'Deluxe Sea View', status: 'Ongoing' });
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-200 font-sans">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['Ongoing', 'Finished'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${
                filter === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
          >
            <Plus size={18} /> Add Deal
          </button>
        </div>
      </div>

      {/* Deals Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <th className="px-4 py-4">Reference</th>
              <th className="px-4 py-4">Deal Details</th>
              <th className="px-4 py-4">Inventory Left</th>
              <th className="px-4 py-4">End Date</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredDeals.map((deal) => (
              <tr key={deal.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-4 py-5 font-mono text-xs font-bold text-slate-500">{deal.ref}</td>
                <td className="px-4 py-5">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-800 text-sm">{deal.name}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 uppercase font-bold">
                      <Home size={10}/> {deal.roomType}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-5">
                  <div className="flex flex-col gap-1.5 w-32">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className={deal.left < 5 ? 'text-red-500' : 'text-slate-600'}>{deal.left} Left</span>
                      <span className="text-slate-300">/ {deal.totalReservations}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${deal.left < 5 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${(deal.left / deal.totalReservations) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-5">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <Calendar size={14} className="text-slate-300" /> {deal.endDate}
                  </span>
                </td>
                <td className="px-4 py-5">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    deal.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {deal.status === 'Ongoing' ? <Clock size={12}/> : <CheckCircle2 size={12}/>}
                    {deal.status}
                  </span>
                </td>
                <td className="px-4 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(deal)} className="p-2 hover:bg-white text-slate-600 rounded-lg border border-transparent hover:border-slate-200 shadow-sm"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(deal.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 text-gray-600 bg-slate-900/60 backdrop-blur-sm z-999 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Tag className="text-blue-600"/> {editingDeal ? 'Update Deal' : 'New Strategic Deal'}</h3>
              <button type="button" onClick={closeModal}><X className="text-slate-400" /></button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Reference #</label>
                <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.ref} onChange={(e) => setFormData({...formData, ref: e.target.value})} placeholder="REF-001" required />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Deal Name</label>
                <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Eid Special" required />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Target Room Type</label>
                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.roomType} onChange={(e) => setFormData({...formData, roomType: e.target.value})}>
                  <option>Deluxe Sea View</option>
                  <option>Standard Room</option>
                  <option>Executive Suite</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Inventory (Total)</label>
                <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.totalReservations} onChange={(e) => setFormData({...formData, totalReservations: e.target.value})} required />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Left</label>
                <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.left} onChange={(e) => setFormData({...formData, left: e.target.value})} required />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">End Date</label>
                <input type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-500" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Status</label>
                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Finished">Finished</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex gap-3">
              <button type="button" onClick={closeModal} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                {editingDeal ? 'Update Logic' : 'Activate Deal'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Deal;