import { Calendar, GraduationCap, Phone, X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const StudentDetailModal = ({ student, onClose }) => {
  if (!student) return null;

  // Mock Attendance Data
  const presentDates = [1, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 22, 23, 24, 25];
  const daysInMonth = 31;
  const today = 27;

  // Calculate Chart Data
  const attendancePercentage = parseInt(student.academics.attendance);
  const chartData = [
    { name: 'Present', value: attendancePercentage, color: '#10b981' }, // Emerald 500
    { name: 'Absent', value: 100 - attendancePercentage, color: '#f87171' }, // Red 400
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X size={24} className="text-slate-500" />
          </button>
          <span className="px-4 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            Student ID: {student.rollNumber}
          </span>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-100">
            {student.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{student.fullName}</h2>
            <p className="text-slate-500 flex items-center gap-2 mt-1 font-bold text-sm">
              <GraduationCap size={16} className="text-blue-500" /> Grade {student.grade}-{student.section}
            </p>
          </div>
        </div>

        {/* Attendance Pie Chart Section */}
        <div className="bg-slate-50 border border-slate-100 rounded-4xl p-6 mb-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Attendance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Pie Chart */}
            <div className="h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Label */}
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-800">{attendancePercentage}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Rate</span>
              </div>
            </div>

            {/* Legend/Stats */}
            <div className="space-y-3">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-bold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Calendar View */}
        <div className="bg-white border border-slate-200 rounded-4xl p-6 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="font-black text-slate-700 uppercase tracking-tight flex items-center gap-2 text-sm">
              <Calendar size={18} className="text-blue-500" /> March 2026
            </h3>
            <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-slate-200" title="Unmarked" />
               <div className="w-2 h-2 rounded-full bg-green-500" title="Present" />
               <div className="w-2 h-2 rounded-full bg-red-400" title="Absent" />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="text-center text-[10px] font-black text-slate-300 py-1 uppercase">{day}</div>
            ))}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const isPresent = presentDates.includes(day);
              const isPast = day < today;
              
              let style = "bg-slate-50 text-slate-300 border border-slate-100"; // Unmarked
              if (isPresent) style = "bg-green-500 text-white shadow-lg shadow-green-100 border-transparent";
              else if (isPast) style = "bg-red-50 text-red-400 border border-red-100";

              return (
                <div key={i} className={`aspect-square rounded-xl flex items-center justify-center text-xs font-black transition-all ${style}`}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Guardian Info */}
        <div className="flex items-center justify-between p-6 bg-indigo-50/50 rounded-4xl border border-indigo-100 group">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                <Phone size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Emergency Contact</p>
                <p className="font-black text-slate-800 tracking-tight">{student.guardian.name} ({student.guardian.relation})</p>
             </div>
          </div>
          <a href={`tel:${student.guardian.phone}`} className="px-6 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
            CALL NOW
          </a>
        </div>

      </div>
    </div>
  );
};

export default StudentDetailModal;