import React, { useState, useMemo } from 'react';
import { 
  EllipsisVertical, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  X,
  DollarSign
} from 'lucide-react';

const Rate = () => {
  // 1. Initial State (Mock Data)
  const [rates, setRates] = useState([
    { id: 1, roomType: 'Deluxe Sea View', deal: 'Early Bird', policy: 'Non-Refundable', dealPrice: 120, originalRate: 150, availability: true },
    { id: 2, roomType: 'Executive Suite', deal: 'Weekend Special', policy: 'Free Cancellation', dealPrice: 200, originalRate: 250, availability: true },
    { id: 3, roomType: 'Standard Room', deal: 'None', policy: '48h Notice', dealPrice: 80, originalRate: 80, availability: false },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    roomType: '', deal: '', policy: '', dealPrice: '', originalRate: '', availability: true
  });

  // 2. Filter Logic
  const filteredRates = useMemo(() => {
    return rates.filter(r => 
      r.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.deal.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rates, searchTerm]);

  // 3. CRUD Operations
  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (editingId) {
      setRates(rates.map(r => r.id === editingId ? { ...formData, id: editingId } : r));
    } else {
      setRates([...rates, { ...formData, id: Date.now() }]);
    }
    closeModal();
  };

  const handleEdit = (rate) => {
    setFormData(rate);
    setEditingId(rate.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this rate plan?")) {
      setRates(rates.filter(r => r.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ roomType: '', deal: '', policy: '', dealPrice: '', originalRate: '', availability: true });
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Rate Management</h2>
          <p className="text-slate-500 text-sm">Set pricing strategy and room availability.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search room or deal..."
              className="w-full pl-10 pr-4 py-2 text-gray-700 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
          >
            <Plus size={18} /> Add Rate
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
              <th className="px-4 py-3">Room Type</th>
              <th className="px-4 py-3">Deals</th>
              <th className="px-4 py-3">Cancellation Policy</th>
              <th className="px-4 py-3 text-center">Price</th>
              <th className="px-4 py-3 text-center">Availability</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRates.map((rate) => (
              <tr key={rate.id} className="bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-4 rounded-l-2xl font-bold text-slate-700">{rate.roomType}</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold uppercase">
                    {rate.deal}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-500 text-sm">{rate.policy}</td>
                <td className="px-4 py-4 text-center">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-slate-800">${rate.dealPrice}</span>
                    {rate.dealPrice < rate.originalRate && (
                      <span className="text-xs text-slate-400 line-through">${rate.originalRate}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  {rate.availability ? (
                    <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 py-1 px-2 rounded-full">
                      <CheckCircle2 size={14} /> Open
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1 text-red-600 font-bold text-xs bg-red-50 py-1 px-2 rounded-full">
                      <XCircle size={14} /> Sold Out
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 rounded-r-2xl text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(rate)} className="p-2 hover:bg-white rounded-lg text-slate-600 shadow-sm border border-transparent hover:border-slate-200"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(rate.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 text-gray-500 backdrop-blur-sm z-999 flex items-center justify-center p-4">
          <form onSubmit={handleAddOrUpdate} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/80">
              <h3 className="text-xl font-black text-slate-800">{editingId ? 'Edit Rate Plan' : 'New Rate Plan'}</h3>
              <button type="button" onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X/></button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Room Type</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={formData.roomType}
                  onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                  required
                >
                  <option value="">Select Room Type</option>
                  <option value="Deluxe Sea View">Deluxe Sea View</option>
                  <option value="Executive Suite">Executive Suite</option>
                  <option value="Standard Room">Standard Room</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Deal Name</label>
                <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" value={formData.deal} onChange={(e) => setFormData({...formData, deal: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Cancellation Policy</label>
                <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" value={formData.policy} onChange={(e) => setFormData({...formData, policy: e.target.value})} />
              </div>

              <div className="relative">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Original Rate</label>
                <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" value={formData.originalRate} onChange={(e) => setFormData({...formData, originalRate: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Deal Price</label>
                <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" value={formData.dealPrice} onChange={(e) => setFormData({...formData, dealPrice: e.target.value})} />
              </div>

              <div className="col-span-2 flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="avail"
                  checked={formData.availability} 
                  onChange={(e) => setFormData({...formData, availability: e.target.checked})} 
                />
                <label htmlFor="avail" className="text-sm font-bold text-slate-700 cursor-pointer">Available for Booking</label>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex gap-3">
              <button type="button" onClick={closeModal} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                {editingId ? 'Update Rate' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Rate;