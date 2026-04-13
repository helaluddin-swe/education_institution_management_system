import React, { useState } from 'react';
import { 
  User, Mail, FileText, ChevronRight, Briefcase, 
  Search, Filter, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ApplicantProfile from './ApplicantProfile';

const AppliedApplicants = ({ applicants, setJobs }) => {
  const [filter, setFilter] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Update Status Logic
  const updateStatus = (jobId, newStatus) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
    
    // Sync the local modal state if open
    if (selectedApplicant && selectedApplicant.id === jobId) {
      setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
    }
    
    toast.success(`Applicant moved to ${newStatus}`);
  };

  // Reject Logic
  const handleReject = (jobId, userName) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'Rejected', completed: false } : job
    ));
    toast.error(`Application for ${userName} rejected`);
    setSelectedApplicant(null);
  };

  const filteredList = applicants.filter(a => {
    if (filter === 'All') return a.completed === true; // Show only those who applied
    return a.status === filter;
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto bg-[#FAFBFF] min-h-screen font-sans">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Applicant Pipeline</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-2 w-2 bg-indigo-600 rounded-full animate-pulse" />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
              {filteredList.length} Total Candidates
            </p>
          </div>
        </div>
        
        {/* TAB NAVIGATION */}
        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-slate-100 overflow-x-auto max-w-full">
          {['All', 'Applied', 'Interview', 'Final Call', 'Offer'].map(tab => (
            <button 
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === tab 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* APPLICANT LIST */}
      <div className="grid gap-6">
        {filteredList.length > 0 ? (
          filteredList.map((applicant) => (
            <div 
              key={applicant.id} 
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center group hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-500 border-l-4 border-l-transparent hover:border-l-indigo-600"
            >
              <div 
                className="flex items-center gap-6 flex-1 cursor-pointer w-full" 
                onClick={() => setSelectedApplicant(applicant)}
              >
                <div className="h-16 w-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <User size={30} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-800 text-xl flex items-center gap-2 truncate">
                    {applicant.applicantInfo?.fullName || "Anonymous Candidate"}
                  </h3>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.15em] mb-2">
                    {applicant.title}
                  </p>
                  <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-bold">
                     <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                       <Mail size={12}/> {applicant.applicantInfo?.email}
                     </span>
                     <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                       <FileText size={12}/> {applicant.applicantInfo?.resume?.name || 'Resume.pdf'}
                     </span>
                  </div>
                </div>
              </div>

              {/* ACTION AREA */}
              <div className="flex items-center gap-4 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                <span className={`text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-tighter border-2 ${
                   applicant.status === 'Offer' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                   applicant.status === 'Final Call' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                   'bg-slate-50 text-slate-500 border-slate-100'
                 }`}>
                   {applicant.status || 'Applied'}
                </span>

                <button 
                  onClick={() => setSelectedApplicant(applicant)}
                  className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
                >
                  Review Profile <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No candidates found</h3>
            <p className="text-slate-300 text-sm font-medium mt-2">Adjust your filters to see more applicants.</p>
          </div>
        )}
      </div>

      {/* DETAILED MODAL OVERLAY */}
      {selectedApplicant && (
        <ApplicantProfile 
          selectedApplicant={selectedApplicant} 
          setSelectedApplicant={setSelectedApplicant}
          updateStatus={updateStatus}
          handleReject={handleReject}
        />
      )}
    </div>
  );
};

export default AppliedApplicants;