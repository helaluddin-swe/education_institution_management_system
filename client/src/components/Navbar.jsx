import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Menu, X, BookOpen, LayoutDashboard, LogOut, 
    User, Settings, Bell, ShieldCheck, GraduationCap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    // Syncing with your specific AuthContext variables
    const { user, logout, isAuthenticated, isAdmin, canEditContent } = useAuth();
    const navigate = useNavigate();
    
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const onNavigate = (to) => {
        setOpen(false);
        window.scrollTo(0, 0);
        navigate(to);
    };

    return (
        <nav className={`fixed top-0 w-full z-[9999] transition-all duration-300 ${
            scrolled ? "bg-slate-900 shadow-xl py-2" : "bg-slate-800 py-4"
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    
                    {/* School Logo Section */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-white font-bold text-xl leading-none tracking-tight">
                                Edu<span className="text-indigo-400">Manage</span>
                            </h1>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">School System</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        <button onClick={() => onNavigate('/')} className="text-slate-300 hover:text-white font-medium text-sm transition-colors">Home</button>
                        <button onClick={() => onNavigate('/academics')} className="text-slate-300 hover:text-white font-medium text-sm transition-colors">Academics</button>
                        
                        {isAuthenticated ? (
                            <div className="flex items-center gap-5 ml-4 pl-6 border-l border-slate-700">
                                {/* Role Badge */}
                                <span className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                                    {user?.role}
                                </span>

                                {/* Admin/Editor Specific Actions */}
                                {canEditContent && (
                                    <button 
                                        onClick={() => onNavigate('/admin/landing-page')} 
                                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium text-sm"
                                        title="Edit Landing Page"
                                    >
                                        <ShieldCheck size={16} />
                                        <span>CMS</span>
                                    </button>
                                )}

                                <button 
                                    onClick={() => onNavigate(`/dashboard/${user?.role}`)} 
                                    className="flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-bold text-xs transition-all"
                                >
                                    <LayoutDashboard size={16} />
                                    DASHBOARD
                                </button>

                                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onNavigate('/profile')}>
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-slate-800 shadow-md">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <button onClick={logout} className="text-slate-400 hover:text-red-400 p-1 transition-colors">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button onClick={() => onNavigate('/login')} className="text-white font-semibold text-sm hover:text-indigo-300">Login</button>
                                <button onClick={() => onNavigate('/register')} className="bg-white text-slate-900 px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-all shadow-md">
                                    Enroll Now
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setOpen(!open)} className="lg:hidden text-white p-2 hover:bg-slate-700 rounded-lg">
                        {open ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 bg-slate-800 ${open ? "max-h-screen border-t border-slate-700" : "max-h-0"}`}>
                <div className="px-6 py-8 space-y-6">
                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-4 pb-4 border-b border-slate-700">
                                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold text-white">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white font-bold">{user?.name}</p>
                                    <p className="text-slate-400 text-xs uppercase tracking-tighter font-bold">{user?.role}</p>
                                </div>
                            </div>
                            <button onClick={() => onNavigate(`/dashboard/${user?.role}`)} className="flex items-center gap-3 w-full text-left text-slate-200 font-medium text-lg">
                                <LayoutDashboard size={20} /> Dashboard
                            </button>
                            {canEditContent && (
                                <button onClick={() => onNavigate('/admin/landing-page')} className="flex items-center gap-3 w-full text-left text-amber-400 font-medium text-lg">
                                    <ShieldCheck size={20} /> Edit Website
                                </button>
                            )}
                            <button onClick={logout} className="flex items-center gap-3 w-full text-left text-red-400 font-medium text-lg pt-4 border-t border-slate-700">
                                <LogOut size={20} /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <button onClick={() => onNavigate('/login')} className="block w-full text-center text-white font-bold py-3 border border-slate-600 rounded-xl">Login</button>
                            <button onClick={() => onNavigate('/register')} className="block w-full text-center bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg">Enroll Now</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;