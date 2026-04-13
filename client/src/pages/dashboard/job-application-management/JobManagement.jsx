import React, { useState, useMemo } from 'react';
import { Plus, Layout, CheckCircle, Users, Briefcase, TrendingUp } from 'lucide-react';
import Overview from './components/Overview';
import Jobs from './components/Jobs';
import Performace from './components/Performace';
import Teams from './components/Teams';
import Settings from './components/Settings';
import Status from './components/Status';
import { jobsData } from './jobs/jobsUtils';
import AppliedApplicants from './admin/ApplyedApplicant';
import Campaign from './campaign/Campaign';


const JobManagement = ({ subPage }) => {
  // --- GLOBAL STATES ---
  // Using the updated taskData (now Job data) from your utils
  const [jobs, setJobs] = useState(jobsData);

  // --- DERIVED RECRUITMENT ANALYTICS ---
  const stats = useMemo(() => {
    const total = jobs.length;
    // 'completed' in job context means the position is filled
    const filled = jobs.filter(j => j.completed).length;
    const active = total - filled;
    // 'efficiency' becomes 'Fill Rate'
    const fillRate = total > 0 ? Math.round((filled / total) * 100) : 0;

    return { total, filled, active, fillRate };
  }, [jobs]);

  // --- CONTENT ROUTING ---
  const renderContent = () => {
    // Standardizing props to use 'jobs' and 'setJobs' for clarity
    switch (subPage) {
      case 'dashboard':
        return <Overview jobs={jobs} setJobs={setJobs} />;
      case 'jobs':
        return <Jobs jobs={jobs} setJobs={setJobs} />;
      case 'status':
        return <Status jobs={jobs} setJobs={setJobs} />;
      case 'performance':
        return <Performace jobs={jobs} />;
      case 'teams':
        return <Teams jobs={jobs} setJobs={setJobs} />;
      case 'admin':
        return <AppliedApplicants
          applicants={jobs.filter(j => j.completed)} // Only show those who applied
          setJobs={setJobs}
        />
      case 'settings':
        return <Settings />;
        case 'campaign':
        return <Campaign job={jobs}  />;
      default:
        return <Overview jobs={jobs} setJobs={setJobs} />;
    }

  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white capitalize tracking-tight">
            {subPage === 'dashboard' || !subPage ? 'Hiring Overview' : `${subPage} Control`}
          </h2>
          <p className="text-slate-400 text-[10px] tracking-widest font-black uppercase mt-1">
            Recruitment Status: <span className="text-emerald-400">Active</span> • March 2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* GLOBAL STATS BADGES */}
          <div className="hidden lg:flex gap-2">
            {/* Active Listings Badge */}
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                <Briefcase size={14} className="text-indigo-400" />
              </div>
              <div className="leading-tight">
                <p className="text-[9px] text-slate-500 font-bold uppercase">Openings</p>
                <p className="text-xs text-white font-bold">{stats.active} Active</p>
              </div>
            </div>

            {/* Fill Rate Badge */}
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                <TrendingUp size={14} className="text-emerald-400" />
              </div>
              <div className="leading-tight">
                <p className="text-[9px] text-slate-500 font-bold uppercase">Fill Rate</p>
                <p className="text-xs text-white font-bold">{stats.fillRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <div className="min-h-[70vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </div>
    </div>
  );
};

export default JobManagement;