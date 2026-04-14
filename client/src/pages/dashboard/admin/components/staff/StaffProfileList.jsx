import React, { useState, useEffect } from 'react';
import {
  Users2, ShieldCheck, Trash2, Edit3, 
  Eye, Briefcase, Phone, Search, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActionDropdown from '../ActionDropDown';
import { useStaff } from '../../../../../context/StaffContext';

const StaffProfileList = ({ onEdit }) => {
  const navigate = useNavigate();
  const { staffList, terminateStaff, isLoading } = useStaff();
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Search Logic
  useEffect(() => {
    // Add safety check: ensure staffList is an array
    const safeList = Array.isArray(staffList) ? staffList : [];
    
    const results = safeList.filter(member => {
      // Safety check for every property before calling toLowerCase()
      const name = member?.fullName || "";
      const id = member?.employeeId || "";
      const subject = member?.primarySubject || "";
      
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(results);
  }, [searchTerm, staffList]);

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to remove this staff record? This will also delete their login account.")) {
      await terminateStaff(id);
    }
  };

  if (isLoading && (!staffList || staffList.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-500">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-sm font-bold uppercase tracking-widest">Accessing Dossiers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search by name, ID, or subject..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-xs font-bold uppercase tracking-wider">
             Total Staff: {staffList?.length || 0}
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Users2 size={20} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Results</p>
            <h4 className="text-xl font-bold text-white leading-none mt-1">{filteredData.length}</h4>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Class Teachers</p>
            <h4 className="text-xl font-bold text-emerald-500 leading-none mt-1">
              {filteredData.filter(s => s?.isClassTeacher).length}
            </h4>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Employee Information</th>
                <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Academic Role</th>
                <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Responsibility</th>
                <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Contact</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredData.map((member) => (
                <tr 
                  key={member?._id || Math.random()} 
                  className="group hover:bg-slate-800/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/admin/staff/view/${member?._id}`)}
                >
                  {/* Basic Info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 font-bold group-hover:border-indigo-500/50 transition-all shadow-inner uppercase">
                        {/* FIX: Safe check for fullName before charAt */}
                        {member?.fullName ? member.fullName.charAt(0) : '?'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                          {member?.fullName || "Unnamed Staff"}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                          <span className="text-indigo-500/80">{member?.employeeId || "No ID"}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Academic Role */}
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                         <Briefcase size={12} className="text-indigo-400" /> {member?.designation || "Staff"}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                        {member?.primarySubject || "General"}
                      </div>
                    </div>
                  </td>

                  {/* Responsibility */}
                  <td className="p-4">
                    {member?.isClassTeacher ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                        Class Teacher: {member?.assignedClassSection}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider italic">No Class Assigned</span>
                    )}
                  </td>

                  {/* Contact */}
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Phone size={12} className="text-slate-500" /> {member?.phoneNumber || "N/A"}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {member?.qualification || "No qualification listed"}
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <ActionDropdown
                      data={member}
                      actions={[
                        {
                          label: 'View Profile',
                          icon: <Eye size={16} />,
                          onClick: (m) => navigate(`/dashboard/admin/staff/view/${m?._id}`)
                        },
                        {
                          label: 'Edit Record',
                          icon: <Edit3 size={16} />,
                          onClick: (m) => onEdit(m)
                        },
                        {
                          label: 'Terminate Staff',
                          icon: <Trash2 size={16} />,
                          variant: 'danger',
                          onClick: (m) => handleDeleteStaff(m?._id)
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && !isLoading && (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 mb-4 shadow-xl text-slate-700">
              <Users2 size={32} />
            </div>
            <p className="text-slate-500 text-sm font-medium">No staff members found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffProfileList;