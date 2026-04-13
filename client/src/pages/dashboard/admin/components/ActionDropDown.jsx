import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

const ActionDropdown = ({ actions, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // Prevents row click events
          setIsOpen(!isOpen);
        }}
        className={`p-2 rounded-xl transition-all active:scale-90 ${
          isOpen 
            ? 'bg-indigo-500/20 text-indigo-400' 
            : 'text-slate-400 hover:text-white hover:bg-white/10'
        }`}
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0f172a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right"
          onClick={(e) => e.stopPropagation()} // Keeps menu open if clicking inside padding
        >
          <div className="py-1.5 p-1">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(data);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold transition-all rounded-xl
                  ${action.variant === 'danger' 
                    ? 'text-rose-400 hover:bg-rose-500/10' 
                    : 'text-slate-300 hover:bg-white/10 hover:text-indigo-400'}
                `}
              >
                <span className={action.variant === 'danger' ? 'text-rose-500' : 'text-indigo-500'}>
                  {action.icon}
                </span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;