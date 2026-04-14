import React, { useEffect, useState } from 'react';
import { useParams, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, LayoutDashboard, Users, 
  UserRoundCheck, GraduationCap, Wallet, Bus, 
  FileSpreadsheet, CalendarDays, ClipboardCheck, 
  Settings2, User, LogOut, Menu, X,
  BookOpen, Library, Clock, Award, FileText, CheckCircle2
} from 'lucide-react';

import StudentDashboard from './student/StudentDashboard';
import TeacherDashboard from './teacher/TeacherDashboard';
import AdminDashboard from './admin/AdminDashboard';
import { useAuth } from '../../context/AuthContext';

// --- ROLE SPECIFIC ROUTES ---

const TEACHER_ROUTES = [
  { name: 'Dashboard', slug: 'overview', icon: <LayoutDashboard size={18} /> },
  { name: 'My Classes', slug: 'class', icon: <Users size={18} /> },
  { name: 'Attendance Marker', slug: 'attendance', icon: <ClipboardCheck size={18} /> },
  { name: 'Exams & Grading', slug: 'exams', icon: <GraduationCap size={18} /> },
  { name: 'Assignments', slug: 'assignments', icon: <FileText size={18} /> },
  { name: 'Study Material', slug: 'syllabus', icon: <BookOpen size={18} /> },
  { name: 'Timetable', slug: 'timetable', icon: <Clock size={18} /> },
  { name: 'Student Progress', slug: 'reports', icon: <Award size={18} /> },
  { name: 'Notice Board', slug: 'events', icon: <CalendarDays size={18} /> },
];

const STUDENT_ROUTES = [
  { name: 'My Dashboard', slug: 'overview', icon: <LayoutDashboard size={18} /> },
  { name: 'My Subjects', slug: 'subjects', icon: <BookOpen size={18} /> },
  { name: 'Class Timetable', slug: 'class', icon: <Clock size={18} /> },
  { name: 'Attendance Record', slug: 'attendance', icon: <CheckCircle2 size={18} /> },
  { name: 'Homework/Tasks', slug: 'assignments', icon: <FileText size={18} /> },
  { name: 'Exam Results', slug: 'exams', icon: <GraduationCap size={18} /> },
  { name: 'Fee Payments', slug: 'fees', icon: <Wallet size={18} /> },
  { name: 'Library Books', slug: 'library', icon: <Library size={18} /> },
  { name: 'Transport Info', slug: 'transport', icon: <Bus size={18} /> },
  { name: 'Events & News', slug: 'events', icon: <CalendarDays size={18} /> },
];

const ADMIN_ROUTES = [
  { name: 'Admin Dashboard', slug: 'overview', icon: <LayoutDashboard size={18} /> },
  { name: 'Student Database', slug: 'students', icon: <Users size={18} /> },
  { name: 'Faculty Management', slug: 'staff', icon: <UserRoundCheck size={18} /> },
  { name: 'Academic Setup', slug: 'exams', icon: <GraduationCap size={18} /> },
  { name: 'Finance & Fees', slug: 'fees', icon: <Wallet size={18} /> },
  { name: 'Library Manager', slug: 'library', icon: <Library size={18} /> },
  { name: 'Class Schedule', slug: 'class', icon: <Library size={18} /> },
  { name: 'Fleet Management', slug: 'transport', icon: <Bus size={18} /> },
  { name: 'Institutional Events', slug: 'events', icon: <CalendarDays size={18} /> },
  { name: 'Reports Center', slug: 'documents', icon: <FileSpreadsheet size={18} /> },
];

const dashboardRoutes = {
  student: STUDENT_ROUTES,
  teacher: TEACHER_ROUTES,
  admin: ADMIN_ROUTES,
};

const managementTypes = [
  { id: 'admin', label: 'Admin Dashboard', icon: <Settings2 size={20} className="text-emerald-400" /> },
  { id: 'student', label: 'Student Dashboard', icon: <GraduationCap size={20} className="text-emerald-400" /> },
  { id: 'teacher', label: 'Teacher Dashboard', icon: <User size={20} className="text-emerald-400" /> },
];

function Dashboard() {
  const { user, logout, loading } = useAuth();
  const { mode, page } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentMode = mode || user?.role || 'student';
  const activeType = managementTypes.find(t => t.id === currentMode) || managementTypes[0];
  const currentPage = page;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
        return;
      }
      if (user.role !== 'admin' && mode !== user.role) {
        navigate(`/dashboard/${user.role}/overview`, { replace: true });
      }
    }
  }, [mode, user, loading, navigate]);

  const handleModeChange = (typeId) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/dashboard/${typeId}/overview`);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full select-none">
      {/* Workspace Switcher */}
      <div className="relative p-6">
        <button 
          onClick={() => user?.role === 'admin' && setIsDropdownOpen(!isDropdownOpen)} 
          className={`w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 ${user?.role === 'admin' ? 'hover:bg-white/10 cursor-pointer active:scale-95' : 'cursor-default'}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              {activeType.icon}
            </div>
            <div className="text-left">
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black mb-0.5">
                {user?.role === 'admin' ? 'Workspace' : 'Portal'}
              </p>
              <p className="text-sm font-bold text-white leading-none">{activeType.label}</p>
            </div>
          </div>
          {user?.role === 'admin' && (
            <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          )}
        </button>

        {isDropdownOpen && user?.role === 'admin' && (
          <div className="absolute left-6 right-6 mt-3 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
            {managementTypes.map((type) => (
              <button 
                key={type.id} 
                onClick={() => handleModeChange(type.id)} 
                className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest border-b border-white/5 last:border-0 ${currentMode === type.id ? 'text-indigo-400' : 'text-slate-300'}`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-4 py-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">General Management</p>
        {/* FIX: Now correctly uses the role-specific route array */}
        {dashboardRoutes[currentMode]?.map((item) => (
          <NavLink 
            key={item.slug} 
            to={`/dashboard/${currentMode}/${item.slug}`} 
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => 
              `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`
            }
          >
            <span className="transition-transform group-hover:scale-110">{item.icon}</span>
            <span className="font-bold text-xs uppercase tracking-widest">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <LogOut size={16} /> Log Out System
        </button>
      </div>
    </div>
  );

  if (loading) return <div className="h-screen w-full bg-slate-950 flex items-center justify-center text-white font-bold animate-pulse tracking-widest">LOADING WORKSPACE...</div>;

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-100 overflow-hidden relative">
      <aside className="hidden lg:flex w-80 border-r border-white/5 bg-[#0b0f1a] flex-col z-20">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#020617]">
        <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" key={location.pathname}>
            {currentMode === 'student' && <StudentDashboard subPage={currentPage} />}
            {currentMode === 'teacher' && <TeacherDashboard subPage={currentPage} />}
            {currentMode === 'admin' && <AdminDashboard subPage={currentPage} />} 
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;