import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ShieldCheck, BookOpen, GraduationCap, School } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  // Pulling loading state from AuthContext to handle the initial session check flicker
  const { register, isAuthenticated, user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'student', 
    adminSecret: '',
    schoolId: '', 
    className: '' 
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Optimized Redirect: Runs when auth status changes
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      navigate(`/dashboard/${user.role}`);
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field Validations
    if (formData.role === 'admin' && !formData.adminSecret.trim()) {
      return toast.error("Institutional Master Key is required.");
    }
    if (formData.role !== 'admin' && !formData.schoolId.trim()) {
      return toast.error(`${formData.role === 'teacher' ? 'Employee' : 'Student'} ID is required.`);
    }

    setIsSubmitting(true);

    // Structure the payload to match your AuthController/Model expectations
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      profileData: {
        ...(formData.role === 'student' && { 
          studentId: formData.schoolId,
          currentClass: formData.className || "Not Assigned",
        }),
        ...(formData.role === 'teacher' && { 
          employeeId: formData.schoolId,
          primarySubject: "General", // Default for initial registration
        }),
        ...(formData.role === 'admin' && { 
          adminSecret: formData.adminSecret,
          role: "Office-Staff" // Default role for admin profiles
        }), 
      }
    };

    try {
      // register function from AuthContext handles token storage and state updates
      await register(payload);
    } catch (error) {
      // Errors are toasted inside AuthContext, so we just reset submission state
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skip rendering the form if we are already authenticated
  if (authLoading) return null;

  const themeStyles = {
    admin: { bar: 'bg-rose-600', text: 'text-rose-500', border: 'border-rose-500/20', bg: 'bg-rose-500/5', btn: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20' },
    teacher: { bar: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' },
    student: { bar: 'bg-sky-600', text: 'text-sky-400', border: 'border-sky-500/20', bg: 'bg-sky-500/5', btn: 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/20' }
  };

  const activeTheme = themeStyles[formData.role];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 font-sans selection:bg-sky-500/30">
      <div className="max-w-md w-full bg-[#0b0f1a] p-8 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
        
        <div className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-500 ${activeTheme.bar}`} />

        <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-white tracking-tight">
             {formData.role === 'admin' ? 'Campus Admin' : formData.role === 'teacher' ? 'Faculty Portal' : 'Student Join'}
            </h2>
            <p className="text-slate-400 text-sm mt-2">Access your academic dashboard</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/10">
          {['student', 'teacher', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => updateForm('role', r)}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${
                formData.role === r ? 'bg-white text-slate-900 shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput 
            label="Full Name" 
            icon={<User size={14} />} 
            type="text" 
            placeholder="John Doe" 
            value={formData.name} 
            onChange={(val) => updateForm('name', val)} 
          />

          <FormInput 
            label="Institutional Email" 
            icon={<Mail size={14} />} 
            type="email" 
            placeholder="john@school.edu" 
            value={formData.email} 
            onChange={(val) => updateForm('email', val)} 
          />

          <FormInput 
            label="Security Password" 
            icon={<Lock size={14} />} 
            type="password" 
            placeholder="••••••••" 
            value={formData.password} 
            onChange={(val) => updateForm('password', val)} 
            minLength={6}
          />

          {/* Conditional ID Input */}
          {formData.role !== 'admin' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className={`flex items-center gap-2 text-xs font-bold ${activeTheme.text} uppercase ml-1 mb-1`}>
                  {formData.role === 'teacher' ? <BookOpen size={14} /> : <GraduationCap size={14} />} 
                  {formData.role === 'teacher' ? 'Employee ID' : 'Student ID / Roll'}
              </label>
              <input
                type="text"
                required
                className={`w-full ${activeTheme.bg} border ${activeTheme.border} px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-sky-600 outline-none transition`}
                placeholder={formData.role === 'teacher' ? "FAC-001" : "STU-2024-001"}
                value={formData.schoolId}
                onChange={(e) => updateForm('schoolId', e.target.value)}
              />
            </div>
          )}

          {/* Student Class Input */}
          {formData.role === 'student' && (
             <div className="animate-in fade-in slide-in-from-top-2 duration-300">
             <label className={`flex items-center gap-2 text-xs font-bold ${activeTheme.text} uppercase ml-1 mb-1`}>
                 <School size={14} /> Class / Section
             </label>
             <input
               type="text"
               required
               className={`w-full ${activeTheme.bg} border ${activeTheme.border} px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-sky-600 outline-none transition`}
               placeholder="e.g. 10th-B"
               value={formData.className}
               onChange={(e) => updateForm('className', e.target.value)}
             />
           </div>
          )}

          {/* Admin Secret Input */}
          {formData.role === 'admin' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <label className={`flex items-center gap-2 text-xs font-bold ${activeTheme.text} uppercase ml-1 mb-1`}>
                  <ShieldCheck size={14} /> Admin Master Key
              </label>
              <input
                type="password"
                required
                className={`w-full ${activeTheme.bg} border ${activeTheme.border} px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-rose-500 outline-none transition`}
                placeholder="Enter Secret Key"
                value={formData.adminSecret}
                onChange={(e) => updateForm('adminSecret', e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest text-white transition-all duration-300 shadow-lg mt-6 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${activeTheme.btn}`}
          >
            {isSubmitting ? "Enrolling..." : `Join as ${formData.role}`}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Registered? 
          <button 
            onClick={() => navigate('/login')} 
            className="ml-2 text-sky-400 font-bold hover:text-sky-300 transition-colors"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

const FormInput = ({ label, icon, type, placeholder, value, onChange, minLength }) => (
  <div>
    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1 mb-1.5">
        {icon} {label}
    </label>
    <input
      type={type}
      required
      minLength={minLength}
      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white placeholder:text-slate-600 focus:bg-white/[0.08] focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all duration-200"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default SignUpPage;