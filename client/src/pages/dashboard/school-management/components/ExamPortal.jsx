import React, { useState } from 'react';
import {
  Megaphone,
  Calendar,
  Plus,
  FileText,
  Trash2,
  Edit3,
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';

const ExamPortal = () => {
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notices'); // 'notices' or 'exams'

  // Mock data for notices
  const [notices, setNotices] = useState([
    { id: 1, title: "Mid-Term Reschedule", category: "Urgent", date: "2026-03-25", author: "Admin Office" },
    { id: 2, title: "Annual Science Fair 2026", category: "Academic", date: "2026-04-10", author: "Science Dept" },
    { id: 3, title: "Library Maintenance Notice", category: "General", date: "2026-03-28", author: "Librarian" },
  ]);

  const [examSchedule, setExamSchedule] = useState([
    { id: 1, subject: "Biology 101", date: "2026-05-12", room: "Hall A", proctor: "Dr. Smith" },
    { id: 2, subject: "Linear Algebra", date: "2026-05-14", room: "Room 302", proctor: "Prof. Zhang" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Academic & Notice Management</h1>
            <p className="text-slate-500 text-sm">Create schedules and broadcast information to the campus.</p>
          </div>
          <button
            onClick={() => setIsNoticeModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus size={18} />
            {activeTab === 'notices' ? 'Create New Notice' : 'Schedule New Exam'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'notices' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Notice Board
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'exams' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Exam Scheduling
          </button>
        </div>

        {/* Main Content Area */}
        {activeTab === 'notices' ? (
          <div className="grid gap-4">
            {notices.map((notice) => (
              <div key={notice.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${notice.category === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                    <Megaphone size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800">{notice.title}</h3>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${notice.category === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {notice.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {notice.date}</span>
                      <span className="flex items-center gap-1"><FileText size={12} /> By: {notice.author}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-indigo-600"><Edit3 size={18} /></button>
                  <button className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Proctor</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {examSchedule.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-800">{exam.subject}</td>
                    <td className="px-6 py-4 text-slate-600">{exam.date}</td>
                    <td className="px-6 py-4 text-slate-600">{exam.room}</td>
                    <td className="px-6 py-4 text-slate-600">{exam.proctor}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 font-medium hover:underline">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- CREATE NOTICE MODAL --- */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsNoticeModalOpen(false)}></div>

          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">

              <h2 className="text-xl font-bold text-slate-800">
                {activeTab === 'notices' ? 'Post New Notice' : 'Schedule Exam Session'}
              </h2>
              <button onClick={() => setIsNoticeModalOpen(false)} className="text-slate-500 hover:text-slate-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title / Subject</label>
                <input type="text" className="w-full px-4 py-2 border text-zinc-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Final Grade Submission" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category / Room</label>
                  <select className="w-full px-4 py-2 border border-slate-200 text-zinc-700 rounded-lg outline-none">
                    <option>Academic</option>
                    <option>Examination</option>
                    <option>Administrative</option>
                    <option>Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Date</label>
                  <input type="date" className="w-full text-zinc-700 px-4 py-2 border border-slate-200 rounded-lg outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description</label>
                <textarea className="w-full h-32 px-4 py-2 border border-slate-200 rounded-lg outline-none text-zinc-700 resize-none" placeholder="Write the full notice content here..."></textarea>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" id="notify" className="size-4 text-zinc-700 accent-indigo-600" />
                <label htmlFor="notify" className="text-xs text-slate-500 font-medium">Send SMS & Email notification to all students</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsNoticeModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">Publish Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};



export default ExamPortal;