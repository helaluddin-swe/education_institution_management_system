import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Heart, Activity, 
  ShieldCheck, GraduationCap, Loader2, ArrowLeft, 
  User, Calendar, Briefcase, Award
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, AreaChart, Area, Tooltip as RechartTooltip 
} from 'recharts';
import { useStudent } from '../../../../context/StudentContext';

const StudentProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students } = useStudent();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const getDynamicStudent = () => {
      setLoading(true);
      try {
        const foundStudent = students.find(s => String(s._id || s.id) === String(id));
        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          setError("Student record not found in the database.");
        }
      } catch (err) {
        setError("Failed to synchronize with database.");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    if (id && students.length > 0) getDynamicStudent();
  }, [id, students]);

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse text-indigo-300/60">Loading Student Dossier...</p>
    </div>
  );

  if (error || !student) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
      <Activity className="text-rose-500 mx-auto mb-4" size={48} />
      <h2 className="text-xl font-black text-white uppercase tracking-tighter">Record Missing</h2>
      <p className="text-slate-400 mb-6">{error}</p>
      <button onClick={() => navigate(-1)} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold uppercase transition-all hover:bg-white/10">Return to Registry</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 text-slate-200">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <GraduationCap className="text-indigo-500" size={32} />
              {(student.fullName || "Student").toUpperCase()}
            </h1>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-1">
              Class {student.currentClass} • Section {student.section} • Roll #{student.rollNo}
            </p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${student.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
          {student.status}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-6">
          <div className="bg-[#0b1224] border border-white/5 rounded-[3rem] p-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-[2.5rem] bg-slate-950 border-4 border-indigo-500/20 flex items-center justify-center mb-6 overflow-hidden">
                {student.profilePicture ? (
                  <img src={student.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-slate-800" />
                )}
              </div>
              <h2 className="text-2xl font-black text-white leading-tight">{student.fullName}</h2>
              <p className="text-indigo-400 font-bold tracking-widest text-[10px] uppercase mt-2">{student.studentId}</p>
            </div>

            <div className="mt-8 space-y-4 border-t border-white/5 pt-6">
              <InfoRow icon={<Mail />} label={student.personal?.email || "No Email"} />
              <InfoRow icon={<MapPin />} label={student.personal?.address || "No Address"} />
              <InfoRow icon={<Heart className="text-rose-500" />} label={`Blood: ${student.personal?.bloodGroup}`} />
            </div>
          </div>

          {/* Guardian Info */}
          <div className="bg-[#0b1224] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ShieldCheck size={14} /> Guardian Records
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-white font-bold text-sm">{student.guardian?.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">{student.guardian?.relation} • {student.guardian?.occupation}</p>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone size={14} className="text-indigo-500" /> {student.guardian?.phone}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Column */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={<Activity className="text-emerald-400" />} value={student.academics?.attendance || "0%"} label="Attendance" />
            <StatCard icon={<Award className="text-amber-400" />} value={student.academics?.lastGPA || "0.00"} label="Cumulative GPA" />
            <StatCard icon={<Calendar className="text-indigo-400" />} value={student.personal?.dob ? new Date(student.personal.dob).getFullYear() : "N/A"} label="Birth Year" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ChartWrapper title="Academic Skill Map">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={student.academics?.subjectGrades?.length ? student.academics.subjectGrades : defaultRadarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Radar name="Performance" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Growth Trajectory">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={student.academics?.progressHistory?.length ? student.academics.progressHistory : defaultAreaData}>
                  <Area type="monotone" dataKey="rate" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                  <RechartTooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Sub-components
const InfoRow = ({ icon, label }) => (
  <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
    <div className="text-indigo-500">{icon && React.cloneElement(icon, { size: 16 })}</div>
    <span className="truncate">{label}</span>
  </div>
);

const StatCard = ({ icon, value, label }) => (
  <div className="bg-[#0b1224] p-6 rounded-[2rem] border border-white/5">
    <div className="mb-3">{icon}</div>
    <p className="text-2xl font-black text-white">{value}</p>
    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
  </div>
);

const ChartWrapper = ({ children, title }) => (
  <div className="bg-[#0b1224] p-8 rounded-[3rem] border border-white/5 h-[350px]">
    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">{title}</h3>
    {children}
  </div>
);

// Fallback Data
const defaultRadarData = [
  { subject: 'Math', score: 80 }, { subject: 'Science', score: 70 },
  { subject: 'English', score: 90 }, { subject: 'History', score: 65 }
];
const defaultAreaData = [
  { month: 'Term 1', rate: 65 }, { month: 'Term 2', rate: 75 }, { month: 'Term 3', rate: 85 }
];

export default StudentProfileDetails;