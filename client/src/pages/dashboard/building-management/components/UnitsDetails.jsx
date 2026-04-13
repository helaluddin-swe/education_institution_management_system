import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { unitsDataBN } from "../data";
import { 
  X, Bed, Bath, Maximize, CheckCircle2, PhoneCall, 
  Calendar, Tag, ArrowLeft, MapPin, Navigation, Info,
  Edit3, Trash2, Check, Lock
} from 'lucide-react';

const UnitsDetails = ({ unit: propsUnit, onClose, onUpdate, onDelete, onEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ডাটা সোর্স হ্যান্ডলিং
  const unit = propsUnit || unitsDataBN.find(u => u.id === parseInt(id));

  if (!unit) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
          <Info className="text-slate-500" size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">ইউনিটটি পাওয়া যায়নি!</h2>
        <button onClick={() => navigate(-1)} className="bg-indigo-600 px-8 py-3 rounded-2xl font-bold transition-all">
          পিছনে যান
        </button>
      </div>
    );
  }

  const handleClose = () => {
    onClose ? onClose() : navigate(-1);
  };

  const toggleStatus = () => {
    const newStatus = unit.status === 'ফাঁকা' ? 'ভাড়া হয়েছে' : 'ফাঁকা';
    onUpdate && onUpdate(unit.id, { ...unit, status: newStatus });
  };

  return (
    // কন্টেইনার: মোডাল হলে ডানে থাকবে, পেজ হলে মাঝখানে থাকবে
    <div className={`
      ${onClose 
        ? 'fixed inset-0 z-[100] flex justify-end bg-slate-950/60 backdrop-blur-sm' 
        : 'min-h-screen bg-slate-950 flex justify-center py-0 md:py-12 px-0 md:px-4'}
    `}>
      
      {onClose && <div className="absolute inset-0" onClick={handleClose}></div>}

      {/* মেইন কার্ড: ব্লগ টাইপ লুক দেওয়ার জন্য max-w-3xl ব্যবহার করা হয়েছে */}
      <div className={`
        relative w-full shadow-2xl transition-all duration-300
        ${onClose 
          ? 'max-w-md bg-slate-900 h-screen animate-in slide-in-from-right' 
          : 'max-w-3xl bg-slate-900 md:rounded-[40px] border-x md:border border-slate-800 h-fit min-h-screen md:min-h-fit'} 
        overflow-y-auto hide-scrollbar flex flex-col
      `}>
        
        {/* ১. হেডার ব্যানার */}
        <div className={`
          min-h-[280px] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 md:p-12 flex flex-col justify-end relative
          ${!onClose && 'md:rounded-t-[40px]'}
        `}>
          
          {/* অ্যাকশন বাটনস */}
          <div className="absolute top-8  right-8 flex justify-end items-center z-20">
             

             <button onClick={handleClose} className="p-3 bg-slate-900/40 hover:bg-slate-900 backdrop-blur-md rounded-full text-white transition-all border border-white/10">
                {onClose ? <X size={20} /> : <ArrowLeft size={20} />}
             </button>
          </div>
          
          <div className="relative z-0 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-4 py-1.5 rounded-full font-black uppercase border border-white/10 tracking-widest">
                {unit.category}
              </span>
              <button onClick={toggleStatus} className={`flex items-center gap-2 text-[10px] px-4 py-1.5 rounded-full font-black uppercase border transition-all active:scale-95 ${
                unit.status === 'ফাঁকা' ? 'bg-amber-500 text-slate-900 border-amber-400' : 'bg-emerald-500 text-white border-emerald-400'
              }`}>
                {unit.status === 'ফাঁকা' ? <Check size={12}/> : <Lock size={12}/>}
                {unit.status}
              </button>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">ইউনিট {unit.unitNo}</h2>
            <div className="flex items-center gap-2 text-indigo-100/70">
              <MapPin size={18} className="text-indigo-300" />
              <p className="text-sm md:text-base font-medium">{unit.thana}, {unit.district}, {unit.division}</p>
            </div>
          </div>
        </div>

        {/* ২. কন্টেন্ট এরিয়া (Blog Style) */}
        <div className="p-8 md:p-12 space-y-12 bg-slate-900">
          
          {/* স্পেসিফিকেশন গ্রিড */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">বেডরুম</p>
              <div className="flex items-center gap-2">
                <Bed className="text-indigo-500" size={20} />
                <span className="text-xl font-black text-white">{unit.bedrooms || '০'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">বাথরুম</p>
              <div className="flex items-center gap-2">
                <Bath className="text-indigo-500" size={20} />
                <span className="text-xl font-black text-white">{unit.bathrooms || '০'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">সাইজ</p>
              <div className="flex items-center gap-2">
                <Maximize className="text-indigo-500" size={20} />
                <span className="text-xl font-black text-white">{unit.size} <small className="text-[10px] font-normal text-slate-500">sqft</small></span>
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* বর্ণনা (Blog Paragraph Style) */}
          <div className="prose prose-invert max-w-none">
            <h3 className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-4">বিস্তারিত বর্ণনা</h3>
            <p className="text-slate-300 text-lg leading-relaxed font-medium">
              {unit.description || "এই ইউনিটটি আধুনিক সুযোগ-সুবিধা সম্পন্ন এবং চমৎকার পরিবেশে অবস্থিত। বিস্তারিত তথ্যের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।"}
            </p>
          </div>

          {/* ভাড়া ও অন্যান্য তথ্য কার্ড */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 bg-slate-950 rounded-[32px] border border-slate-800">
               <Tag className="text-indigo-500 mb-4" size={24} />
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">মাসিক ভাড়া</p>
               <h4 className="text-xl font-black text-white">৳{unit.rent}</h4>
               <p className="text-xs text-slate-400 mt-2">অগ্রিম জামানত: ৳{unit.advance}</p>
            </div>
            <div className="p-8 bg-indigo-600 rounded-[32px] text-white">
               <Calendar className="text-indigo-200 mb-4" size={24} />
               <p className="text-[10px] text-indigo-200 font-black uppercase tracking-widest mb-1">ভাড়া পাওয়া যাবে</p>
               <h4 className="text-xl font-black">{unit.month}, {unit.year}</h4>
               <p className="text-xs text-indigo-100 mt-2">বুকিং এখন চলছে</p>
            </div>
          </div>

          {/* সুযোগ-সুবিধা */}
          <div className="space-y-6">
            <h3 className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em]">অতিরিক্ত সুবিধা</h3>
            <div className="grid grid-cols-2 gap-4">
              {unit.amenities?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-800/30 p-4 rounded-2xl border border-slate-800/50 hover:bg-slate-800 transition-all">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span className="text-sm text-slate-200 font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* কন্টাক্ট বাটন */}
          <div className="py-8 border-t border-slate-800">
            <a 
              href={`tel:${unit.contact}`}
              className="w-full bg-white text-slate-900 py-6 rounded-[24px] font-black text-xl flex items-center justify-center gap-4 hover:bg-indigo-50 transition-all shadow-xl active:scale-[0.98]"
            >
              <PhoneCall size={24} /> 
              কল করুন: {unit.contact}
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UnitsDetails;