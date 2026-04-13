import React from 'react';
import { 
  Share2, Linkedin, Facebook, Twitter, 
  Copy, ExternalLink, Megaphone, Globe, 
  DollarSign, MapPin, AlignLeft 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Campaign = ({ job }) => {
  if (!job) return null;

  // The URL of the job post on your site
  const jobUrl = `http://localhost:5173/jobs/${job.id}`;
  const encodedUrl = encodeURIComponent(jobUrl);
  
  // Create a compelling caption
  const shareText = `🚀 We're hiring a ${job.title}! 
📍 ${job.locationType}
💰 ${job.salary}
Join our team and make an impact. Apply here:`;

  const encodedTitle = encodeURIComponent(shareText);

  // Social Share Links (Native Intents)
  const socialPlatforms = [
    {
      name: 'LinkedIn',
      icon: <Linkedin size={18} />,
      color: 'bg-[#0077b5]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      name: 'Facebook',
      icon: <Facebook size={18} />,
      color: 'bg-[#1877f2]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      name: 'Twitter / X',
      icon: <Twitter size={18} />,
      color: 'bg-[#000000]',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jobUrl);
    toast.success("Job link copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
          <Megaphone size={24} />
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-xl tracking-tight">Campaign Job Post</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Social Outreach Center</p>
        </div>
      </div>

      {/* JOB DATA PREVIEW */}
      <div className="bg-slate-50 rounded-[2rem] p-6 mb-8 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Post Content Preview</p>
            <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">{job.date}</span>
        </div>
        
        <div className="space-y-4">
            <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-white rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                    <Globe size={16} />
                </div>
                <div>
                    <h4 className="font-black text-slate-800 text-sm">{job.title}</h4>
                    <div className="flex gap-3 mt-1 text-[10px] font-bold text-slate-400">
                        <span className="flex items-center gap-1"><MapPin size={10}/> {job.locationType}</span>
                        <span className="flex items-center gap-1 text-emerald-600"><DollarSign size={10}/> {job.salary}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white/60 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <AlignLeft size={12} />
                    <span className="text-[9px] font-black uppercase">Description Snippet</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 italic">
                    {job.description || "No description provided for this position."}
                </p>
            </div>
        </div>
      </div>

      {/* SOCIAL ACTIONS */}
      <div className="mt-auto space-y-3">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2 text-center">Share to Platforms</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {socialPlatforms.map((platform) => (
            <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${platform.color} text-white flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all shadow-lg shadow-slate-100`}
            >
                {platform.icon} {platform.name}
            </a>
            ))}
        </div>

        <div className="flex gap-2 pt-2">
            <button 
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all group"
            >
                <Copy size={16} className="text-slate-400 group-hover:text-white" /> Copy Public Link
            </button>
            
            {navigator.share && (
                <button 
                    onClick={() => navigator.share({ 
                        title: job.title, 
                        text: shareText, 
                        url: jobUrl 
                    })}
                    className="px-6 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors"
                    title="System Share"
                >
                    <Share2 size={18} />
                </button>
            )}
        </div>
      </div>

      <div className="mt-6 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex gap-3 items-center">
        <div className="h-2 w-2 bg-indigo-500 rounded-full animate-ping" />
        <p className="text-[9px] font-bold text-indigo-600 uppercase leading-tight">
            Sharing this post increases applicant traffic by up to **40%**
        </p>
      </div>
    </div>
  );
};

export default Campaign;