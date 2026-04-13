import React, { useState } from 'react';
import { 
  User, Bell, Shield, Palette, 
  Globe, Moon, Sun, Check, 
  Camera, Zap, LogOut 
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    slack: true
  });

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

  return (
    <div className="p-6  max-w-6xl mx-auto animate-in fade-in duration-500">
      

      <div className="flex flex-col md:flex-row gap-8 bg-white border border-slate-100 rounded-[3rem] p-4 shadow-sm min-h-150">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-50 rounded-[2.5rem] p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-40 p-4">
             <button className="flex items-center gap-2 text-rose-500 font-black text-xs uppercase tracking-widest hover:opacity-70 transition">
               <LogOut size={14}/> Sign Out
             </button>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 md:p-8">
          
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="h-24 w-24 bg-indigo-100 rounded-4xl flex items-center justify-center text-indigo-600 text-3xl font-black shadow-inner">
                    JD
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg text-slate-600 hover:text-indigo-600 transition">
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">John Doe</h3>
                  <p className="text-slate-400 text-sm font-medium">Workspace Admin</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Full Name</label>
                  <input className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 transition-all" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Email Address</label>
                  <input className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 transition-all" defaultValue="john@startup.com" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h3 className="text-xl font-black text-slate-800 mb-6">Notification Channels</h3>
              {Object.keys(notifications).map((type) => (
                <div key={type} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-700 capitalize">{type} Notifications</p>
                    <p className="text-xs text-slate-400">Receive daily task summaries via {type}</p>
                  </div>
                  <button 
                    onClick={() => setNotifications({...notifications, [type]: !notifications[type]})}
                    className={`w-12 h-6 rounded-full transition-all relative ${notifications[type] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${notifications[type] ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Theme Preference</h3>
                <p className="text-slate-400 text-sm mb-6">Choose how the interface looks on your device</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsDarkMode(false)}
                    className={`p-6 rounded-4xl border-2 transition-all flex flex-col items-center gap-3 ${!isDarkMode ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <Sun className={!isDarkMode ? 'text-indigo-600' : 'text-slate-400'} />
                    <span className={`font-black text-xs uppercase tracking-widest ${!isDarkMode ? 'text-indigo-600' : 'text-slate-400'}`}>Light Mode</span>
                  </button>
                  <button 
                    onClick={() => setIsDarkMode(true)}
                    className={`p-6 rounded-4xl border-2 transition-all flex flex-col items-center gap-3 ${isDarkMode ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <Moon className={isDarkMode ? 'text-indigo-600' : 'text-slate-400'} />
                    <span className={`font-black text-xs uppercase tracking-widest ${isDarkMode ? 'text-indigo-600' : 'text-slate-400'}`}>Dark Mode</span>
                  </button>
                </div>
              </div>

              <div className="p-6 bg-indigo-600 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl shadow-indigo-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl"><Zap size={24}/></div>
                  <div>
                    <p className="font-black">Turbo Experience</p>
                    <p className="text-xs text-indigo-100">Hardware acceleration is active</p>
                  </div>
                </div>
                <Check />
              </div>
            </div>
          )}

        </main>
      </div>
      
      <div className="mt-8 flex justify-end gap-4">
         <button className="px-8 py-4 text-slate-400 font-bold hover:text-slate-600 transition">Discard</button>
         <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all active:scale-95">Save Preferences</button>
      </div>
    </div>
  );
};

export default Settings;