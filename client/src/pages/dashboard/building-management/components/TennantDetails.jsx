import React, { useState, useMemo } from 'react';
import { X, Save, Zap, Droplets, Flame, Trash2, Car, ShieldCheck, CreditCard, Calendar } from 'lucide-react';

const TennantDetails = ({ tenant, onClose, onUpdate }) => {
  const [selectedMonth, setSelectedMonth] = useState(tenant.payments[0] || {});

  const handleBillChange = (field, value) => {
    // ইনপুট ভ্যালু নাম্বার এ কনভার্ট করা (ফাঁকা থাকলে ০)
    const numValue = value === "" ? 0 : parseFloat(value);
    setSelectedMonth(prev => ({ ...prev, [field]: numValue }));
  };

  // বর্তমান মাসের মোট টাকা হিসাব করার লজিক
  const monthlyTotal = useMemo(() => {
    const fields = ['rent', 'electricity', 'water', 'gas', 'service', 'parking', 'dust'];
    return fields.reduce((sum, field) => sum + (Number(selectedMonth[field]) || 0), 0);
  }, [selectedMonth]);

  if (!tenant) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-slate-900 h-full overflow-y-auto shadow-2xl border-l border-slate-800 animate-in slide-in-from-right duration-300 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="text-xl font-black text-white">{tenant.name}</h2>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{tenant.unit} • {tenant.type}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"><X size={20}/></button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* লিজ ইনফো কার্ড */}
          <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">লিজের মেয়াদ শেষ</p>
                <p className="text-sm font-black text-slate-200">{tenant.lease}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-400 font-bold">সক্রিয় লিজ</span>
            </div>
          </div>

          {/* ১. ক্যালেন্ডার সিলেকশন */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center block">পেমেন্ট ক্যালেন্ডার</label>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {tenant.payments.map((p, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedMonth(p)}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap border transition-all flex flex-col items-center gap-1 ${
                    selectedMonth.month === p.month ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <span>{p.month}</span>
                  <span className={`text-[8px] ${selectedMonth.month === p.month ? 'text-indigo-200' : 'text-slate-600'}`}>{p.year}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ২. বিল এন্ট্রি ফর্ম */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BillInput label="বাসা ভাড়া" icon={<CreditCard size={14}/>} value={selectedMonth.rent} onChange={(v) => handleBillChange('rent', v)} color="text-indigo-400" />
            <BillInput label="বিদ্যুৎ বিল" icon={<Zap size={14}/>} value={selectedMonth.electricity} onChange={(v) => handleBillChange('electricity', v)} color="text-yellow-500" />
            <BillInput label="পানি বিল" icon={<Droplets size={14}/>} value={selectedMonth.water} onChange={(v) => handleBillChange('water', v)} color="text-blue-500" />
            <BillInput label="গ্যাস বিল" icon={<Flame size={14}/>} value={selectedMonth.gas} onChange={(v) => handleBillChange('gas', v)} color="text-orange-500" />
            <BillInput label="সার্ভিস চার্জ" icon={<ShieldCheck size={14}/>} value={selectedMonth.service} onChange={(v) => handleBillChange('service', v)} color="text-emerald-500" />
            <BillInput label="পার্কিং" icon={<Car size={14}/>} value={selectedMonth.parking} onChange={(v) => handleBillChange('parking', v)} color="text-purple-500" />
            <BillInput label="ময়লা বিল" icon={<Trash2 size={14}/>} value={selectedMonth.dust} onChange={(v) => handleBillChange('dust', v)} color="text-slate-400" />
            
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <label className="text-[10px] font-bold text-slate-500 uppercase">পেমেন্ট স্ট্যাটাস</label>
              <select 
                value={selectedMonth.status}
                onChange={(e) => handleBillChange('status', e.target.value)}
                className={`w-full bg-transparent text-sm font-black outline-none mt-1 ${selectedMonth.status === 'Paid' ? 'text-emerald-500' : 'text-red-500'}`}
              >
                <option value="Paid" className="bg-slate-900">পরিশোধিত (Paid)</option>
                <option value="Pending" className="bg-slate-900">বাকি (Pending)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ৩. মোট টাকার সামারি (Sticky Bottom) */}
        <div className="mt-auto p-6 bg-slate-950/50 border-t border-slate-800 backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">সর্বমোট ({selectedMonth.month})</p>
              <h3 className="text-2xl font-black text-white">৳{monthlyTotal.toLocaleString()}</h3>
            </div>
            <div className={`px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest ${selectedMonth.status === 'Paid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              {selectedMonth.status === 'Paid' ? 'ক্লিয়ার' : 'বকেয়া'}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-800 rounded-2xl transition-all">বাতিল</button>
            <button 
              onClick={() => onUpdate({ ...tenant, currentUpdate: selectedMonth, total: monthlyTotal })}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <Save size={18}/> আপডেট সেভ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BillInput = ({ label, icon, value, onChange, color }) => (
  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl focus-within:border-indigo-500/50 transition-all group">
    <label className={`text-[10px] font-black uppercase tracking-tighter mb-1 flex items-center gap-1 ${color}`}>
      {icon} {label}
    </label>
    <div className="flex items-center gap-2">
      <span className="text-slate-600 font-bold text-sm">৳</span>
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        onWheel={(e) => e.target.blur()} // মাউস হুইল দিয়ে নাম্বার পরিবর্তন বন্ধ করা
        className="w-full bg-transparent text-lg font-black text-white outline-none"
        placeholder="0"
      />
    </div>
  </div>
);

export default TennantDetails;