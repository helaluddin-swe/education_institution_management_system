import React, { useState, useMemo } from 'react';
import { EllipsisVertical, Plus, Trash2, Edit3, X, Bed, Layers, CheckCircle, XCircle } from 'lucide-react';

const Rooms = () => {
  // 1. Initial Data State
  const [rooms, setRooms] = useState([
    { id: '101', roomNumber: '101', bedType: 'Double King', floor: '1st Floor', facility: 'AC, WiFi, Mini Bar', status: 'Available' },
    { id: '202', roomNumber: '202', bedType: 'Single Queen', floor: '2nd Floor', facility: 'WiFi, Balcony', status: 'Booked' },
    { id: '305', roomNumber: '305', bedType: 'Suite', floor: '3rd Floor', facility: 'AC, WiFi, Kitchen', status: 'Available' },
  ]);

  // 2. UI State
  const [filter, setFilter] = useState('All'); // All, Available, Booked
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    roomNumber: '', bedType: 'Single', floor: '', facility: '', status: 'Available'
  });

  // 3. Filter Logic
  const filteredRooms = useMemo(() => {
    if (filter === 'All') return rooms;
    return rooms.filter(room => room.status === filter);
  }, [rooms, filter]);

  // 4. CRUD Handlers
  const handleSave = (e) => {
    e.preventDefault();
    if (editingRoom) {
      // Update
      setRooms(rooms.map(r => r.id === editingRoom.id ? { ...formData, id: editingRoom.id } : r));
    } else {
      // Create
      setRooms([...rooms, { ...formData, id: Date.now().toString() }]);
    }
    closeModal();
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData(room);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this room?")) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setFormData({ roomNumber: '', bedType: 'Single', floor: '', facility: '', status: 'Available' });
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-200">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['All', 'Available', 'Booked'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                filter === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {type} Rooms
            </button>
          ))}
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          <Plus size={18} /> Add Room
        </button>
      </div>

      {/* Rooms Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-widest">
              <th className="px-4 py-4">Room Number</th>
              <th className="px-4 py-4">Bed Type</th>
              <th className="px-4 py-4">Floor</th>
              <th className="px-4 py-4">Facility</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredRooms.map((room) => (
              <tr key={room.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-4 py-4 font-black text-slate-700">#{room.roomNumber}</td>
                <td className="px-4 py-4 text-slate-600 text-sm flex items-center gap-2">
                  <Bed size={14} className="text-slate-400" /> {room.bedType}
                </td>
                <td className="px-4 py-4 text-slate-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-slate-400" /> {room.floor}
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-500 text-xs italic">{room.facility}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    room.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {room.status === 'Available' ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                    {room.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(room)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(room.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRooms.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-medium italic">No rooms found in this category.</div>
        )}
      </div>

      {/* CRUD Modal (Create / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-999 text-gray-600 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800">{editingRoom ? 'Update Room' : 'Add New Room'}</h3>
              <button type="button" onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X/></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Room Number</label>
                  <input 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                    placeholder="101" required
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Floor</label>
                  <input 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={formData.floor}
                    onChange={(e) => setFormData({...formData, floor: e.target.value})}
                    placeholder="1st Floor"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Bed Type</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
                  value={formData.bedType}
                  onChange={(e) => setFormData({...formData, bedType: e.target.value})}
                >
                  <option value="Single Queen">Single Queen</option>
                  <option value="Double King">Double King</option>
                  <option value="Suite">Suite / Penthouse</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Facilities (Comma separated)</label>
                <textarea 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none min-h-20"
                  value={formData.facility}
                  onChange={(e) => setFormData({...formData, facility: e.target.value})}
                  placeholder="AC, WiFi, Mini Fridge..."
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Current Status</label>
                <div className="flex gap-4 mt-2">
                  {['Available', 'Booked'].map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status"
                        checked={formData.status === s}
                        onChange={() => setFormData({...formData, status: s})}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-bold text-slate-600">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex gap-3">
              <button type="button" onClick={closeModal} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                {editingRoom ? 'Update Room' : 'Register Room'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Rooms;