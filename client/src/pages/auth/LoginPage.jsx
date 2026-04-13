import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Loader2, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isStaffMode, setIsStaffMode] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading } = useAuth();

  // 1. Enhanced Effect: Watch for user role changes and redirect immediately
  useEffect(() => {
    if (!loading && isAuthenticated && user?.role) {
      navigate(`/dashboard/${user.role}/overview`, { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 2. Call login from Context
      const response = await login(email, password);
      
      // 3. Fallback: If for some reason the useEffect doesn't trigger, 
      // we check the response from the login function directly.
      if (response?.user?.role || user?.role) {
        const role = response?.user?.role || user?.role;
        navigate(`/dashboard/${role}/overview`, { replace: true });
      }
    } catch (err) {
      console.error("Login failed:", err);
      // Error handling is usually managed via toast in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="text-sky-500 animate-spin" size={40} />
      </div>
    );
  }

  const themeColor = isStaffMode ? 'emerald' : 'sky';
  const ringClass = isStaffMode ? 'focus:ring-emerald-500/50' : 'focus:ring-sky-500/50';
  const borderClass = isStaffMode ? 'focus:border-emerald-500' : 'focus:border-sky-500';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 font-sans selection:bg-sky-500/30">
      <div className="max-w-md w-full bg-[#0b0f1a] p-10 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden transition-all duration-500">
        
        <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] transition-colors duration-700 ${isStaffMode ? 'bg-emerald-600/10' : 'bg-sky-600/10'}`} />

        <div className="text-center mb-10 relative z-10">
          <div className={`inline-flex p-3 rounded-2xl mb-4 bg-white/5 border border-white/10 ${isStaffMode ? 'text-emerald-500' : 'text-sky-500'}`}>
            {isStaffMode ? <ShieldCheck size={28} /> : <GraduationCap size={28} />}
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {isStaffMode ? 'Faculty Portal' : 'Student Login'}
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            {isStaffMode ? 'Admin & Teacher Authentication' : 'Access your academic records'}
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Mail size={12} /> Institutional Email
            </label>
            <input 
              type="email" 
              required
              value={email}
              autoComplete="email"
              className={`w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-white placeholder:text-slate-600 outline-none transition-all duration-300 ring-0 focus:ring-4 ${ringClass} ${borderClass}`}
              placeholder="id@school.edu"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Lock size={12} /> Security Password
            </label>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                autoComplete="current-password"
                className={`w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-white placeholder:text-slate-600 outline-none transition-all duration-300 ring-0 focus:ring-4 ${ringClass} ${borderClass}`}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white transition-all duration-300 shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${
              isStaffMode 
              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' 
              : 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/20'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} /> 
                Authenticating...
              </>
            ) : 'Enter Dashboard'}
          </button>

          <div className="pt-4">
            <button 
              type="button"
              onClick={() => setIsStaffMode(!isStaffMode)}
              className="w-full group flex flex-col items-center gap-2"
            >
              <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent mb-2" />
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest group-hover:text-slate-300 transition-colors flex items-center gap-2">
                <ShieldCheck size={14} className={isStaffMode ? 'text-emerald-500' : 'text-slate-500'}/> 
                {isStaffMode ? "Switch to Student Login" : "Faculty or Admin Login"}
              </span>
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-xs text-slate-500 font-bold uppercase tracking-widest">
          Not enrolled yet? 
          <button 
            onClick={() => navigate('/signup')} 
            className={`ml-2 transition-colors duration-300 ${isStaffMode ? 'text-emerald-500 hover:text-emerald-400' : 'text-sky-400 hover:text-sky-300'}`}
          >
            Apply Now
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;