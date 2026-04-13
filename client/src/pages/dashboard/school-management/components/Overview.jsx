import { Award, BarChart3, Calendar, Landmark, ShieldCheck, Users } from "lucide-react";

const AcademicOverview = () => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
    {/* Row 1: The Essentials */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Daily Attendance (K-12 Focus) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-emerald-400"><Users size={16}/> Daily Attendance</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold text-white">96.4%</span>
            <span className="text-[10px] text-slate-500 mb-1">Today, Mar 26</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[96.4%]"></div>
          </div>
          <p className="text-[10px] text-slate-500">Highest: Class 5-B (100%) | Lowest: Class 10-A (88%)</p>
        </div>
      </div>

      {/* 2. Fee Collection (School Revenue) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-amber-400"><Landmark size={16}/> Fee Collection</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold text-white">$42,500</span>
            <span className="text-[10px] text-rose-400 mb-1 font-bold">12% Overdue</span>
          </div>
          <div className="flex gap-1 h-2">
            <div className="bg-amber-500 w-[88%] rounded-l-full"></div>
            <div className="bg-rose-500 w-[12%] rounded-r-full"></div>
          </div>
          <p className="text-[10px] text-slate-500">Current Month: March 2026</p>
        </div>
      </div>

      {/* 3. Class Performance (Grade 1-12) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-indigo-400"><Award size={16}/> Academic Standings</h3>
        <div className="space-y-3">
          {[{g: 'Primary (1-5)', v: 92}, {g: 'Secondary (6-12)', v: 84}].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1"><span>{item.g}</span><span>{item.v}%</span></div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: `${item.v}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Row 2: Management & Communication */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 4. Guardian-Teacher Meetings (Communication) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-purple-400"><ShieldCheck size={16}/> Guardian Engagement</h3>
        <div className="space-y-4">
          {[
            { p: 'Parent of Leo (Cls 4)', status: 'Pending', time: '2:30 PM' },
            { p: 'Parent of Mia (Cls 9)', status: 'Confirmed', time: '4:00 PM' }
          ].map((m, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <p className="text-xs font-medium text-slate-200">{m.p}</p>
                <p className="text-[10px] text-slate-500">{m.time}</p>
              </div>
              <span className={`text-[9px] px-2 py-1 rounded-full border ${m.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. School Committee & Board Notices */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-rose-400"><BarChart3 size={16}/> Committee Resolutions</h3>
        <div className="p-4 bg-indigo-600/5 border border-indigo-500/20 rounded-xl">
          <p className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider mb-2">Active Policy</p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Annual Sports Day scheduled for April 15. All Class Teachers must submit participant lists by Monday.
          </p>
          <div className="mt-4 flex gap-2">
            <button className="text-[10px] px-3 py-1 bg-indigo-600 text-white rounded-md font-bold">Download Circular</button>
          </div>
        </div>
      </div>

      {/* 6. Upcoming School Events (Full Width) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl lg:col-span-2">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-blue-400"><Calendar size={16}/> School Calendar</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Mar 28: Term Exams', 'Apr 02: Science Fair', 'Apr 10: Holiday', 'Apr 15: Sports Day'].map((event, i) => (
            <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <p className="text-[11px] font-bold text-slate-200">{event.split(': ')[1]}</p>
              <p className="text-[10px] text-slate-500 mt-1">{event.split(': ')[0]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
export default AcademicOverview