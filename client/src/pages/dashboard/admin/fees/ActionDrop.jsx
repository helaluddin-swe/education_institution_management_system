import React, { useState, useEffect, useRef } from "react";
import { Eye, Edit2, Trash2, MoreVertical, GraduationCap } from "lucide-react";

const ActionDropdown = ({ student, setSelectedStudent, handleEdit, handleDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex justify-end" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-all active:scale-90"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          
          {/* VIEW DETAILS / FEES */}
          <button
            onClick={() => {
              setSelectedStudent(student);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors"
          >
            <Eye size={16} />
            <span className="font-medium">View & Manage Fees</span>
          </button>

          {/* EDIT PROFILE */}
          <button
            onClick={(e) => {
              handleEdit(e, student);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
          >
            <Edit2 size={16} />
            <span className="font-medium">Edit Profile</span>
          </button>

          <div className="h-px bg-slate-800 my-1 mx-2" />

          {/* DELETE RECORD */}
          <button
            onClick={(e) => {
              // Using _id as primary, falling back to id to match Mongoose
              handleDelete(e, student._id || student.id);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={16} />
            <span className="font-medium">Remove Student</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;