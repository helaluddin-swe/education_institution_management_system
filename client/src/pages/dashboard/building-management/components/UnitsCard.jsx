import React from 'react';
import { MapPin, Bed, Maximize2, ArrowUpRight } from 'lucide-react';

const UnitsCard = ({ setSelectedUnit, unit }) => {
  return (
    <div
      onClick={() => setSelectedUnit(unit)}
      className="bg-slate-900 border border-slate-800 p-5 rounded-3xl hover:border-indigo-500/50 transition-all cursor-pointer group shadow-lg hover:shadow-indigo-500/10 relative overflow-hidden flex flex-col h-full active:scale-[0.98]"
    >
      {/* স্ট্যাটাস ও ইউনিট নম্বর */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
            ইউনিট-{unit.unitNo}
          </span>
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin size={10} className="text-indigo-500" />
            <span className="text-[9px] font-bold">{unit.thana}, {unit.district}</span>
          </div>
        </div>

        <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider border ${
          unit.status === 'ফাঁকা'
            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
        }`}>
          {unit.status}
        </span>
      </div>

      {/* টাইটেল ও সাব-টাইটেল */}
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors mb-2">
          {unit.type}
        </h4>
        
        {/* কুইক স্পেসিফিকেশন */}
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

      {/* প্রাইস ও প্রিভিউ বাটন */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">মাসিক ভাড়া</p>
          <span className="text-sm font-black text-indigo-400">৳{unit.rent}</span>
        </div>
        
        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
          <ArrowUpRight size={14} />
        </div>
      </div>

      {/* হোভার গ্লো ইফেক্ট */}
      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-indigo-600/10 blur-2xl rounded-full group-hover:bg-indigo-600/20 transition-all"></div>
    </div>
  );
};

export default UnitsCard;