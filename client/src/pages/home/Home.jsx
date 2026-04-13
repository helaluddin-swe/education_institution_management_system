import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  GraduationCap,
  Users,
  LayoutDashboard,
  ArrowRight,
  Zap,
  BarChart3,
  Bell,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  // Using user, isAuthenticated, and the dynamic landingPageData
  const { user, isAuthenticated, landingPageData } = useAuth();

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Dynamic Glow based on Landing Page theme */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <Zap size={14} className="fill-current" /> 
            {landingPageData?.heroSection?.subtitle || "Next-Gen Academic Excellence"}
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent">
            {landingPageData?.heroSection?.title?.split(' ').slice(0, -1).join(' ') || "Empowering the Future of"} <br />
            <span className="text-indigo-500">{landingPageData?.heroSection?.title?.split(' ').pop() || "Education"}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-12 leading-relaxed font-medium">
            Join thousands of students and educators in a seamless digital learning environment. 
            Manage your **academics, attendance, and school life** with a single click.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest transition-all hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] flex items-center justify-center gap-3 group"
              >
                Enroll Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest transition-all backdrop-blur-sm"
              >
                Student Login
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-5 p-5 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl shadow-2xl">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-black text-xl border-2 border-white/10">
                  {getInitials(user?.name)}
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Signed in as {user?.role}</p>
                  <p className="text-2xl font-black">{user?.name}</p>
                </div>
                <button
                  onClick={() => navigate(`/dashboard/${user?.role}`)}
                  className="ml-4 p-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  <LayoutDashboard size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- LIVE ANNOUNCEMENTS / FEATURES --- */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div className="text-left">
            <h2 className="text-3xl font-black mb-2">Academic Ecosystem</h2>
            <p className="text-slate-500 font-medium">Everything you need to succeed in one place.</p>
          </div>
          {user?.canEditLandingPage && (
            <button onClick={() => navigate('/admin/landing-page')} className="flex items-center gap-2 text-amber-500 font-bold text-sm bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/20">
              <ShieldCheck size={16}/> Edit Page Content
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<GraduationCap className="text-indigo-400" />}
            title="Digital Classroom"
            desc="Access your assignments, lecture notes, and recorded sessions from anywhere in the world."
          />
          <FeatureCard
            icon={<Bell className="text-rose-400" />}
            title="Real-time Updates"
            desc="Get instant notifications for exam schedules, results, and important school announcements."
          />
          <FeatureCard
            icon={<Calendar className="text-emerald-400" />}
            title="Schedule Manager"
            desc="Track your attendance and stay on top of your class timetable with our intuitive calendar."
          />
        </div>
      </section>

      {/* --- DYNAMIC STATS (Fetched from Schema) --- */}
      <section className="max-w-6xl mx-auto px-4 pb-32">
        <div className="bg-gradient-to-b from-[#0b0f1a] to-[#05070a] border border-white/5 rounded-[3.5rem] p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-md text-center md:text-left">
                    <h3 className="text-4xl font-black mb-6 leading-tight">Our School at a <br/><span className="text-indigo-500">Glance</span></h3>
                    <p className="text-slate-400 mb-8 font-medium leading-relaxed">
                        We take pride in our numbers. From academic excellence to community reach, see the impact of our system.
                    </p>
                    <button className="text-indigo-400 font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                        View Detailed Report <ArrowRight size={16}/>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
                    <StatBox 
                        label="Students enrolled" 
                        value={landingPageData?.schoolStats?.totalStudents || "2.5k+"} 
                        icon={<Users size={16} />}
                    />
                    <StatBox 
                        label="Awards won" 
                        value={landingPageData?.schoolStats?.totalAwards || "48"} 
                        icon={<Trophy size={16} className="text-amber-500" />}
                    />
                    <StatBox 
                        label="Faculty Members" 
                        value="120+" 
                        icon={<Briefcase size={16} />}
                    />
                    <StatBox 
                        label="Success Rate" 
                        value="98%" 
                        icon={<BarChart3 size={16} className="text-emerald-500" />}
                    />
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

// Sub-components
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-[#0b0f1a] border border-white/5 p-10 rounded-[2.5rem] hover:border-indigo-500/40 transition-all group hover:-translate-y-2 duration-500">
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all duration-500">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h3 className="text-2xl font-black mb-4 group-hover:text-indigo-400 transition-colors">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

const StatBox = ({ label, value, icon }) => (
  <div className="bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-colors min-w-[160px]">
    <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-white/5 rounded-lg text-slate-500">{icon}</div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
    <p className="text-4xl font-black text-white">{value}</p>
  </div>
);

// Lucide icon helper
const Trophy = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const Briefcase = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;

export default Home;