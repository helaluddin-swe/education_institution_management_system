import React from 'react';
import { 
  User, Mail, Phone, CheckCircle2, XCircle, 
  FileText, MessageSquare, Globe, ExternalLink,
  X, Calendar, Download, Briefcase
} from 'lucide-react';

const ApplicantProfile = ({ 
  selectedApplicant, 
  setSelectedApplicant, 
  updateStatus, 
  handleReject 
}) => {
  if (!selectedApplicant) return null;
  const { applicantInfo } = selectedApplicant;

  // Handles downloading the actual PDF file uploaded by the user
  const handleDownload = () => {
    if (applicantInfo?.resume) {
      const url = URL.createObjectURL(applicantInfo.resume);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', applicantInfo.resume.name);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* SIDEBAR - CONTACT INFO */}
        <aside className="w-full md:w-80 bg-slate-50 p-10 flex flex-col items-center border-r border-slate-100">
          <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-sm flex items-center justify-center text-indigo-600 mb-6 border border-slate-200">
            <User size={48} />
          </div>
          
          <h2 className="font-black text-2xl text-slate-900 text-center leading-tight">
            {applicantInfo?.fullName}
          </h2>
          <p className="text-[10px] font-black text-indigo-500 uppercase mt-2 tracking-widest text-center">
            {selectedApplicant.title}
          </p>

          <div className="w-full space-y-4 mt-10">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Email</span>
              <p className="text-xs font-bold text-slate-700 truncate">{applicantInfo?.email}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Phone</span>
              <p className="text-xs font-bold text-slate-700">{applicantInfo?.phone || 'Not Provided'}</p>
            </div>
          </div>

          <button 
            onClick={() => setSelectedApplicant(null)} 
            className="mt-auto pt-8 text-slate-400 text-[10px] font-black uppercase hover:text-rose-500 transition-colors tracking-[0.2em]"
          >
            Close Profile
          </button>
        </aside>

        {/* MAIN BODY - APPLICATION DETAILS */}
        <main className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col">
          <header className="flex justify-between items-start mb-10">
            <div className="flex gap-3">
              <span className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase">
                {selectedApplicant.category}
              </span>
              <span className="px-4 py-2 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase flex items-center gap-2">
                <Calendar size={12}/> Applied {applicantInfo?.appliedAt}
              </span>
            </div>
            <button 
              onClick={() => setSelectedApplicant(null)} 
              className="p-3 bg-slate-50 rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
            >
              <X size={20} />
            </button>
          </header>

          {/* COVER LETTER */}
          <section className="mb-10">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-indigo-500" /> Candidate Statement
            </h4>
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative">
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "{applicantInfo?.coverLetter || "The candidate did not provide a cover letter."}"
              </p>
            </div>
          </section>

          {/* LINKS & RESUME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <a 
              href={applicantInfo?.portfolio} 
              target="_blank" rel="noreferrer"
              className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-[2rem] hover:bg-indigo-600 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Globe size={22} className="text-indigo-400" />
                <span className="font-black text-[11px] uppercase tracking-widest">View Portfolio</span>
              </div>
              <ExternalLink size={18} />
            </a>

            <div className="flex items-center justify-between p-6 bg-white border-2 border-slate-100 rounded-[2rem]">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="text-indigo-500 shrink-0" size={22} />
                <span className="font-black text-[11px] uppercase tracking-widest truncate">
                  {applicantInfo?.resume?.name || 'Resume.pdf'}
                </span>
              </div>
              <button 
                onClick={handleDownload}
                className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                title="Download Resume"
              >
                <Download size={20} />
              </button>
            </div>
          </div>

          {/* PIPELINE ACTIONS */}
          <footer className="mt-auto pt-10 border-t border-slate-100">
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => updateStatus(selectedApplicant.id, 'Interview')} 
                className="flex-1 px-6 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                Schedule Interview
              </button>
              <button 
                onClick={() => updateStatus(selectedApplicant.id, 'Final Call')} 
                className="flex-1 px-6 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-amber-500 hover:text-amber-500 transition-all"
              >
                Final Call
              </button>
              <button 
                onClick={() => updateStatus(selectedApplicant.id, 'Offer')} 
                className="flex-[2] px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} /> Send Offer
              </button>
              <button 
                onClick={() => handleReject(selectedApplicant.id, applicantInfo?.fullName)} 
                className="px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all"
              >
                <XCircle size={16} />
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ApplicantProfile;