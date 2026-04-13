import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  Trophy,
  BookOpen,
  LayoutDashboard,
  ArrowRight,
  Zap,
  BarChart3
} from 'lucide-react';
import Navbar from '../../components/Navbar';

const Home = () => {
  const navigate = useNavigate();
  const { userData, isLoggedIn } = useAppContext();

  // Helper to get initials for a placeholder avatar
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';

  return (

    <div className="min-h-screen  bg-[#020617] text-white font-sans">
       <Navbar/>
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        {/* Animated Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-indigo-600/10 blur-[120px] rounded-full" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap size={14} /> The Ultimate Management Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-linear-to-b from-white to-slate-500 bg-clip-text text-transparent">
            DevSpace Management <br />
            <span className="text-indigo-500">Ready in Seconds</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-lg mb-10 leading-relaxed">
            A comprehensive management ecosystem built for modern businesses.
            Streamline your **property operations, school administration, and project workflows** with our lightning-fast, all-in-one full-stack platform.
          </p>

          {!isLoggedIn ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
              >
                Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest transition-all"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-4xl backdrop-blur-md">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg">
                  {getInitials(userData?.name)}
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-bold uppercase">Welcome back,</p>
                  <p className="text-xl font-black">{userData?.name}</p>
                </div>
                <button
                  onClick={() => navigate(userData?.role === 'admin' ? '/admin' : '/dashboard')}
                  className="ml-4 p-3 bg-white/10 hover:bg-indigo-600 rounded-xl transition-colors"
                >
                  <LayoutDashboard size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<BookOpen className="text-blue-400" />}
          title="Enviroment Setup"
          desc="First clone site in your local computer and command with npm insatall thats it."
        />
        <FeatureCard
          icon={<Trophy className="text-amber-400" />}
          title="Frontend Setup"
          desc="Enter your backend live url in client env file ,run local with npm run build and deploy your site in vercel easily."
        />
        <FeatureCard
          icon={<BarChart3 className="text-emerald-400" />}
          title="Backend Setup"
          desc="Only change server env file with your mongodb actual connection,your admin secret code and enter your JWT secret code."
        />
      </section>

      {/* --- QUICK STATS (Visible if logged in) --- */}
      {isLoggedIn && userData?.stats && (
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <div className="bg-[#0b0f1a] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <BarChart3 size={20} className="text-indigo-500" /> Your Current Progress
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox label="Total Points" value={userData.stats.totalPoints || 0} />
              <StatBox label="Tests Taken" value={userData.stats.totalTestsTaken || 0} />
              <StatBox label="Solved" value={userData.stats.totalSolved || 0} />
              <StatBox label="Accuracy" value={`${((userData.stats.totalCorrect / (userData.stats.totalSolved || 1)) * 100).toFixed(1)}%`} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// Sub-components for cleaner code
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-[#0b0f1a] border border-white/5 p-8 rounded-4xl hover:border-indigo-500/50 transition-all group">
    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const StatBox = ({ label, value }) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-black text-indigo-400">{value}</p>
  </div>
);

export default Home;