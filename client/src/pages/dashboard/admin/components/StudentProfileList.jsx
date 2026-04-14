import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Phone, Users2,
  ShieldCheck, Trash2, Edit3, MapPin,
  TrendingUp, CalendarCheck,
  Eye
} from 'lucide-react';
import StudentFilter from '../../school-management/components/Filter';
import ActionDropdown from './ActionDropDown';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../../../../context/StudentContext';

const StudentProfileList = ({ onEdit }) => {
  const navigate = useNavigate();
  const { students, expelStudent } = useStudent();
  const [filteredData, setFilteredData] = useState(students);

  useEffect(() => {
    setFilteredData(students);
  }, [students]);

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student record? This action cannot be undone.")) {
      await expelStudent(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Search & Filter Bar */}
      <StudentFilter
        students={students}
        onFilterChange={setFilteredData}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Users2 size={20} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Results Found</p>
            <h4 className="text-xl font-bold text-white leading-none mt-1">{filteredData.length}</h4>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Active in View</p>
            <h4 className="text-xl font-bold text-emerald-500 leading-none mt-1">
              {filteredData.filter(s => s.status === 'Active').length}
            </h4>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Student Information</th>
                <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Class / Contact</th>
                <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Guardian Info</th>
                <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Academic Summary</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredData.map((student) => (
                <tr 
                  key={student._id || student.id} 
                  className="group hover:bg-slate-800/30 transition-colors cursor-pointer"
                  onClick={(e) => {
                    if (e.target.closest('button')) return;
                    navigate(`/dashboard/admin/students/view/${student._id || student.id}`);
                  }}
                >
                  {/* Basic Info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 font-bold group-hover:border-indigo-500/50 transition-all shadow-inner uppercase">
                        {student.fullName?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{student.fullName}</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                          {/* UPDATED: rollNo instead of rollNumber */}
                          <span className="text-indigo-500/80">ROLL: {student.rollNo || 'N/A'}</span>
                          <span className="text-slate-700">•</span>
                          <span>{student.personal?.bloodGroup || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Class / Contact */}
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {/* UPDATED: currentClass instead of grade */}
                      <span className="text-xs text-slate-300 font-medium">
                        Class {student.currentClass || 'N/A'} - {student.section || 'A'}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <MapPin size={10} className="text-slate-600" />
                        <span className="truncate max-w-30">{student.personal?.address || 'No Address'}</span>
                      </div>
                    </div>
                  </td>

                  {/* Guardian Info */}
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                        {student.guardian?.name || 'N/A'}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Phone size={10} className="text-indigo-500/70" /> {student.guardian?.phone || 'No Phone'}
                      </div>
                    </div>
                  </td>

                  {/* Academic Summary */}
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                          <TrendingUp size={10} /> GPA {student.academics?.lastGPA || '0.00'}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-400">
                          <CalendarCheck size={10} /> {student.academics?.attendance || '0%'}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        student.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                        <span className={`w-1 h-1 rounded-full ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {student.status || 'Active'}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <ActionDropdown
                      data={student}
                      actions={[
                        {
                          label: 'View Profile',
                          icon: <Eye size={16} />,
                          onClick: (s) => navigate(`/dashboard/admin/students/view/${s._id || s.id}`)
                        },
                        {
                          label: 'Edit Student',
                          icon: <Edit3 size={16} />,
                          onClick: (s) => onEdit(s)
                        },
                        {
                          label: 'Delete Record',
                          icon: <Trash2 size={16} />,
                          variant: 'danger',
                          onClick: (s) => handleDeleteStudent(s._id || s.id)
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 mb-4 shadow-xl">
              <GraduationCap className="text-slate-700" size={32} />
            </div>
            <p className="text-slate-500 text-sm font-medium">No students found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfileList;