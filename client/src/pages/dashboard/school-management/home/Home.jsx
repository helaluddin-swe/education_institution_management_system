import React, { useState } from 'react';
// Assuming these are in your components folder
// import AttendanceTracker from './components/AttendanceTraker';
// import EventsCalendar from './components/EventsCalendar';
// ... etc

const SchoolLandingPage = () => {
  const [activeModule, setActiveModule] = useState('Overview');

  // Mapping your uploaded components to display data
  const modules = [
    { id: 'Overview', name: 'Admin Overview', icon: '📊', desc: 'Real-time institutional health metrics and quick-action shortcuts.' },
    { id: 'Attendance', name: 'Attendance Tracker', icon: '✅', desc: 'Biometric & manual sync with automated parent SMS alerts.' },
    { id: 'Exams', name: 'Exam Portal', icon: '📝', desc: 'Schedule, conduct, and grade exams with automated result generation.' },
    { id: 'Finance', name: 'Fee Management', icon: '💰', desc: 'Online payments, invoice generation, and pending dues tracking.' },
    { id: 'Transport', name: 'Transport Fleet', icon: '🚌', desc: 'Live GPS tracking and route management for student safety.' },
    { id: 'Academics', name: 'Report Card System', icon: '🏆', desc: 'Dynamic grade conversion and performance analysis reports.' }
  ];

  const roles = [
    { 
      title: "Administrators", icon: "🔑", 
      desc: "Centralized control over admissions, finance, and HR.",
      features: ["Financial Analytics", "Staff Management", "System Logs"]
    },
    { 
      title: "Students", icon: "🎓", 
      desc: "Access course materials, submit assignments, and track progress.",
      features: ["LMS Access", "Result Tracking", "Online Fees"]
    },
    { 
      title: "Teachers", icon: "👨‍🏫", 
      desc: "Automated grading, attendance, and parent communication.",
      features: ["Attendance", "Gradebook", "Lesson Planning"]
    },
    { 
      title: "Governing Body", icon: "🏛️", 
      desc: "High-level insights and compliance tracking.",
      features: ["Audit Reports", "Strategic Planning", "Compliance"]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* 1. Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">EDUCORE</div>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-bold text-slate-600">
            <a href="#modules" className="hover:text-blue-600">Modules</a>
            <a href="#solutions" className="hover:text-blue-600">Solutions</a>
            <a href="#demo" className="hover:text-blue-600">Live Demo</a>
          </div>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition shadow-lg">
            Portal Login
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="pt-20 pb-20 px-6 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center text-left">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6">
              Next-Gen School ERP
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-8 leading-[1.1]">
              Management <br/><span className="text-blue-600 italic">Simplified.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
              From <span className="font-bold text-slate-800">Transport Fleet</span> tracking to <span className="font-bold text-slate-800">Fee Management</span>, we provide a unified engine for modern educational excellence.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition">Start Free Trial</button>
              <button className="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition">View All 12+ Modules</button>
            </div>
          </div>
          <div className="relative group">
             <div className="absolute inset-0 bg-blue-400 blur-[100px] opacity-20 group-hover:opacity-30 transition"></div>
             <img src="https://illustrations.popsy.co/blue/work-from-home.svg" alt="Dashboard" className="relative z-10 w-full max-w-md mx-auto" />
          </div>
        </div>
      </header>

      {/* 3. DYNAMIC MODULES SECTION (Using your specific component list) */}
      <section id="modules" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-black text-slate-900">Comprehensive Modules</h2>
            <p className="text-slate-500 mt-2">Every tool you need to run your institution, integrated out of the box.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Module Selector Sidebar */}
            <div className="lg:col-span-4 space-y-3">
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                    activeModule === m.id 
                    ? 'bg-white border-blue-200 shadow-xl shadow-blue-100 ring-2 ring-blue-50' 
                    : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-200/50'
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <p className={`font-bold text-sm ${activeModule === m.id ? 'text-blue-600' : 'text-slate-700'}`}>{m.name}</p>
                    <p className="text-xs opacity-70">Core System Module</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Component Preview Area */}
            <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-inner min-h-[400px] flex flex-col items-center justify-center text-center">
              <div className="max-w-md">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
                    {modules.find(m => m.id === activeModule).icon}
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4">
                    {modules.find(m => m.id === activeModule).name}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-8 italic">
                    {modules.find(m => m.id === activeModule).desc}
                </p>
                {/* Dynamic UI Placeholder representing the component's functionality */}
                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 font-mono text-[10px] text-slate-400">
                  {`// Ready to Render: <${activeModule.replace(/\s/g, '')} />`}
                  <br/>
                  {`{ status: "Active", data: "Real-time stream linked" }`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Stakeholder Section */}
      <section id="solutions" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">One Platform, Many Personas</h2>
            <p className="text-slate-500">The same data, customized for every role in your community.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-blue-500 transition-all duration-300">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{role.icon}</div>
                <h3 className="text-xl font-bold mb-3">{role.title}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">{role.desc}</p>
                <ul className="space-y-2">
                   {role.features.map(f => (
                     <li key={f} className="text-xs font-bold text-slate-400 flex items-center gap-2">
                       <span className="w-1 h-1 bg-blue-500 rounded-full"></span> {f}
                     </li>
                   ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 text-center">
        <div className="text-xl font-black text-blue-600 mb-4">EDUCORE</div>
        <p className="text-slate-400 text-sm">© 2026 Institutional Management Systems. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SchoolLandingPage;