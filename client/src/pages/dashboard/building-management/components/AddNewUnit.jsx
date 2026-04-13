import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Save, Home, DollarSign, Calendar, Maximize, 
  MapPin, Bed, Bath, Layers, Navigation, Info, FileText, Edit3
} from 'lucide-react';

const AddNewUnit = ({ isOpen, onClose, onAdd, onUpdate, editUnit = null }) => {
  const initialState = {
    unitNo: '',
    type: 'আবাসিক ফ্ল্যাট',
    status: 'ফাঁকা',
    floor: '',
    size: '',
    category: 'Residential',
    rent: '',
    advance: '',
    month: 'December',
    year: 2026,
    bedrooms: 1,
    bathrooms: 1,
    division: 'চট্টগ্রাম',
    district: 'চট্টগ্রাম',
    thana: '',
    roadNo: '',
    description: '',
    amenities: []
  };

  const [formData, setFormData] = useState(initialState);

  // Edit Mode হ্যান্ডলিং
  useEffect(() => {
    if (isOpen) {
      if (editUnit) {
        setFormData(editUnit);
      } else {
        setFormData(initialState);
      }
    }
  }, [editUnit, isOpen]);

  const divisions = ["ঢাকা", "চট্টগ্রাম", "সিলেট", "রাজশাহী", "খুলনা", "বরিশাল", "রংপুর", "ময়মনসিংহ"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCounter = (name, type) => {
    setFormData(prev => ({
      ...prev,
      [name]: type === 'inc' ? prev[name] + 1 : Math.max(0, prev[name] - 1)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editUnit) {
      onUpdate(formData); // এডিট মোড
    } else {
      onAdd({ ...formData, id: Date.now() }); // নতুন অ্যাড মোড
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end bg-slate-950/80 backdrop-blur-sm transition-all p-0 sm:p-4 overflow-hidden">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-slate-900 h-full sm:h-fit sm:max-h-[90vh] shadow-2xl sm:rounded-4xl border border-slate-800 animate-in slide-in-from-right duration-300 flex flex-col">
        
        {/* Header - ডাইনামিক টাইটেল */}
        <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900 sticky top-0 z-10 sm:rounded-t-4xl">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              {editUnit ? (
                <><Edit3 className="text-amber-500" size={24} /> ইউনিট তথ্য আপডেট</>
              ) : (
                <><Plus className="text-indigo-500" size={24} /> নতুন ইউনিট লিস্টিং</>
              )}
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
              {editUnit ? `UNIT ID: ${editUnit.id}` : 'টু-লেট ক্যাম্পেইন ২০২৬'}
            </p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar pb-24 sm:pb-8">
          
          {/* ১. লোকেশন */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} /> লোকেশন ডিটেইলস
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">বিভাগ</label>
                <select name="division" onChange={handleChange} value={formData.division} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-sm text-slate-200 outline-none appearance-none focus:border-indigo-500/50">
                  {divisions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">থানা/এলাকা</label>
                <input required name="thana" value={formData.thana} onChange={handleChange} placeholder="যেমন: পাঁচলাইশ" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">ঠিকানা / রোড নম্বর</label>
              <div className="relative">
                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input name="roadNo" value={formData.roadNo} onChange={handleChange} placeholder="যেমন: রোড-০৫, হাউজিং" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-200 outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>

          {/* ২. ইউনিট ইনফো */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">ইউনিট নম্বর</label>
              <input required name="unitNo" value={formData.unitNo} onChange={handleChange} placeholder="১০১" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">সাইজ (sqft)</label>
              <input name="size" value={formData.size} onChange={handleChange} placeholder="১২৫০" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">তলা (Floor)</label>
              <input name="floor" value={formData.floor} onChange={handleChange} placeholder="০২" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
          </div>

          {/* ৩. কাউন্টার UI */}
          <div className="flex gap-4 p-5 bg-slate-950/50 rounded-3xl border border-slate-800/50">
            <div className="flex-1 space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Bed size={14}/> বেডরুম</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => handleCounter('bedrooms', 'dec')} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors">-</button>
                <span className="text-lg font-black text-white">{formData.bedrooms}</span>
                <button type="button" onClick={() => handleCounter('bedrooms', 'inc')} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors">+</button>
              </div>
            </div>
            <div className="w-[1px] bg-slate-800"></div>
            <div className="flex-1 space-y-3 pl-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Bath size={14}/> বাথরুম</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => handleCounter('bathrooms', 'dec')} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors">-</button>
                <span className="text-lg font-black text-white">{formData.bathrooms}</span>
                <button type="button" onClick={() => handleCounter('bathrooms', 'inc')} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors">+</button>
              </div>
            </div>
          </div>

          {/* ৪. ভাড়া */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-5 rounded-2xl space-y-1 border transition-colors ${editUnit ? 'bg-amber-500/5 border-amber-500/10' : 'bg-indigo-500/5 border-indigo-500/10'}`}>
              <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${editUnit ? 'text-amber-500' : 'text-indigo-400'}`}>
                <DollarSign size={14}/> মাসিক ভাড়া
              </label>
              <input required type="text" name="rent" value={formData.rent} onChange={handleChange} placeholder="৳ ২৫,০০০" className="w-full bg-transparent text-2xl font-black text-white outline-none" />
            </div>
            <div className="p-5 bg-slate-800/20 border border-slate-800 rounded-2xl space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">অগ্রিম জামানত</label>
              <input name="advance" value={formData.advance} onChange={handleChange} placeholder="৳ ৫০,০০০" className="w-full bg-transparent text-xl font-black text-slate-300 outline-none" />
            </div>
          </div>

          {/* ৫. বিস্তারিত বর্ণনা */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText size={14}/> বিস্তারিত বর্ণনা</label>
            <textarea 
              name="description" 
              rows="4" 
              value={formData.description}
              onChange={handleChange}
              placeholder="ফ্ল্যাটটি কেন সেরা? বিস্তারিত এখানে লিখুন..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-300 outline-none focus:border-indigo-500 transition-all resize-none"
            ></textarea>
          </div>

        </form>

        {/* Footer */}
        <div className="p-6 bg-slate-900 border-t border-slate-800/50 flex gap-4 sticky bottom-0 sm:rounded-b-4xl">
          <button onClick={onClose} type="button" className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-800 transition-all">বাতিল করুন</button>
          <button onClick={handleSubmit} type="button" className={`flex-2 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-[0.98] ${editUnit ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'}`}>
            <Save size={20} /> {editUnit ? 'তথ্য আপডেট করুন' : 'লিস্টিং পাবলিশ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewUnit;