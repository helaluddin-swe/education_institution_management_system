import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Award, Heart, BookOpen, 
  Activity, Download, ShieldCheck, GraduationCap, 
  Loader2, ArrowLeft, Edit3 
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, AreaChart, Area, Tooltip as RechartTooltip 
} from 'recharts';
import { useAuth } from '../../../../context/AuthContext';
import { studentProfiles } from '../../school-management/data';
// Assuming your mock data is here


const StudentProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // FRONTEND ONLY LOGIC: Find student in local array
    const getLocalStudent = () => {
      setLoading(true);
      try {
        // Find by ID (checking both string and number just in case)
        const foundStudent = studentProfiles.find(s => String(s.id || s._id) === String(id));
        
        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          setError("Student dossier not found in local records.");
        }
      } catch (err) {
        setError("An error occurred while retrieving student data.");
      } finally {
        // Small timeout to simulate a "loading" feel for the UI
        setTimeout(() => setLoading(false), 500);
      }
    };

    if (id) getLocalStudent();
  }, [id]);

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse text-indigo-300/60">Scanning Database...</p>
    </div>
  );

  if (error || !student) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white p-6 text-center">
      <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-[2.5rem] backdrop-blur-md">
        <Activity className="text-rose-500 mx-auto mb-4" size={48} />
        <h2 className="text-xl font-black mb-2 uppercase tracking-tighter text-rose-500">Record Missing</h2>
        <p className="text-slate-400 max-w-xs mb-6 text-sm">{error}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-xs uppercase transition-all">Return to List</button>
      </div>
    </div>
  );

  // Helper calculations
  const attendancePercentage = student.attendance?.totalDays > 0 
    ? ((student.attendance.presentDays / student.attendance.totalDays) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 text-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate(-1)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
           </button>
           <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <GraduationCap className="text-indigo-500" size={32} />
              {(student.name || "Student").split(' ')[0].toUpperCase()}'S DOSSIER
            </h1>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-1">
              {student.currentClass} • {student.section} • Roll #{student.rollNo}
            </p>
          </div>
        </div>
        {/* ... Buttons and Rest of UI ... */}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Identity Column */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-6">
             <div className="bg-[#0b1224] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden">
                <div className="relative flex flex-col items-center text-center">
                    <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-indigo-500/20 p-1.5 mb-6">
                        <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-[2rem]" />
                    </div>
                    <h2 className="text-2xl font-black text-white">{student.name}</h2>
                    <p className="text-indigo-400 font-bold tracking-widest text-[10px] uppercase mt-1">{student.studentId}</p>
                </div>
                {/* Contact Info */}
                <div className="mt-8 space-y-4 border-t border-white/5 pt-6">
                    <div className="flex items-center gap-4 text-sm">
                        <Mail className="text-indigo-400" size={18}/>
                        <span className="text-slate-400">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <Heart className="text-rose-400" size={18}/>
                        <span className="text-slate-400">BG: {student.medicalInfo?.bloodGroup}</span>
                    </div>
                </div>
             </div>
          </motion.div>

          {/* Stats/Charts Column */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard icon={<Activity className="text-emerald-400" />} value={`${attendancePercentage}%`} label="Attendance" />
                  <StatCard icon={<BookOpen className="text-indigo-400" />} value={student.subjects?.length} label="Subjects" />
                  <StatCard icon={<Award className="text-amber-400" />} value={student.achievements?.length} label="Awards" />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ChartWrapper title="Skills Analysis">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={student.performance}>
                            <PolarGrid stroke="#1e293b" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                            <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                        </RadarChart>
                    </ResponsiveContainer>
                  </ChartWrapper>

                  <ChartWrapper title="Attendance Trend">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={student.attendanceHistory}>
                            <Area type="monotone" dataKey="rate" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                            <RechartTooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                  </ChartWrapper>
              </div>
          </motion.div>
      </div>
    </div>
  );
};

// Reusable UI sub-components
const StatCard = ({ icon, value, label }) => (
    <div className="bg-[#0b1224] p-6 rounded-[2rem] border border-white/5">
        <div className="mb-2">{icon}</div>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</p>
    </div>
);

const ChartWrapper = ({ children, title }) => (
    <div className="bg-[#0b1224] p-8 rounded-[3rem] border border-white/5 h-[350px]">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">{title}</h3>
        {children}
    </div>
);

export default StudentProfileDetails;