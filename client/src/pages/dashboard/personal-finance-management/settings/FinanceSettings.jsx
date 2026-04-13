import React, { useState, useEffect } from 'react';
import { 
  User, Bell, Shield, Palette, 
  Camera, LogOut, Loader2, Globe, 
  Wallet, TrendingUp, Moon, Sun 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../utils/apiUtils';

const FinanceSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State aligned with the updated Mongoose Schema
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    preferences: {
      currency: 'USD',
      theme: 'light',
      language: 'en'
    },
    financeStats: {
      totalBalance: 0,
      monthlyBudget: 0
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/me');
        // data.user comes from your updated controller structure
        const user = data.user; 
        setUserData({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          preferences: user.preferences || { currency: 'USD', theme: 'light' },
          financeStats: user.financeStats || { totalBalance: 0, monthlyBudget: 0 }
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to sync profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Sending name and preferences as defined in the controller
      await api.put(`/users/${userData.id}`, {
        name: userData.name,
        preferences: userData.preferences
      });

      toast.success("Finance profile updated!", {
        style: { background: '#0f172a', color: '#fff', borderRadius: '1rem' }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success("Securely logged out");
    setTimeout(() => window.location.href = '/login', 800);
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="relative">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <Wallet className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={16} />
      </div>
      <p className="mt-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Syncing Ledger...</p>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row gap-8 bg-white border border-slate-100 rounded-[3.5rem] p-4 shadow-2xl shadow-slate-200/50">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-72 bg-slate-50 rounded-[3rem] p-6 flex flex-col">
          <div className="mb-8 px-4">
             <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Settings</h2>
             <p className="text-[10px] text-slate-400 font-bold">Manage your financial identity</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'profile', label: 'Identity', icon: <User size={18}/> },
              { id: 'preferences', label: 'Preferences', icon: <Globe size={18}/> },
              { id: 'appearance', label: 'Appearance', icon: <Palette size={18}/> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-100/50 scale-[1.02]' 
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                }`}
              >
                {tab.icon}
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>

          <button 
            onClick={handleLogout}
            className="mt-auto p-4 flex items-center gap-3 text-rose-500 font-black text-xs uppercase tracking-[0.15em] hover:bg-rose-50 rounded-2xl transition-all"
          >
            <LogOut size={16}/> Sign Out
          </button>
        </aside>

        {/* Dynamic Content */}
        <main className="flex-1 p-4 md:p-10">
          
          {activeTab === 'profile' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
              <header className="flex items-center gap-8">
                <div className="relative group">
                  <div className="h-24 w-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-200">
                    {userData.name.charAt(0)}
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-full shadow-xl text-slate-600 hover:text-indigo-600 transition-transform active:scale-90 border border-slate-50">
                    <Camera size={18} />
                  </button>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">{userData.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                      {userData.role}
                    </span>
                    <span className="text-slate-300">•</span>
                    <p className="text-slate-400 text-xs font-bold">{userData.email}</p>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Legal Name</label>
                  <input 
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-200 focus:bg-white outline-none font-bold text-slate-700 transition-all shadow-inner" 
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Security Email</label>
                  <input 
                    className="w-full px-6 py-4 bg-slate-100 rounded-2xl border-none font-bold text-slate-400 cursor-not-allowed italic" 
                    value={userData.email}
                    disabled 
                  />
                </div>
              </div>

              {/* Financial Snapshot Section */}
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Live Portfolio Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-emerald-200 transition-all">
                    <TrendingUp className="text-emerald-500 mb-3" size={20} />
                    <p className="text-[10px] font-black text-slate-400 uppercase">Current Balance</p>
                    <p className="text-xl font-black text-slate-800">{userData.preferences.currency} {userData.financeStats.totalBalance.toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-indigo-200 transition-all">
                    <Wallet className="text-indigo-500 mb-3" size={20} />
                    <p className="text-[10px] font-black text-slate-400 uppercase">Monthly Budget</p>
                    <p className="text-xl font-black text-slate-800">{userData.preferences.currency} {userData.financeStats.monthlyBudget.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-8 animate-in slide-in-from-right-8">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">System Preferences</h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                    <div>
                      <p className="font-black text-slate-700">Base Currency</p>
                      <p className="text-xs text-slate-400 font-bold">Standard currency for all reports</p>
                    </div>
                    <select 
                      value={userData.preferences.currency}
                      onChange={(e) => setUserData({
                        ...userData, 
                        preferences: { ...userData.preferences, currency: e.target.value }
                      })}
                      className="bg-white px-4 py-2 rounded-xl font-black text-xs border-none shadow-sm outline-none text-indigo-600"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="BDT">BDT (৳)</option>
                    </select>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8 animate-in slide-in-from-right-8">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Interface Theme</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { id: 'light', icon: <Sun size={24}/>, label: 'Crystal Light' },
                  { id: 'dark', icon: <Moon size={24}/>, label: 'Deep Ocean' }
                ].map((theme) => (
                  <button 
                    key={theme.id}
                    onClick={() => setUserData({
                      ...userData, 
                      preferences: { ...userData.preferences, theme: theme.id }
                    })}
                    className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${
                      userData.preferences.theme === theme.id 
                      ? 'border-indigo-600 bg-indigo-50/30' 
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className={userData.preferences.theme === theme.id ? 'text-indigo-600' : 'text-slate-400'}>
                      {theme.icon}
                    </div>
                    <span className={`font-black text-[10px] uppercase tracking-widest ${
                      userData.preferences.theme === theme.id ? 'text-indigo-600' : 'text-slate-400'
                    }`}>
                      {theme.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Footer Controls */}
      <footer className="mt-10 flex justify-end items-center gap-6">
         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hidden md:block">
           Last synced: {new Date().toLocaleTimeString()}
         </p>
         <button 
          onClick={handleSave}
          disabled={saving}
          className="group relative px-14 py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl shadow-slate-300 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 overflow-hidden"
         >
           <span className="relative z-10 flex items-center gap-3">
             {saving ? <Loader2 size={20} className="animate-spin" /> : 'Synchronize Settings'}
           </span>
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
         </button>
      </footer>
    </div>
  );
};

export default FinanceSettings;