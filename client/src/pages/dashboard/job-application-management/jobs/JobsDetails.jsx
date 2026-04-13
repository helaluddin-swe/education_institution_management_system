import React, { useState } from 'react';
import { 
  X, MapPin, DollarSign, Calendar, Briefcase, 
  ShieldCheck, Globe, Clock, CheckCircle2, Heart
} from 'lucide-react';
import ApplyForm from './ApplyForm'; // Import the new form

const JobDetails = ({ job, onClose, onApply }) => {
  const [isApplying, setIsApplying] = useState(false);

  if (!job) return null;

  // Handle final submission from the form
  const handleFinalSubmit = (candidateData) => {
    // Send both the job ID and the full candidate info back to parent
    onApply(job.id, candidateData);
    onClose(); // Close details after application
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col relative overflow-hidden">
        
        {/* CLOSE BUTTON (Stays fixed) */}
        {!isApplying && (
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>
        )}

        {/* TOGGLE CONTENT: DETAILS vs FORM */}
        {isApplying ? (
          <ApplyForm 
            job={job} 
            onBack={() => setIsApplying(false)} 
            onSubmit={handleFinalSubmit}
          />
        ) : (
          <>
            {/* --- HEADER --- */}
            <div className="relative p-10 border-b border-slate-50">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {job.category}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified Listing
                </span>
              </div>

              <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">
                {job.title}
              </h2>
              
              <div className="flex flex-wrap gap-5 text-slate-500 font-bold text-xs mt-4">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-indigo-500" /> {job.locationType}
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign size={14} className="text-emerald-500" /> {job.salary}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-amber-500" /> Posted {job.date}
                </div>
              </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <section>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Briefcase size={16} /> About the Role
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  We are looking for a high-performing {job.title} to join our growing team...
                  [Full Description goes here]
                </p>
              </section>

              <section className="bg-slate-50 p-8 rounded-[2rem]">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4">
                  Key Responsibilities
                </h3>
                <ul className="space-y-3">
                  {[
                    "Develop and maintain scalable software architectures.",
                    "Collaborate with designers to ensure high-quality UI/UX.",
                    "Optimize application performance."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-slate-600 font-medium leading-relaxed">
                      <CheckCircle2 size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* --- FOOTER ACTIONS --- */}
            <div className="p-8 border-t border-slate-50 bg-white">
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsApplying(true)}
                  disabled={job.completed}
                  className={`flex-1 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all ${
                    job.completed 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-indigo-100'
                  }`}
                >
                  {job.completed ? 'Already Applied' : 'Apply Now'}
                </button>
                <button className="p-5 border border-slate-200 rounded-[2rem] hover:bg-slate-50 transition-colors">
                  <Heart size={20} className={job.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JobDetails;