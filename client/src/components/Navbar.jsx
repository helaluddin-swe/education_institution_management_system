import React, { useState, useEffect } from 'react';
import { 
    Menu, X, BookOpen, GraduationCap, Database, 
    LayoutDashboard, LogOut, UserPlus, LogIn, PenTool, ShieldCheck 
} from 'lucide-react';

import { useAppContext } from '../context/AppContext';



const Navbar = () => {
    const { navigate, isLoggedIn, userData, logout } = useAppContext();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const isAdmin = userData?.role === 'admin';

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
        <nav className={`fixed top-0 w-full z-9999 transition-all duration-300 ${
            scrolled ? "bg-indigo-800 shadow-lg py-2" : "bg-indigo-600 py-4"
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-12">
                    
                    {/* Logo Section */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-black text-indigo-600">D</div>
                        <h1 className="text-white font-bold text-xl tracking-tight">
                            DevSpace <span className="text-pink-300">Studio</span>
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-6">
                        <button onClick={() => onNavigate('/building/units')} className="text-white/90 hover:text-white font-medium text-sm">Campaign</button>
                         <button onClick={() => onNavigate('/school')} className="text-white/90 hover:text-white font-medium text-sm">School</button>
                        
                        {isLoggedIn ? (
                            <>
                                {isAdmin && (
                                    <button onClick={() => onNavigate('/admin-control-center')} className="bg-amber-400 text-amber-950 px-4 py-2 rounded-lg font-bold text-xs uppercase">
                                        Admin
                                    </button>
                                )}
                                <button onClick={() => onNavigate('/dashboard')} className="text-white/90 hover:text-white font-medium text-sm">Dashboard</button>
                                <button onClick={logout} className="text-pink-200 hover:text-white font-medium text-sm">Logout</button>
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30">
                                    {userData?.name?.charAt(0).toUpperCase()}
                                </div>
                            </>
                        ) : (
                            <>
                                <button onClick={() => onNavigate('/login')} className="text-white font-medium text-sm">Login</button>
                                <button onClick={() => onNavigate('/signup')} className="bg-white text-indigo-600 px-5 py-2 rounded-full font-bold text-sm hover:bg-indigo-50 transition-colors">
                                    Join Now
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setOpen(!open)} className="lg:hidden text-white">
                        {open ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 bg-indigo-700 ${open ? "max-h-96 border-t border-white/10" : "max-h-0"}`}>
                <div className="px-4 py-6 space-y-4">
                    {isLoggedIn ? (
                        <>
                            <p className="text-white/60 text-xs uppercase font-bold px-2">Welcome, {userData?.name}</p>
                            <button onClick={() => onNavigate('/dashboard')} className="block w-full text-left text-white font-medium py-2 px-2">Dashboard</button>
                            {isAdmin && <button onClick={() => onNavigate('/admin-control-center')} className="block w-full text-left text-amber-300 font-medium py-2 px-2">Admin Panel</button>}
                            <button onClick={logout} className="block w-full text-left text-red-300 font-medium py-2 px-2">Logout</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => onNavigate('/login')} className="block w-full text-left text-white font-medium py-2 px-2">Login</button>
                            <button onClick={() => onNavigate('/signup')} className="block w-full text-center bg-white text-indigo-600 font-bold py-3 rounded-xl">Join Now</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
export default Navbar
