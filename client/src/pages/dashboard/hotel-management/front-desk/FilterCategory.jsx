import React from 'react';
import { Key, LogOut, Wrench, Bed, CheckCircle, Filter } from 'lucide-react';

export const HOTEL_CATEGORIES = {
  CheckIn: { color: '#10b981', icon: <Key size={14}/>, label: 'Check-In' },
  CheckOut: { color: '#ef4444', icon: <LogOut size={14}/>, label: 'Check-Out' },
  Maintenance: { color: '#f59e0b', icon: <Wrench size={14}/>, label: 'Maintenance' },
  Reserved: { color: '#3b82f6', icon: <Bed size={14}/>, label: 'Reservation' },
  Cleaned: { color: '#8b5cf6', icon: <CheckCircle size={14}/>, label: 'Housekeeping' }
};

const CategoryFilter = ({ activeFilters, toggleFilter }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {Object.entries(HOTEL_CATEGORIES).map(([key, value]) => {
        const isActive = activeFilters.includes(key);
        return (
          <button
            key={key}
            onClick={() => toggleFilter(key)}
            style={{
              borderColor: isActive ? value.color : '#e2e8f0',
              backgroundColor: isActive ? `${value.color}15` : '#fff',
              color: isActive ? value.color : '#64748b',
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all hover:shadow-sm active:scale-95"
          >
            <span style={{ color: isActive ? value.color : '#94a3b8' }}>
              {value.icon}
            </span>
            {value.label}
          </button>
        );
      })}
      
      <button 
        onClick={() => toggleFilter('ALL')}
        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 ml-2"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default CategoryFilter;