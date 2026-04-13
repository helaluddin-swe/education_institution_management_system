import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Award, BookOpen, 
  Briefcase, ShieldCheck, Clock, Download, 
  ArrowLeft, Edit3, Loader2, MapPin, Hash
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

// DUMMY DATA (Follows your Schema)
const DUMMY_TEACHERS = [
  {
    _id: "TCH-001",
    employeeId: "EDU-2024-089",
    name: "Dr. Sarah Jenkins", // Extended for UI
    email: "s.jenkins@academy.edu",
    designation: "Senior Lecturer",
    qualification: "Ph.D. in Applied Mathematics, M.Ed",
    primarySubject: "Mathematics",
    otherSubjects: ["Physics", "Statistics"],
    isClassTeacher: true,
    assignedClassSection: "12-C",
    joiningDate: "2021-08-15",
    bio: "Dedicated educator with over 10 years of experience in advanced calculus and theoretical physics. Passionate about developing interactive curriculum models for secondary education.",
    phoneNumber: "+1 (555) 123-4567",
    emergencyContact: "+1 (555) 987-6543",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  }
];

const TeacherProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate local lookup
    const found = DUMMY_TEACHERS.find(t => t._id === id || t.employeeId === id);
    
    setTimeout(() => {
      setTeacher(found || DUMMY_TEACHERS[0]); // Defaulting to first for preview
      setLoading(false);
    }, 600);
  }, [id]);

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Accessing Staff Records...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              STAFF DOSSIER
            </h1>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-1">
              ID: {teacher.employeeId} • Status: <span className="text-emerald-500">Permanent</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-xs font-black uppercase">
            <Download size={16} /> Schedule
          </button>
          {user?.role === 'admin' && (
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all text-xs font-black uppercase">
              <Edit3 size={16} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Identity & Credentials */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-6">
          <div className="bg-[#0b1224] border border-white/5 rounded-[3rem] p-8 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-44 h-44 rounded-[3rem] overflow-hidden border-4 border-indigo-500/20 p-2">
                <img src={teacher.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-[2.5rem]" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-indigo-500 p-3 rounded-2xl border-4 border-[#0b1224]">
                <ShieldCheck size={20} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-white leading-tight">{teacher.name}</h2>
            <p className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest mt-2">{teacher.designation}</p>
            
            <div className="mt-8 space-y-4 text-left border-t border-white/5 pt-8">
              <InfoRow icon={<BookOpen size={16}/>} label="Primary Subject" value={teacher.primarySubject} />
              <InfoRow icon={<Award size={16}/>} label="Qualification" value={teacher.qualification} />
              <InfoRow icon={<Calendar size={16}/>} label="Joined Date" value={new Date(teacher.joiningDate).toLocaleDateString()} />
            </div>
          </div>

          {/* Quick Contact Box */}
          <div className="bg-[#0b1224]/50 border border-white/5 rounded-[2.5rem] p-8 space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Systems</h3>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl text-indigo-400"><Phone size={18}/></div>
              <p className="text-sm font-bold">{teacher.phoneNumber}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl text-indigo-400"><Mail size={18}/></div>
              <p className="text-sm font-bold">{teacher.email}</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Responsibilities & Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 space-y-8">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              label="Class Teacher" 
              value={teacher.isClassTeacher ? teacher.assignedClassSection : "None"} 
              icon={<User className="text-indigo-400" />} 
            />
            <MetricCard 
              label="Assigned Subjects" 
              value={teacher.otherSubjects.length + 1} 
              icon={<Briefcase className="text-emerald-400" />} 
            />
            <MetricCard 
              label="Workload" 
              value="Full-Time" 
              icon={<Clock className="text-amber-400" />} 
            />
          </div>

          {/* Biography & Skills */}
          <div className="bg-[#0b1224] border border-white/5 rounded-[3rem] p-10">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Professional Biography</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              {teacher.bio}
            </p>
            
            <div className="mt-10">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Subject Portfolio</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 rounded-2xl text-xs font-black uppercase">
                  {teacher.primarySubject} (Lead)
                </span>
                {teacher.otherSubjects.map(sub => (
                  <span key={sub} className="px-5 py-2 bg-white/5 text-slate-400 border border-white/5 rounded-2xl text-xs font-black uppercase">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Protocols */}
          <div className="bg-rose-500/5 border border-rose-500/10 rounded-[2.5rem] p-8">
             <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Emergency Protocol</h3>
                  <p className="text-white font-black text-xl">{teacher.emergencyContact}</p>
                  <p className="text-rose-400/50 text-[10px] font-bold uppercase mt-1">Designated Emergency Line</p>
               </div>
               <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-400">
                  <ShieldCheck size={24} />
               </div>
             </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

// Sub-components
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 group">
    <div className="text-slate-500 group-hover:text-indigo-400 transition-colors">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{label}</p>
      <p className="text-xs font-bold text-slate-300">{value}</p>
    </div>
  </div>
);

const MetricCard = ({ label, value, icon }) => (
  <div className="bg-[#0b1224] p-8 rounded-[2.5rem] border border-white/5">
    <div className="mb-4">{icon}</div>
    <p className="text-3xl font-black text-white">{value}</p>
    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{label}</p>
  </div>
);

export default TeacherProfileDetails;