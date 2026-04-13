import React from 'react';
import { Search, Plus, Calendar as CalendarIcon } from 'lucide-react';

const JobHeader = ({ 
  viewMode, 
  setViewMode, 
  searchQuery, 
  setSearchQuery, 
  onAddNew,
  title = "Jobs" 
}) => {
  const modes = ['Today', 'Weekly', 'Monthly'];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      {/* Title & View Toggles */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {viewMode} {title}
        </h1>
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit mt-2">
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                viewMode === mode 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            placeholder={`Filter ${viewMode.toLowerCase()}...`}
            className="pl-10 pr-4 py-2.5 bg-white text-gray-700 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Date Context Icon (Changes look based on mode) */}
        {viewMode === 'Monthly' && (
          <button className="p-2.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm transition-colors">
            <CalendarIcon size={20} />
          </button>
        )}

        <button 
          onClick={onAddNew}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} strokeWidth={3} />
          <span className="hidden sm:inline">New Job</span>
        </button>
      </div>
    </div>
  );
};

export default JobHeader;