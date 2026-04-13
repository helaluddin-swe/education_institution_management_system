import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Save, User, Phone, Mail, Calendar, 
  Home, CreditCard, FileText, Edit3, Briefcase, Hash
} from 'lucide-react';

const AddNewTennant = ({ isOpen, onClose, onAdd, onUpdate, editTenant = null }) => {
  const initialState = {
    name: '',
    phone: '',
    email: '',
    unit: '',
    status: 'সক্রিয়',
    type: 'আবাসিক',
    lease: 'ডিসেম্বর ২০২৬',
    joiningDate: new Date().toISOString().split('T')[0],
    nid: '',
    emergencyContact: '',
    payments: [] // ডিফল্ট পেমেন্ট অ্যারে
  };

  const [formData, setFormData] = useState(initialState);

  // Edit Mode হ্যান্ডলিং
  useEffect(() => {
    if (editTenant) {
      setFormData(editTenant);
    } else {
      setFormData(initialState);
    }
  }, [editTenant, isOpen]);

  const tenantTypes = ["আবাসিক", "বাণিজ্যিক", "ব্যাচেলর", "অফিস"];
  const statusOptions = ["সক্রিয়", "মেয়াদ শেষ", "অপেক্ষমান"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTenant) {
      onUpdate(formData);
    } else {
      // নতুন টেন্যান্টের জন্য ডামি পেমেন্ট স্ট্রাকচার তৈরি
      const newTenant = {
        ...formData,
        id: Date.now(),
        payments: [
          { month: "জানুয়ারি", year: 2026, status: "Pending", rent: 0, electricity: 0, water: 0, gas: 0, service: 0, parking: 0, dust: 0 }
        ]
      };
      onAdd(newTenant);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end bg-slate-950/80 backdrop-blur-sm transition-all p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-slate-900 h-full sm:h-fit sm:max-h-[95vh] shadow-2xl sm:rounded-4xl border border-slate-800 animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              {editTenant ? (
                <><Edit3 className="text-amber-500" size={24} /> টেন্যান্ট প্রোফাইল আপডেট</>
              ) : (
                <><Plus className="text-indigo-500" size={24} /> নতুন টেন্যান্ট রেজিস্ট্রেশন</>
              )}
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
              {editTenant ? `UID: ${editTenant.id}` : 'সিস্টেম এন্ট্রি ২০২৬'}
            </p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* ১. ব্যক্তিগত তথ্য */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> ব্যক্তিগত তথ্য
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">পূর্ণ নাম</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input required name="name" value={formData.name} onChange={handleChange} placeholder="যেমন: হেলাল উদ্দিন" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">ফোন নম্বর</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input required name="phone" value={formData.phone} onChange={handleChange} placeholder="017XXXXXXXX" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 outline-none" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">ইমেইল (অপশনাল)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input name="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">এনআইডি নম্বর</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input name="nid" value={formData.nid} onChange={handleChange} placeholder="XXXX XXXX XXXX" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* ২. লিজ ও ইউনিট ইনফো */}
          <div className="space-y-4 pt-4 border-t border-slate-800/50">
            <h3 className="text-[11px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
              <Home size={14} /> লিজ ও ইউনিট ডিটেইলস
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">ইউনিট নম্বর</label>
                <input required name="unit" value={formData.unit} onChange={handleChange} placeholder="বি-১০৪" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-200 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">ধরণ</label>
                <select name="type" onChange={handleChange} value={formData.type} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-200 outline-none">
                  {tenantTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">স্ট্যাটাস</label>
                <select name="status" onChange={handleChange} value={formData.status} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-200 outline-none">
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">যোগদানের তারিখ</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">লিজ শেষ হওয়ার সময়</label>
                <input name="lease" value={formData.lease} onChange={handleChange} placeholder="যেমন: ডিসেম্বর ২০২৬" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-200 outline-none" />
              </div>
            </div>
          </div>

          {/* ৩. ইমার্জেন্সি কন্টাক্ট */}
          <div className="p-5 bg-slate-950/50 border border-slate-800/50 rounded-3xl space-y-3">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Briefcase size={14}/> ইমার্জেন্সি কন্টাক্ট ও নোটস
             </label>
             <textarea 
               name="emergencyContact" 
               rows="3" 
               value={formData.emergencyContact}
               onChange={handleChange}
               placeholder="বিকল্প ফোন নম্বর বা বিশেষ কোনো তথ্য..."
               className="w-full bg-transparent border-none p-0 text-sm text-slate-300 outline-none resize-none"
             ></textarea>
          </div>

        </form>

        {/* Footer */}
        <div className="p-6 bg-slate-900 border-t border-slate-800/50 flex gap-4">
          <button onClick={onClose} type="button" className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-800 transition-all">বাতিল করুন</button>
          <button onClick={handleSubmit} className={`flex-[2] py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-[0.98] ${editTenant ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'}`}>
            <Save size={20} /> {editTenant ? 'তথ্য আপডেট করুন' : 'টেন্যান্ট এন্ট্রি করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewTennant;