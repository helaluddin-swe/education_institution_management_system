import React, { useState } from 'react';
import { User, Mail, Phone, Link as LinkIcon, FileText, Send, ChevronLeft } from 'lucide-react';

const ApplyForm = ({ job, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    portfolio: '',
    resume: null,
    coverLetter: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd use FormData() for file uploads
    onSubmit({
      ...formData,
      jobId: job.id,
      jobTitle: job.title,
      appliedAt: new Date().toLocaleDateString()
    });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-5 duration-300">
      {/* Mini Header */}
      <div className="p-8 border-b border-slate-50 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-900">Applying for {job.title}</h2>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Candidate Information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="John Doe"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                required
                type="email"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="john@example.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Portfolio Link */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Portfolio / LinkedIn URL</label>
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="url"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="https://portfolio.com"
              onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
            />
          </div>
        </div>

        {/* Resume Upload */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Resume (PDF)</label>
          <div className="relative border-2 border-dashed border-slate-100 rounded-3xl p-8 hover:bg-indigo-50/30 hover:border-indigo-200 transition-all group text-center">
            <input 
              required
              type="file" 
              accept=".pdf"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
            />
            <FileText className="mx-auto mb-2 text-slate-300 group-hover:text-indigo-500 transition-colors" size={32} />
            <p className="text-xs font-bold text-slate-500">
              {formData.resume ? formData.resume.name : "Click to upload or drag and drop"}
            </p>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Briefly, why you?</label>
          <textarea 
            rows="4"
            className="w-full p-6 bg-slate-50 border-none rounded-3xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="Tell us a bit about your experience..."
            onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
          ></textarea>
        </div>

        <button 
          type="submit"
          className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          <Send size={16} /> Confirm & Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyForm;