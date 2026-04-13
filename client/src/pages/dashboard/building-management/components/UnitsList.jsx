import React, { useState, useMemo } from 'react';
import { unitsDataBN } from '../data';
import { useNavigate } from 'react-router-dom';
import UnitsCard from './UnitsCard';
import { Search, Filter, Home, Building2, MapPin, LayoutGrid } from 'lucide-react';

const UnitLists = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
const [filterCategory, setFilterCategory] = useState("All");
const [showOnlyVacant, setShowOnlyVacant] = useState(true);

// লোকেশন স্টেটসমূহ
const [locationFilter, setLocationFilter] = useState({
  division: "",
  district: "",
  thana: "",
  roadNo: ""
});

const filteredUnits = useMemo(() => {
  return unitsDataBN.filter(unit => {
    // আগের ফিল্টারসমূহ
    const matchesSearch = unit.unitNo.includes(searchTerm) || 
                          unit.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || unit.category === filterCategory;
    const matchesStatus = showOnlyVacant ? unit.status === "ফাঁকা" : true;

    // নতুন লোকেশন ফিল্টারসমূহ (যদি ভ্যালু থাকে তবেই চেক করবে)
    const matchesDivision = !locationFilter.division || unit.division === locationFilter.division;
    const matchesDistrict = !locationFilter.district || unit.district === locationFilter.district;
    const matchesThana = !locationFilter.thana || unit.thana === locationFilter.thana;
    const matchesRoad = !locationFilter.roadNo || unit.roadNo === locationFilter.roadNo;

    return matchesSearch && matchesCategory && matchesStatus && 
           matchesDivision && matchesDistrict && matchesThana && matchesRoad;
  });
}, [searchTerm, filterCategory, showOnlyVacant, locationFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
      
      {/* ১. Hero Section */}
      <div className="relative bg-indigo-600/10 border-b border-indigo-500/10 py-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
            Live Campaign: ২০২৬ টু-লেট
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-6 mb-4">
            আপনার পছন্দের <span className="text-indigo-500 text-glow">স্পেস</span> খুঁজুন
          </h1>
        </div>
      </div>

      {/* ২. Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-2xl space-y-4">
          
          <div className="flex flex-col lg:flex-row gap-4">
            {/* সার্চ */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="ইউনিট নম্বর (যেমন: ১০১) দিয়ে সার্চ করুন..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* ফিল্টার গ্রুপ */}
            <div className="flex flex-wrap items-center gap-4">
              {/* ক্যাটাগরি */}
              <div className="flex gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                {["All", "Residential", "Commercial"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${
                      filterCategory === cat 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {cat === "All" ? "সবগুলো" : cat === "Residential" ? "আবাসিক" : "বাণিজ্যিক"}
                  </button>
                ))}
              </div>

              {/* Vacant Toggle Switch */}
              <label className="flex items-center gap-3 cursor-pointer bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 group hover:border-slate-700 transition-all">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">শুধু ফাঁকা ফ্ল্যাট</span>
                <div 
                  className="relative w-10 h-5"
                  onClick={() => setShowOnlyVacant(!showOnlyVacant)}
                >
                  <div className={`w-full h-full rounded-full transition-colors ${showOnlyVacant ? 'bg-indigo-600' : 'bg-slate-800'}`}></div>
                  <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${showOnlyVacant ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ৩. ফলাফল */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-center gap-2 mb-8">
           <LayoutGrid size={16} className="text-indigo-500" />
           <h3 className="text-lg font-bold text-white">উপলব্ধ ইউনিটের তালিকা</h3>
           <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">
             {filteredUnits.length} Units Found
           </span>
        </div>

        {filteredUnits.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6'>
            {filteredUnits.map((unit) => (
              <UnitsCard 
                unit={unit} 
                key={unit.id} 
                setSelectedUnit={() => navigate(`/building/units/${unit.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-900/30 rounded-[40px] border border-dashed border-slate-800">
            <h4 className="text-slate-400 font-bold">এই মুহূর্তে কোনো ফাঁকা ইউনিট নেই</h4>
            <button 
              onClick={() => {setShowOnlyVacant(false); setSearchTerm(""); setFilterCategory("All")}}
              className="mt-4 text-indigo-500 text-xs font-bold hover:underline"
            >
              সবগুলো ইউনিট দেখুন
            </button>
          </div>
        )}
      </div>
      
      {/* কল টু অ্যাকশন বাটন (Sticky on Mobile) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:hidden">
        <a href="tel:+8801700000000" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/40">
           সরাসরি কল করুন
        </a>
      </div>

    </div>
  );
};

export default UnitLists;