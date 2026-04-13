import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, Maximize2, Calendar, Clock, CheckCircle2, 
  Briefcase, DollarSign, Bookmark, Send, Users, TrendingUp 
} from 'lucide-react';
import { AnalyticsBarCard, JobsRow } from '../jobs/jobComponent';
import { AnalyticsBarGraph } from '../jobs/AnalyticsBarGraph';

const Overview = ({ jobs, setJobs }) => {
  const [activeTab, setActiveTab] = useState('Applied');
  const [analyticsFilter, setAnalyticsFilter] = useState('Monthly');

  // --- FILTER LOGIC ---
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (activeTab === 'Applied') return job.completed;
      if (activeTab === 'Saved') return job.isFavorite;
      if (activeTab === 'Interviewing') return !job.completed && job.priority === 'High';
      return true;
    });
  }, [jobs, activeTab]);

  const toggleFavorite = (id) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, isFavorite: !j.isFavorite } : j));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAFBFF] p-6 lg:p-10 gap-10 font-sans">
      
      {/* LEFT: JOB PIPELINE */}
      <div className="flex-1 space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-100 pb-2">
          <div className="flex gap-8">
            {['Applied', 'Saved', 'Interviewing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab === 'Saved' && <Bookmark size={14} />}
                  {tab === 'Applied' && <Send size={14} />}
                  {tab === 'Interviewing' && <Users size={14} />}
                  {tab}
                </div>
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 pb-3 text-slate-300">
            <RotateCcw size={18} className="cursor-pointer hover:text-indigo-500 transition-colors" />
            <Maximize2 size={18} className="cursor-pointer hover:text-indigo-500 transition-colors" />
          </div>
        </header>

        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900">{activeTab} Pipeline</h2>
            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">
              {filteredJobs.length} Jobs
            </span>
          </div>

          <div className="grid gap-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg flex items-center gap-1">
                        <Briefcase size={10} /> {job.priority || 'Standard'}
                      </span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg border border-emerald-100">
                        {job.salary}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-indigo-500">{job.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                         <Calendar size={12} className="text-indigo-400" /> {job.date}
                       </span>
                       <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                         <Clock size={12} className="text-amber-400" /> 
                         {(() => {
                           const diff = 30 - parseInt(job.date.split(' ')[1]);
                           return diff === 0 ? "Today" : `${diff}d ago`;
                         })()}
                       </span>
                    </div>
                    <button className="text-[10px] font-black uppercase text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">View Details →</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Empty Pipeline</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* RIGHT: ANALYTICS SIDEBAR */}
      <div className="w-full lg:w-96 space-y-8">
        {/* Market Reach Component */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <div>
              <h3 className="text-lg font-black text-slate-900">Market Reach</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Application Flow</p>
            </div>
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/50">
              {['Weekly', 'Monthly'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAnalyticsFilter(mode)}
                  className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${
                    analyticsFilter === mode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <AnalyticsBarGraph jobs={jobs} viewMode={analyticsFilter} />
        </div>

        {/* Insight Highlight */}
        <div className="bg-indigo-600 rounded-[2.5rem] p-6 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase opacity-60 mb-1">Weekly Success Rate</p>
            <p className="text-2xl font-black">74.2%</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-2 py-1 rounded-lg">
              <TrendingUp size={12} /> +12% from last week
            </div>
          </div>
          <TrendingUp className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform" size={100} />
        </div>

        {/* Recent Activity List */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest px-2">Recent Feed</h3>
          <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden divide-y divide-slate-50">
            {jobs.slice(0, 3).map((job) => (
              <JobsRow key={job.id} task={job} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;