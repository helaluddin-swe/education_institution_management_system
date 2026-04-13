import React, { useState, useMemo } from 'react';
import {
  RotateCcw, Maximize2, Calendar, CheckCircle2,
  Bookmark, Send, Users, Briefcase, DollarSign, Clock, AlertCircle
} from 'lucide-react';
import JobDetails from '../jobs/JobsDetails';
import { toast } from "react-hot-toast";

const Status = ({ jobs, setJobs }) => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('Status'); // Defaulting to Status to see the pipeline
  const [viewingJob, setViewingJob] = useState(null);

 const handleApply = (id, candidateData) => {
  setJobs(prev => prev.map(j => 
    j.id === id ? { 
      ...j, 
      completed: true, 
      status: 'Applied',
      applicantInfo: candidateData // <--- Storing the form data in the job object
    } : j
  ));
  toast.success("Application submitted successfully! 🚀");
};

  // --- UPDATED FILTER LOGIC ---
  const filteredJobsByTab = useMemo(() => {
    return jobs.filter(job => {
      if (activeTab === 'Applied') return job.completed && (!job.status || job.status === 'Applied');
      if (activeTab === 'Saved') return job.isFavorite;
      
      // The "Status" tab now shows everything that is IN PROGRESS (Interview, Final Call, Offer)
      if (activeTab === 'Status') {
        const pipelineStages = ['Interview', 'Final Call', 'Offer'];
        return pipelineStages.includes(job.status);
      }
      return true;
    });
  }, [jobs, activeTab]);

  // Helper for dynamic status colors
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Offer': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Final Call': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Interview': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-900 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-4 lg:p-10 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* PIPELINE HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-8 border-b border-gray-100 w-full md:w-auto">
            {['Applied', 'Saved', 'Status'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-black transition-all relative flex items-center gap-2 ${
                  activeTab === tab ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === 'Saved' && <Bookmark size={16} />}
                {tab === 'Applied' && <Send size={16} />}
                {tab === 'Status' && <Users size={16} />}
                <span className="uppercase tracking-widest text-[11px]">{tab}</span>
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full animate-in slide-in-from-bottom-1" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase">Live Tracking</p>
              <p className="text-xs font-bold text-slate-700">{filteredJobsByTab.length} Applications</p>
            </div>
          </div>
        </header>

        {/* STATUS CONTENT GRID */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                <h2 className="text-3xl font-black tracking-tight text-slate-900">
                  {activeTab} <span className="text-slate-400 text-xl font-bold ml-2">Timeline</span>
                </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredJobsByTab.length > 0 ? (
              filteredJobsByTab.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 hover:shadow-2xl hover:shadow-indigo-100/30 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-wrap gap-2">
                      {/* DYNAMIC STATUS BADGE FROM ADMIN */}
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter flex items-center gap-2 border ${getStatusStyle(job.status)}`}>
                        {job.status === 'Offer' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {job.status || 'Under Review'}
                      </span>
                      
                      <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase bg-slate-50 text-slate-400 border border-slate-100">
                        {job.locationType}
                      </span>
                    </div>
                    
                    <div className="text-emerald-600 font-black text-sm flex items-center">
                       <DollarSign size={14} /> {job.salary?.split(' ')[0]}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-2 text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                    {job.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                    {job.category}
                  </p>

                  {/* PROGRESS INDICATOR */}
                  {activeTab === 'Status' && (
                    <div className="mb-6 space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                        <span>Application Progress</span>
                        <span className="text-indigo-600">
                          {job.status === 'Offer' ? '100%' : job.status === 'Final Call' ? '75%' : '50%'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-1000" 
                          style={{ width: job.status === 'Offer' ? '100%' : job.status === 'Final Call' ? '75%' : '50%' }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                      <Calendar size={14} className="text-indigo-500" /> 
                      Applied on: <span className="text-slate-700">{job.date}</span>
                    </div>
                    <button onClick={()=>setViewingJob(job)} className="text-[10px] font-black uppercase text-indigo-600 hover:underline tracking-widest">
                      Details →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-20 text-center bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-100">
                <div className="bg-white w-16 h-16 rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="text-slate-200" size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-400">Pipeline Empty</h3>
                <p className="text-sm text-slate-300 font-bold mt-1">Jobs moved by the admin to Interview or Offer will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {viewingJob && (
        <JobDetails
          job={viewingJob} 
          onClose={() => setViewingJob(null)} 
          onApply={handleApply}
        />
      )}
    </div>
  );
};

export default Status;