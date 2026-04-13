
import React from 'react';
import { 
    Github, Twitter, Linkedin, Mail, MapPin, Phone,
    BookOpen, GraduationCap, ShieldCheck 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Footer = () => {
    const { navigate } = useAppContext();

    const onNavigate = (to) => {
        window.scrollTo(0, 0);
        navigate(to);
    };

    return (
        <footer className="bg-indigo-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
                            <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-black text-indigo-900 text-sm">D</div>
                            <h2 className="font-bold text-xl tracking-tight">
                                DevSpace <span className="text-pink-300">Studio</span>
                            </h2>
                        </div>
                        <p className="text-indigo-200 text-sm leading-relaxed">
                            Empowering developers to build the next generation of web applications with precision and speed.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-indigo-800 rounded-full hover:bg-pink-400 transition-colors">
                                <Github size={18} />
                            </a>
                            <a href="#" className="p-2 bg-indigo-800 rounded-full hover:bg-pink-400 transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 bg-indigo-800 rounded-full hover:bg-pink-400 transition-colors">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Platform</h3>
                        <ul className="space-y-3 text-sm text-indigo-200">
                            <li><button onClick={() => onNavigate('/')} className="hover:text-pink-300 transition-colors">Home</button></li>
                            <li><button onClick={() => onNavigate('/dashboard')} className="hover:text-pink-300 transition-colors">Dashboard</button></li>
                            <li><button onClick={() => onNavigate('/courses')} className="hover:text-pink-300 transition-colors">Courses</button></li>
                            <li><button onClick={() => onNavigate('/projects')} className="hover:text-pink-300 transition-colors">Projects</button></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Support</h3>
                        <ul className="space-y-3 text-sm text-indigo-200">
                            <li><button onClick={() => onNavigate('/documentation')} className="hover:text-pink-300 transition-colors">Documentation</button></li>
                            <li><button onClick={() => onNavigate('/privacy')} className="hover:text-pink-300 transition-colors">Privacy Policy</button></li>
                            <li><button onClick={() => onNavigate('/terms')} className="hover:text-pink-300 transition-colors">Terms of Service</button></li>
                            <li><button onClick={() => onNavigate('/contact')} className="hover:text-pink-300 transition-colors">Contact Us</button></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Office</h3>
                        <ul className="space-y-4 text-sm text-indigo-200">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-pink-300 shrink-0" />
                                <span>Chittagong, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-pink-300 shrink-0" />
                                <span>support@devspace.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <ShieldCheck size={18} className="text-pink-300 shrink-0" />
                                <span>Verified Hub</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 pt-8 border-t border-indigo-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-indigo-300 font-medium">
                    <p>© {new Date().getFullYear()} DevSpace Studio. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Designed with <span className="text-pink-400">❤</span> for the Dev Community
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer