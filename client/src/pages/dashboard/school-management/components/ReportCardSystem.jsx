import React, { useState } from 'react';
import {
  GraduationCap, Plus, Search, Edit3, Trash2,
  FileDown, Save, X, Trophy, AlertCircle, CheckCircle,
  Mail, Download, Filter, User, BookOpen, ArrowUpCircle, Eye,
  ChevronRight, Printer, Share2,
  PrinterCheck
} from 'lucide-react';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportCardSystem = () => {
  // --- State Management ---
  const [students, setStudents] = useState([
    { id: 1, name: "Alex Rivera", rollNo: "101", class: "10", section: "A", math: 85, science: 92, english: 78, bangla: 88, hMath: 90, grammar: 82, attendance: "95%", remarks: "Excellent performance in Science." },
    { id: 2, name: "Mila Kunis", rollNo: "102", class: "10", section: "B", math: 45, science: 38, english: 50, bangla: 55, hMath: 40, grammar: 48, attendance: "82%", remarks: "Needs to focus on core subjects." },
    { id: 3, name: "Julian Casablancas", rollNo: "103", class: "9", section: "A", math: 75, science: 80, english: 85, bangla: 70, hMath: 65, grammar: 88, attendance: "91%", remarks: "Consistent improvement shown." },
  ]);

  const [activeTab, setActiveTab] = useState('manage');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");

  const initialFormState = {
    name: '', rollNo: '', class: '10', section: 'A',
    math: 0, science: 0, english: 0, bangla: 0, hMath: 0, grammar: 0, remarks: '', attendance: '100%'
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- Logic: Calculation Engine ---
  const getStats = (s) => {
    const scores = [s.math, s.science, s.english, s.bangla, s.hMath, s.grammar];
    const total = scores.reduce((a, b) => Number(a) + Number(b), 0);
    const avg = (total / scores.length).toFixed(1);
    let grade = 'F';
    if (avg >= 80) grade = 'A+';
    else if (avg >= 60) grade = 'B';
    else if (avg >= 40) grade = 'C';
    return { total, avg, grade, status: avg >= 40 ? 'Passed' : 'Failed' };
  };

  // --- CRUD Actions ---

  // Handle Edit: Load data and open modal
  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData(student);
    setIsEditModalOpen(true);
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this report card?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update logic
      setStudents(students.map(s => s.id === editingId ? { ...formData, id: editingId } : s));
    } else {
      // Create logic
      setStudents([...students, { ...formData, id: Date.now() }]);
    }
    closeModal();
    setActiveTab('manage');
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const downloadPDF = (student) => {
    const doc = new jsPDF();
    const stats = getStats(student);

    // Header
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text("ACADEMIC REPORT CARD", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Academic Year: 2025-2026`, 105, 27, { align: "center" });

    // Info Line
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Name: ${student.name}`, 20, 45);
    doc.text(`Roll No: ${student.rollNo}`, 20, 52);
    doc.text(`Class: ${student.class} - ${student.section}`, 140, 45);
    doc.text(`Attendance: ${student.attendance}`, 140, 52);

    // Table
    const tableRows = [
      ['Mathematics', student.math, '100', student.math >= 40 ? 'Pass' : 'Fail'],
      ['Science', student.science, '100', student.science >= 40 ? 'Pass' : 'Fail'],
      ['English', student.english, '100', student.english >= 40 ? 'Pass' : 'Fail'],
      ['Bangla', student.bangla, '100', student.bangla >= 40 ? 'Pass' : 'Fail'],
      ['Higher Math', student.hMath, '100', student.hMath >= 40 ? 'Pass' : 'Fail'],
      ['Grammar', student.grammar, '100', student.grammar >= 40 ? 'Pass' : 'Fail'],
    ];

    doc.autoTable({
      startY: 65,
      head: [['Subject', 'Obtained', 'Total', 'Status']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10, cellPadding: 5 }
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text(`Final Result: ${stats.status}`, 20, finalY);
    doc.text(`Grade: ${stats.grade}`, 140, finalY);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Teacher's Remarks:", 20, finalY + 15);
    doc.setFont("helvetica", "italic");
    doc.text(student.remarks || "No remarks provided.", 20, finalY + 22);

    // Signatures
    doc.setFont("helvetica", "normal");
    doc.line(20, 260, 70, 260);
    doc.text("Class Teacher", 45, 265, { align: "center" });
    doc.line(140, 260, 190, 260);
    doc.text("Principal", 165, 265, { align: "center" });

    doc.save(`${student.name}_Report.pdf`);
  };

  const promoteStudents = (targetClass) => {
    if (window.confirm(`Promote all passed students in Class ${targetClass} to the next grade?`)) {
      setStudents(students.map(s => {
        if (s.class === targetClass && getStats(s).status === 'Passed') {
          return { ...s, class: (parseInt(s.class) + 1).toString() };
        }
        return s;
      }));
      alert("Promotion successful!");
    }
  };

  const filteredStudents = students.filter(s =>
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNo.includes(searchTerm)) &&
    (selectedClass === "All" || s.class === selectedClass)
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 mb-8 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
          <button onClick={() => setActiveTab('manage')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition ${activeTab === 'manage' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Manage Reports</button>
          <button onClick={() => { setEditingId(null); setFormData(initialFormState); setActiveTab('create'); }} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition ${activeTab === 'create' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Create New</button>
          <button onClick={() => setActiveTab('promotion')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition ${activeTab === 'promotion' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Promotions</button>
        </div>

        {/* --- SECTION: MANAGE REPORTS --- */}
        {activeTab === 'manage' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search students..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold outline-none" onChange={(e) => setSelectedClass(e.target.value)}>
                <option value="All">All Classes</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
            </div>

            <div className="bg-white rounded-4xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5">Student</th>
                    <th className="px-6 py-5">Class/Sec</th>
                    <th className="px-6 py-5">Result</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition group">
                      <td className="px-8 py-5 font-bold text-slate-800">{s.name} <p className="text-[10px] text-slate-400 font-normal">Roll: {s.rollNo}</p></td>
                      <td className="px-6 py-5 font-semibold text-slate-500">{s.class}-{s.section}</td>
                      <td className="px-6 py-5">
                        <span className={`text-xs font-black px-3 py-1 rounded-full ${getStats(s).status === 'Passed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                          GRADE {getStats(s).grade}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right space-x-1">
                        <button onClick={() => setSelectedStudent(s)} className="p-2 text-slate-400 hover:text-indigo-600 transition" title="View Details"><Eye size={18} /></button>
                        <button onClick={() => handleEdit(s)} className="p-2 text-slate-400 hover:text-amber-500 transition" title="Edit"><Edit3 size={18} /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-400 hover:text-red-500 transition" title="Delete"><Trash2 size={18} /></button>

                        <button
                          onClick={() => downloadPDF(s)}
                          className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition"
                        >
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- SECTION: CREATE/EDIT FORM --- */}
        {(activeTab === 'create' || isEditModalOpen) && (
          <div className={isEditModalOpen ? "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" : ""}>
            <div className={`max-w-3xl w-full mx-auto bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl ${isEditModalOpen ? 'animate-in zoom-in' : 'animate-in slide-in-from-bottom'}`}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 p-3 rounded-2xl text-white">
                    {editingId ? <Edit3 /> : <Plus />}
                  </div>
                  <h2 className="text-2xl font-black">{editingId ? 'Edit Student Record' : 'Create New Record'}</h2>
                </div>
                {isEditModalOpen && <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>}
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Student Name</label>
                  <input required value={formData.name} className="w-full mt-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Robert Fox" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Roll Number</label>
                  <input required value={formData.rollNo} className="w-full mt-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Class</label>
                    <select value={formData.class} className="w-full mt-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" onChange={(e) => setFormData({ ...formData, class: e.target.value })}>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Section</label>
                    <input value={formData.section} className="w-full mt-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" onChange={(e) => setFormData({ ...formData, section: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-3 col-span-2 gap-4 border-t pt-6">
                  {['math', 'science', 'english', 'bangla', 'hMath', 'grammar'].map(sub => (
                    <div key={sub}>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">{sub}</label>
                      <input type="number" value={formData[sub]} className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({ ...formData, [sub]: e.target.value })} />
                    </div>
                  ))}
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Remarks</label>
                  <input value={formData.remarks} className="w-full mt-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} />
                </div>

                <div className="col-span-2 flex gap-4 mt-4">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black tracking-widest text-xs uppercase shadow-lg hover:bg-indigo-700 transition">
                    {editingId ? 'Update Record' : 'Finalize & Save'}
                  </button>
                  {isEditModalOpen && (
                    <button type="button" onClick={closeModal} className="px-8 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- PROMOTION & DETAILS MODALS (Same as previous version) --- */}
        {activeTab === 'promotion' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in duration-300">
            {[9, 10].map(cls => (
              <div key={cls} className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><ArrowUpCircle size={80} /></div>
                <h3 className="text-xl font-black mb-2">Class {cls} Promotion</h3>
                <p className="text-sm text-slate-500 mb-6">Bulk move all qualified students to Class {cls + 1}.</p>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-6">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Passed Candidates</p>
                    <p className="text-2xl font-black text-emerald-600">{students.filter(s => s.class === cls.toString() && getStats(s).status === 'Passed').length}</p>
                  </div>
                  <ChevronRight className="text-slate-300" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Next Grade</p>
                    <p className="text-2xl font-black text-indigo-600">Class {cls + 1}</p>
                  </div>
                </div>
                <button onClick={() => promoteStudents(cls.toString())} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition flex items-center justify-center gap-2">
                  Launch Promotion Cycle <ArrowUpCircle size={18} />
                </button>
              </div>
            ))}
          </div>
        )}



        {/* ... (Promotion logic and Details modal remain the same) ... */}

        {/* Details View Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-top duration-300">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="size-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">{selectedStudent.name.charAt(0)}</div>
                  <div>
                    <h2 className="text-xl font-black">{selectedStudent.name}</h2>
                    <p className="text-xs text-slate-400 font-bold tracking-tight">CLASS {selectedStudent.class}-{selectedStudent.section} | ROLL {selectedStudent.rollNo}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-slate-100 rounded-full transition"><X /></button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-indigo-50 rounded-2xl">
                    <p className="text-[10px] font-black text-indigo-400 uppercase">Average</p>
                    <p className="text-xl font-black text-indigo-700">{getStats(selectedStudent).avg}%</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl">
                    <p className="text-[10px] font-black text-emerald-400 uppercase">Total Marks</p>
                    <p className="text-xl font-black text-emerald-700">{getStats(selectedStudent).total}/600</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl">
                    <p className="text-[10px] font-black text-amber-400 uppercase">Attendance</p>
                    <p className="text-xl font-black text-amber-700">{selectedStudent.attendance || 'N/A'}</p>
                  </div>
                </div>
                <h4 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">Subject Breakdown</h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {['Math', 'Science', 'English', 'Bangla', 'hMath', 'Grammar'].map(sub => (
                    <div key={sub} className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-sm font-bold text-slate-600">{sub}</span>
                      <span className="text-sm font-black text-slate-800">{selectedStudent[sub.toLowerCase().replace(' ', '')]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Teacher Remarks</p>
                  <p className="text-sm italic text-slate-600">"{selectedStudent.remarks || 'No remarks provided.'}"</p>
                </div>

                <button
                  onClick={() => downloadPDF(selectedStudent)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl"
                >
                  <PrinterCheck size={16} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCardSystem;