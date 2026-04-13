import React from 'react';
import { Search, Plus, FileDown, Filter } from 'lucide-react';

const InventoryHeader = ({ 
  viewMode, 
  setViewMode, 
  searchQuery, 
  setSearchQuery, 
  onAddNew,
  title = "Inventory" 
}) => {
  // Added 'All Items' to match your Products.js state
  const modes = ['All Items', 'In Stock', 'Low Stock', 'Out Of Stock'];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
      
      {/* 1. Title & View Toggles */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-indigo-600 rounded-full" />
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
            {title}
          </h1>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-[1.25rem] w-fit mt-1 border border-slate-200/50">
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
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

      {/* 2. Search & Actions */}
      <div className="flex items-center gap-3 w-full lg:w-auto">
        
        {/* Search Input */}
        <div className="relative flex-1 lg:flex-none">
          <Search 
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              searchQuery ? 'text-indigo-500' : 'text-slate-300'
            }`} 
            size={18} 
          />
          <input 
            type="text" 
            value={searchQuery}
            placeholder={`Search SKU or Name...`}
            className="w-full lg:w-72 pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-50 shadow-sm transition-all placeholder:text-slate-300"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Export Button (New) */}
        <button 
          title="Export to CSV"
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all active:scale-95"
        >
          <FileDown size={20} />
        </button>

        {/* Add New Product Button */}
        <button 
          onClick={onAddNew}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 transition-all active:scale-95 flex items-center gap-3"
        >
          <Plus size={16} strokeWidth={4} />
          <span>New Product</span>
        </button>

      </div>
    </div>
  );
};

export default InventoryHeader;