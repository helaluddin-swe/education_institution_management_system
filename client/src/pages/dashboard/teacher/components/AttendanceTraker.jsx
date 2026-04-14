import React, { useState, useMemo, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  CheckCircle, XCircle, Search, LayoutGrid, Users, Calendar as CalendarIcon
} from 'lucide-react';

import AttendanceReport from './AttendanceReport';
import { useStudent } from '../../../../context/StudentContext';
import { useAttendance } from '../../../../context/AttendanceContext';

// --- Sub-component: StudentsFilter ---
const StudentsFilter = ({ filters, setFilters }) => (
  <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-slate-200 mb-6">
    {['grade', 'section', 'status'].map((key) => (
      <select 
        key={key}
        value={filters[key]}
        onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
        className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 capitalize cursor-pointer hover:border-blue-300 transition-colors"
      >
        <option value="All">All {key}s</option>
        {key === 'grade' && ['2', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(v => <option key={v} value={v}>Grade {v}</option>)}
        {key === 'section' && ['A', 'B', 'C'].map(v => <option key={v} value={v}>Section {v}</option>)}
        {key === 'status' && ['Active', 'Inactive'].map(v => <option key={v} value={v}>{v}</option>)}
      </select>
    ))}
  </div>
);

const AttendanceTracker = () => {
  const { students } = useStudent();
  const { markStudentAttendance, allLogs, fetchAllLogs } = useAttendance(); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState({ grade: 'All', section: 'All', status: 'All' });
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  // 1. Initial Data Sync & Fetch Global Logs
  useEffect(() => {
    fetchAllLogs(); 
    if (students && students.length > 0) {
      setAttendanceData(
        students.map(s => ({ 
          ...s, 
          todayStatus: 'Pending',
          attendanceVal: parseInt(s.academics?.attendance || 0) 
        }))
      );
    }
  }, [students, fetchAllLogs]);

  // 2. Sync UI Status with backend logs for the selected date
  useEffect(() => {
    if (allLogs && allLogs.length > 0) {
      setAttendanceData(prev => prev.map(student => {
        const logForDate = allLogs.find(log => {
          const logDate = new Date(log.date).toISOString().split('T')[0];
          return logDate === selectedDate && (log.studentId?._id === student._id || log.studentId === student._id);
        });

        return {
          ...student,
          todayStatus: logForDate ? (logForDate.status === 'present' ? 'Present' : 'Absent') : 'Pending'
        };
      }));
    }
  }, [selectedDate, allLogs]);

  // 3. Transform Backend Logs for Recharts (Fixed sorting and date labels)
  const chartTrendData = useMemo(() => {
    if (!allLogs || allLogs.length === 0) return [];

    const groups = allLogs.reduce((acc, log) => {
      const d = new Date(log.date);
      const dateKey = d.toISOString().split('T')[0]; // Use ISO for sorting
      const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!acc[dateKey]) acc[dateKey] = { sortKey: dateKey, name: dateLabel, presentCount: 0, total: 0 };
      
      acc[dateKey].total += 1;
      if (log.status === 'present') acc[dateKey].presentCount += 1;
      return acc;
    }, {});

    return Object.values(groups)
      .sort((a, b) => new Date(a.sortKey) - new Date(b.sortKey)) // Ensure chronological order
      .map(group => ({
        name: group.name,
        present: Math.round((group.presentCount / group.total) * 100),
        absent: Math.round(((group.total - group.presentCount) / group.total) * 100)
      }))
      .slice(-7); // Show only last 7 logged days
  }, [allLogs]);

  const filteredStudents = useMemo(() => {
    return attendanceData.filter(s => {
      const matchesSearch = s.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = filters.grade === 'All' || s.grade === filters.grade;
      const matchesSection = filters.section === 'All' || s.section === filters.section;
      const matchesStatus = filters.status === 'All' || s.status === filters.status;
      return matchesSearch && matchesGrade && matchesSection && matchesStatus;
    });
  }, [searchTerm, filters, attendanceData]);

  const updateStatus = async (e, id, status) => {
    e.stopPropagation();
    const currentStudent = attendanceData.find(s => s._id === id);
    if (currentStudent?.todayStatus === status) return;

    setAttendanceData(prev => 
      prev.map(item => item._id === id ? { ...item, todayStatus: status } : item)
    );

    await markStudentAttendance({
      studentId: id,
      status: status.toLowerCase(),
      date: new Date(selectedDate),
    });
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase italic">Attendance Tracker</h1>
            <div className="flex items-center gap-2 text-slate-500 font-medium bg-white w-fit px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <CalendarIcon size={14} className="text-blue-500" />
              <span className="text-xs">Log Date:</span>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="outline-none text-xs font-black bg-transparent cursor-pointer text-slate-800"
              />
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search student profile..." 
              className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-96 transition-all text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <StudentsFilter filters={filters} setFilters={setFilters} />

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-black text-slate-700 flex items-center gap-2 uppercase text-sm tracking-tight">
                <LayoutGrid size={18} className="text-blue-600"/> Roll Call
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                <tr>
                    <th className="px-8 py-4">Student Identity</th>
                    <th className="px-8 py-4 text-center">Class Stats</th>
                    <th className="px-8 py-4 text-right">Quick Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                    <tr 
                      key={student._id} 
                      onClick={() => setSelectedStudentId(student._id)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-all group"
                    >
                      <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              {student.fullName?.charAt(0) || '?'}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{student.fullName}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Roll: {student.rollNo} • {student.currentClass}-{student.section}</span>
                            </div>
                          </div>
                      </td>
                      <td className="px-8 py-5">
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-black text-slate-700 mb-1">{student.attendanceVal}%</span>
                            <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-700 ${student.attendanceVal > 85 ? 'bg-green-500' : 'bg-amber-500'}`}
                                  style={{ width: `${student.attendanceVal}%` }}
                                />
                            </div>
                          </div>
                      </td>
                      <td className="px-8 py-5">
                          <div className="flex justify-end gap-2">
                            <button 
                                onClick={(e) => updateStatus(e, student._id, 'Present')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-tighter uppercase transition-all ${student.todayStatus === 'Present' ? 'bg-green-500 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400 hover:bg-green-50 hover:text-green-600'}`}
                            >
                                <CheckCircle size={14} /> Present
                            </button>
                            <button 
                                onClick={(e) => updateStatus(e, student._id, 'Absent')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-tighter uppercase transition-all ${student.todayStatus === 'Absent' ? 'bg-red-500 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600'}`}
                            >
                                <XCircle size={14} /> Absent
                            </button>
                          </div>
                      </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-700 uppercase tracking-tight">Attendance Trend (%)</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"/> <span className="text-[10px] font-bold text-slate-400 uppercase">Present</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"/> <span className="text-[10px] font-bold text-slate-400 uppercase">Absent</span></div>
              </div>
            </div>
            {/* Fixed height container for LineChart */}
            <div className="h-62.5 w-full text-gray-600">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    unit="%" 
                    tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} 
                    domain={[0, 100]} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} 
                    cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="present" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 6 }} 
                    animationDuration={1000}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="absent" 
                    stroke="#ef4444" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-slate-400 text-xs uppercase tracking-[0.2em] font-black mb-6">Daily Summary: {new Date(selectedDate).toLocaleDateString()}</h4>
              <div className="space-y-6">
                {[
                  { label: 'Present', val: attendanceData.filter(s => s.todayStatus === 'Present').length, color: 'text-green-400' },
                  { label: 'Absent', val: attendanceData.filter(s => s.todayStatus === 'Absent').length, color: 'text-red-400' },
                  { label: 'Pending', val: attendanceData.filter(s => s.todayStatus === 'Pending').length, color: 'text-amber-400' }
                ].map(stat => (
                  <div key={stat.label} className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-sm font-bold opacity-60 uppercase tracking-tighter">{stat.label}</span>
                    <span className={`text-2xl font-black ${stat.color}`}>{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 text-white/5 pointer-events-none"><Users size={160}/></div>
          </div>
        </div>
      </div>

      {selectedStudentId && (
        <AttendanceReport
          studentId={selectedStudentId} 
          onClose={() => setSelectedStudentId(null)} 
        />
      )}
    </div>
  );
};

export default AttendanceTracker;