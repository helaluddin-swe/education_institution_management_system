import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, GraduationCap, Phone, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useStudent } from '../../../../context/StudentContext';
import { useAttendance } from '../../../../context/AttendanceContext';

const AttendanceReport = ({ studentId, onClose }) => {
  const { students } = useStudent();
  const { fetchStudentReport } = useAttendance();
  
  // Local States
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [reportData, setReportData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  // Find base student info
  const student = students.find(s => s._id === studentId);

  // 1. Fetch the full report (including records) on mount
  useEffect(() => {
    const getReport = async () => {
      setIsFetching(true);
      const data = await fetchStudentReport(studentId);
      if (data) setReportData(data);
      setIsFetching(false);
    };
    if (studentId) getReport();
  }, [studentId, fetchStudentReport]);

  if (!student) return null;

  // Calendar Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Navigation Handlers
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // 2. Extract and Filter Records
  const attendanceRecords = reportData?.records || [];
  
  const getStatusForDay = (day) => {
    const record = attendanceRecords.find(r => {
      const d = new Date(r.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
    return record ? record.status : null;
  };

  // Stats Logic - Memoized for performance
  const stats = useMemo(() => {
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const total = present + absent;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, absent, total, percentage };
  }, [attendanceRecords]);

  const chartData = [
    { name: 'Present', value: stats.percentage, color: '#10b981' },
    { name: 'Absent', value: 100 - stats.percentage, color: '#f87171' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300 relative">
        
        {/* Loading Overlay */}
        {isFetching && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X size={24} className="text-slate-500" />
          </button>
          <span className="px-4 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            Roll Number: {student?.rollNo || 'N/A'}
          </span>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl">
            {student.fullName?.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{student.fullName}</h2>
            <p className="text-slate-500 flex items-center gap-2 mt-1 font-bold text-sm">
              <GraduationCap size={16} className="text-blue-500" /> {student.currentClass}-{student.section}
            </p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-40 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-800">{stats.percentage}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate</span>
              </div>
            </div>

            <div className="space-y-3">
              <StatItem label="Present" value={stats.present} color="#10b981" />
              <StatItem label="Absent" value={stats.absent} color="#f87171" />
              <StatItem label="Total" value={stats.total} color="#6366f1" />
            </div>
          </div>
        </div>

        {/* Interactive Calendar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-700 uppercase tracking-tight flex items-center gap-2 text-sm">
              <CalendarIcon size={18} className="text-blue-500" /> 
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="text-center text-[10px] font-black text-slate-300 py-1">{day}</div>
            ))}
            
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const status = getStatusForDay(day);
              const isSelected = selectedDay === day;
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
              
              let statusClasses = "bg-slate-50 text-slate-500 hover:bg-slate-100";
              if (status === 'present') statusClasses = "bg-green-500 text-white shadow-lg shadow-green-100";
              else if (status === 'absent') statusClasses = "bg-red-400 text-white shadow-lg shadow-red-100";
              
              const borderClasses = isSelected ? "border-2 border-blue-500" : isToday ? "border border-blue-200" : "border border-transparent";

              return (
                <button 
                  key={day} 
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xs font-black transition-all ${statusClasses} ${borderClasses}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Guardian Footer */}
        {student.guardian && (
          <div className="flex items-center justify-between p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                  <Phone size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Guardian</p>
                  <p className="font-black text-slate-800 tracking-tight">{student.guardian.name}</p>
               </div>
            </div>
            <a href={`tel:${student.guardian.phone}`} className="px-6 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-transform active:scale-95">
              CALL
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const StatItem = ({ label, value, color }) => (
  <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{label}</span>
    </div>
    <span className="text-sm font-black text-slate-800">{value}</span>
  </div>
);

export default AttendanceReport;