import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Receipt, Target, Wallet, 
  ArrowRight, CheckCircle2, ShieldCheck, Zap ,ArrowLeftRight
} from 'lucide-react';

const FinanceLandingPage = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const features = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, color: 'bg-blue-500' },
    { name: 'Expenses', icon: <Receipt size={20} />, color: 'bg-red-500' },
    { name: 'Goals', icon: <Target size={20} />, color: 'bg-green-500' },
    { name: 'Accounts', icon: <Wallet size={20} />, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* --- NAVIGATION --- */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">F</div>
          FinanceFlow
        </div>
        <div className="hidden md:flex gap-8 font-medium text-slate-600">
          <a href="#" className="hover:text-blue-600 transition">Features</a>
          <a href="#" className="hover:text-blue-600 transition">Security</a>
          <a href="#" className="hover:text-blue-600 transition">Pricing</a>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          Get Started Free
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-32 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
            Built for 2026 Intelligence
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mt-6 tracking-tight text-slate-900">
            Master your money with <span className="text-blue-600">Precision.</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 leading-relaxed">
            The all-in-one ERP for personal wealth. Track every transaction, 
            automate your savings, and visualize your financial future in real-time.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition">
              Start Your Journey <ArrowRight size={20} />
            </button>
            <button className="bg-white border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition shadow-sm">
              Watch Video Demo
            </button>
          </div>
        </motion.div>

        {/* --- INTERACTIVE APP DEMO --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-20 relative max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex h-125"
        >
          {/* Sidebar Mockup */}
          <div className="w-64 bg-slate-900 p-6 flex flex-col gap-4 text-left">
            <div className="h-4 w-32 bg-slate-700 rounded mb-4 opacity-50" />
            {features.map((f) => (
              <div 
                key={f.name}
                onClick={() => setActiveTab(f.name)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${activeTab === f.name ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                {f.icon} <span className="text-sm font-medium">{f.name}</span>
              </div>
            ))}
          </div>

          {/* Content Mockup */}
          <div className="flex-1 bg-slate-50 p-8 text-left overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">{activeTab}</h2>
              <div className="bg-white p-2 rounded-lg border border-slate-200 text-xs font-mono">
                Last updated: Just now
              </div>
            </div>

            {/* Dynamic Charts/Widgets */}
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="text-xs text-slate-400 font-bold uppercase">Total Net Worth</div>
                <div className="text-2xl font-bold mt-1 text-green-600">$124,500.00</div>
              </div>
              <div className="h-32 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="text-xs text-slate-400 font-bold uppercase">Monthly Budget</div>
                <div className="text-2xl font-bold mt-1 text-blue-600">72% Used</div>
              </div>
              <div className="col-span-2 h-48 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-end gap-2">
                 {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                   <div key={i} className="flex-1 bg-blue-100 rounded-t-sm relative group">
                      <div style={{ height: `${h}%` }} className="bg-blue-500 rounded-t-sm transition-all group-hover:bg-blue-600" />
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why choose FinanceFlow?</h2>
            <p className="text-slate-500 mt-4">Powerful tools to keep your financial life in sync.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: 'Bank-Grade Security', desc: 'AES-256 encryption and biometric auth keep your data under lock.', icon: <ShieldCheck className="text-blue-600" /> },
              { title: 'Automated Insight', desc: 'AI-driven categorization of every dollar you spend or earn.', icon: <Zap className="text-blue-600" /> },
              { title: 'Goal Mastery', desc: 'Visual progress trackers for your house, car, or retirement fund.', icon: <Target className="text-blue-600" /> },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <div className="bg-blue-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl" />
          <h2 className="text-4xl font-bold mb-6">Ready to take control?</h2>
          <p className="text-blue-100 mb-10 text-lg max-w-xl mx-auto">
            Join 50,000+ users managing over $2B in assets. Your first 30 days are on us.
          </p>
          <button className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition">
            Create Free Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default FinanceLandingPage;