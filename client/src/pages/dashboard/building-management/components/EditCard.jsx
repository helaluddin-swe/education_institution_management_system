import React from 'react';
import { MapPin, Bed, Maximize2, ArrowUpRight, Edit3, Trash2 } from 'lucide-react';

const EditCard = ({ setSelectedUnit, unit, onEdit, onDelete }) => {
  
  // এডিট হ্যান্ডলার
  const handleEditClick = (e) => {
    e.stopPropagation(); // কার্ডের ডিটেইলস ওপেন হওয়া আটকাবে
    if (onEdit) onEdit(unit);
  };

  // ডিলিট হ্যান্ডলার (Confirm Alert সহ)
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // কার্ডের ডিটেইলস ওপেন হওয়া আটকাবে
    if (onDelete) {
      const confirmDelete = window.confirm(`আপনি কি নিশ্চিতভাবে ইউনিট ${unit.unitNo} ডিলিট করতে চান?`);
      if (confirmDelete) {
        onDelete(unit.id);
      }
    }
  };

  return (
    <div
      onClick={() => setSelectedUnit(unit)}
      className="bg-slate-900 border border-slate-800 p-5 rounded-3xl hover:border-indigo-500/50 transition-all cursor-pointer group shadow-lg hover:shadow-indigo-500/10 relative overflow-hidden flex flex-col h-full active:scale-[0.98]"
    >
      {/* ১. হেডার: ইউনিট নম্বর ও অ্যাকশন বাটনস */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
            ইউনিট-{unit.unitNo}
          </span>
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin size={10} className="text-indigo-500" />
            <span className="text-[9px] font-bold">{unit.thana}, {unit.district}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* স্ট্যাটাস ব্যাজ */}
          <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider border ${
            unit.status === 'ফাঁকা'
              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
          }`}>
            {unit.status}
          </span>
          
          {/* অ্যাকশন বাটন গ্রুপ */}
          <div className="flex gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleEditClick}
              className="p-2 bg-slate-800/80 hover:bg-amber-500 hover:text-slate-900 rounded-xl text-slate-400 border border-slate-700/50 transition-all shadow-xl backdrop-blur-sm"
              title="এডিট করুন"
            >
              <Edit3 size={14} />
            </button>
            <button 
              onClick={handleDeleteClick}
              className="p-2 bg-slate-800/80 hover:bg-red-500 hover:text-white rounded-xl text-slate-400 border border-slate-700/50 transition-all shadow-xl backdrop-blur-sm"
              title="ডিলিট করুন"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ২. কন্টেন্ট এরিয়া */}
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors mb-2 line-clamp-1">
          {unit.type || 'আবাসিক ইউনিট'}
        </h4>
        
        <div className="flex items-center gap-3 text-slate-500">
          {unit.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed size={12} />
              <span className="text-[10px] font-bold">{unit.bedrooms} বেড</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Maximize2 size={12} />
            <span className="text-[10px] font-bold">{unit.size} ft²</span>
          </div>
        </div>
      </div>

      {/* ডিভাইডার */}
      <div className="my-4 border-t border-slate-800/50 w-full"></div>

      {/* ৩. ফুটার: প্রাইস ও ইন্ডিকেটর */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">মাসিক ভাড়া</p>
          <span className="text-sm font-black text-indigo-400">৳{unit.rent}</span>
        </div>
        
        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
          <ArrowUpRight size={14} />
        </div>
      </div>

      {/* ডিজাইন এলিমেন্ট (গ্লো ইফেক্ট) */}
      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-indigo-600/10 blur-2xl rounded-full group-hover:bg-indigo-600/20 transition-all pointer-events-none"></div>
    </div>
  );
};

export default EditCard;