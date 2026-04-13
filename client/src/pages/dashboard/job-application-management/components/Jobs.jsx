import React, { useState } from 'react';
import { Briefcase, Search } from 'lucide-react';
import { AnalyticsCard, JobsRow } from '../jobs/jobComponent';

import { toast } from "react-hot-toast";
import JobHeader from '../jobs/JobHeader';
import AddNewJob from '../jobs/AddNewJob';


const Jobs = ({  jobs, setJobs }) => {
  // --- State Management ---
  const [viewMode, setViewMode] = useState('Monthly');
  const [searchQuery, setSearchQuery] = useState('');
  // Set to a dynamic or static default that matches your jobsData format
  const [selectedDate] = useState('Mar 28'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    locationType: 'Remote', // Changed from 'priority' to 'locationType'
    salary: '',
    date: selectedDate
  });
  const [viewingJob, setViewingJob] = useState(null);

// 2. Add an apply handler
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

  // --- Filter Logic ---
  const displayJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         j.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (viewMode === 'Today') return j.date === selectedDate && matchesSearch;
    
    if (viewMode === 'Monthly') {
      const currentMonth = selectedDate.split(' ')[0]; // Extracts "Mar"
      return j.date.startsWith(currentMonth) && matchesSearch;
    }

    return matchesSearch;
  });

  // --- Analytics Logic ---
  const categoryStats = displayJobs.reduce((acc, job) => {
    acc[job.category] = (acc[job.category] || 0) + 1;
    return acc;
  }, {});

  const totalJobsInView = displayJobs.length;

  const pieData = Object.entries(categoryStats).map(([label, value], index) => ({
    label,
    value,
    color: ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'][index % 5],
    percentage: totalJobsInView > 0 ? (value / totalJobsInView) * 100 : 0
  }));

  // --- CRUD Handlers ---
  const handleSaveTask = (e) => {
    e.preventDefault();
    if (editingTask) {
      setJobs(jobs.map(j => j.id === editingTask.id ? { ...j, ...formData } : j));
      toast.success("Job Listing Updated!");
    } else {
      const newJob = {
        id: Date.now(),
        ...formData,
        completed: false, // Default: Not applied yet
        isFavorite: false,
      };
      setJobs([newJob, ...jobs]);
      toast.success("Job Posted Successfully! 🚀");
    }
    closeModal();
  };

  const deleteJob = (id) => {
    setJobs(jobs.filter(j => j.id !== id));
    toast.success("Job Listing Removed");
  };

  // Logic for the Heart icon
  const toggleFavorite = (id) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, isFavorite: !j.isFavorite } : j));
    // Toast only on "Save" action
    const job = jobs.find(j => j.id === id);
    if (!job?.isFavorite) toast.success("Job Saved to Favorites");
  };

  const openEditModal = (job) => {
    setEditingTask(job);
    setFormData({ 
      title: job.title, 
      category: job.category, 
      locationType: job.locationType, // Synced key
      salary: job.salary,
      date: job.date 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({ 
        title: '', 
        category: 'Web Development', 
        locationType: 'Remote', 
        salary: '', 
        date: selectedDate 
    });
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto bg-[#FDFDFF] min-h-screen">
      {/* 1. Header */}
      <JobHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddNew={() => setIsModalOpen(true)}
        title="Job Board"
      />

      {/* 2. Job List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
        <div className="hidden md:grid grid-cols-12 bg-slate-50/50 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="col-span-6">Position & Type</div>
          <div className="col-span-3 text-center">Salary Estimate</div>
          <div className="col-span-3 text-right">Options</div>
        </div>
        
        {displayJobs.length > 0 ? (
          displayJobs.map((job) => (
            <JobsRow
              key={job.id}
              task={job}
              handleApply={handleApply}
              onToggle={toggleFavorite} 
              onEdit={openEditModal}
              onDelete={deleteJob}
            />
          ))
        ) : (
          <div className="p-20 text-center text-slate-300 font-bold flex flex-col items-center gap-4">
            <Search size={40} className="text-slate-100" />
            <p>No job listings found for "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* 3. Stats & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-2xl shadow-indigo-200/50">
          <div>
            <div className="flex justify-between items-center mb-6">
              <Briefcase className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Board Health</span>
            </div>
            <h3 className="text-3xl font-black mb-2">{jobs.length}</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">Active Listings</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <p className="text-[9px] font-black text-indigo-400 uppercase">Applied</p>
              <p className="text-xl font-bold">{jobs.filter(j => j.completed).length}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <p className="text-[9px] font-black text-emerald-400 uppercase">Bookmarked</p>
              <p className="text-xl font-bold">{jobs.filter(j => j.isFavorite).length}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <AnalyticsCard
            pieData={pieData}
            totalJobs={jobs.length} 
            viewMode="Role Distribution"
          />
        </div>
      </div>

      {/* 4. Modal */}
      {isModalOpen && (
        <AddNewJob
          editingTask={editingTask}
          closeModal={closeModal}
          formData={formData}
          setFormData={setFormData}
          handleSaveTask={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Jobs;