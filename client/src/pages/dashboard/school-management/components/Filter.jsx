import React, { useState, useEffect } from 'react';
import { Search, Filter as FilterIcon } from 'lucide-react';

const StudentFilter = ({ students, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');

  // --- REFINED FILTER LOGIC ---
  useEffect(() => {
    const filtered = students.filter(s => {
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGrade = selectedGrade === 'All' || s.grade.toString() === selectedGrade;
      const matchesSection = selectedSection === 'All' || s.section === selectedSection;

      return matchesSearch && matchesGrade && matchesSection;
    });

    // Send the filtered list back to the parent component
    onFilterChange(filtered);
  }, [searchTerm, selectedGrade, selectedSection, students, onFilterChange]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input
          type="text"
          placeholder="Search name, ID or roll..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Group */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl">
          <FilterIcon size={14} className="text-slate-500" />

          {/* Grade Filter */}
          <select
            className="bg-transparent text-xs text-slate-400 outline-none cursor-pointer border-r border-slate-800 pr-2"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="All" className="bg-slate-950">All Grades</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={(i + 1).toString()} className="bg-slate-950">
                Grade {i + 1}
              </option>
            ))}
          </select>

          {/* Section Filter */}
          <select
            className="bg-transparent text-xs text-slate-400 outline-none cursor-pointer pl-1"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="All" className="bg-slate-950">All Sections</option>
            <option value="A" className="bg-slate-950">Section A</option>
            <option value="B" className="bg-slate-950">Section B</option>
            <option value="C" className="bg-slate-950">Section C</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedGrade !== 'All' || selectedSection !== 'All') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedGrade('All');
              setSelectedSection('All');
            }}
            className="text-[10px] uppercase font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentFilter;